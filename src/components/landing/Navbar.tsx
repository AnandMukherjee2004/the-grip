"use client";

import { useEffect, useRef } from "react";
import { initLiquidNav } from "@/lib/liquid-nav";

const NAV_ITEMS = [
  { href: "#solution", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "#blog", label: "Blog" },
  { href: "#docs", label: "Docs" },
] as const;

export function Navbar() {
  const centerWrapRef = useRef<HTMLDivElement>(null);
  const centerNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    if (centerWrapRef.current && centerNavRef.current) {
      cleanups.push(
        initLiquidNav(centerWrapRef.current, centerNavRef.current, {
          parallax: true,
        })
      );
    }

    let lastY = window.scrollY;
    let ticking = false;
    const wrap = centerWrapRef.current;
    const nav = centerNavRef.current;

    const applyScroll = () => {
      const y = window.scrollY;
      const hidden = y > 60 && y > lastY;
      if (wrap) wrap.dataset.hidden = hidden ? "true" : "false";
      if (nav) nav.classList.toggle("is-scrolled", y > 50);
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div ref={centerWrapRef} className="lg-wrap lg-wrap--center">
      <nav ref={centerNavRef} className="lg-nav px-16 py-3" aria-label="Primary">
        <ul className="lg-list">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="lg-item font-sans"
                data-lg-item
                {...(i === 0 ? { "aria-current": "page" as const } : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
