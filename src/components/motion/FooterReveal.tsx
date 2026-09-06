"use client";

import { stagger, useAnimate, useInView } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

/** One entrance for the footer's content, with visible server-rendered HTML. */
export default function FooterReveal({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -12% 0px",
  });
  const reducedMotion = useReducedMotionPreference();
  const played = useRef(false);

  useEffect(() => {
    if (!inView || reducedMotion || played.current || !scope.current) return;
    played.current = true;
    const elements = scope.current.querySelectorAll<HTMLElement>("[data-footer-reveal]");
    const playback = animate(
      elements,
      { opacity: [0, 1], transform: ["translateY(16px)", "translateY(0px)"] },
      { duration: 0.6, delay: stagger(0.08), ease: [0.19, 1, 0.22, 1] },
    );
    return () => {
      playback.stop();
      elements.forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      });
    };
  }, [animate, inView, reducedMotion, scope]);

  return <div ref={scope} className="footer-top">{children}</div>;
}
