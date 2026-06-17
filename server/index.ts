import { hostname } from "os";
import app from "../src/index";

const port = Number(process.env.PORT ?? 3001);

console.log(`GRIP API (Hono + Bun) → http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  hostname: '0.0.0.0'
};
