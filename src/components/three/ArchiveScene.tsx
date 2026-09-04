"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import { resolveArchiveQuality } from "../../lib/three-quality";
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
  readonly label?: string;
};

/**
 * Isolated Orbital Archive prototype (Step 8). Procedural scene graph from
 * plan.md, WebGPURenderer with setAnimationLoop, DPR tiers, off-screen and
 * hidden-tab pause, reduced-motion single frame, and full teardown.
 * Ambient motion only — interaction and named poses arrive in Step 9.
 */
export default function ArchiveScene({
  backend,
  simulateFailure = false,
  onStats,
  label = "Orbital archive prototype",
}: ArchiveSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);
  const onStatsRef = useRef(onStats);

  useEffect(() => {
    onStatsRef.current = onStats;
  }, [onStats]);

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
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 4 / 3, 0.1, 50);
      camera.position.set(0, 0.9, 7.4);
      camera.lookAt(0, 0.1, 0);

      const root = new THREE.Group();
      root.name = "ArchiveRoot";
      scene.add(root);

      // Shared within this mount; every geometry/material is disposed below.
      const monolith = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 2.3, 0.55),
        new THREE.MeshStandardMaterial({
          color: 0x15171b,
          roughness: 0.55,
          metalness: 0.35,
        }),
      );
      monolith.position.y = 0.15;
      root.add(monolith);

      const ORBIT_RX = 2.6;
      const ORBIT_RZ = 1.72;
      const ORBIT_Y = 0.35;
      const frameGeo = new THREE.BoxGeometry(1.7, 1.05, 0.05);
      const frameFace = new THREE.MeshStandardMaterial({
        color: 0xf7f8fc,
        roughness: 0.5,
        metalness: 0.05,
      });
      const frameEdge = new THREE.LineBasicMaterial({
        color: 0x635bff,
        transparent: true,
        opacity: 0.9,
      });
      const frameEdgeGeo = new THREE.EdgesGeometry(frameGeo);
      const frames: Array<{ group: THREE.Group; phase: number }> = [];
      for (let index = 0; index < 3; index += 1) {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(frameGeo, frameFace));
        group.add(new THREE.LineSegments(frameEdgeGeo, frameEdge));
        const phase = (index / 3) * Math.PI * 2;
        group.position.set(
          Math.cos(phase) * ORBIT_RX,
          ORBIT_Y,
          Math.sin(phase) * ORBIT_RZ,
        );
        root.add(group);
        frames.push({ group, phase });
      }

      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, ORBIT_RX, ORBIT_RZ).getPoints(128),
      );
      const orbit = new THREE.LineLoop(
        orbitGeo,
        new THREE.LineBasicMaterial({
          color: 0x9aa0ab,
          transparent: true,
          opacity: 0.55,
        }),
      );
      orbit.rotation.x = -Math.PI / 2;
      orbit.position.y = -0.55;
      root.add(orbit);

      const dust = new THREE.InstancedMesh(
        new THREE.SphereGeometry(0.012, 6, 6),
        new THREE.MeshBasicMaterial({
          color: 0x6f737b,
          transparent: true,
          opacity: 0.5,
        }),
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

      const clock = new THREE.Clock();
      const loop = { visible: true, pageVisible: !document.hidden };

      const renderFrame = () => {
        renderer.render(scene, camera);
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
          renderFrame();
        }
      };
      applySize();

      const ORBIT_SPEED = 0.1;
      const tick = () => {
        // Advance the clock and clamp the delta so tab-switch gaps never
        // teleport the orbit; poses below read elapsed time, not delta.
        clock.getDelta();
        const t = clock.elapsedTime;
        for (const frame of frames) {
          const angle = frame.phase + t * ORBIT_SPEED;
          frame.group.position.set(
            Math.cos(angle) * ORBIT_RX,
            ORBIT_Y + Math.sin(t * 0.5 + frame.phase) * 0.22,
            Math.sin(angle) * ORBIT_RZ,
          );
          frame.group.lookAt(camera.position);
        }
        monolith.rotation.y = t * 0.05;
        root.rotation.y = Math.sin(t * 0.08) * 0.06;
        dust.rotation.y = -t * 0.02;
        renderFrame();
      };

      const updateLoop = () => {
        if (disposed) {
          return;
        }
        if (reduceMotion) {
          renderer.setAnimationLoop(null);
          renderFrame();
          return;
        }
        if (loop.visible && loop.pageVisible) {
          clock.getDelta();
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

      if (reduceMotion) {
        renderFrame();
      } else {
        tick();
        updateLoop();
      }

      const backendFlag = renderer.backend as unknown as {
        isWebGPUBackend?: boolean;
      };
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
        renderer.setAnimationLoop(null);
        scene.traverse((object) => {
          if (
            object instanceof THREE.Mesh ||
            object instanceof THREE.Line
          ) {
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
        renderer.dispose();
        if (process.env.NODE_ENV !== "production") {
          console.info("[archive] scene disposed");
        }
      };
    };

    start().catch(() => {
      if (!disposed) {
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
