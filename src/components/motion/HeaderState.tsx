"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

type HeaderStateProps = {
  readonly children: ReactNode;
};

/**
 * Owns the <header> element so scroll state can toggle the backdrop without
 * pulling static brand/nav markup into the client bundle: children are
 * passed from the server parent and stay server-rendered.
 */
export default function HeaderState({ children }: HeaderStateProps) {
  const ref = useRef<HTMLElement>(null);
  const entered = useRef(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion || entered.current || window.scrollY > 0) return;
    const inner = ref.current?.querySelector<HTMLElement>(".site-header-inner");
    if (!inner) return;
    entered.current = true;
    const entrance = inner.animate([
      { opacity: 0, transform: "translateY(-16px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: 600, delay: 200, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" });
    return () => entrance.cancel();
  }, [reducedMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    document.documentElement.classList.add("js");
    let frame = 0;
    const update = () => {
      frame = 0;
      el.dataset.scrolled = String(window.scrollY > 8);
      const chapter = document.getElementById("work");
      const rect = chapter?.getBoundingClientRect();
      el.dataset.theme = rect && rect.top < el.offsetHeight && rect.bottom > el.offsetHeight ? "dark" : "light";
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    const onAnchorClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.closest(".menu-panel") || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      const instant = event.detail === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: instant ? "instant" : "smooth" });
      const heading = target.matches("h1, h2") ? target : target.querySelector<HTMLElement>("h1, h2");
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("click", onAnchorClick, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onAnchorClick, true);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <header ref={ref} data-scrolled="false" className="site-header">
      {children}
    </header>
  );
}
