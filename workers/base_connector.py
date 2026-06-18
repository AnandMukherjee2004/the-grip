import os
from abc import ABC, abstractmethod
import httpx
from dotenv import load_dotenv

# Load environment variables (such as API_URL and INTERNAL_SECRET) from .env
load_dotenv()

class BaseConnector(ABC):
    def __init__(self, connector_id: str):
        api_url = os.getenv("API_URL", "http://localhost:3001")
        if not api_url.endswith("/api/v1"):
            api_url = f"{api_url.rstrip('/')}/api/v1"
        self.api_url = api_url
        self.internal_secret = os.getenv("INTERNAL_SECRET")
        if not self.internal_secret:
            raise ValueError("INTERNAL_SECRET environment variable is missing")

        # Fetch connector details
        connector_resp = httpx.get(f"{self.api_url}/connectors/{connector_id}")
        if connector_resp.status_code != 200:
            raise RuntimeError(f"Failed to fetch connector: {connector_resp.status_code} - {connector_resp.text}")
        self.connector = connector_resp.json()
        self.tool_id = self.connector.get("toolId")

        # Fetch decrypted credentials
        headers = {"x-internal-secret": self.internal_secret}
        creds_resp = httpx.get(
            f"{self.api_url}/connectors/{connector_id}/credentials",
            headers=headers
        )
        if creds_resp.status_code != 200:
            raise RuntimeError(f"Failed to fetch credentials: {creds_resp.status_code} - {creds_resp.text}")
        self.credentials = creds_resp.json()

    @abstractmethod
    def sync(self) -> dict:
        """
        Execute the synchronization logic for the connector.
        Subclasses must implement this method.
        """
        pass

    def report_run(
        self,
        status: str,
        records_synced: int,
        records_failed: int,
        error_code: str = None,
        error_summary: str = None
    ) -> dict:
        headers = {
            "x-internal-secret": self.internal_secret,
            "Content-Type": "application/json"
        }
        payload = {
            "connectorId": self.connector.get("id"),
            "workspaceId": self.connector.get("workspaceId"),
            "status": status,
            "recordsSynced": records_synced,
            "recordsFailed": records_failed,
            "errorCode": error_code,
            "errorSummary": error_summary
        }
        resp = httpx.post(f"{self.api_url}/pipeline-runs", json=payload, headers=headers)
        if resp.status_code != 201:
            raise RuntimeError(f"Failed to report run: {resp.status_code} - {resp.text}")
        return resp.json()
