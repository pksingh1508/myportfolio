"use client";

import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

import dynamic from "next/dynamic";
import { motion, useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import ArchivePoster from "../three/ArchivePoster";

const ArchiveScene = dynamic(() => import("../three/ArchiveScene"), {
  ssr: false,
  loading: () => null,
});

type HeroArchiveProps = {
  readonly frameSlugs: readonly string[];
};

/**
 * Hero dock for the Orbital Archive. The static poster renders with the
 * server HTML (same box, no layout shift); the live canvas crossfades in
 * only after its first successfully rendered frame. Copy stays first in
 * reading and visual order; the canvas is decorative.
 */
export default function HeroArchive({ frameSlugs }: HeroArchiveProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotionPreference();

  useEffect(() => {
    const element = scope.current;
    if (!element || reduceMotion || window.scrollY > window.innerHeight * .5) return;
    const resting = getComputedStyle(element).transform;
    const finalTransform = resting === "none" ? "translateY(0px)" : resting;
    const playback = animate(element, {
      opacity: [.65, 1],
      transform: [`translateY(24px) scale(.97) ${finalTransform}`, finalTransform],
    }, { duration: .85, delay: .12, ease: [.22, .68, .35, 1] });
    return () => {
      playback.stop();
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
    };
  }, [animate, reduceMotion, scope]);

  return (
    <div ref={scope} className="hero-archive" data-ready={String(ready)}>
      <motion.div
        className="hero-archive-poster"
        aria-hidden={ready || undefined}
        initial={false}
        animate={{ opacity: ready ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <ArchivePoster label="Orbital archive of selected work" />
      </motion.div>
      <motion.div
        className="hero-archive-scene"
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <ArchiveScene
          backend="auto"
          pose="hero"
          frameSlugs={frameSlugs}
          label="Orbital archive of selected work"
          onFirstFrame={() => setReady(true)}
        />
      </motion.div>
      <div className="archive-title" aria-hidden="true"><span>Orbital Archive</span><small>PK / Selected work</small></div>
      <div className="archive-readout" aria-hidden="true">
        <span><i /> Interactive archive</span>
        <span>Three selected systems</span>
      </div>
    </div>
  );
}
