"use client";

import { useEffect } from "react";
import { countDown, countUp, prefersReducedMotion } from "@/lib/grip-utils";

function animateDash(dash: HTMLElement, reduced: boolean) {
  const counter = dash.querySelector<HTMLElement>("[data-dash-counter]");
  const pill = dash.querySelector<HTMLElement>("[data-dash-pill]");
  const toast = dash.querySelector<HTMLElement>("[data-dash-toast]");
  if (counter) countUp(counter, 1420000, 1800, "₹", "", reduced);
  if (reduced) {
    pill?.classList.add("win");
    toast?.classList.add("on");
    return;
  }
  setTimeout(() => pill?.classList.add("win"), 1000);
  setTimeout(() => toast?.classList.add("on"), 2200);
  setTimeout(() => toast?.classList.remove("on"), 5400);
}

export function useGripEffects() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const pre = document.querySelector<HTMLElement>(".preloader");
    let t1: ReturnType<typeof setTimeout> | undefined;
    let t2: ReturnType<typeof setTimeout> | undefined;

    if (reduced) {
      if (pre) pre.style.display = "none";
      document.body.classList.add("loaded");
    } else {
      document.body.classList.add("preloading");
      t1 = setTimeout(() => {
        pre?.classList.add("out");
        document.body.classList.add("loaded");
        t2 = setTimeout(() => {
          if (pre) pre.style.display = "none";
        }, 600);
      }, 1400);
    }

    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const onFirstScroll = () => {
      if (window.scrollY > 10) {
        document.body.classList.add("scrolled");
        window.removeEventListener("scroll", onFirstScroll);
      }
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true });
    return () => window.removeEventListener("scroll", onFirstScroll);
  }, []);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const rvIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            rvIO.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll("[data-rv]").forEach((el) => rvIO.observe(el));

    const stage = (selector: string, cls: string, threshold: number) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add(cls);
              io.unobserve(en.target);
            }
          });
        },
        { threshold },
      );
      io.observe(el);
    };
    stage(".chaos", "in", 0.3);
    stage(".chat", "play", 0.3);
    stage(".ba", "in", 0.25);

    const metricsEl = document.querySelector(".metrics");
    if (metricsEl) {
      const mIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            mIO.unobserve(en.target);
            en.target.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
              countUp(
                el,
                parseFloat(el.getAttribute("data-count") || "0"),
                2000,
                el.getAttribute("data-prefix") || "",
                el.getAttribute("data-suffix") || "",
                reduced,
              );
            });
            en.target.querySelectorAll<HTMLElement>("[data-steps]").forEach((el) => {
              const steps = (el.getAttribute("data-steps") || "")
                .split(",")
                .map(Number);
              countDown(
                el,
                steps,
                el.getAttribute("data-prefix") || "",
                el.getAttribute("data-suffix") || "",
                reduced,
              );
            });
          });
        },
        { threshold: 0.5 },
      );
      mIO.observe(metricsEl);
    }

    const solStage = document.querySelector<HTMLElement>(".solution-stage");
    if (solStage) {
      const solDash = solStage.querySelector<HTMLElement>(".dash");
      const solIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            solIO.unobserve(en.target);
            solInterval = runSolution();
          });
        },
        { threshold: 0.35 },
      );
      solIO.observe(solStage);

      function runSolution() {
        const beams = solStage!.querySelectorAll<HTMLElement>(".beam");
        const chips = solStage!.querySelectorAll<HTMLElement>(".conn-chip");
        const hub = solStage!.querySelector<HTMLElement>(".hub");
        const counter = solStage!.querySelector<HTMLElement>("[data-dash-counter]");
        const pill = solStage!.querySelector<HTMLElement>("[data-dash-pill]");
        const toast = solStage!.querySelector<HTMLElement>("[data-dash-toast]");

        if (reduced) {
          beams.forEach((b) => b.classList.add("on"));
          chips.forEach((c) => c.classList.add("ok-on"));
          hub?.classList.add("lit");
          solStage!.classList.add("dash-on");
          if (solDash) animateDash(solDash, reduced);
          return undefined;
        }

        let runCount = 0;
        const playCycle = () => {
          // Clear sub-timeouts if any or let them natural clear. Since we reset all classes, they'll visually restart clean.
          beams.forEach((b) => b.classList.remove("on"));
          chips.forEach((c) => c.classList.remove("ok-on"));
          hub?.classList.remove("lit");
          solStage!.classList.remove("dash-on");
          pill?.classList.remove("win");
          toast?.classList.remove("on");
          if (counter) counter.textContent = "₹0";

          beams.forEach((b, i) => {
            setTimeout(() => {
              b.classList.add("on");
              if (chips[i])
                setTimeout(() => chips[i].classList.add("ok-on"), 450);
            }, i * 600);
          });
          setTimeout(() => hub?.classList.add("lit"), 5 * 600 + 300);
          setTimeout(() => {
            solStage!.classList.add("dash-on");
            setTimeout(() => {
              if (solDash) {
                if (counter) countUp(counter, 1420000, 1800, "₹", "", reduced);
                setTimeout(() => pill?.classList.add("win"), 1000);
                setTimeout(() => toast?.classList.add("on"), 2200);
                setTimeout(() => toast?.classList.remove("on"), 5400);
              }
            }, 700);
          }, 5 * 600 + 800);
          runCount++;
        };

        playCycle();
        return setInterval(playCycle, 10000);
      }
    }

    const how = document.querySelector<HTMLElement>(".how");
    const track = document.querySelector<HTMLElement>(".how-track");
    const panels = document.querySelectorAll<HTMLElement>(".panel");
    const isDesktop = window.matchMedia("(min-width: 1024px)");
    let liveDashStarted = false;
    let liveInterval: ReturnType<typeof setInterval> | undefined;
    let solInterval: ReturnType<typeof setInterval> | undefined;

    function activatePanel(idx: number) {
      panels.forEach((p, i) => {
        if (i === idx) {
          if (!p.classList.contains("active")) {
            p.classList.add("active");
            if (i === 2 && !liveDashStarted) {
              liveDashStarted = true;
              startLiveDash();
            }
          }
        }
      });
    }

    function howScroll() {
      if (!how || !track) return;
      const rect = how.getBoundingClientRect();
      const total = how.offsetHeight - window.innerHeight;
      const p = Math.min(Math.max(-rect.top / total, 0), 1);
      track.style.transform = `translate3d(${-p * 2 * window.innerWidth}px,0,0)`;
      activatePanel(p < 0.34 ? 0 : p < 0.72 ? 1 : 2);
    }

    function startLiveDash() {
      const liveDash = document.querySelector<HTMLElement>(
        "[data-live-dash-slot] .dash",
      );
      if (!liveDash) return;
      const row = liveDash.querySelector<HTMLElement>("[data-dash-newrow]");
      const pill = row?.querySelector<HTMLElement>(".pill");
      const toast = liveDash.querySelector<HTMLElement>("[data-dash-toast]");
      let orderNo = 4822;

      if (reduced) {
        row?.classList.add("on");
        pill?.classList.add("win");
        return;
      }

      const cycle = () => {
        row?.classList.remove("on");
        if (pill) {
          pill.classList.remove("win");
          pill.textContent = "New lead";
        }
        toast?.classList.remove("on");

        setTimeout(() => row?.classList.add("on"), 500);
        setTimeout(() => {
          if (pill) {
            pill.classList.add("win");
            pill.textContent = "Sale Done";
          }
        }, 2400);
        setTimeout(() => {
          if (toast) {
            const text = toast.querySelector(".toast-text");
            if (text) text.textContent = `Order #${orderNo} → Shopify`;
            toast.classList.add("on");
            orderNo++;
          }
        }, 3600);
        setTimeout(() => toast?.classList.remove("on"), 5400);
      };
      cycle();
      liveInterval = setInterval(cycle, 6000);
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        howScroll();
        ticking = false;
      });
    };

    if (how && track) {
      if (isDesktop.matches && !reduced) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", howScroll);
        howScroll();
      } else {
        const pIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (!en.isIntersecting) return;
              pIO.unobserve(en.target);
              const idx = Array.prototype.indexOf.call(panels, en.target);
              activatePanel(idx);
            });
          },
          { threshold: 0.25 },
        );
        panels.forEach((p) => pIO.observe(p));
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", howScroll);
      if (liveInterval) clearInterval(liveInterval);
      if (solInterval) clearInterval(solInterval);
      rvIO.disconnect();
    };
  }, []);
}
