import sys
import os
import json
import sys
import base64
import httpx
import psycopg2
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from datetime import datetime, timedelta

sys.stdout.reconfigure(line_buffering=True)

# Load environment variables
load_dotenv()

def decrypt_credentials(enc_b64: str, key_b64: str) -> dict:
    """
    Decrypts the base64-encoded AES-256-GCM credentials payload.
    The Node API encrypts credentials as: [IV (12B)] [AuthTag (16B)] [Ciphertext]
    """
    key = base64.b64decode(key_b64)
    enc_bytes = base64.b64decode(enc_b64)
    
    if len(enc_bytes) < 28:
        raise ValueError("Invalid credentials payload length")
        
    iv = enc_bytes[:12]
    tag = enc_bytes[12:28]
    ciphertext = enc_bytes[28:]
    
    aesgcm = AESGCM(key)
    # The cryptography library expects tag appended to ciphertext
    decrypted_bytes = aesgcm.decrypt(iv, ciphertext + tag, None)
    return json.loads(decrypted_bytes.decode('utf-8'))

def parse_lead_property_list(lead: dict) -> dict:
    """
    Normalizes a LeadPropertyList response or a flat response into a flat dict.
    """
    flat = {}
    if "LeadPropertyList" in lead and isinstance(lead["LeadPropertyList"], list):
        for prop in lead["LeadPropertyList"]:
            attr = prop.get("Attribute")
            val = prop.get("Value")
            if attr is not None:
                flat[attr] = val
                
    for k, v in lead.items():
        if k != "LeadPropertyList" and v is not None:
            flat[k] = v
            
    return flat

def run_sync(connector_id: str, workspace_id: str, db_conn, pipeline_run_id: str = None) -> dict:
    """
    Runs the LeadSquared sync logic and returns records_synced and records_failed.
    """
    encryption_key = os.getenv("CREDENTIALS_ENCRYPTION_KEY")
    if not encryption_key:
        raise ValueError("CREDENTIALS_ENCRYPTION_KEY environment variable is missing")
        
    cur = db_conn.cursor()
    
    try:
        cur.execute(
            "SELECT credentials_enc_b64, capabilities, last_synced_at FROM connectors WHERE id = %s",
            (connector_id,)
        )
        row = cur.fetchone()
        if not row:
            raise ValueError(f"Connector {connector_id} not found.")
            
        credentials_enc_b64, capabilities, last_synced_at = row
        
        if last_synced_at is not None:
            lookup_value = last_synced_at.strftime("%Y-%m-%d %H:%M:%S")
        else:
            lookup_value = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
        
        # Parse capabilities JSON
        if isinstance(capabilities, str):
            capabilities = json.loads(capabilities)
        elif capabilities is None:
            capabilities = {}
            
        lsq_host = capabilities.get("lsq_host")
        if not lsq_host:
            raise ValueError(f"No lsq_host mapped in capabilities for connector {connector_id}.")
            
        # 2. Decrypt credentials
        credentials = decrypt_credentials(credentials_enc_b64, encryption_key)
        access_key = credentials.get("accessKey") or credentials.get("access_key")
        secret_key = credentials.get("secretKey") or credentials.get("secret_key")
        
        if not access_key or not secret_key:
            raise ValueError("Decrypted credentials do not contain accessKey or secretKey.")
            
        # 3. Paginate LeadSquared Leads
        # Clean host (strip scheme if present)
        host = lsq_host.replace("https://", "").replace("http://", "").rstrip("/")
        url = f"https://{host}/v2/LeadManagement.svc/Leads.Get"
        
        page_index = 1
        page_size = 50
        inserted_count = 0
        updated_count = 0
        records_failed = 0
        
        print(f"Starting sync from LeadSquared via {host} with CreatedOn > {lookup_value}...")
        
        while True:
            payload = {
                "Parameter": {
                    "LookupName": "CreatedOn",
                    "LookupValue": lookup_value,
                    "SqlOperator": ">"
                },
                "Columns": {
                    "Include_CSV": "ProspectID,FirstName,LastName,EmailAddress,Phone,TotalSales,mx_TotalSales,ProspectStage,CreatedOn"
                },
                "Sorting": {
                    "ColumnName": "CreatedOn",
                    "Direction": "0"
                },
                "Paging": {
                    "PageIndex": page_index,
                    "PageSize": page_size
                }
            }
            
            params = {
                "accessKey": access_key,
                "secretKey": secret_key
            }
            
            resp = httpx.post(url, params=params, json=payload, timeout=60.0)
            if resp.status_code != 200:
                raise ValueError(f"LeadSquared API returned {resp.status_code}: {resp.text}")
                
            data = resp.json()
            if isinstance(data, list):
                leads = data
            elif isinstance(data, dict):
                leads = data.get("Leads", data.get("RecordList", []))
            else:
                leads = []
                
            if not leads:
                break
                
            for raw_lead in leads:
                lead = parse_lead_property_list(raw_lead)
                
                external_id = lead.get("ProspectID") or lead.get("ProspectId")
                if not external_id:
                    continue
                    
                first_name = lead.get("FirstName") or ""
                last_name = lead.get("LastName") or ""
                name = f"{first_name} {last_name}".strip() or None
                
                email = lead.get("EmailAddress") or lead.get("Email") or None
                phone = lead.get("Phone") or lead.get("Mobile") or None
                
                # Deal value mapping
                deal_value_inr = None
                deal_keys = ["TotalSales", "mx_TotalSales", "Total_Sales", "mx_Deal_Value", "mx_DealValue"]
                for k in deal_keys:
                    val = lead.get(k)
                    if val is not None and str(val).strip():
                        try:
                            deal_value_inr = float(val)
                            break
                        except ValueError:
                            pass
                            
                # Stage Raw mapping
                stage_raw = lead.get("ProspectStage") or None
                
                # Upsert into unified_leads
                upsert_query = """
                INSERT INTO unified_leads (
                    workspace_id,
                    connector_id,
                    source_tool,
                    external_id,
                    name,
                    email,
                    phone,
                    deal_value_inr,
                    stage_raw,
                    created_at,
                    updated_at
                ) VALUES (
                    %s, %s, 'leadsquared', %s, %s, %s, %s, %s, %s, NOW(), NOW()
                )
                ON CONFLICT (workspace_id, source_tool, external_id) DO UPDATE SET
                    connector_id = EXCLUDED.connector_id,
                    name = EXCLUDED.name,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    deal_value_inr = EXCLUDED.deal_value_inr,
                    stage_raw = EXCLUDED.stage_raw,
                    updated_at = NOW()
                RETURNING (xmax = 0) AS inserted;
                """
                
                try:
                    cur.execute("SAVEPOINT lead_upsert")
                    cur.execute(upsert_query, (
                        workspace_id,
                        connector_id,
                        external_id,
                        name,
                        email,
                        phone,
                        deal_value_inr,
                        stage_raw
                    ))
                    inserted = cur.fetchone()[0]
                    if inserted:
                        inserted_count += 1
                    else:
                        updated_count += 1
                    cur.execute("RELEASE SAVEPOINT lead_upsert")
                except Exception as e:
                    print(f"Error upserting lead {external_id}: {e}")
                    try:
                        cur.execute("ROLLBACK TO SAVEPOINT lead_upsert")
                    except Exception:
                        pass
                    records_failed += 1
                    
            db_conn.commit()
            print(f"Processed page {page_index} ({len(leads)} leads)...")
            page_index += 1
            
        return {
            "records_synced": inserted_count + updated_count,
            "records_failed": records_failed
        }
    finally:
        cur.close()

def main():
    if len(sys.argv) < 2:
        print("Usage: python leadsquared_sync.py <connectorId>")
        sys.exit(1)
        
    connector_id = sys.argv[1]
    
    # 1. Fetch credentials and configuration from database
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("Error: DATABASE_URL environment variable is missing")
        sys.exit(1)
        
    try:
        conn = psycopg2.connect(db_url)
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)
        
    try:
        # Get workspace_id
        cur = conn.cursor()
        cur.execute("SELECT workspace_id FROM connectors WHERE id = %s", (connector_id,))
        row = cur.fetchone()
        if not row:
            print(f"Error: Connector {connector_id} not found.")
            sys.exit(1)
        workspace_id = row[0]
        cur.close()

        res = run_sync(connector_id, workspace_id, conn)
        print(f"Sync finished: {res}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
