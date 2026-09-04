"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import { resolveArchiveQuality } from "../../lib/three-quality";
import {
  createArchiveMaterials,
  disposeArchiveMaterials,
} from "./archive-materials";
import {
  createArchivePoseState,
  getArchivePoseTarget,
  type ArchivePoseName,
  type ArchivePoseState,
} from "./archive-poses";
import ArchivePoster from "./ArchivePoster";

export type ArchiveBackend = "webgpu" | "webgl2" | "unavailable";

export type ArchiveStats = {
  readonly backend: ArchiveBackend;
  readonly calls: number;
  readonly triangles: number;
  readonly geometries: number;
  readonly textures: number;
};

type ArchiveSceneProps = {
  /** "auto" prefers WebGPU with WebGL2 fallback; "webgl" forces WebGL2. */
  readonly backend: "auto" | "webgl";
  /** Throw before init to exercise the poster fallback. */
  readonly simulateFailure?: boolean;
  readonly onStats?: (stats: ArchiveStats) => void;
  /** Fires once after the first successfully rendered frame. */
  readonly onFirstFrame?: () => void;
  /** Fires once when initialization fails and the poster takes over. */
  readonly onError?: () => void;
  readonly label?: string;
  /** Active named pose; the loop damps toward its target every frame. */
  readonly pose?: ArchivePoseName;
  /** Frame order for `project:<slug>` poses. */
  readonly frameSlugs?: readonly string[];
};

/** Strict pointer-tilt limits (radians). */
const MAX_TILT_X = 0.1;
const MAX_TILT_Y = 0.15;
/** Exponential damping rates (per second). */
const TILT_LAMBDA = 4;
const POSE_LAMBDA = 3;

function damp(current: number, target: number, delta: number, lambda: number) {
  return current + (target - current) * (1 - Math.exp(-delta * lambda));
}

/**
 * Isolated Orbital Archive prototype. Procedural scene graph from plan.md,
 * WebGPURenderer with setAnimationLoop, DPR tiers, off-screen and hidden-tab
 * pause, reduced-motion single frame at the final pose, and full teardown.
 */
export default function ArchiveScene({
  backend,
  simulateFailure = false,
  onStats,
  onFirstFrame,
  onError,
  label = "Orbital archive prototype",
  pose = "hero",
  frameSlugs = [],
}: ArchiveSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);
  const onStatsRef = useRef(onStats);
  const onFirstFrameRef = useRef(onFirstFrame);
  const onErrorRef = useRef(onError);
  const poseRef = useRef<ArchivePoseName>(pose);
  const slugsRef = useRef<readonly string[]>(frameSlugs);

  useEffect(() => {
    onStatsRef.current = onStats;
    onFirstFrameRef.current = onFirstFrame;
    onErrorRef.current = onError;
  }, [onStats, onFirstFrame, onError]);

  useEffect(() => {
    poseRef.current = pose;
    slugsRef.current = frameSlugs;
  }, [pose, frameSlugs]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) {
      return;
    }

    let disposed = false;
    let teardown: (() => void) | null = null;

    const start = async () => {
      if (simulateFailure) {
        throw new Error("[archive] simulated renderer failure");
      }

      const quality = resolveArchiveQuality();
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const finePointer =
        !reduceMotion &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const renderer = new THREE.WebGPURenderer({
        canvas,
        alpha: true,
        antialias: quality.antialias,
        forceWebGL: backend === "webgl",
        powerPreference: "high-performance",
      });
      await renderer.init();
      if (disposed) {
        renderer.dispose();
        return;
      }

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 4 / 3, 0.1, 50);
      camera.position.set(0, 0.9, 7.4);
      camera.lookAt(0, 0.1, 0);

      // Pointer tilt owns tiltGroup; poses own root/camera — never the same property.
      const tiltGroup = new THREE.Group();
      tiltGroup.name = "TiltGroup";
      scene.add(tiltGroup);
      const root = new THREE.Group();
      root.name = "ArchiveRoot";
      tiltGroup.add(root);

      const materials = createArchiveMaterials(quality.tier === "high");

      const monolithGeo = new THREE.BoxGeometry(0.55, 2.3, 0.55);
      const monolith = new THREE.Mesh(monolithGeo, materials.monolithFace);
      monolith.position.y = 0.15;
      const monolithEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(monolithGeo),
        materials.monolithEdge,
      );
      monolithEdge.position.copy(monolith.position);
      root.add(monolith, monolithEdge);

      if (materials.glass) {
        const sheath = new THREE.Mesh(
          new THREE.BoxGeometry(0.72, 2.5, 0.72),
          materials.glass,
        );
        sheath.position.y = 0.15;
        root.add(sheath);
      }

      const ORBIT_RX = 2.6;
      const ORBIT_RZ = 1.72;
      const ORBIT_Y = 0.35;
      const FRAME_COUNT = 3;
      const frameGeo = new THREE.BoxGeometry(1.7, 1.05, 0.05);
      const frameEdgeGeo = new THREE.EdgesGeometry(frameGeo);
      const frames: Array<{
        group: THREE.Group;
        phase: number;
        index: number;
        scale: number;
      }> = [];
      for (let index = 0; index < FRAME_COUNT; index += 1) {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(frameGeo, materials.frameFace));
        group.add(new THREE.LineSegments(frameEdgeGeo, materials.frameEdge));
        const phase = (index / FRAME_COUNT) * Math.PI * 2;
        group.position.set(
          Math.cos(phase) * ORBIT_RX,
          ORBIT_Y,
          Math.sin(phase) * ORBIT_RZ,
        );
        root.add(group);
        frames.push({ group, phase, index, scale: 1 });
      }

      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, ORBIT_RX, ORBIT_RZ).getPoints(128),
      );
      // Plain Line, not LineLoop: the WebGPU backend drops LineLoop objects
      // (per-frame console error, missing orbit). EllipseCurve closes its
      // own point ring, so this draws the identical loop on both backends.
      const orbit = new THREE.Line(orbitGeo, materials.orbit);
      orbit.rotation.x = -Math.PI / 2;
      orbit.position.y = -0.55;
      root.add(orbit);

      const dust = new THREE.InstancedMesh(
        new THREE.SphereGeometry(0.012, 6, 6),
        materials.dust,
        quality.dustCount,
      );
      const dummy = new THREE.Object3D();
      for (let index = 0; index < quality.dustCount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.5 + Math.random() * 2;
        dummy.position.set(
          Math.cos(angle) * radius,
          -1 + Math.random() * 2.5,
          Math.sin(angle) * radius,
        );
        dummy.updateMatrix();
        dust.setMatrixAt(index, dummy.matrix);
      }
      dust.instanceMatrix.needsUpdate = true;
      root.add(dust);

      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(3, 5, 4);
      const fill = new THREE.DirectionalLight(0xdde4ff, 0.7);
      fill.position.set(-4, 1, 2);
      const rim = new THREE.DirectionalLight(0xb9b6ff, 1.2);
      rim.position.set(-1, 3, -5);
      scene.add(key, fill, rim, new THREE.AmbientLight(0xffffff, 0.55));

      const poseState: ArchivePoseState = createArchivePoseState();
      const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };
      // THREE.Timer replaces the deprecated THREE.Clock: call update()
      // once per frame, then read getDelta()/getElapsed() (both seconds).
      const timer = new THREE.Timer();
      timer.connect(document);
      const loop = { visible: true, pageVisible: !document.hidden };

      const renderFrame = () => {
        renderer.render(scene, camera);
      };

      const ORBIT_SPEED = 0.1;

      /**
       * Pose layout shared by the live loop and the reduced-motion still.
       * `instant` snaps every value to its target with ambient terms at rest,
       * so reduced motion shows final states in a single frame instead of
       * the construction pose.
       */
      const updatePose = (delta: number, t: number, instant: boolean) => {
        const target = getArchivePoseTarget(poseRef.current, slugsRef.current);
        if (instant) {
          Object.assign(poseState, target);
        } else {
          poseState.orbitOffset = damp(poseState.orbitOffset, target.orbitOffset, delta, POSE_LAMBDA);
          poseState.spread = damp(poseState.spread, target.spread, delta, POSE_LAMBDA);
          poseState.cameraZ = damp(poseState.cameraZ, target.cameraZ, delta, POSE_LAMBDA);
          poseState.cameraY = damp(poseState.cameraY, target.cameraY, delta, POSE_LAMBDA);
          poseState.stackMix = damp(poseState.stackMix, target.stackMix, delta, POSE_LAMBDA);
          poseState.focusIndex = target.focusIndex;
        }

        camera.position.set(0, poseState.cameraY, poseState.cameraZ);
        camera.lookAt(0, 0.1, 0);

        for (const frame of frames) {
          const angle = frame.phase + t * ORBIT_SPEED;
          const orbitX = Math.cos(angle) * ORBIT_RX * poseState.spread;
          const orbitZ = Math.sin(angle) * ORBIT_RZ * poseState.spread;
          const orbitY =
            ORBIT_Y + (instant ? 0 : Math.sin(t * 0.5 + frame.phase) * 0.22);
          const stackY = 0.8 - frame.index * 0.8;
          frame.group.position.set(
            orbitX * (1 - poseState.stackMix),
            orbitY + (stackY - orbitY) * poseState.stackMix,
            orbitZ * (1 - poseState.stackMix) + 0.6 * poseState.stackMix,
          );
          frame.group.lookAt(camera.position);
          const targetScale = frame.index === poseState.focusIndex ? 1.08 : 1;
          frame.scale = instant
            ? targetScale
            : damp(frame.scale, targetScale, delta, POSE_LAMBDA);
          frame.group.scale.setScalar(frame.scale);
        }
        monolith.rotation.y = instant ? 0 : t * 0.05;
        root.rotation.y =
          poseState.orbitOffset + (instant ? 0 : Math.sin(t * 0.08) * 0.06);
        dust.rotation.y = instant ? 0 : -t * 0.02;
      };

      const renderStill = () => {
        updatePose(0, 0, true);
        renderFrame();
      };

      const applySize = () => {
        const width = host.clientWidth || 4;
        const height = host.clientHeight || 3;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, quality.maxPixelRatio),
        );
        renderer.setSize(width, height, false);
        if (reduceMotion) {
          renderStill();
        }
      };
      applySize();

      const tick = (timestamp?: number) => {
        timer.update(timestamp);
        const delta = Math.min(timer.getDelta(), 0.05);
        updatePose(delta, timer.getElapsed(), false);

        tilt.x = damp(tilt.x, tilt.targetX, delta, TILT_LAMBDA);
        tilt.y = damp(tilt.y, tilt.targetY, delta, TILT_LAMBDA);
        tiltGroup.rotation.x = tilt.x;
        tiltGroup.rotation.y = tilt.y;

        renderFrame();
      };

      const updateLoop = () => {
        if (disposed) {
          return;
        }
        if (reduceMotion) {
          renderer.setAnimationLoop(null);
          renderStill();
          return;
        }
        if (loop.visible && loop.pageVisible) {
          // Discard time spent paused so the orbit doesn't jump on resume.
          timer.reset();
          renderer.setAnimationLoop(tick);
        } else {
          renderer.setAnimationLoop(null);
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          loop.visible = entries[0]?.isIntersecting ?? true;
          updateLoop();
        },
        { threshold: 0 },
      );
      observer.observe(host);

      const onVisibility = () => {
        loop.pageVisible = !document.hidden;
        updateLoop();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const resizer = new ResizeObserver(applySize);
      resizer.observe(host);

      let detachPointer: (() => void) | null = null;
      if (finePointer) {
        const onPointerMove = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            return;
          }
          const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
          tilt.targetY = THREE.MathUtils.clamp(nx, -1, 1) * MAX_TILT_Y;
          tilt.targetX = THREE.MathUtils.clamp(ny, -1, 1) * MAX_TILT_X;
        };
        const onPointerLeave = () => {
          tilt.targetX = 0;
          tilt.targetY = 0;
        };
        host.addEventListener("pointermove", onPointerMove);
        host.addEventListener("pointerleave", onPointerLeave);
        detachPointer = () => {
          host.removeEventListener("pointermove", onPointerMove);
          host.removeEventListener("pointerleave", onPointerLeave);
        };
      }

      if (reduceMotion) {
        renderStill();
      } else {
        tick();
        updateLoop();
      }

      const backendFlag = renderer.backend as unknown as {
        isWebGPUBackend?: boolean;
      };
      onFirstFrameRef.current?.();
      onStatsRef.current?.({
        backend: backendFlag.isWebGPUBackend ? "webgpu" : "webgl2",
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
      });

      teardown = () => {
        observer.disconnect();
        resizer.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        detachPointer?.();
        renderer.setAnimationLoop(null);
        timer.dispose();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
            object.geometry.dispose();
            const material = object.material as
              | THREE.Material
              | THREE.Material[];
            if (Array.isArray(material)) {
              for (const entry of material) {
                entry.dispose();
              }
            } else {
              material.dispose();
            }
          }
          if (object instanceof THREE.InstancedMesh) {
            object.dispose();
          }
        });
        disposeArchiveMaterials(materials);
        renderer.dispose();
        if (process.env.NODE_ENV !== "production") {
          console.info("[archive] scene disposed");
        }
      };
    };

    start().catch(() => {
      if (!disposed) {
        onErrorRef.current?.();
        setFailed(true);
      }
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [backend, simulateFailure]);

  if (failed) {
    return <ArchivePoster label={`${label} (static fallback)`} />;
  }

  return (
    <div ref={hostRef} className="archive-stage">
      <canvas ref={canvasRef} className="archive-canvas" aria-hidden="true" />
    </div>
  );
}
