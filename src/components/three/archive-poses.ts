/*
 * Named scene poses. The render loop damps a numeric pose state toward the
 * active target every frame, so retargeting (scroll scrub in Step 11, lab
 * buttons here) is always smooth and interruption-safe with no tween
 * lifecycle to clean up: one owner per animated value.
 */

export type ArchivePoseName = "hero" | "final-mark" | `project:${string}`;

export type ArchivePoseTarget = {
  /** Base Y rotation of the archive root (radians). */
  readonly orbitOffset: number;
  /** Multiplier on orbit radii. */
  readonly spread: number;
  readonly cameraZ: number;
  readonly cameraY: number;
  /** Focused frame index; -1 means none. */
  readonly focusIndex: number;
  /** 0 = orbit formation, 1 = vertical mark stack. */
  readonly stackMix: number;
};

export type ArchivePoseState = {
  orbitOffset: number;
  spread: number;
  cameraZ: number;
  cameraY: number;
  focusIndex: number;
  stackMix: number;
};

const HERO_POSE: ArchivePoseTarget = {
  orbitOffset: 0,
  spread: 1,
  cameraZ: 7.4,
  cameraY: 0.9,
  focusIndex: -1,
  stackMix: 0,
};

const FINAL_MARK_POSE: ArchivePoseTarget = {
  orbitOffset: 0,
  spread: 0.55,
  cameraZ: 6.2,
  cameraY: 0.9,
  focusIndex: -1,
  stackMix: 1,
};

export function createArchivePoseState(): ArchivePoseState {
  return { ...HERO_POSE };
}

export function getArchivePoseTarget(
  name: ArchivePoseName,
  frameSlugs: readonly string[],
): ArchivePoseTarget {
  if (name === "final-mark") {
    return FINAL_MARK_POSE;
  }
  if (name.startsWith("project:")) {
    const slug = name.slice("project:".length);
    const index = frameSlugs.indexOf(slug);
    if (index >= 0) {
      // Rest angle so the focused frame swings to the front (+Z).
      const phase = (index / Math.max(frameSlugs.length, 1)) * Math.PI * 2;
      return {
        orbitOffset: Math.PI / 2 - phase,
        spread: 0.92,
        cameraZ: 6.6,
        cameraY: 0.7,
        focusIndex: index,
        stackMix: 0,
      };
    }
  }
  return HERO_POSE;
}
