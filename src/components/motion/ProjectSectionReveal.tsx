"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

/**
 * Content remains visible in HTML; the tree entrance only starts on
 * intersection. CSS holds the pre-reveal pose while the client can still
 * play it, so this island must always end by setting data-revealing.
 */
export default function ProjectSectionReveal({ children, labelledBy }: { readonly children: ReactNode; readonly labelledBy: string }) {
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || played.current) return;
    element.querySelectorAll("li").forEach((item, index) => {
      (item as HTMLElement).style.setProperty("--project-detail-index", String(index));
    });
    if (typeof IntersectionObserver === "undefined") {
      played.current = true;
      element.dataset.revealing = "true";
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      played.current = true;
      element.dataset.revealing = "true";
      observer.disconnect();
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [reducedMotion]);

  return <section ref={ref} aria-labelledby={labelledBy} className="project-section project-detail-tree">{children}</section>;
}
