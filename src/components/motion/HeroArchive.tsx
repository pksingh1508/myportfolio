"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import ArchivePoster from "../three/ArchivePoster";

const ArchiveScene = dynamic(() => import("../three/ArchiveScene"), {
  ssr: false,
  loading: () => <ArchivePoster label="Loading orbital archive…" />,
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
  const [ready, setReady] = useState(false);

  return (
    <div className="hero-archive" data-ready={String(ready)}>
      <div className="hero-archive-poster" aria-hidden={ready || undefined}>
        <ArchivePoster label="Orbital archive of selected work" />
      </div>
      <div className="hero-archive-scene">
        <ArchiveScene
          backend="auto"
          pose="hero"
          frameSlugs={frameSlugs}
          label="Orbital archive of selected work"
          onFirstFrame={() => setReady(true)}
        />
      </div>
    </div>
  );
}
