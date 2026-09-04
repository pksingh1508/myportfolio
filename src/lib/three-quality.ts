export type ArchiveQualityTier = "high" | "balanced";

export type ArchiveQuality = {
  readonly tier: ArchiveQualityTier;
  /** Hard cap for renderer.setPixelRatio. */
  readonly maxPixelRatio: number;
  readonly antialias: boolean;
  /** Instanced dust particle count (desktop/high only in spirit). */
  readonly dustCount: number;
};

/**
 * Quality resolver with an SSR-safe default. Mobile, small viewports, and
 * weak CPUs land on the balanced tier (DPR 1–1.5, no MSAA, fewer particles).
 */
export function resolveArchiveQuality(): ArchiveQuality {
  if (typeof window === "undefined") {
    return { tier: "balanced", maxPixelRatio: 1.5, antialias: false, dustCount: 60 };
  }
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallViewport = window.innerWidth < 768;
  const weakCpu = (window.navigator.hardwareConcurrency ?? 8) <= 4;
  if (coarsePointer || smallViewport || weakCpu) {
    return { tier: "balanced", maxPixelRatio: 1.5, antialias: false, dustCount: 60 };
  }
  return { tier: "high", maxPixelRatio: 2, antialias: true, dustCount: 140 };
}
