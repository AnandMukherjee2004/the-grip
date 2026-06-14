"use client";

import Link from "next/link";
import { HeroGraphPaper } from "./HeroGraphPaper";
import { HeroLeakingLine } from "./HeroLeakingLine";
import { HeroNumbersDisagree } from "./HeroNumbersDisagree";

const ARTBOARDS = [
  {
    id: "a",
    label: "A · Graph Paper (as specced)",
    href: "/heroes/a",
    component: <HeroGraphPaper />,
  },
  {
    id: "b",
    label: "B · The Leaking Line",
    href: "/heroes/b",
    component: <HeroLeakingLine />,
  },
  {
    id: "c",
    label: "C · The Numbers Disagree",
    href: "/heroes/c",
    component: <HeroNumbersDisagree />,
  },
];

export function HeroVariationsPage() {
  return (
    <div className="min-h-screen bg-[#f0eee9] font-sans">
      <header className="border-b border-black/5 bg-[#f0eee9] px-6 py-8 md:px-12">
        <p className="text-sm font-medium uppercase tracking-widest text-[#70709a]">
          Design canvas
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#2a251f]">
          Grip — Hero Variations
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[#5a4a2a]/80">
          Three openings for the same story. Full page uses A — say the word to
          swap.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back to landing page
        </Link>
      </header>

      <div className="flex flex-col gap-10 overflow-x-auto px-6 py-10 md:flex-row md:px-12">
        {ARTBOARDS.map((board) => (
          <article key={board.id} className="shrink-0">
            <div className="mb-2 flex items-center justify-between gap-4">
              <h2 className="text-sm font-medium text-[#5a4a2a]">
                {board.label}
              </h2>
              <Link
                href={board.href}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                Open full page →
              </Link>
            </div>
            <div
              className="overflow-hidden rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]"
              style={{ width: 1440, height: 900, transform: "scale(0.45)", transformOrigin: "top left" }}
            >
              <div style={{ width: 1440, height: 900 }}>{board.component}</div>
            </div>
            <div style={{ height: 495 }} aria-hidden />
          </article>
        ))}
      </div>

      <aside className="fixed bottom-8 left-8 max-w-xs rotate-[-2deg] bg-[#fef4a8] p-4 text-sm leading-relaxed text-[#5a4a2a] shadow-md">
        A is the spec verbatim. B makes the pipeline metaphor literal — the line
        leaks. C opens with the conflict itself: four tools, four numbers.
      </aside>
    </div>
  );
}
