import os
import psycopg2
from fastapi import FastAPI, Header, HTTPException, BackgroundTasks, status
from pydantic import BaseModel
from dotenv import load_dotenv
from leadsquared_sync import run_sync

# Load environment variables
load_dotenv()

app = FastAPI()

class SyncRequest(BaseModel):
    connector_id: str
    workspace_id: str
    tool_id: str

@app.get("/health")
def health():
    return {"status": "ok"}

def perform_sync(pipeline_run_id: str, connector_id: str, workspace_id: str):
    db_url = os.getenv("DATABASE_URL")
    try:
        conn = psycopg2.connect(db_url)
    except Exception as e:
        print(f"Error connecting to database for background sync: {e}")
        return

    try:
        # Run the sync logic
        res = run_sync(connector_id, workspace_id, conn, pipeline_run_id)
        records_synced = res.get("records_synced", 0)
        records_failed = res.get("records_failed", 0)
        
        # Update pipeline run to success
        cur = conn.cursor()
        cur.execute(
            """
            UPDATE pipeline_runs 
            SET status = 'success', 
                records_synced = %s, 
                records_failed = %s, 
                finished_at = NOW() 
            WHERE id = %s
            """,
            (records_synced, records_failed, pipeline_run_id)
        )
        # Update connectors last_synced_at
        cur.execute(
            """
            UPDATE connectors 
            SET last_synced_at = NOW() 
            WHERE id = %s
            """,
            (connector_id,)
        )
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"Error during background sync: {e}")
        # Update pipeline run to failed
        try:
            cur = conn.cursor()
            cur.execute(
                """
                UPDATE pipeline_runs 
                SET status = 'failed', 
                    error_summary = %s, 
                    finished_at = NOW() 
                WHERE id = %s
                """,
                (str(e)[:500], pipeline_run_id)
            )
            # Update connectors last_synced_at
            cur.execute(
                """
                UPDATE connectors 
                SET last_synced_at = NOW() 
                WHERE id = %s
                """,
                (connector_id,)
            )
            conn.commit()
            cur.close()
        except Exception as db_err:
            print(f"Failed to update pipeline status to failed: {db_err}")
    finally:
        conn.close()

@app.post("/sync")
def sync(
    payload: SyncRequest,
    background_tasks: BackgroundTasks,
    x_worker_secret: str = Header(None, alias="X-Worker-Secret")
):
    worker_secret = os.getenv("WORKER_SECRET")
    if not x_worker_secret or x_worker_secret != worker_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing X-Worker-Secret header"
        )
        
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DATABASE_URL is not configured"
        )
        
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {e}"
        )
        
    try:
        # Create pipeline run
        cur.execute(
            """
            INSERT INTO pipeline_runs (workspace_id, connector_id, status, records_synced, records_failed, started_at)
            VALUES (%s, %s, 'running', 0, 0, NOW())
            RETURNING id
            """,
            (payload.workspace_id, payload.connector_id)
        )
        pipeline_run_id = cur.fetchone()[0]
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create pipeline run: {e}"
        )
    finally:
        cur.close()
        conn.close()
        
    # Queue background task
    background_tasks.add_task(
        perform_sync,
        str(pipeline_run_id),
        payload.connector_id,
        payload.workspace_id
    )
    
    return {
        "status": "accepted",
        "pipeline_run_id": str(pipeline_run_id)
    }
