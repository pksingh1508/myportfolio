"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/*
 * Single GSAP registration point. Import ONLY from client islands
 * (this module's "use client" boundary would pull GSAP into any
 * server component that imports it, breaking route-level code splitting).
 * ScrollTrigger stays out of this module so pages that only need core
 * tweens (hero intro) never download it; Step 11 registers it in a
 * scroll-specific module.
 */
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reactive reduced-motion flag. Starts false to match the server render and
 * corrects in an effect, so there is never a hydration mismatch.
 */
export function usePrefersReducedMotion(): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    setMatches(media.matches);
    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  return matches;
}

/**
 * ScrollTrigger markers are a development instrument only. They enable on
 * development builds with ?gsap-markers in the URL and can never ship
 * enabled: production always returns false.
 */
export function markersEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  return (
    typeof window !== "undefined" &&
    window.location.search.includes("gsap-markers")
  );
}
