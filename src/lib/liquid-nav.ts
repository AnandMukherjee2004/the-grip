export function initLiquidNav(
  wrap: HTMLElement,
  nav: HTMLElement,
  opts: { parallax: boolean } = { parallax: true }
) {
  const indicator = nav.querySelector<HTMLElement>("[data-lg-indicator]");
  const items = Array.from(nav.querySelectorAll<HTMLElement>("[data-lg-item]"));
  if (!indicator || items.length === 0) return () => {};

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const activeEl =
    items.find((el) => el.getAttribute("aria-current") === "page") ?? null;
  wrap.dataset.hasActive = activeEl ? "true" : "false";

  let currentEl: HTMLElement | null = activeEl;
  let settleTimer = 0;

  const setVar = (name: string, value: string) =>
    wrap.style.setProperty(name, value);

  const moveTo = (el: HTMLElement | null, stretch: boolean) => {
    if (!el) return;
    currentEl = el;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setVar("--ind-x", `${elRect.left - navRect.left}px`);
    setVar("--ind-w", `${elRect.width}px`);
    setVar("--ind-o", "1");

    if (stretch && !reduceMotion) {
      setVar("--ind-scale", "1.08");
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => setVar("--ind-scale", "1"), 170);
    }
  };

  const rest = () => {
    if (activeEl) {
      moveTo(activeEl, false);
    } else {
      currentEl = null;
      setVar("--ind-o", "0");
    }
  };

  const place = (fn: () => void) => {
    const prev = indicator.style.transition;
    indicator.style.transition = "none";
    fn();
    void indicator.offsetWidth;
    indicator.style.transition = prev;
  };
  place(rest);

  const onEnter = (e: Event) => moveTo(e.currentTarget as HTMLElement, true);
  const onFocus = (e: Event) => moveTo(e.currentTarget as HTMLElement, false);
  items.forEach((el) => {
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("focus", onFocus);
  });

  const onLeave = () => rest();
  const onFocusOut = (e: FocusEvent) => {
    if (!nav.contains(e.relatedTarget as Node)) rest();
  };
  nav.addEventListener("pointerleave", onLeave);
  nav.addEventListener("focusout", onFocusOut);

  let raf = 0;
  const target = { mx: 50, my: 50 };
  const cur = { mx: 50, my: 50 };
  const enableMotion = opts.parallax && !reduceMotion && !coarsePointer;

  const tick = () => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    cur.mx = lerp(cur.mx, target.mx, 0.18);
    cur.my = lerp(cur.my, target.my, 0.18);

    setVar("--mx", `${cur.mx.toFixed(2)}%`);
    setVar("--my", `${cur.my.toFixed(2)}%`);
    raf = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent) => {
    const r = nav.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    target.mx = nx * 100;
    target.my = ny * 100;
  };

  const resetMove = () => {
    target.mx = 50;
    target.my = 50;
  };

  if (enableMotion) {
    nav.addEventListener("pointermove", onMove);
    nav.addEventListener("pointerleave", resetMove);
    raf = requestAnimationFrame(tick);
  }

  const onResize = () => place(() => moveTo(currentEl, false));
  window.addEventListener("resize", onResize);

  return () => {
    window.clearTimeout(settleTimer);
    if (raf) cancelAnimationFrame(raf);
    items.forEach((el) => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("focus", onFocus);
    });
    nav.removeEventListener("pointerleave", onLeave);
    nav.removeEventListener("focusout", onFocusOut);
    nav.removeEventListener("pointermove", onMove);
    nav.removeEventListener("pointerleave", resetMove);
    window.removeEventListener("resize", onResize);
  };
}
