"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import ArchivePoster from "../three/ArchivePoster";

const ArchiveScene = dynamic(() => import("../three/ArchiveScene"), {
  ssr: false,
  loading: () => <ArchivePoster label="Loading personal mark…" />,
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

  return (
    <div className="finale-mark" data-ready={String(ready)}>
      <div className="finale-mark-poster" aria-hidden={ready || undefined}>
        <ArchivePoster label="Archive resolving into the personal mark" />
      </div>
      <div className="finale-mark-scene">
        <ArchiveScene
          backend="auto"
          pose="final-mark"
          frameSlugs={frameSlugs}
          label="Personal mark resolving from the orbital archive"
          onFirstFrame={() => setReady(true)}
        />
      </div>
    </div>
  );
}
