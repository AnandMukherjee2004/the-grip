import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export const orgPlanEnum = pgEnum('org_plan', [
  'free', 'starter', 'growth', 'enterprise',
])

export const memberRoleEnum = pgEnum('member_role', [
  'owner', 'admin', 'member', 'viewer',
])

export const connectorStatusEnum = pgEnum('connector_status', [
  'pending', 'active', 'error', 'paused', 'disconnected',
])

export const authMethodEnum = pgEnum('auth_method', [
  'api_key', 'oauth2', 'webhook', 'manual',
])

export const pipelineRunStatusEnum = pgEnum('pipeline_run_status', [
  'queued', 'running', 'success', 'failed', 'partial',
])

export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'confirmed', 'completed', 'refunded', 'cancelled',
])

export const attributionMethodEnum = pgEnum('attribution_method', [
  'crm_match', 'email_match', 'phone_match', 'utm_match', 'manual', 'unattributed',
])

export const adPlatformEnum = pgEnum('ad_platform', [
  'meta', 'google', 'instagram', 'linkedin', 'other',
])

// ─────────────────────────────────────────────
// LAYER 1 — AUTH / IDENTITY
// ─────────────────────────────────────────────

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  plan: orgPlanEnum('plan').notNull().default('free'),
  clerkOrgId: varchar('clerk_org_id', { length: 255 }).notNull(),
  // Soft delete
  deletedAt: timestamp('deleted_at'),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  slugUnique: uniqueIndex('orgs_slug_unique').on(t.slug),
  clerkOrgUnique: uniqueIndex('orgs_clerk_org_unique').on(t.clerkOrgId),
}))

export const orgMembers = pgTable('org_members', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull(),
  role: memberRoleEnum('role').notNull().default('member'),
  // Timestamps
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // One user per org — no duplicate memberships
  memberUnique: uniqueIndex('org_members_unique').on(t.orgId, t.clerkUserId),
  orgIdx: index('org_members_org_idx').on(t.orgId),
}))

// ─────────────────────────────────────────────
// LAYER 2 — WORKSPACE / CONNECTORS
// ─────────────────────────────────────────────

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  // Soft delete
  deletedAt: timestamp('deleted_at'),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // Slug unique per org (not globally)
  slugUnique: uniqueIndex('workspaces_slug_org_unique').on(t.orgId, t.slug),
  orgIdx: index('workspaces_org_idx').on(t.orgId),
}))

export const connectors = pgTable('connectors', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  toolId: varchar('tool_id', { length: 100 }).notNull(),       // 'razorpay', 'shopify', 'meta_ads'
  authMethod: authMethodEnum('auth_method').notNull(),
  status: connectorStatusEnum('status').notNull().default('pending'),
  // Credentials stored as base64-encoded AES-256-GCM ciphertext
  credentialsEncB64: text('credentials_enc_b64'),
  // Connector versioning + capability flags (e.g. { "webhooks": true, "bidirectional": false })
  connectorVersion: varchar('connector_version', { length: 50 }),
  capabilities: jsonb('capabilities').default('{}'),
  // Audit
  lastSyncedAt: timestamp('last_synced_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
  // Soft delete
  deletedAt: timestamp('deleted_at'),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // One connector per tool per workspace — no duplicates
  toolUnique: uniqueIndex('connectors_workspace_tool_unique').on(t.workspaceId, t.toolId),
  workspaceIdx: index('connectors_workspace_idx').on(t.workspaceId),
}))

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  crmUserId: varchar('crm_user_id', { length: 255 }).notNull(),
  sourceTool: varchar('source_tool', { length: 100 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // One agent per CRM user per workspace — no duplicates on re-sync
  agentUnique: uniqueIndex('agents_workspace_crm_unique').on(t.workspaceId, t.crmUserId, t.sourceTool),
  workspaceIdx: index('agents_workspace_idx').on(t.workspaceId),
}))

export const pipelineStages = pgTable('pipeline_stages', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  position: integer('position').notNull(),
  sourceTool: varchar('source_tool', { length: 100 }),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // No duplicate stage names per workspace
  stageUnique: uniqueIndex('pipeline_stages_workspace_name_unique').on(t.workspaceId, t.name),
  workspaceIdx: index('pipeline_stages_workspace_idx').on(t.workspaceId),
}))

// ─────────────────────────────────────────────
// LAYER 3 — PIPELINE / JOBS
// ─────────────────────────────────────────────

export const pipelineRuns = pgTable('pipeline_runs', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  connectorId: uuid('connector_id').notNull().references(() => connectors.id, { onDelete: 'cascade' }),
  status: pipelineRunStatusEnum('status').notNull().default('queued'),
  recordsSynced: integer('records_synced').notNull().default(0),
  recordsFailed: integer('records_failed').notNull().default(0),
  // Short machine-readable code for retry logic + human summary for logs
  errorCode: varchar('error_code', { length: 50 }),
  errorSummary: varchar('error_summary', { length: 500 }),
  // Timestamps
  startedAt: timestamp('started_at').defaultNow().notNull(),
  finishedAt: timestamp('finished_at'),
}, (t) => ({
  connectorDateIdx: index('pipeline_runs_connector_date_idx').on(t.connectorId, t.startedAt),
  workspaceIdx: index('pipeline_runs_workspace_idx').on(t.workspaceId),
}))

// Raw inbound webhook payloads — store before processing for idempotency + replay
export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  connectorId: uuid('connector_id').references(() => connectors.id, { onDelete: 'set null' }),
  sourceTool: varchar('source_tool', { length: 100 }).notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  // Raw payload from external tool
  payload: jsonb('payload').notNull(),
  // Idempotency key — prevent double-processing
  idempotencyKey: varchar('idempotency_key', { length: 255 }).notNull(),
  processed: boolean('processed').notNull().default(false),
  processedAt: timestamp('processed_at'),
  // Timestamps
  receivedAt: timestamp('received_at').defaultNow().notNull(),
}, (t) => ({
  // Prevent duplicate webhook delivery
  idempotencyUnique: uniqueIndex('webhook_idempotency_unique').on(t.sourceTool, t.idempotencyKey),
  workspaceIdx: index('webhook_events_workspace_idx').on(t.workspaceId),
  processedIdx: index('webhook_events_processed_idx').on(t.processed),
}))

// ─────────────────────────────────────────────
// LAYER 4 — UNIFIED DATA
// ─────────────────────────────────────────────

export const unifiedLeads = pgTable('unified_leads', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  connectorId: uuid('connector_id').references(() => connectors.id, { onDelete: 'set null' }),
  pipelineRunId: uuid('pipeline_run_id').references(() => pipelineRuns.id, { onDelete: 'set null' }),
  agentId: uuid('agent_id').references(() => agents.id, { onDelete: 'set null' }),
  // Stage as FK (normalized) + raw string from CRM (preserved for debugging)
  stageId: uuid('stage_id').references(() => pipelineStages.id, { onDelete: 'set null' }),
  stageRaw: varchar('stage_raw', { length: 100 }),   // original CRM label
  stageUpdatedAt: timestamp('stage_updated_at'),           // for funnel velocity
  // Source identity
  sourceTool: varchar('source_tool', { length: 100 }).notNull(),
  externalId: varchar('external_id', { length: 255 }).notNull(),
  // PII — subject to DPDP erasure requests
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  // Deal value — all amounts in INR (rupees, not paise)
  dealValueInr: numeric('deal_value_inr', { precision: 15, scale: 2 }),
  // Attribution — links this lead to the ad campaign that generated it
  adPlatform: adPlatformEnum('ad_platform'),
  campaignId: varchar('campaign_id', { length: 255 }),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  // Deduplication — if this lead is a duplicate, point to the canonical record
  canonicalLeadId: uuid('canonical_lead_id'),               // self-referencing FK (set after insert)
  // DPDP Act compliance — PII erasure
  piiErasureRequestedAt: timestamp('pii_erasure_requested_at'),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // Prevent duplicate leads from re-sync — upsert on this key
  sourceUnique: uniqueIndex('leads_source_unique').on(t.workspaceId, t.sourceTool, t.externalId),
  // Performance indexes for dashboard queries
  workspaceDateIdx: index('leads_workspace_date_idx').on(t.workspaceId, t.createdAt),
  workspaceStageIdx: index('leads_workspace_stage_idx').on(t.workspaceId, t.stageId),
  agentIdx: index('leads_agent_idx').on(t.agentId),
  campaignIdx: index('leads_campaign_idx').on(t.workspaceId, t.campaignId),
}))

// Every time a lead moves stage — powers funnel velocity + drop-off analysis
export const leadStageHistory = pgTable('lead_stage_history', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  leadId: uuid('lead_id').notNull().references(() => unifiedLeads.id, { onDelete: 'cascade' }),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  fromStageId: uuid('from_stage_id').references(() => pipelineStages.id, { onDelete: 'set null' }),
  toStageId: uuid('to_stage_id').references(() => pipelineStages.id, { onDelete: 'set null' }),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
  changedBy: varchar('changed_by', { length: 100 }),        // 'system' or agent name
}, (t) => ({
  leadIdx: index('lead_stage_history_lead_idx').on(t.leadId),
  workspaceIdx: index('lead_stage_history_workspace_idx').on(t.workspaceId),
}))

export const unifiedOrders = pgTable('unified_orders', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  connectorId: uuid('connector_id').references(() => connectors.id, { onDelete: 'set null' }),
  pipelineRunId: uuid('pipeline_run_id').references(() => pipelineRuns.id, { onDelete: 'set null' }),
  // Attribution — nullable: not every order comes from a tracked CRM lead
  leadId: uuid('lead_id').references(() => unifiedLeads.id, { onDelete: 'set null' }),
  isAttributed: boolean('is_attributed').notNull().default(false),
  attributionMethod: attributionMethodEnum('attribution_method').default('unattributed'),
  // Source identity
  sourceTool: varchar('source_tool', { length: 100 }).notNull(),
  externalId: varchar('external_id', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  // Amount in INR (rupees, not paise). Razorpay returns paise — divide by 100 in connector.
  amountInr: numeric('amount_inr', { precision: 15, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  orderedAt: timestamp('ordered_at').notNull(),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // Prevent duplicate orders from re-sync — upsert on this key
  sourceUnique: uniqueIndex('orders_source_unique').on(t.workspaceId, t.sourceTool, t.externalId),
  // Performance indexes
  workspaceDateIdx: index('orders_workspace_date_idx').on(t.workspaceId, t.orderedAt),
  leadIdx: index('orders_lead_idx').on(t.leadId),
  // Partial index — most revenue queries only touch completed orders
  // CREATE INDEX orders_completed_idx ON unified_orders(workspace_id, ordered_at) WHERE status = 'completed'
}))

export const adSpends = pgTable('ad_spends', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  connectorId: uuid('connector_id').references(() => connectors.id, { onDelete: 'set null' }),
  pipelineRunId: uuid('pipeline_run_id').references(() => pipelineRuns.id, { onDelete: 'set null' }),
  platform: adPlatformEnum('platform').notNull(),
  campaignId: varchar('campaign_id', { length: 255 }).notNull(),
  campaignName: varchar('campaign_name', { length: 255 }),
  adSetId: varchar('ad_set_id', { length: 255 }),
  adSetName: varchar('ad_set_name', { length: 255 }),
  // Amount in INR
  spendInr: numeric('spend_inr', { precision: 15, scale: 2 }).notNull(),
  impressions: integer('impressions').notNull().default(0),
  clicks: integer('clicks').notNull().default(0),
  leadsGenerated: integer('leads_generated').notNull().default(0),
  spendDate: date('spend_date').notNull(),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // One row per campaign per day — upsert on this key
  spendUnique: uniqueIndex('ad_spends_unique').on(t.workspaceId, t.platform, t.campaignId, t.spendDate),
  // Performance indexes
  workspaceDateIdx: index('ad_spends_workspace_date_idx').on(t.workspaceId, t.spendDate),
  campaignIdx: index('ad_spends_campaign_idx').on(t.workspaceId, t.platform, t.campaignId),
}))

// ─────────────────────────────────────────────
// LAYER 5 — ANALYTICS
// ─────────────────────────────────────────────

export const dailyMetrics = pgTable('daily_metrics', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  metricDate: date('metric_date').notNull(),
  // Channel breakdown — 'all' for workspace total, 'meta'/'google' for channel-level
  channel: varchar('channel', { length: 50 }).notNull().default('all'),
  // Computed metrics — all amounts in INR
  revenueInr: numeric('revenue_inr', { precision: 15, scale: 2 }).notNull().default('0'),
  ordersCount: integer('orders_count').notNull().default(0),
  leadsCount: integer('leads_count').notNull().default(0),
  adSpendInr: numeric('ad_spend_inr', { precision: 15, scale: 2 }).notNull().default('0'),
  roas: numeric('roas', { precision: 8, scale: 4 }),
  conversionRate: numeric('conversion_rate', { precision: 5, scale: 4 }),
  avgDealSize: numeric('avg_deal_size', { precision: 15, scale: 2 }),
  costPerLead: numeric('cost_per_lead', { precision: 15, scale: 2 }),
  // Staleness tracking — if source data changes after rollup, mark stale for recomputation
  isStale: boolean('is_stale').notNull().default(false),
  isProvisional: boolean('is_provisional').notNull().default(false),
  lastComputedAt: timestamp('last_computed_at').defaultNow().notNull(),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  // One row per workspace per date per channel
  metricsUnique: uniqueIndex('daily_metrics_unique').on(t.workspaceId, t.metricDate, t.channel),
  workspaceDateIdx: index('daily_metrics_workspace_date_idx').on(t.workspaceId, t.metricDate),
}))

// ─────────────────────────────────────────────
// LAYER 6 — AUDIT / COMPLIANCE
// ─────────────────────────────────────────────

// Who did what and when — required for DPDP Act compliance + enterprise security
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'set null' }),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'set null' }),
  clerkUserId: varchar('clerk_user_id', { length: 255 }),
  action: varchar('action', { length: 100 }).notNull(), // 'connector.created', 'lead.deleted'
  resourceType: varchar('resource_type', { length: 50 }).notNull(),
  resourceId: uuid('resource_id'),
  metadata: jsonb('metadata').default('{}'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  workspaceIdx: index('audit_logs_workspace_idx').on(t.workspaceId),
  createdAtIdx: index('audit_logs_created_at_idx').on(t.createdAt),
}))

// ─────────────────────────────────────────────
// LAYER 0 — NEXTAUTH IDENTITY TABLES
// (appended — do not rename or move existing tables)
// ─────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  // bcrypt hash — only set for credentials users; null for OAuth users
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => ({
  emailUnique: uniqueIndex('users_email_unique').on(t.email),
}))

export const accounts = pgTable('accounts', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (t) => ({
  providerUnique: uniqueIndex('accounts_provider_unique').on(t.provider, t.providerAccountId),
}))

export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (t) => ({
  identifierTokenUnique: uniqueIndex('verification_tokens_unique').on(t.identifier, t.token),
}))

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  // 64-char hex string from crypto.randomBytes(32)
  token: varchar('token', { length: 128 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  // Null = unused. Set on consumption to prevent replay.
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  tokenUnique: uniqueIndex('password_reset_tokens_token_unique').on(t.token),
  userIdx: index('password_reset_tokens_user_idx').on(t.userId),
}))
