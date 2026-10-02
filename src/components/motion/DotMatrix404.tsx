"use client";

import { useEffect, useRef } from "react";

type Dot = {
  readonly x: number;
  readonly y: number;
  readonly inside: boolean;
  /** Current influence 0–1, eased toward its target every frame. */
  level: number;
};

const INK = "#0a0a0a";
const IDLE = "#dedede";
/** Influence radius around the pointer, in CSS pixels. */
const REACH = 150;
/** Width of the ambient diagonal beam, in CSS pixels. */
const BEAM = 120;
/** Beam travel speed, in CSS pixels per second. */
const BEAM_SPEED = 170;

const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

/**
 * Decorative dot-matrix "404" for the not-found page, after a cursor-reactive
 * dot-matrix reference. The server renders a pure-CSS version (the digits
 * filled with a dot pattern), so the figure exists without JavaScript; this
 * island swaps in a canvas whose dots swell and darken around the pointer
 * while a slow diagonal beam passes over them.
 *
 * Reduced motion draws the matrix once, still. The loop pauses off-screen
 * and in background tabs, the device pixel ratio is capped at 2, and every
 * listener and observer is removed on unmount.
 */
export default function DotMatrix404() {
  const box = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = box.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let gap = 12;
    let pointer: { x: number; y: number } | null = null;
    let beam = -BEAM;
    let frame = 0;
    let last = 0;
    let visible = false;
    let alive = true;

    const layout = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width < 1 || height < 1) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      gap = Math.max(9, Math.min(15, Math.round(width / 52)));

      // Rasterize the digits once, then sample them on the dot grid.
      const mask = document.createElement("canvas");
      mask.width = Math.ceil(width);
      mask.height = Math.ceil(height);
      const ink = mask.getContext("2d", { willReadFrequently: true });
      if (!ink) return;
      const family = getComputedStyle(host).fontFamily;
      const size = Math.min(width / 2.15, height / 0.86);
      ink.font = `700 ${size}px ${family}`;
      ink.textAlign = "center";
      ink.textBaseline = "alphabetic";
      const metrics = ink.measureText("404");
      const glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baseline = (height - glyphHeight) / 2 + metrics.actualBoundingBoxAscent;
      ink.fillText("404", width / 2, baseline);
      const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;

      const columns = Math.floor(width / gap);
      const rows = Math.floor(height / gap);
      const offsetX = (width - (columns - 1) * gap) / 2;
      const offsetY = (height - (rows - 1) * gap) / 2;
      const next: Dot[] = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = offsetX + column * gap;
          const y = offsetY + row * gap;
          const index = (Math.round(y) * mask.width + Math.round(x)) * 4 + 3;
          next.push({ x, y, inside: (pixels[index] ?? 0) > 128, level: 0 });
        }
      }
      dots = next;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const base = gap * 0.085;
      const full = gap * 0.34;
      // Resting dots share one path; lit dots draw on their own.
      context.fillStyle = IDLE;
      context.beginPath();
      for (const dot of dots) {
        if (dot.inside || dot.level > 0.02) continue;
        context.moveTo(dot.x + base, dot.y);
        context.arc(dot.x, dot.y, base, 0, Math.PI * 2);
      }
      context.fill();
      for (const dot of dots) {
        if (dot.inside || dot.level <= 0.02) continue;
        const tone = mix(222, 120, dot.level);
        context.fillStyle = `rgb(${tone} ${tone} ${tone})`;
        context.beginPath();
        context.arc(dot.x, dot.y, base * (1 + 2.4 * dot.level), 0, Math.PI * 2);
        context.fill();
      }
      context.fillStyle = INK;
      context.beginPath();
      for (const dot of dots) {
        if (!dot.inside) continue;
        const radius = full * (0.82 + 0.32 * dot.level);
        context.moveTo(dot.x + radius, dot.y);
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      }
      context.fill();
    };

    const tick = (now: number) => {
      frame = 0;
      const elapsed = last ? Math.min((now - last) / 1000, 0.064) : 0;
      last = now;
      beam += BEAM_SPEED * elapsed;
      const span = width + height + BEAM * 2;
      if (beam > span) beam = -BEAM;
      const ease = 1 - Math.exp(-elapsed * 10);
      for (const dot of dots) {
        let target = 0;
        if (pointer) {
          const distance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
          if (distance < REACH) target = smooth(1 - distance / REACH);
        }
        // The beam sweeps along x + y, so it crosses the matrix diagonally.
        const across = Math.abs(dot.x + dot.y - beam) / Math.SQRT2;
        if (across < BEAM) target = Math.max(target, 0.42 * smooth(1 - across / BEAM));
        dot.level += (target - dot.level) * ease;
      }
      draw();
      if (alive && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduced || frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onLeave = () => {
      pointer = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(() => {
      layout();
      draw();
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    void document.fonts.ready.then(() => {
      if (!alive) return;
      layout();
      draw();
      host.dataset.live = "";
      resizeObserver.observe(host);
      viewObserver.observe(host);
    });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      delete host.dataset.live;
    };
  }, []);

  return (
    <div ref={box} className="dot-404" aria-hidden="true">
      <p className="dot-404-fallback">404</p>
      <canvas ref={canvasRef} className="dot-404-canvas" />
    </div>
  );
}
