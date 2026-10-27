"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, markersEnabled } from "./scroll";

/** Scale a card settles to once the next card covers it. */
const SETTLED_SCALE = 0.94;
/** Darkness of the shade over a fully covered card. */
const SETTLED_SHADE = 0.6;

type WorkStackProps = {
  /** Number of cards, so CSS can size each card to fit the deepest docking line. */
  readonly count: number;
  readonly children: ReactNode;
};

/**
 * Settle motion for the sticky selected-work deck. CSS docks each card
 * (`position: sticky`); this island only scrubs the card underneath: as the
 * next card rises from the bottom of the viewport to its docking line, the
 * covered card shrinks toward its top edge and dims, so earlier projects
 * recede into a stack instead of simply being painted over.
 *
 * Trigger positions are measured from the stack's natural (unstuck) layout,
 * never from the sticky cards themselves, whose boxes move while docked.
 * Scroll is the clock: linear, no duration. The media query matches the CSS
 * that enables the sticky deck, so below it nothing is transformed.
 */
export default function WorkStack({ count, children }: WorkStackProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
        () => {
          const slots = Array.from(root.querySelectorAll<HTMLElement>(".stack-slot"));
          if (slots.length < 2) return;

          // Document offset of slot `index` as if nothing were stuck.
          const naturalTop = (index: number) => {
            const gap = parseFloat(getComputedStyle(root).rowGap) || 0;
            let offset = root.getBoundingClientRect().top + window.scrollY;
            for (let k = 0; k < index; k += 1) {
              offset += slots[k].offsetHeight + gap;
            }
            return offset;
          };
          const dockLine = (slot: HTMLElement) => parseFloat(getComputedStyle(slot).top) || 0;

          slots.slice(0, -1).forEach((slot, index) => {
            const card = slot.querySelector<HTMLElement>(".stack-card");
            const shade = slot.querySelector<HTMLElement>(".stack-shade");
            const next = slots[index + 1];
            if (!card || !shade) return;
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: root,
                  // The next card enters from the bottom edge, but never
                  // before this one has docked.
                  start: () =>
                    Math.max(
                      naturalTop(index + 1) - window.innerHeight,
                      naturalTop(index) - dockLine(slot),
                    ),
                  end: () => naturalTop(index + 1) - dockLine(next),
                  scrub: true,
                  invalidateOnRefresh: true,
                  markers: markersEnabled(),
                },
              })
              .to(card, { scale: SETTLED_SCALE, ease: "none" }, 0)
              .to(shade, { opacity: SETTLED_SHADE, ease: "none" }, 0);
          });

          let alive = true;
          void document.fonts.ready.then(() => {
            if (alive) ScrollTrigger.refresh();
          });
          return () => {
            alive = false;
          };
        },
      );
      return () => media.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="work-stack" style={{ "--count": count } as CSSProperties}>
      {children}
    </div>
  );
}
