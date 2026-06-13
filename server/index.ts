import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api");

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/health", (c) =>
  c.json({
    ok: true,
    service: "revline-api",
    runtime: "bun",
    version: process.env.npm_package_version ?? "0.1.0",
  }),
);

app.get("/status", (c) =>
  c.json({
    pipeline: "ready",
    connectors: ["leadsquared", "hubspot", "shopify", "razorpay", "meta-ads"],
    syncedMinutesAgo: 2,
  }),
);

const port = Number(process.env.PORT ?? 3001);

console.log(`Revline API (Hono + Bun) → http://localhost:${port}/api`);

export default {
  port,
  fetch: app.fetch,
};
