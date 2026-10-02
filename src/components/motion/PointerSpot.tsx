"use client";

import { useEffect, useRef } from "react";

/**
 * Pointer-follow light. Renders one decorative layer and, while a mouse
 * moves over the layer's parent, exposes the pointer position to CSS as
 * `--mx` / `--my` (px in the parent's own, untransformed box) and sets
 * `data-active`. CSS draws the light itself: the lit dot grid on the dark
 * contact panels and the glare on project cards. Writes are batched to one
 * per frame. Touch, pen, keyboard, and no-JS keep the resting look; the
 * light only ever responds to the user's own movement, never on its own.
 */
export default function PointerSpot({ className }: { readonly className: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const spot = ref.current;
    const host = spot?.parentElement;
    if (!spot || !host) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      frame = 0;
      spot.style.setProperty("--mx", `${x.toFixed(1)}px`);
      spot.style.setProperty("--my", `${y.toFixed(1)}px`);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      // The host may be scaled by a scroll scene; map back to its own box.
      const rect = host.getBoundingClientRect();
      const scaleX = rect.width ? host.offsetWidth / rect.width : 1;
      const scaleY = rect.height ? host.offsetHeight / rect.height : 1;
      x = (event.clientX - rect.left) * scaleX;
      y = (event.clientY - rect.top) * scaleY;
      if (!frame) frame = requestAnimationFrame(write);
      spot.dataset.active = "";
    };
    const onLeave = () => {
      delete spot.dataset.active;
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      delete spot.dataset.active;
    };
  }, []);

  return <span ref={ref} className={className} aria-hidden="true" />;
}
