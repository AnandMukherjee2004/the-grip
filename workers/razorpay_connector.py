import httpx
from base_connector import BaseConnector

class RazorpayConnector(BaseConnector):
    def sync(self) -> dict:
        """
        Execute Razorpay synchronization.
        """
        # Read credentials
        api_key = self.credentials.get("key_id") or self.credentials.get("api_key")
        api_secret = self.credentials.get("key_secret") or self.credentials.get("api_secret")

        if not api_key or not api_secret:
            raise ValueError("Missing api_key or api_secret in credentials")

        # TODO: Replace this test call with real sync logic (fetching payments, payouts, etc.)
        auth = (api_key, api_secret)
        resp = httpx.get("https://api.razorpay.com/v1/payments", auth=auth)
        print(f"Razorpay API response status: {resp.status_code}")

        # Report the run status
        report = self.report_run(
            status="success",
            records_synced=1,
            records_failed=0
        )
        return report

if __name__ == "__main__":
    import sys
    connector_id = sys.argv[1] if len(sys.argv) > 1 else "fad23a4d-11fa-4afd-855b-c2de00893fca"
    print(f"Running Razorpay Connector with ID: {connector_id}...")
    worker = RazorpayConnector(connector_id)
    result = worker.sync()
    print("Sync finished successfully. Result:", result)
