import { Pool } from 'pg';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Since drizzle-orm pool connection signature expects pg client/pool:
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
export const db = drizzlePg(pool, { schema });
