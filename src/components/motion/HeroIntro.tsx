"use client";

import { stagger, useAnimate, useReducedMotion } from "motion/react";
import { useLayoutEffect, type ReactNode } from "react";

const PLAYED_KEY = "orbital-archive:hero-intro-played";

function alreadyPlayed(): boolean {
  try {
    return window.sessionStorage.getItem(PLAYED_KEY) === "1";
  } catch {
    // Private mode: replay on the next mount rather than crashing.
    return false;
  }
}

function markPlayed(): void {
  try {
    window.sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    // Private mode: replay on the next mount rather than crashing.
  }
}

type HeroIntroProps = {
  readonly children: ReactNode;
};

/**
 * One-time hero entrance, max ~1.15s. The server-rendered hero is always
 * shipped visible; initial states are set in a layout effect (pre-paint, so
 * nothing flashes) and animated to the natural resting pose in hierarchy
 * order. Reduced motion, repeat visits in the same session, and failed
 * JavaScript all resolve to the final readable pose.
 */
export default function HeroIntro({ children }: HeroIntroProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion || alreadyPlayed()) {
      return;
    }

    const elements = Array.from(scope.current.querySelectorAll<HTMLElement>("[data-intro]"));
    const playback = animate(elements,
      { opacity: [0.35, 1], transform: ["translateY(22px)", "translateY(0px)"] },
      { delay: stagger(0.065), duration: 0.7, ease: [0.22, 0.68, 0.35, 1] },
    );
    // Mark at start so a fast route return does not replay a half-finished intro.
    markPlayed();
    return () => {
      playback.stop();
      elements.forEach(element => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      });
    };
  }, [animate, reduceMotion, scope]);

  return (
    <div ref={scope} className="hero-copy flow">
      {children}
    </div>
  );
}
