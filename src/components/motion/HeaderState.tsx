"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

type HeaderStateProps = {
  readonly children: ReactNode;
};

type NavState = "center" | "split";

/**
 * Owns the <header> element so scroll state can restyle the floating glass
 * controls without pulling static brand/nav markup into the client bundle:
 * children are passed from the server parent and stay server-rendered.
 *
 * - data-scrolled: any scroll away from the top.
 * - data-theme: "dark" while a [data-header-theme="dark"] surface sits
 *   under the header, so the glass turns smoke.
 * - data-nav: "center" over the homepage hero (the hero already names the
 *   owner), "split" once it ends and on every other page.
 *
 * The entrance is CSS (it plays on first paint); this island also marks
 * the document as hydrated, which retires the reveal failsafe.
 */
export default function HeaderState({ children }: HeaderStateProps) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotionPreference();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const navState = useRef<NavState | null>(null);
  const navAnim = useRef<Animation | null>(null);
  const sync = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    if (!root.hasAttribute("data-hydrated")) root.setAttribute("data-hydrated", "true");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    if (!navState.current) {
      navState.current = el.dataset.nav === "split" ? "split" : "center";
    }
    let frame = 0;
    let initialized = false;

    const setNav = (next: NavState) => {
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
      // FLIP: measure, switch layout, then glide from the old position.
      const first = nav.getBoundingClientRect();
      el.dataset.nav = next;
      navState.current = next;
      const last = nav.getBoundingClientRect();
      const dx = first.left - last.left;
      if (Math.abs(dx) > 1) {
        navAnim.current?.cancel();
        const anim = nav.animate(
          [{ transform: `translateX(${dx}px)` }, { transform: "translateX(0px)" }],
          { duration: 620, easing: "cubic-bezier(.16, 1, .3, 1)" },
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

      const probe = el.offsetHeight / 2;
      let dark = false;
      document.querySelectorAll<HTMLElement>('[data-header-theme="dark"]').forEach((zone) => {
        const rect = zone.getBoundingClientRect();
        if (rect.top < probe && rect.bottom > probe) dark = true;
      });
      el.dataset.theme = dark ? "dark" : "light";

      const hero = document.querySelector<HTMLElement>(".hero-section");
      const next: NavState =
        hero && hero.getBoundingClientRect().bottom > window.innerHeight * 0.35
          ? "center"
          : "split";
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
    sync.current = onScroll;

    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !anchor ||
        anchor.closest(".menu-panel") ||
        anchor.target ||
        anchor.hasAttribute("download")
      )
        return;
      const url = new URL(anchor.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      let target: HTMLElement | null;
      try {
        target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      } catch {
        return;
      }
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      const instant =
        event.detail === 0 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: instant ? "instant" : "smooth" });
      const heading = target.matches("h1, h2")
        ? target
        : target.querySelector<HTMLElement>("h1, h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
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
      sync.current = () => {};
    };
  }, []);

  // The layout persists across routes: re-measure after every navigation,
  // since a same-position route change fires no scroll event.
  useEffect(() => {
    sync.current();
  }, [pathname]);

  // Server-render the resting state for this route so the nav never jumps
  // on hydration: only the homepage opens over a hero.
  return (
    <header
      ref={ref}
      data-scrolled="false"
      data-nav={pathname === "/" ? "center" : "split"}
      className="site-header"
      style={{ viewTransitionName: "site-header" }}
    >
      {children}
    </header>
  );
}
