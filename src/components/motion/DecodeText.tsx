"use client";

import { useEffect, useRef } from "react";

/** Flap faces: lowercase and figures, so sentence-case labels settle calmly. */
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789/+-=";
/** Milliseconds between neighbouring characters locking in, left to right. */
const STEP = 32;
/** Milliseconds a character waits before its first lock-in window opens. */
const LEAD = 140;
/** Milliseconds between flips of the still-unresolved characters. */
const FLIP = 48;

/**
 * Split-flap decode for short labels, after a departure-board reference.
 * The server renders the real text, and it stays in the accessibility tree
 * the whole time: while decoding, an aria-hidden overlay shows the flipping
 * glyphs above the temporarily transparent label, so layout never shifts
 * and nothing garbled is ever announced. Plays once, when the label scrolls
 * into view (the same moment its `Reveal` fades it in). Reduced motion,
 * no JavaScript, and failed hydration all keep the plain label.
 */
export default function DecodeText({ text }: { readonly text: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const overlay = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = root.current;
    const layer = overlay.current;
    if (!host || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const chars = Array.from(text);
    // Each character locks in at its own moment: a left-to-right sweep with
    // a little jitter, like flaps that do not all land on the same beat.
    const lockAt = chars.map((_, index) => LEAD + index * STEP + Math.random() * 110);
    const end = Math.max(...lockAt);
    let frame = 0;
    let start = 0;
    let lastFlip = -Infinity;

    const finish = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      delete host.dataset.decoding;
      layer.textContent = "";
    };

    const paint = (elapsed: number) => {
      layer.textContent = chars
        .map((char, index) =>
          char.trim() === "" || elapsed >= lockAt[index]
            ? char
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        )
        .join("");
    };

    const render = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      if (elapsed >= end) {
        finish();
        return;
      }
      if (now - lastFlip >= FLIP) {
        lastFlip = now;
        paint(elapsed);
      }
      frame = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        // Fill the overlay before hiding the label: never an empty frame.
        paint(0);
        host.dataset.decoding = "true";
        frame = requestAnimationFrame(render);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    observer.observe(host);
    return () => {
      observer.disconnect();
      finish();
    };
  }, [text]);

  return (
    <span ref={root} className="decode">
      <span className="decode-text">{text}</span>
      <span ref={overlay} className="decode-glyphs" aria-hidden="true" />
    </span>
  );
}
