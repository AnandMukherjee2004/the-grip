# The Grip — Next.js + Bun + Hono

Component-based Next.js + TypeScript + Tailwind frontend with a **Hono API on Bun**.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main landing page |
| `/heroes` | Hero variation comparison |
| `/heroes/a` | Hero A — Graph Paper |
| `/heroes/b` | Hero B — The Leaking Line |
| `/heroes/c` | Hero C — The Numbers Disagree |

## Prerequisites

Install [Bun](https://bun.sh):

```bash
curl -fsSL https://bun.sh/install | bash
```

## Development

```bash
bun install
cp .env.example .env.local   # optional — defaults work for local dev
bun run dev
```

This starts both services:

| Service | URL | Runtime |
|---------|-----|---------|
| Next.js frontend | http://localhost:3000 | Bun runs `next dev` |
| Hono API | http://localhost:3001/api | Bun native |

Next.js proxies `/api/*` → the Hono server (see `next.config.ts`).

### Run services separately

```bash
bun run dev:web   # Next.js only
bun run dev:api   # Hono API only (hot reload)
```

### API endpoints

- `GET /api/health` — service health
- `GET /api/status` — sample pipeline status payload

From the frontend:

```ts
import { getHealth, getStatus } from "@/lib/api";

const health = await getHealth();
```

## Production

```bash
bun run build
bun run start        # Next.js
bun run start:api    # Hono API (separate process)
```

## Stack

- **Bun** — package manager + API runtime
- **Hono** — lightweight API framework (`server/index.ts`)
- **Next.js 16** — App Router frontend
- **TypeScript** + **Tailwind CSS v4**

## Project layout

```
server/index.ts      # Hono API entry (Bun.serve)
scripts/dev.ts       # Runs Next.js + API together
src/lib/api.ts       # Frontend API client
src/components/      # React components
```
