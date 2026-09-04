"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "./gsap";

/*
 * Scroll registration point, imported only by scroll-driven islands.
 * Registering ScrollTrigger here (not in motion/gsap) keeps it out of
 * bundles that only need core tweens, such as the hero intro.
 */
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
export { markersEnabled, useGSAP, usePrefersReducedMotion } from "./gsap";
