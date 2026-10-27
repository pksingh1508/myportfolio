"use client";

import { useEffect, useId, useSyncExternalStore, type MouseEvent } from "react";
import { THEME_COLORS, THEME_STORAGE_KEY, type ColorMode } from "../../lib/theme";

/** Reveal length for the circular wipe, in milliseconds. */
const REVEAL_MS = 720;
/** Cross-fade length where view transitions are unavailable. */
const FADE_MS = 420;

const readMode = (): ColorMode =>
  document.documentElement.dataset.mode === "dark" ? "dark" : "light";

/** Re-render whenever <html data-mode> changes, from any source. */
const subscribe = (notify: () => void) => {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributeFilter: ["data-mode"] });
  return () => observer.disconnect();
};

function applyMode(mode: ColorMode) {
  document.documentElement.dataset.mode = mode;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", THEME_COLORS[mode]));
}

function storedMode(): ColorMode | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

/**
 * Light/dark switch in the header. The pre-paint script in the root layout
 * has already applied the mode, so this island only reads it, flips it, and
 * remembers an explicit choice. Until a choice exists the page follows the
 * system preference live.
 *
 * Motion: with the View Transitions API the new theme spreads from the
 * button as a growing circle over a frozen snapshot of the old one; without
 * it, colors cross-fade briefly. Reduced motion swaps instantly. The icon
 * morph (sun to crescent) is CSS keyed off <html data-mode>, and the button
 * stays live above the wipe so the morph plays while the circle grows.
 */
export default function ThemeToggle() {
  const maskId = useId();
  // The server cannot know the mode; render "unknown" there and on the
  // hydration pass, then read the real value.
  const mode = useSyncExternalStore<ColorMode | null>(subscribe, readMode, () => null);

  useEffect(() => {
    applyMode(readMode());
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (storedMode()) return;
      applyMode(event.matches ? "dark" : "light");
    };
    system.addEventListener("change", onSystemChange);
    return () => system.removeEventListener("change", onSystemChange);
  }, []);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next: ColorMode = readMode() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* The switch still works for this visit. */
    }

    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      applyMode(next);
      return;
    }

    if (typeof document.startViewTransition !== "function") {
      root.dataset.themeFade = "";
      applyMode(next);
      window.setTimeout(() => delete root.dataset.themeFade, FADE_MS);
      return;
    }

    // Grow from the button's center (keyboard activation has no pointer
    // position) to the farthest viewport corner.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    root.dataset.themeSwitch = "";
    const transition = document.startViewTransition(() => applyMode(next));
    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: REVEAL_MS,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        /* Skipped transitions still applied the mode. */
      });
    void transition.finished.finally(() => {
      delete root.dataset.themeSwitch;
    });
  };

  const dark = mode === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Dark theme"
      aria-pressed={mode === null ? undefined : dark}
      onClick={toggle}
    >
      <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <mask id={maskId}>
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-icon-cutout" cx="17" cy="7" r="5.5" fill="#000" />
        </mask>
        <circle
          className="theme-icon-core"
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        <g className="theme-icon-rays" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 2.5v1.8M12 19.7v1.8M2.5 12h1.8M19.7 12h1.8M5.3 5.3l1.27 1.27M17.43 17.43l1.27 1.27M5.3 18.7l1.27-1.27M17.43 6.57l1.27-1.27" />
        </g>
      </svg>
    </button>
  );
}
