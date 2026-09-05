"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

type HeroIntroProps = {
  readonly children: ReactNode;
};

const INTRO_DELAYS = [0.05, 0.18, 0.34, 0.48];
const INTRO_DURATION = 0.85;

/**
 * Staged page-load entrance. HTML stays readable without JavaScript or motion.
 *
 * Raw WAAPI with `fill: "backwards"` (same pattern as HeaderState): the hidden
 * starting pose lives only inside the live animation effect, never as inline
 * styles or library-side state. A finished animation exerts no effect and
 * unmount cancels everything, so client-side route transitions can never
 * strand the copy at opacity 0 — every skip path leaves visible HTML alone.
 */
export default function HeroIntro({ children }: HeroIntroProps) {
  const scope = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const reduceMotion = useReducedMotionPreference();

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || played.current || reduceMotion) {
      return;
    }
    if (window.scrollY > window.innerHeight * 0.5) {
      return;
    }
    const elements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-intro]"),
    );
    if (elements.length === 0) {
      return;
    }
    played.current = true;
    const animations = elements.map((element, index) =>
      element.animate(
        [
          { opacity: 0, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0px)" },
        ],
        {
          delay: (INTRO_DELAYS[index] ?? 0.48) * 1000,
          duration: INTRO_DURATION * 1000,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        },
      ),
    );
    return () => {
      animations.forEach((animation) => animation.cancel());
    };
  }, [reduceMotion]);

  return (
    <div ref={scope} className="hero-copy flow">
      {children}
    </div>
  );
}
