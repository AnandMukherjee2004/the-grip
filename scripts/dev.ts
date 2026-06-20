import type { Subprocess } from "bun";

const procs: Subprocess[] = [];
let shuttingDown = false;

function spawnDev(cmd: string[], label: string, options?: { restart?: boolean }) {
  const proc = Bun.spawn(cmd, {
    stdout: "inherit",
    stderr: "inherit",
    env: process.env,
  });

  procs.push(proc);

  proc.exited.then((code) => {
    if (shuttingDown) return;

    if (code !== 0) {
      console.error(`\n[${label}] exited with code ${code}`);

      // Next.js must stay up for /api/auth/session and the UI.
      if (label === "web") {
        shutdown(code ?? 1);
        return;
      }

      if (options?.restart) {
        console.warn(`[${label}] restarting in 1s…\n`);
        setTimeout(() => spawnDev(cmd, label, options), 1000);
      }
    }
  });

  return proc;
}

function shutdown(code = 0) {
  shuttingDown = true;
  for (const proc of procs) {
    if (!proc.killed) proc.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Starting GRIP dev stack (Next.js + Hono/Bun)…\n");

spawnDev(["bun", "run", "--hot", "server/index.ts"], "api", { restart: true });
spawnDev(["bunx", "next", "dev", "--webpack", "-p", "3000"], "web");
