import sys
import os
import json
import base64
import httpx
import psycopg2
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

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

def main():
    if len(sys.argv) < 2:
        print("Usage: python leadsquared_sync.py <connectorId>")
        sys.exit(1)
        
    connector_id = sys.argv[1]
    
    # 1. Fetch credentials and configuration from database
    db_url = os.getenv("DATABASE_URL")
    encryption_key = os.getenv("CREDENTIALS_ENCRYPTION_KEY")
    
    if not db_url:
        print("Error: DATABASE_URL environment variable is missing")
        sys.exit(1)
    if not encryption_key:
        print("Error: CREDENTIALS_ENCRYPTION_KEY environment variable is missing")
        sys.exit(1)
        
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)
        
    try:
        cur.execute(
            "SELECT workspace_id, credentials_enc_b64, capabilities FROM connectors WHERE id = %s",
            (connector_id,)
        )
        row = cur.fetchone()
        if not row:
            print(f"Error: Connector {connector_id} not found.")
            sys.exit(1)
            
        workspace_id, credentials_enc_b64, capabilities = row
        
        # Parse capabilities JSON
        if isinstance(capabilities, str):
            capabilities = json.loads(capabilities)
        elif capabilities is None:
            capabilities = {}
            
        lsq_host = capabilities.get("lsq_host")
        if not lsq_host:
            print(f"Error: No lsq_host mapped in capabilities for connector {connector_id}.")
            sys.exit(1)
            
        # 2. Decrypt credentials
        try:
            credentials = decrypt_credentials(credentials_enc_b64, encryption_key)
        except Exception as e:
            print(f"Error decrypting credentials: {e}")
            sys.exit(1)
            
        access_key = credentials.get("accessKey") or credentials.get("access_key")
        secret_key = credentials.get("secretKey") or credentials.get("secret_key")
        
        if not access_key or not secret_key:
            print("Error: Decrypted credentials do not contain accessKey or secretKey.")
            sys.exit(1)
            
        # 3. Paginate LeadSquared Leads
        # Clean host (strip scheme if present)
        host = lsq_host.replace("https://", "").replace("http://", "").rstrip("/")
        url = f"https://{host}/v2/LeadManagement.svc/Leads.Get"
        
        page_index = 1
        page_size = 50
        total_fetched = 0
        inserted_count = 0
        updated_count = 0
        
        print(f"Starting sync from LeadSquared via {host}...")
        
        while True:
            payload = {
                "Parameter": {
                    "LookupName": "CreatedOn",
                    "LookupValue": "1970-01-01 00:00:00",
                    "SqlOperator": ">"
                },
                "Columns": {
                    "Include_CSV": "ProspectID,FirstName,LastName,EmailAddress,Phone,TotalSales,mx_TotalSales,LeadStatus,Status,CreatedOn"
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
            
            try:
                resp = httpx.post(url, params=params, json=payload, timeout=60.0)
                if resp.status_code != 200:
                    print(f"Error: LeadSquared API returned {resp.status_code}: {resp.text}")
                    sys.exit(1)
                    
                data = resp.json()
            except Exception as e:
                print(f"Error calling LeadSquared API: {e}")
                sys.exit(1)
                
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
                stage_raw = lead.get("LeadStatus") or lead.get("Status") or lead.get("StatusCode") or None
                
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
                except Exception as e:
                    print(f"Error upserting lead {external_id}: {e}")
                    conn.rollback()
                    sys.exit(1)
                    
            conn.commit()
            total_fetched += len(leads)
            print(f"Processed page {page_index} ({len(leads)} leads)...")
            
            break
                
            page_index += 1
            
        print("\n--- Sync Summary ---")
        print(f"Leads fetched:  {total_fetched}")
        print(f"Leads inserted: {inserted_count}")
        print(f"Leads updated:  {updated_count}")
        
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()
