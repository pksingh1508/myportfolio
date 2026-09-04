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
  readonly orbit: THREE.LineBasicMaterial;
  readonly dust: THREE.MeshBasicMaterial;
  /** Single hero glass surface; null on the balanced tier. */
  readonly glass: THREE.MeshPhysicalMaterial | null;
};

export function createArchiveMaterials(includeGlass: boolean): ArchiveMaterials {
  return {
    // Satin graphite core.
    monolithFace: new THREE.MeshStandardMaterial({
      color: 0x2a2e35,
      roughness: 0.5,
      metalness: 0.4,
    }),
    // Narrow violet emissive edge.
    monolithEdge: new THREE.LineBasicMaterial({
      color: 0x635bff,
      transparent: true,
      opacity: 0.85,
    }),
    // Satin paper frame faces.
    frameFace: new THREE.MeshStandardMaterial({
      color: 0xf7f8fc,
      roughness: 0.5,
      metalness: 0.05,
    }),
    frameEdge: new THREE.LineBasicMaterial({
      color: 0x635bff,
      transparent: true,
      opacity: 0.9,
    }),
    orbit: new THREE.LineBasicMaterial({
      // Graphite plan token; the previous mid-gray had no token home.
      color: 0x6f737b,
      transparent: true,
      opacity: 0.55,
    }),
    dust: new THREE.MeshBasicMaterial({
      color: 0x6f737b,
      transparent: true,
      opacity: 0.5,
    }),
    glass: includeGlass
      ? new THREE.MeshPhysicalMaterial({
          color: 0xdde1e8,
          transparent: true,
          opacity: 0.16,
          roughness: 0.08,
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
  materials.orbit.dispose();
  materials.dust.dispose();
  materials.glass?.dispose();
}
