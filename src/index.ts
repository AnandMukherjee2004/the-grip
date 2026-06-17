import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { sql } from 'drizzle-orm';
import { db } from './db/index';
import apiRouter from './routes/index';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  })
);

// Mount routes (/api/v1/onboarding will be handled by apiRouter)
app.route('/', apiRouter);

// 1. GET /health
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 2. GET /api/v1/ping
app.get('/api/v1/ping', (c) => {
  return c.json({
    pong: true,
  });
});

// Startup Database connection check
const testDbConnection = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('DB connected ✓');
  } catch (error) {
    console.error('Database connection failed on startup:', error);
    process.exit(1);
  }
};

await testDbConnection();

export default app;
