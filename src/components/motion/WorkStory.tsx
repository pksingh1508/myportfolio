"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, markersEnabled } from "./scroll";

/** The server supplies the articles. Only this scoped controller owns scroll transforms. */
export default function WorkStory({ children }: { readonly children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = scope.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)", () => {
      const slides = Array.from(root.querySelectorAll<HTMLElement>(".project-slide"));
      const links = Array.from(root.querySelectorAll<HTMLElement>(".project-index-link"));
      const rails = Array.from(root.querySelectorAll<HTMLElement>(".project-index-track > span"));
      const stage = root.querySelector<HTMLElement>(".work-stage");
      if (!stage || slides.length < 2) return;
      let alive = true;
      root.dataset.enhanced = "true";
      const entryY = window.scrollY;
      gsap.set(slides, { opacity: 1, y: 0 });
      const setters = slides.map(slide => ({ opacity: gsap.quickSetter(slide, "opacity"), y: gsap.quickSetter(slide, "y", "px") }));
      const railSetters = rails.map(rail => gsap.quickSetter(rail, "scaleX"));
      let active = -1;
      const render = (progress: number) => {
        const position = progress * slides.length;
        const segment = Math.min(Math.floor(position), slides.length - 1);
        const blend = segment === slides.length - 1 ? 0 : Math.max(0, Math.min(1, (position - segment - .78) / .22));
        const current = Math.min(slides.length - 1, segment + (blend >= .5 ? 1 : 0));
        slides.forEach((slide, index) => {
          const opacity = index === segment ? 1 - blend : index === segment + 1 ? blend : 0;
          setters[index].opacity(opacity);
          setters[index].y(index === segment ? -20 * blend : 20 * (1 - blend));
          slide.style.visibility = opacity > 0 ? "visible" : "hidden";
          slide.style.pointerEvents = index === current ? "auto" : "none";
          railSetters[index]?.(Math.max(0, Math.min(1, position - index)));
        });
        if (active !== current) {
          active = current;
          slides.forEach((slide, index) => { slide.inert = index !== current; });
          links.forEach((link, index) => { link.dataset.active = String(index === current); });
        }
      };
      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "+=180%",
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: markersEnabled(),
        onUpdate: self => render(self.progress),
        onRefresh: self => render(self.progress),
      });
      render(trigger.progress);
      let settled = false;
      const refresh = () => {
        if (!alive) return;
        ScrollTrigger.refresh();
        if (!settled && Math.abs(window.scrollY - entryY) < 8) {
          const id = window.location.hash.slice(1);
          if (id) {
            try { document.getElementById(decodeURIComponent(id))?.scrollIntoView({ behavior: "instant" }); }
            catch { /* Malformed fragments do not prevent enhancement. */ }
          }
        }
        settled = true;
      };
      const frame = requestAnimationFrame(refresh);
      void document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
      return () => {
        alive = false;
        cancelAnimationFrame(frame);
        trigger.kill();
        delete root.dataset.enhanced;
        slides.forEach(slide => {
          slide.inert = false;
          slide.style.removeProperty("visibility");
          slide.style.removeProperty("pointer-events");
        });
        links.forEach(link => delete link.dataset.active);
        gsap.set(slides, { clearProps: "opacity,transform" });
        gsap.set(rails, { clearProps: "transform" });
      };
    });
    return () => media.revert();
  }, { scope });

  return <div ref={scope} className="work-story"><div className="work-stage">{children}</div></div>;
}
