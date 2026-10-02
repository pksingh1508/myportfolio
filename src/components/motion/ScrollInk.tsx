"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import { gsap, markersEnabled, useGSAP } from "./scroll";

type ScrollInkProps = {
  readonly text: string;
  readonly className?: string;
};

/**
 * Statement that inks in word by word as it scrolls up the viewport.
 * The server renders every word at full ink. This island scrubs a single
 * custom property, `--ink` (0 → 1), and CSS maps it to each word's opacity
 * from the word's index (see "About" in globals.css), so there is one
 * scroll-driven value and no per-word tween. The range ends before the
 * statement reaches the middle of the screen, so it is always fully inked
 * by the time it is read. Reduced motion and no-JS keep it fully inked.
 */
export default function ScrollInk({ text, className }: ScrollInkProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { ink: 0 };
        const apply = () => element.style.setProperty("--ink", state.ink.toFixed(4));
        // Scroll is the clock: linear mapping, smoothed only by scrub. The
        // range is fixed (0 → 1), so refreshes only re-measure the trigger.
        const tween = gsap.fromTo(
          state,
          { ink: 0 },
          {
            ink: 1,
            ease: "none",
            onUpdate: apply,
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              end: "bottom 66%",
              scrub: 0.5,
              markers: markersEnabled(),
            },
          },
        );
        apply();
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          element.style.removeProperty("--ink");
        };
      });
      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <p
      ref={ref}
      className={className ? `ink-statement ${className}` : "ink-statement"}
      style={{ "--n": words.length } as CSSProperties}
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <span className="ink-word" style={{ "--w": index } as CSSProperties}>
            {word}
          </span>
        </Fragment>
      ))}
    </p>
  );
}
