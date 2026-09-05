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
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const navState = useRef<"center" | "split" | null>(null);
  const navAnim = useRef<Animation | null>(null);

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
    if (!el.dataset.nav) {
      el.dataset.nav = "center";
    }
    if (!navState.current) {
      navState.current = el.dataset.nav === "split" ? "split" : "center";
    }
    document.documentElement.classList.add("js");
    let frame = 0;
    let initialized = false;
    const setNav = (next: "center" | "split") => {
      if (navState.current === next) {
        if (el.dataset.nav !== next) {
          el.dataset.nav = next;
        }
        return;
      }
      const nav = el.querySelector<HTMLElement>(".desktop-nav");
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const canAnimate =
        initialized &&
        !reducedRef.current &&
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
        desktop &&
        !!nav &&
        nav.offsetParent !== null;
      if (!canAnimate || !nav) {
        navAnim.current?.cancel();
        navAnim.current = null;
        el.dataset.nav = next;
        navState.current = next;
        return;
      }
      const first = nav.getBoundingClientRect();
      el.dataset.nav = next;
      navState.current = next;
      const last = nav.getBoundingClientRect();
      const dx = first.left - last.left;
      if (Math.abs(dx) > 1) {
        navAnim.current?.cancel();
        const anim = nav.animate(
          [{ transform: `translateX(${dx}px)` }, { transform: "translateX(0px)" }],
          { duration: 450, easing: "cubic-bezier(.22, 1, .36, 1)" },
        );
        navAnim.current = anim;
        anim.onfinish = () => {
          if (navAnim.current === anim) {
            navAnim.current = null;
          }
        };
      }
    };
    const update = () => {
      frame = 0;
      el.dataset.scrolled = String(window.scrollY > 8);
      const chapter = document.getElementById("work");
      const rect = chapter?.getBoundingClientRect();
      el.dataset.theme = rect && rect.top < el.offsetHeight && rect.bottom > el.offsetHeight ? "dark" : "light";
      const outcomes = document.querySelector(".outcomes-section");
      let split: boolean;
      if (outcomes) {
        const outcomesRect = outcomes.getBoundingClientRect();
        split = window.scrollY > 32 || outcomesRect.top < window.innerHeight * 0.85;
      } else {
        split = window.scrollY > 24;
      }
      const next = split ? "split" : "center";
      if (!initialized) {
        initialized = true;
        el.dataset.nav = next;
        navState.current = next;
        return;
      }
      if (next === "center") {
        const brand = el.querySelector<HTMLElement>(".brand");
        if (brand && brand.contains(document.activeElement)) {
          (document.activeElement as HTMLElement).blur();
        }
      }
      setNav(next);
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
      navAnim.current?.cancel();
      navAnim.current = null;
    };
  }, []);

  return (
    <header ref={ref} data-scrolled="false" data-nav="center" className="site-header">
      {children}
    </header>
  );
}
