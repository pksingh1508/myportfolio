/*
 * Ambient types for the `three/webgpu` entry point (three 0.185).
 * At runtime it is a full superset of the core build; the matching
 * declarations are reached through `three/src/*` specifiers (the path form
 * TypeScript itself resolves to @types/three). Verified against the
 * installed three@0.185.1 / @types/three@0.185.4 pair — re-verify after
 * upgrades.
 */
declare module "three/webgpu" {
  export * from "three";
  export { default as WebGPURenderer } from "three/src/renderers/webgpu/WebGPURenderer";
  export type { WebGPURendererParameters } from "three/src/renderers/webgpu/WebGPURenderer";
}
