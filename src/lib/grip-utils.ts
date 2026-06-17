export function fmtIN(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function countUp(
  el: HTMLElement,
  to: number,
  dur: number,
  prefix = "",
  suffix = "",
  reduced = false,
) {
  if (reduced || dur <= 0) {
    el.textContent = prefix + fmtIN(to) + suffix;
    return;
  }
  let start: number | null = null;
  const tick = (ts: number) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + fmtIN(to * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function countDown(
  el: HTMLElement,
  steps: number[],
  prefix = "",
  suffix = "",
  reduced = false,
) {
  if (reduced) {
    el.textContent = prefix + steps[steps.length - 1] + suffix;
    el.classList.add("zero");
    return;
  }
  let i = 0;
  const next = () => {
    el.textContent = prefix + fmtIN(steps[i]) + suffix;
    if (steps[i] === 0) {
      el.classList.add("zero");
      return;
    }
    i++;
    if (i < steps.length) setTimeout(next, 250);
  };
  next();
}

export function scrollToSelector(selector: string, reduced = false) {
  const target = document.querySelector(selector);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}
