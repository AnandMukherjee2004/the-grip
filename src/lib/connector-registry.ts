export const CONNECTOR_REGISTRY = {
  razorpay: {
    displayName: "Razorpay",
    authMethod: "api_key",
    credentialFields: [
      { key: "key_id", label: "Key ID", placeholder: "rzp_live_...", secret: true },
      { key: "key_secret", label: "Key Secret", secret: true }
    ],
    capabilities: { webhooks: true, bidirectional: false },
    category: "payments"
  },
  shopify: {
    displayName: "Shopify",
    authMethod: "oauth2",
    oauthScopes: ["read_products", "read_orders", "read_customers"],
    capabilities: { webhooks: true, bidirectional: true },
    category: "ecommerce"
  },
  leadsquared: {
    displayName: "LeadSquared",
    authMethod: "api_key",
    credentialFields: [
      { key: "access_key", label: "Access Key", secret: false },
      { key: "secret_key", label: "Secret Key", secret: true },
      { key: "host_url", label: "Host URL", placeholder: "https://api-us11.leadsquared.com", secret: false }
    ],
    capabilities: { webhooks: true, bidirectional: false },
    category: "crm"
  },
  "meta-ads": {
    displayName: "Meta Ads",
    authMethod: "oauth2",
    oauthScopes: ["ads_read", "ads_management", "pages_read_engagement"],
    capabilities: { webhooks: true, bidirectional: false },
    category: "ads"
  },
  "google-ads": {
    displayName: "Google Ads",
    authMethod: "oauth2",
    oauthScopes: ["https://www.googleapis.com/auth/adwords"],
    capabilities: { webhooks: false, bidirectional: false },
    category: "ads"
  },
  woocommerce: {
    displayName: "WooCommerce",
    authMethod: "api_key",
    credentialFields: [
      { key: "store_url", label: "Store URL", placeholder: "https://example.com", secret: false },
      { key: "consumer_key", label: "Consumer Key", secret: true },
      { key: "consumer_secret", label: "Consumer Secret", secret: true }
    ],
    capabilities: { webhooks: true, bidirectional: true },
    category: "ecommerce"
  },
  "whatsapp-business": {
    displayName: "WhatsApp Business",
    authMethod: "api_key",
    credentialFields: [
      { key: "api_token", label: "API Token", secret: true },
      { key: "phone_number_id", label: "Phone Number ID", secret: false }
    ],
    capabilities: { webhooks: true, bidirectional: false },
    category: "communication"
  },
  tally: {
    displayName: "Tally",
    authMethod: "manual",
    credentialFields: [
      { key: "export_path", label: "Export Folder Path", placeholder: "C:\\Tally\\Export", secret: false }
    ],
    capabilities: { webhooks: false, bidirectional: false },
    category: "accounting"
  },
  limechat: {
    displayName: "LimeChat",
    authMethod: "api_key",
    credentialFields: [
      { key: 'account_id', label: 'Account ID', placeholder: 'Your LimeChat account ID', secret: false },
      { key: 'api_token', label: 'API Token', secret: true }
    ],
    capabilities: { webhooks: true, bidirectional: false },
    category: "communication"
  }
} as const;

type Registry = typeof CONNECTOR_REGISTRY;
type ToolId = keyof Registry;

export type ConnectorMeta = {
  [K in ToolId]: Registry[K] & { toolId: K };
}[ToolId];

export function getConnector(toolId: string): ConnectorMeta | undefined {
  if (toolId in CONNECTOR_REGISTRY) {
    const key = toolId as ToolId;
    return {
      ...CONNECTOR_REGISTRY[key],
      toolId: key,
    } as ConnectorMeta;
  }
  return undefined;
}

export function listConnectors(): ConnectorMeta[] {
  return (Object.keys(CONNECTOR_REGISTRY) as ToolId[]).map((toolId) => ({
    ...CONNECTOR_REGISTRY[toolId],
    toolId,
  })) as ConnectorMeta[];
}
