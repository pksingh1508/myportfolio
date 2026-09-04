"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import ArchivePoster from "../three/ArchivePoster";

const ArchiveScene = dynamic(() => import("../three/ArchiveScene"), {
  ssr: false,
  loading: () => null,
});

type FinaleMarkProps = {
  readonly frameSlugs: readonly string[];
};

/**
 * Step 12 contact-finale moment: the archive resolves into the personal mark.
 * Poster-first crossfade like the hero dock; the scene mounts at the hero
 * pose and damps to `final-mark` when its loop starts on-screen, so arrival
 * choreographs the resolution with no scroll choreography of its own.
 * Decorative throughout: adjacent copy carries the meaning, and renderer
 * failure leaves the poster with layout unchanged.
 */
export default function FinaleMark({ frameSlugs }: FinaleMarkProps) {
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="finale-mark" data-ready={String(ready)}>
      <motion.div
        className="finale-mark-poster"
        aria-hidden={ready || undefined}
        initial={false}
        animate={{ opacity: ready ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.4 }}
      >
        <ArchivePoster label="Archive resolving into the personal mark" />
      </motion.div>
      <motion.div
        className="finale-mark-scene"
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <ArchiveScene
          backend="auto"
          pose="final-mark"
          frameSlugs={frameSlugs}
          label="Personal mark resolving from the orbital archive"
          onFirstFrame={() => setReady(true)}
        />
      </motion.div>
    </div>
  );
}
