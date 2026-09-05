"use client";

import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

import { useAnimate } from "motion/react";
import { useLayoutEffect, useRef, type ReactNode } from "react";

type HeroIntroProps = {
  readonly children: ReactNode;
};

/** Staged page-load entrance. HTML stays readable without JavaScript or motion. */
export default function HeroIntro({ children }: HeroIntroProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const played = useRef(false);
  const reduceMotion = useReducedMotionPreference();

  useLayoutEffect(() => {
    if (reduceMotion || played.current || window.scrollY > window.innerHeight * .5) {
      return;
    }

    const elements = Array.from(scope.current.querySelectorAll<HTMLElement>("[data-intro]"));
    const playback = animate(elements,
      { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0px)"] },
      { delay: (index) => [0.05, 0.18, 0.34, 0.48][index] ?? 0.48, duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    );
    played.current = true;
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
