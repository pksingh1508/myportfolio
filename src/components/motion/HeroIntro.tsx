"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";

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
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (alreadyPlayed()) {
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          "[data-intro]",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.09,
            onComplete: markPlayed,
          },
        );
        return () => {
          tween.kill();
        };
      });
      return () => {
        mm.revert();
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className="flow">
      {children}
    </div>
  );
}
