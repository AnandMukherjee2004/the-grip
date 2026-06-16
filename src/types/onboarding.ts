export type ToolCategory = 'crm' | 'payments' | 'ecommerce' | 'communication' | 'ads' | 'accounting';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string; // emoji or icon name
  logo?: string; // image logo URL
  popular?: boolean;
}

export interface OnboardingStep {
  id: number;
  label: string;
  path: string;
}

export type ConnectorStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'skipped'

export type AuthMethod = 'oauth' | 'apikey'

export interface ConnectorConfig {
  toolId: string           // matches Tool.id from lib/tools.ts
  authMethod: AuthMethod
  oauthUrl?: string        // for OAuth tools
  apiKeyLabel?: string     // e.g. "Razorpay Key ID"
  apiSecretLabel?: string  // e.g. "Razorpay Key Secret" (optional)
  docsUrl?: string         // link to "Where do I find this?" docs
  connectTime?: string     // e.g. "~30 seconds"
}

