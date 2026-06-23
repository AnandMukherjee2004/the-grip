-- Run manually on Neon: psql $DATABASE_URL -f drizzle/0002_sourced_at.sql
ALTER TABLE unified_leads ADD COLUMN IF NOT EXISTS sourced_at TIMESTAMP;
