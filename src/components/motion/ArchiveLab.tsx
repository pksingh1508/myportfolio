"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { projects } from "../../constant/data";
import ArchivePoster from "../three/ArchivePoster";
import type { ArchivePoseName } from "../three/archive-poses";
import type { ArchiveStats } from "../three/ArchiveScene";

/*
 * DEV-ONLY lab harness for the isolated archive prototype (Steps 8–9).
 * Rendered on /specimen; never ships in production UI.
 */
const ArchiveScene = dynamic(() => import("../three/ArchiveScene"), {
  ssr: false,
  loading: () => <ArchivePoster label="Loading orbital archive prototype…" />,
});

type BackendOption = "auto" | "webgl" | "failed";

const BACKEND_OPTIONS: ReadonlyArray<{ value: BackendOption; label: string }> = [
  { value: "auto", label: "WebGPU, WebGL2 fallback" },
  { value: "webgl", label: "Force WebGL2" },
  { value: "failed", label: "Simulate failure" },
];

export default function ArchiveLab() {
  const [backend, setBackend] = useState<BackendOption>("auto");
  const [pose, setPose] = useState<ArchivePoseName>("hero");
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const frameSlugs = useMemo(() => projects.map((project) => project.slug), []);
  const poseOptions = useMemo<ReadonlyArray<{ value: ArchivePoseName; label: string }>>(
    () => [
      { value: "hero", label: "Hero" },
      ...projects.map((project) => ({
        value: `project:${project.slug}` as ArchivePoseName,
        label: project.title,
      })),
      { value: "final-mark", label: "Final mark" },
    ],
    [],
  );

  return (
    <div className="flow">
      <div className="btn-row" role="group" aria-label="Renderer backend">
        {BACKEND_OPTIONS.map((entry) => (
          <button
            key={entry.value}
            type="button"
            aria-pressed={backend === entry.value}
            className={backend === entry.value ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => {
              setBackend(entry.value);
              setStats(null);
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="btn-row" role="group" aria-label="Scene pose">
        {poseOptions.map((entry) => (
          <button
            key={entry.value}
            type="button"
            aria-pressed={pose === entry.value}
            className={pose === entry.value ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => setPose(entry.value)}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <p role="status" className="mono">
        {stats
          ? `Backend ${stats.backend} — ${stats.calls} draw calls, ${stats.triangles} triangles, ${stats.geometries} geometries, ${stats.textures} textures.`
          : backend === "failed"
            ? "Renderer failed as requested — static poster fallback shown, layout unchanged."
            : "Waiting for the first frame…"}
      </p>
      {backend === "failed" ? (
        <ArchiveScene
          key="failed"
          backend="auto"
          simulateFailure
          onStats={setStats}
        />
      ) : (
        <ArchiveScene
          key={backend}
          backend={backend}
          pose={pose}
          frameSlugs={frameSlugs}
          onStats={setStats}
        />
      )}
    </div>
  );
}
