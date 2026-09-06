"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, markersEnabled } from "./scroll";

const MAX_RADIUS = 28;
const MIN_INSET = 24;
/** Entry/exit panel targets Tailwind max-w-6xl (72rem ≈ 1152px), centered. */
const PANEL_MAX_WIDTH = 1152;

type WorkExpandProps = {
  readonly children: ReactNode;
};

/**
 * Inset-panel bloom for the dark selected-work chapter, in both directions.
 * The section enters as a rounded max-w-6xl panel, expands to full bleed as
 * it docks to the top, then shrinks back to the same max-w-6xl panel as it
 * scrolls out of view — all driven 1:1 by scroll progress.
 *
 * Implemented as a scrubbed clip-path (never width/height), so inner content
 * keeps its full-bleed layout the whole time: no reflow, no distortion.
 * Entry and exit blend through one openness value, so they stay smooth even
 * when their ranges overlap on short viewports. Below tablet widths,
 * reduced motion, or without JavaScript the section stays full bleed — the
 * clip is only ever applied by this enhancement.
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
          let enterProgress = 0;
          let exitProgress = 0;
          const render = () => {
            // Centered 6xl panel: (viewport - 1152) / 2 per side, floored so
            // small viewports keep a visible rounded margin. Both entry and
            // exit share this value, so expand and collapse are symmetric.
            const inset = Math.max(
              (window.innerWidth - PANEL_MAX_WIDTH) / 2,
              MIN_INSET,
            );
            const open =
              Math.max(0, Math.min(1, enterProgress)) *
              (1 - Math.max(0, Math.min(1, exitProgress)));
            const amount = 1 - open;
            section.style.clipPath = `inset(0px ${inset * amount}px 0px ${inset * amount}px round ${MAX_RADIUS * amount}px)`;
          };
          render();
          const enterTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
            invalidateOnRefresh: true,
            markers: markersEnabled(),
            onUpdate: (self) => {
              enterProgress = self.progress;
              render();
            },
            onRefresh: (self) => {
              enterProgress = self.progress;
              render();
            },
          });
          const exitTrigger = ScrollTrigger.create({
            trigger: section,
            start: "bottom bottom",
            end: "bottom top",
            scrub: 0.5,
            invalidateOnRefresh: true,
            markers: markersEnabled(),
            onUpdate: (self) => {
              exitProgress = self.progress;
              render();
            },
            onRefresh: (self) => {
              exitProgress = self.progress;
              render();
            },
          });
          enterProgress = enterTrigger.progress;
          exitProgress = exitTrigger.progress;
          render();
          return () => {
            enterTrigger.kill();
            exitTrigger.kill();
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
