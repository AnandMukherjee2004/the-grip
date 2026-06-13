export type ToolCategory = 'crm' | 'payments' | 'ecommerce' | 'communication';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string; // emoji or icon name
  popular?: boolean;
}

export interface OnboardingStep {
  id: number;
  label: string;
  path: string;
}
