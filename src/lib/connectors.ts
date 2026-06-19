import { ConnectorConfig } from "@/types/onboarding";

export const CONNECTORS: Record<string, ConnectorConfig> = {
  // CRM
  hubspot: {
    toolId: "hubspot",
    authMethod: "oauth",
    oauthUrl: "https://app.hubspot.com/oauth/authorize",
    connectTime: "~30 seconds",
    docsUrl: "https://knowledge.hubspot.com/marketplace/connect-apps-to-hubspot",
  },
  salesforce: {
    toolId: "salesforce",
    authMethod: "oauth",
    oauthUrl: "https://login.salesforce.com/services/oauth2/authorize",
    connectTime: "~30 seconds",
    docsUrl: "https://help.salesforce.com/s/articleView?id=sf.remoteaccess_authenticate_overview.htm",
  },
  leadsquared: {
    toolId: "leadsquared",
    authMethod: "apikey",
    apiKeyLabel: "Access Key",
    apiSecretLabel: "Secret Key",
    docsUrl: "https://help.leadsquared.com/leadsquared-api-access-keys/",
  },
  freshsales: {
    toolId: "freshsales",
    authMethod: "apikey",
    apiKeyLabel: "API Key",
    docsUrl: "https://support.freshsales.io/support/solutions/articles/231189-how-to-find-my-api-key-",
  },
  "zoho-crm": {
    toolId: "zoho-crm",
    authMethod: "oauth",
    oauthUrl: "https://accounts.zoho.com/oauth/v2/auth",
    docsUrl: "https://www.zoho.com/crm/developer/docs/api/v2/oauth-overview.html",
  },
  pipedrive: {
    toolId: "pipedrive",
    authMethod: "oauth",
    oauthUrl: "https://oauth.pipedrive.com/oauth/authorize",
  },

  // Payments
  razorpay: {
    toolId: "razorpay",
    authMethod: "apikey",
    apiKeyLabel: "Key ID",
    apiSecretLabel: "Key Secret",
    docsUrl: "https://razorpay.com/docs/payments/dashboard/settings/api-keys/",
  },
  stripe: {
    toolId: "stripe",
    authMethod: "apikey",
    apiKeyLabel: "Secret Key",
    docsUrl: "https://stripe.com/docs/keys",
  },
  payu: {
    toolId: "payu",
    authMethod: "apikey",
    apiKeyLabel: "Merchant Key",
    apiSecretLabel: "Salt",
    docsUrl: "https://www.payu.in/docs/integrations/api-reference/merchant-salt-key-info/",
  },
  cashfree: {
    toolId: "cashfree",
    authMethod: "apikey",
    apiKeyLabel: "App ID",
    apiSecretLabel: "Secret Key",
    docsUrl: "https://docs.cashfree.com/docs/api-keys",
  },

  // E-commerce
  shopify: {
    toolId: "shopify",
    authMethod: "oauth",
    oauthUrl: "https://shopify.dev/docs/apps/auth",
    docsUrl: "https://help.shopify.com/en/manual/apps/app-permissions",
  },
  woocommerce: {
    toolId: "woocommerce",
    authMethod: "apikey",
    apiKeyLabel: "Consumer Key",
    apiSecretLabel: "Consumer Secret",
    docsUrl: "https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication",
  },

  // Communication
  intercom: {
    toolId: "intercom",
    authMethod: "oauth",
    oauthUrl: "https://app.intercom.com/oauth",
    docsUrl: "https://developers.intercom.com/building-apps/docs/authentication-types",
  },
  twilio: {
    toolId: "twilio",
    authMethod: "apikey",
    apiKeyLabel: "Account SID",
    apiSecretLabel: "Auth Token",
    docsUrl: "https://www.twilio.com/docs/iam/credentials/api-keys",
  },
  freshdesk: {
    toolId: "freshdesk",
    authMethod: "apikey",
    apiKeyLabel: "API Key",
    docsUrl: "https://support.freshdesk.com/support/solutions/articles/215517-how-to-find-your-api-key",
  },
  "whatsapp-business": {
    toolId: "whatsapp-business",
    authMethod: "apikey",
    apiKeyLabel: "Access Token",
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
  },
  whatsapp: {
    toolId: "whatsapp-business",
    authMethod: "apikey",
    apiKeyLabel: "Access Token",
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
  },
  limechat: {
    toolId: "limechat",
    authMethod: "apikey",
    apiKeyLabel: "Account ID",
    apiSecretLabel: "API Token",
    docsUrl: "https://limechat.ai",
  },
};
