"use client";

import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

import {
  useAnimate,
  useInView,
  
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

type MotionRevealProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
};

/**
 * A deliberately scarce, one-shot marketing reveal. Content is server-rendered
 * and visible by default; Motion only borrows it for a short transform/opacity
 * entrance once the section is already arriving in the viewport.
 */
export default function MotionReveal({
  children,
  className = "",
  delay = 0,
}: MotionRevealProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -10% 0px",
  });
  const reduceMotion = useReducedMotionPreference();
  const played = useRef(false);

  useEffect(() => {
    if (!inView || reduceMotion || played.current || !scope.current) {
      return;
    }

    played.current = true;
    const element = scope.current;
    const playback = animate(
      element,
      {
        opacity: [0.72, 1],
        transform: ["translateY(16px)", "translateY(0px)"],
      },
      {
        delay,
        duration: 0.65,
        ease: [0.19, 1, 0.22, 1],
      },
    );
    return () => {
      playback.stop();
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
    };
  }, [animate, delay, inView, reduceMotion, scope]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
