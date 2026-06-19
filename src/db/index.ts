import * as schema from './schema';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';

let db: any;
let pool: any;

if (process.env.NEXT_RUNTIME === 'edge') {
  db = {} as any;
} else {
  const { Pool } = require('pg');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is missing');
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  db = drizzlePg(pool, { schema });
}

export { db, pool };
