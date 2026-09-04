"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import ArchivePoster from "../three/ArchivePoster";
import type { ArchiveStats } from "../three/ArchiveScene";

/*
 * DEV-ONLY lab harness for the isolated archive prototype (Step 8).
 * Rendered on /specimen; never ships in production UI.
 */
const ArchiveScene = dynamic(() => import("../three/ArchiveScene"), {
  ssr: false,
  loading: () => <ArchivePoster label="Loading orbital archive prototype…" />,
});

type BackendOption = "auto" | "webgl" | "failed";

const OPTIONS: ReadonlyArray<{ value: BackendOption; label: string }> = [
  { value: "auto", label: "WebGPU, WebGL2 fallback" },
  { value: "webgl", label: "Force WebGL2" },
  { value: "failed", label: "Simulate failure" },
];

export default function ArchiveLab() {
  const [option, setOption] = useState<BackendOption>("auto");
  const [stats, setStats] = useState<ArchiveStats | null>(null);

  return (
    <div className="flow">
      <div className="btn-row" role="group" aria-label="Renderer backend">
        {OPTIONS.map((entry) => (
          <button
            key={entry.value}
            type="button"
            aria-pressed={option === entry.value}
            className={option === entry.value ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => {
              setOption(entry.value);
              setStats(null);
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <p role="status" className="mono">
        {stats
          ? `Backend ${stats.backend} — ${stats.calls} draw calls, ${stats.triangles} triangles, ${stats.geometries} geometries, ${stats.textures} textures.`
          : option === "failed"
            ? "Renderer failed as requested — static poster fallback shown, layout unchanged."
            : "Waiting for the first frame…"}
      </p>
      {option === "failed" ? (
        <ArchiveScene
          key="failed"
          backend="auto"
          simulateFailure
          onStats={setStats}
        />
      ) : (
        <ArchiveScene key={option} backend={option} onStats={setStats} />
      )}
    </div>
  );
}
