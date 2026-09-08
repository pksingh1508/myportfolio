"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

/** Content remains visible in HTML; the entrance only starts on intersection. */
export default function ContributionReveal({ children }: { readonly children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || played.current || typeof IntersectionObserver === "undefined") return;
    element.querySelectorAll("li").forEach((item, index) => {
      (item as HTMLElement).style.setProperty("--contribution-index", String(index));
    });
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      played.current = true;
      element.dataset.revealing = "true";
      observer.disconnect();
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.revealing;
    };
  }, [reducedMotion]);

  return <section ref={ref} aria-labelledby="contribution-heading" className="project-section contribution-tree">{children}</section>;
}
