import * as THREE from "three/webgpu";

/*
 * Smoked-glass / satin-graphite / violet-edge material system (plan.md).
 * One shared set is created per scene mount and disposed on teardown.
 * Renderer-compatible built-ins only: no ShaderMaterial, no onBeforeCompile,
 * no transmission pass (the glass sheath is opacity-based, not transmissive).
 */

export type ArchiveMaterials = {
  readonly monolithFace: THREE.MeshStandardMaterial;
  readonly monolithEdge: THREE.LineBasicMaterial;
  readonly frameFace: THREE.MeshStandardMaterial;
  readonly frameEdge: THREE.LineBasicMaterial;
  readonly screen: THREE.MeshStandardMaterial;
  readonly screenAccent: THREE.MeshBasicMaterial;
  readonly orbit: THREE.LineBasicMaterial;
  readonly dust: THREE.MeshBasicMaterial;
  /** Single hero glass surface; null on the balanced tier. */
  readonly glass: THREE.MeshPhysicalMaterial | null;
};

export function createArchiveMaterials(includeGlass: boolean): ArchiveMaterials {
  return {
    // Satin graphite core.
    monolithFace: new THREE.MeshStandardMaterial({
      color: 0x181b22,
      roughness: 0.32,
      metalness: 0.72,
      emissive: 0x130f3b,
      emissiveIntensity: 0.28,
    }),
    // Narrow violet emissive edge.
    monolithEdge: new THREE.LineBasicMaterial({
      color: 0x635bff,
      transparent: true,
      opacity: 0.85,
    }),
    // Satin paper frame faces.
    frameFace: new THREE.MeshStandardMaterial({
      color: 0xe8eaf1,
      roughness: 0.34,
      metalness: 0.16,
    }),
    frameEdge: new THREE.LineBasicMaterial({
      color: 0x635bff,
      transparent: true,
      opacity: 0.9,
    }),
    // Dark inset display makes every frame read as a project artifact rather
    // than an empty floating card.
    screen: new THREE.MeshStandardMaterial({
      color: 0x10131a,
      roughness: 0.6,
      metalness: 0.18,
      emissive: 0x0b0a1b,
      emissiveIntensity: 0.42,
    }),
    screenAccent: new THREE.MeshBasicMaterial({
      color: 0xb9b6ff,
    }),
    orbit: new THREE.LineBasicMaterial({
      // Graphite plan token; the previous mid-gray had no token home.
      color: 0x777494,
      transparent: true,
      opacity: 0.48,
    }),
    dust: new THREE.MeshBasicMaterial({
      color: 0xb9b6ff,
      transparent: true,
      opacity: 0.55,
    }),
    glass: includeGlass
      ? new THREE.MeshPhysicalMaterial({
          color: 0xb9b6ff,
          transparent: true,
          opacity: 0.11,
          roughness: 0.14,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          depthWrite: false,
        })
      : null,
  };
}

export function disposeArchiveMaterials(materials: ArchiveMaterials): void {
  materials.monolithFace.dispose();
  materials.monolithEdge.dispose();
  materials.frameFace.dispose();
  materials.frameEdge.dispose();
  materials.screen.dispose();
  materials.screenAccent.dispose();
  materials.orbit.dispose();
  materials.dust.dispose();
  materials.glass?.dispose();
}
