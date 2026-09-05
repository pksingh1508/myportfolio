"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, markersEnabled } from "./scroll";

const MAX_RADIUS = 28;
const MIN_INSET = 24;
const MAX_INSET = 160;
const INSET_RATIO = 0.06;

type WorkExpandProps = {
  readonly children: ReactNode;
};

/**
 * Inset-panel bloom for the dark selected-work chapter. The section starts as
 * a rounded, viewport-inset panel and expands to full bleed as it docks to
 * the top of the viewport, driven 1:1 by scroll progress.
 *
 * Implemented as a scrubbed clip-path (never width/height), so inner content
 * keeps its full-bleed layout the whole time: no reflow, no distortion.
 * Below tablet widths, reduced motion, or without JavaScript the section
 * stays full bleed — the clip is only ever applied by this enhancement.
 */
export default function WorkExpand({ children }: WorkExpandProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const metrics = () => ({
            inset: Math.min(
              Math.max(window.innerWidth * INSET_RATIO, MIN_INSET),
              MAX_INSET,
            ),
            radius: MAX_RADIUS,
          });
          const render = (progress: number) => {
            const { inset, radius } = metrics();
            const amount = Math.max(0, Math.min(1, 1 - progress));
            section.style.clipPath = `inset(0px ${inset * amount}px 0px ${inset * amount}px round ${radius * amount}px)`;
          };
          render(0);
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
            invalidateOnRefresh: true,
            markers: markersEnabled(),
            onUpdate: (self) => render(self.progress),
            onRefresh: (self) => render(self.progress),
          });
          render(trigger.progress);
          return () => {
            trigger.kill();
            section.style.removeProperty("clip-path");
          };
        },
      );
      return () => media.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="work" aria-labelledby="work-heading" className="night">
      {children}
    </section>
  );
}
