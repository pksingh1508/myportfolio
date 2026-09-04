"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, usePrefersReducedMotion } from "./gsap";

/**
 * Dev-only runtime self-test, rendered on /specimen. Plays one tiny scoped
 * timeline when motion is safe, skips it under reduced motion, and reports
 * which path ran. useGSAP reverts everything on unmount, so navigating away
 * and back never duplicates timelines or ScrollTriggers.
 */
export default function MotionSelfTest() {
  const scope = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Arming timeline…");
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          "[data-motion-target]",
          { opacity: 0.25, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => {
              setStatus("Timeline played once, final pose held.");
            },
          },
        );
        return () => {
          tween.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setStatus("Reduced motion: timeline skipped, final pose shown.");
      });

      return () => {
        mm.revert();
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className="flow">
      <p role="status" className="meta">
        GSAP {gsap.version} — prefers-reduced-motion:{" "}
        {reduceMotion ? "reduce" : "no-preference"} — {status}
      </p>
      <p
        data-motion-target
        className="mono"
        style={{
          border: "1px solid var(--color-line)",
          borderRadius: "var(--radius-frame-sm)",
          padding: "1rem",
        }}
      >
        Scoped test target: transform and opacity only.
      </p>
    </div>
  );
}
