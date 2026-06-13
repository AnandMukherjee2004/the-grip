import type { Subprocess } from "bun";

const procs: Subprocess[] = [];

function spawnDev(cmd: string[], label: string) {
  const proc = Bun.spawn(cmd, {
    stdout: "inherit",
    stderr: "inherit",
    env: process.env,
  });

  procs.push(proc);

  proc.exited.then((code) => {
    if (code !== 0) {
      console.error(`[${label}] exited with code ${code}`);
      shutdown(code ?? 1);
    }
  });

  return proc;
}

function shutdown(code = 0) {
  for (const proc of procs) {
    if (!proc.killed) proc.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Starting Revline dev stack (Next.js + Hono/Bun)…\n");

spawnDev(["bun", "run", "--hot", "server/index.ts"], "api");
spawnDev(["bunx", "next", "dev"], "web");
