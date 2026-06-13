import { Tool, ToolCategory } from "@/types/onboarding";

export const TOOLS: Tool[] = [
  // CRM
  {
    id: "hubspot",
    name: "HubSpot",
    category: "crm",
    description: "Inbound marketing, sales, and service software.",
    icon: "🟧",
    popular: true,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "crm",
    description: "Cloud-based customer relationship management platform.",
    icon: "☁️",
    popular: true,
  },
  {
    id: "leadsquared",
    name: "Leadsquared",
    category: "crm",
    description: "Lead management and marketing automation platform.",
    icon: "📈",
  },
  {
    id: "freshsales",
    name: "Freshsales",
    category: "crm",
    description: "AI-powered CRM with email, phone, and activity tracking.",
    icon: "🍃",
  },
  {
    id: "zoho-crm",
    name: "Zoho CRM",
    category: "crm",
    description: "Global online sales suite to manage sales and contacts.",
    icon: "💼",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    category: "crm",
    description: "Sales pipeline and CRM tool for small-to-medium teams.",
    icon: "⚡",
  },
  {
    id: "monday-crm",
    name: "Monday CRM",
    category: "crm",
    description: "Customizable sales CRM to manage pipelines and processes.",
    icon: "📅",
  },
  {
    id: "close-crm",
    name: "Close CRM",
    category: "crm",
    description: "Inside sales CRM designed to double productivity.",
    icon: "🎯",
  },

  // Payments
  {
    id: "razorpay",
    name: "Razorpay",
    category: "payments",
    description: "Popular payment gateway for businesses in India.",
    icon: "💳",
    popular: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "payments",
    description: "Financial infrastructure and payments platform for the internet.",
    icon: "🟪",
    popular: true,
  },
  {
    id: "payu",
    name: "PayU",
    category: "payments",
    description: "Local payment processing solutions for emerging markets.",
    icon: "💸",
  },
  {
    id: "cashfree",
    name: "Cashfree",
    category: "payments",
    description: "Bulk payouts, payment gateways, and banking APIs.",
    icon: "🏦",
  },
  {
    id: "paytm-business",
    name: "Paytm Business",
    category: "payments",
    description: "Merchant payments and business financial operations.",
    icon: "📱",
  },

  // E-commerce
  {
    id: "shopify",
    name: "Shopify",
    category: "ecommerce",
    description: "All-in-one commerce platform to start, run, and grow a store.",
    icon: "🛍️",
    popular: true,
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    category: "ecommerce",
    description: "Open-source e-commerce plugin built for WordPress.",
    icon: "🛒",
  },
  {
    id: "magento",
    name: "Magento",
    category: "ecommerce",
    description: "Flexible, enterprise-grade e-commerce storefront builder.",
    icon: "🧡",
  },
  {
    id: "unicommerce",
    name: "Unicommerce",
    category: "ecommerce",
    description: "SaaS-based e-commerce supply chain management technology.",
    icon: "📦",
  },

  // Communication
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    category: "communication",
    description: "Interact with customers via automated messages and support.",
    icon: "💬",
    popular: true,
  },
  {
    id: "intercom",
    name: "Intercom",
    category: "communication",
    description: "Customer service platform with live chat, AI, and helpdesk.",
    icon: "💬",
    popular: true,
  },
  {
    id: "twilio",
    name: "Twilio",
    category: "communication",
    description: "Web service APIs for sending SMS, calls, and emails.",
    icon: "📞",
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    category: "communication",
    description: "Omnichannel customer service and ticketing system.",
    icon: "🎧",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "crm", label: "CRM / Sales" },
  { id: "payments", label: "Payments" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "communication", label: "Communication" },
] as const;
