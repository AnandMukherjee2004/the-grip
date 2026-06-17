CREATE TYPE "public"."ad_platform" AS ENUM('meta', 'google', 'instagram', 'linkedin', 'other');--> statement-breakpoint
CREATE TYPE "public"."attribution_method" AS ENUM('crm_match', 'email_match', 'phone_match', 'utm_match', 'manual', 'unattributed');--> statement-breakpoint
CREATE TYPE "public"."auth_method" AS ENUM('api_key', 'oauth2', 'webhook', 'manual');--> statement-breakpoint
CREATE TYPE "public"."connector_status" AS ENUM('pending', 'active', 'error', 'paused', 'disconnected');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'member', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'completed', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."org_plan" AS ENUM('free', 'starter', 'growth', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."pipeline_run_status" AS ENUM('queued', 'running', 'success', 'failed', 'partial');--> statement-breakpoint
CREATE TABLE "ad_spends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"connector_id" uuid,
	"pipeline_run_id" uuid,
	"platform" "ad_platform" NOT NULL,
	"campaign_id" varchar(255) NOT NULL,
	"campaign_name" varchar(255),
	"ad_set_id" varchar(255),
	"ad_set_name" varchar(255),
	"spend_inr" numeric(15, 2) NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"leads_generated" integer DEFAULT 0 NOT NULL,
	"spend_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"crm_user_id" varchar(255) NOT NULL,
	"source_tool" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"org_id" uuid,
	"clerk_user_id" varchar(255),
	"action" varchar(100) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"resource_id" uuid,
	"metadata" jsonb DEFAULT '{}',
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"tool_id" varchar(100) NOT NULL,
	"auth_method" "auth_method" NOT NULL,
	"status" "connector_status" DEFAULT 'pending' NOT NULL,
	"credentials_enc_b64" text,
	"connector_version" varchar(50),
	"capabilities" jsonb DEFAULT '{}',
	"last_synced_at" timestamp,
	"last_accessed_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"metric_date" date NOT NULL,
	"channel" varchar(50) DEFAULT 'all' NOT NULL,
	"revenue_inr" numeric(15, 2) DEFAULT '0' NOT NULL,
	"orders_count" integer DEFAULT 0 NOT NULL,
	"leads_count" integer DEFAULT 0 NOT NULL,
	"ad_spend_inr" numeric(15, 2) DEFAULT '0' NOT NULL,
	"roas" numeric(8, 4),
	"conversion_rate" numeric(5, 4),
	"avg_deal_size" numeric(15, 2),
	"cost_per_lead" numeric(15, 2),
	"is_stale" boolean DEFAULT false NOT NULL,
	"is_provisional" boolean DEFAULT false NOT NULL,
	"last_computed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_stage_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"from_stage_id" uuid,
	"to_stage_id" uuid,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"changed_by" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "org_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"plan" "org_plan" DEFAULT 'free' NOT NULL,
	"clerk_org_id" varchar(255) NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"connector_id" uuid NOT NULL,
	"status" "pipeline_run_status" DEFAULT 'queued' NOT NULL,
	"records_synced" integer DEFAULT 0 NOT NULL,
	"records_failed" integer DEFAULT 0 NOT NULL,
	"error_code" varchar(50),
	"error_summary" varchar(500),
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pipeline_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"position" integer NOT NULL,
	"source_tool" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unified_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"connector_id" uuid,
	"pipeline_run_id" uuid,
	"agent_id" uuid,
	"stage_id" uuid,
	"stage_raw" varchar(100),
	"stage_updated_at" timestamp,
	"source_tool" varchar(100) NOT NULL,
	"external_id" varchar(255) NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"phone" varchar(20),
	"deal_value_inr" numeric(15, 2),
	"ad_platform" "ad_platform",
	"campaign_id" varchar(255),
	"utm_source" varchar(255),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(255),
	"canonical_lead_id" uuid,
	"pii_erasure_requested_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unified_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"connector_id" uuid,
	"pipeline_run_id" uuid,
	"lead_id" uuid,
	"is_attributed" boolean DEFAULT false NOT NULL,
	"attribution_method" "attribution_method" DEFAULT 'unattributed',
	"source_tool" varchar(100) NOT NULL,
	"external_id" varchar(255) NOT NULL,
	"customer_email" varchar(255),
	"amount_inr" numeric(15, 2) NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"ordered_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"connector_id" uuid,
	"source_tool" varchar(100) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"payload" jsonb NOT NULL,
	"idempotency_key" varchar(255) NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp,
	"received_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ad_spends" ADD CONSTRAINT "ad_spends_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_spends" ADD CONSTRAINT "ad_spends_connector_id_connectors_id_fk" FOREIGN KEY ("connector_id") REFERENCES "public"."connectors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_spends" ADD CONSTRAINT "ad_spends_pipeline_run_id_pipeline_runs_id_fk" FOREIGN KEY ("pipeline_run_id") REFERENCES "public"."pipeline_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connectors" ADD CONSTRAINT "connectors_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_metrics" ADD CONSTRAINT "daily_metrics_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_stage_history" ADD CONSTRAINT "lead_stage_history_lead_id_unified_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."unified_leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_stage_history" ADD CONSTRAINT "lead_stage_history_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_stage_history" ADD CONSTRAINT "lead_stage_history_from_stage_id_pipeline_stages_id_fk" FOREIGN KEY ("from_stage_id") REFERENCES "public"."pipeline_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_stage_history" ADD CONSTRAINT "lead_stage_history_to_stage_id_pipeline_stages_id_fk" FOREIGN KEY ("to_stage_id") REFERENCES "public"."pipeline_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_runs" ADD CONSTRAINT "pipeline_runs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_runs" ADD CONSTRAINT "pipeline_runs_connector_id_connectors_id_fk" FOREIGN KEY ("connector_id") REFERENCES "public"."connectors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_stages" ADD CONSTRAINT "pipeline_stages_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_leads" ADD CONSTRAINT "unified_leads_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_leads" ADD CONSTRAINT "unified_leads_connector_id_connectors_id_fk" FOREIGN KEY ("connector_id") REFERENCES "public"."connectors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_leads" ADD CONSTRAINT "unified_leads_pipeline_run_id_pipeline_runs_id_fk" FOREIGN KEY ("pipeline_run_id") REFERENCES "public"."pipeline_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_leads" ADD CONSTRAINT "unified_leads_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_leads" ADD CONSTRAINT "unified_leads_stage_id_pipeline_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."pipeline_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_orders" ADD CONSTRAINT "unified_orders_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_orders" ADD CONSTRAINT "unified_orders_connector_id_connectors_id_fk" FOREIGN KEY ("connector_id") REFERENCES "public"."connectors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_orders" ADD CONSTRAINT "unified_orders_pipeline_run_id_pipeline_runs_id_fk" FOREIGN KEY ("pipeline_run_id") REFERENCES "public"."pipeline_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unified_orders" ADD CONSTRAINT "unified_orders_lead_id_unified_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."unified_leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_connector_id_connectors_id_fk" FOREIGN KEY ("connector_id") REFERENCES "public"."connectors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ad_spends_unique" ON "ad_spends" USING btree ("workspace_id","platform","campaign_id","spend_date");--> statement-breakpoint
CREATE INDEX "ad_spends_workspace_date_idx" ON "ad_spends" USING btree ("workspace_id","spend_date");--> statement-breakpoint
CREATE INDEX "ad_spends_campaign_idx" ON "ad_spends" USING btree ("workspace_id","platform","campaign_id");--> statement-breakpoint
CREATE UNIQUE INDEX "agents_workspace_crm_unique" ON "agents" USING btree ("workspace_id","crm_user_id","source_tool");--> statement-breakpoint
CREATE INDEX "agents_workspace_idx" ON "agents" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "audit_logs_workspace_idx" ON "audit_logs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "connectors_workspace_tool_unique" ON "connectors" USING btree ("workspace_id","tool_id");--> statement-breakpoint
CREATE INDEX "connectors_workspace_idx" ON "connectors" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_metrics_unique" ON "daily_metrics" USING btree ("workspace_id","metric_date","channel");--> statement-breakpoint
CREATE INDEX "daily_metrics_workspace_date_idx" ON "daily_metrics" USING btree ("workspace_id","metric_date");--> statement-breakpoint
CREATE INDEX "lead_stage_history_lead_idx" ON "lead_stage_history" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_stage_history_workspace_idx" ON "lead_stage_history" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "org_members_unique" ON "org_members" USING btree ("org_id","clerk_user_id");--> statement-breakpoint
CREATE INDEX "org_members_org_idx" ON "org_members" USING btree ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orgs_slug_unique" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "orgs_clerk_org_unique" ON "organizations" USING btree ("clerk_org_id");--> statement-breakpoint
CREATE INDEX "pipeline_runs_connector_date_idx" ON "pipeline_runs" USING btree ("connector_id","started_at");--> statement-breakpoint
CREATE INDEX "pipeline_runs_workspace_idx" ON "pipeline_runs" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pipeline_stages_workspace_name_unique" ON "pipeline_stages" USING btree ("workspace_id","name");--> statement-breakpoint
CREATE INDEX "pipeline_stages_workspace_idx" ON "pipeline_stages" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "leads_source_unique" ON "unified_leads" USING btree ("workspace_id","source_tool","external_id");--> statement-breakpoint
CREATE INDEX "leads_workspace_date_idx" ON "unified_leads" USING btree ("workspace_id","created_at");--> statement-breakpoint
CREATE INDEX "leads_workspace_stage_idx" ON "unified_leads" USING btree ("workspace_id","stage_id");--> statement-breakpoint
CREATE INDEX "leads_agent_idx" ON "unified_leads" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "leads_campaign_idx" ON "unified_leads" USING btree ("workspace_id","campaign_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_source_unique" ON "unified_orders" USING btree ("workspace_id","source_tool","external_id");--> statement-breakpoint
CREATE INDEX "orders_workspace_date_idx" ON "unified_orders" USING btree ("workspace_id","ordered_at");--> statement-breakpoint
CREATE INDEX "orders_lead_idx" ON "unified_orders" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_idempotency_unique" ON "webhook_events" USING btree ("source_tool","idempotency_key");--> statement-breakpoint
CREATE INDEX "webhook_events_workspace_idx" ON "webhook_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "webhook_events_processed_idx" ON "webhook_events" USING btree ("processed");--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_slug_org_unique" ON "workspaces" USING btree ("org_id","slug");--> statement-breakpoint
CREATE INDEX "workspaces_org_idx" ON "workspaces" USING btree ("org_id");