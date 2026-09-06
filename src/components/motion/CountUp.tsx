"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

type CountUpProps = {
  readonly value: string;
  /** Stagger offset in ms so a row of numbers ripples instead of snapping together. */
  readonly delay?: number;
  readonly className?: string;
};

type Slot =
  | { readonly kind: "reel"; readonly digit: string }
  | { readonly kind: "static"; readonly char: string };

type ReelInfo = {
  readonly slotIndex: number;
  readonly cells: readonly number[];
  readonly finalTransform: string;
  readonly delayMs: number;
};

/**
 * Keep in sync with the slot geometry in refinements.css: every slot is
 * 1.2em tall, so reel position k sits at -k * REEL_STEP_EM.
 */
const REEL_STEP_EM = 1.2;
/** Cascade delay between digit columns, left to right. */
const REEL_STAGGER_MS = 90;
/** Extra revolutions: the two rightmost reels spin most, like a real odometer. */
const TURNS_EDGE = 2;
const TURNS_REST = 1;

const isDigit = (char: string) => char >= "0" && char <= "9";

/** Split the exact final string into rolling digit reels and static chars. */
function buildSlots(value: string): Slot[] {
  return Array.from(value).map(
    (char): Slot =>
      isDigit(char)
        ? { kind: "reel", digit: char }
        : { kind: "static", char },
  );
}

/**
 * Describe every reel: a digit strip starting at 0 that spins through full
 * revolutions before landing on its final digit, cascading left to right.
 */
function buildReels(slots: Slot[]): ReelInfo[] {
  const reelSlots: number[] = [];
  slots.forEach((slot, index) => {
    if (slot.kind === "reel") reelSlots.push(index);
  });
  return reelSlots.map((slotIndex, order) => {
    const slot = slots[slotIndex];
    const digit = slot.kind === "reel" ? Number(slot.digit) : 0;
    const fromRight = reelSlots.length - 1 - order;
    const turns = fromRight < 2 ? TURNS_EDGE : TURNS_REST;
    const endIndex = turns * 10 + digit;
    return {
      slotIndex,
      cells: Array.from({ length: endIndex + 1 }, (_, k) => k % 10),
      finalTransform: `translateY(${-(endIndex * REEL_STEP_EM)}em)`,
      delayMs: order * REEL_STAGGER_MS,
    };
  });
}

/**
 * Leaf odometer island for the Selected outcomes strip, animated like
 * Mobbin's pricing toggle: every digit is a vertical reel parked at zero
 * that physically travels bottom-to-top through full revolutions before
 * landing on its final digit, cascading left to right. No per-frame JS, no
 * text swapping — one CSS transform transition per reel.
 *
 * Server (and no-JS / reduced-motion) renders the exact value as plain text;
 * the client swaps in the parked reels once, then flips them to their final
 * positions when the number enters the viewport. Runs once.
 */
export default function CountUp({
  value,
  delay = 0,
  className = "metric-value",
}: CountUpProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const reelEls = useRef(new Map<number, HTMLSpanElement>());
  const reduceMotion = useReducedMotionPreference();
  // False on first render so hydration matches the SSR plain text exactly.
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    setEnhanced(!reduceMotion && /[0-9]/.test(value));
  }, [reduceMotion, value]);

  useEffect(() => {
    if (!enhanced) return;
    const slots = buildSlots(value);
    const reels = buildReels(slots);
    const finals = new Map(
      reels.map((reel) => [reel.slotIndex, reel] as const),
    );
    const root = rootRef.current;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      // Force layout so the parked-zero state paints before flipping to the
      // finals; otherwise reels already in view would jump instead of roll.
      // The per-metric stagger folds into each reel's transition delay, so
      // there are no timers to clean up — one style flip per reel.
      void root?.offsetWidth;
      finals.forEach((reel, slotIndex) => {
        const el = reelEls.current.get(slotIndex);
        if (!el) return;
        el.style.setProperty(
          "--roll-delay",
          `${delay + reel.delayMs}ms`,
        );
        el.style.setProperty("transform", reel.finalTransform);
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    if (root) observer.observe(root);
    return () => observer.disconnect();
  }, [enhanced, value, delay]);

  if (!enhanced) {
    return (
      <span ref={rootRef} className={className}>
        {value}
      </span>
    );
  }

  const slots = buildSlots(value);
  const reels = buildReels(slots);
  const reelBySlot = new Map(reels.map((reel) => [reel.slotIndex, reel]));

  const setReelRef =
    (index: number) => (el: HTMLSpanElement | null) => {
      if (el) reelEls.current.set(index, el);
      else reelEls.current.delete(index);
    };

  return (
    <span ref={rootRef} className={`${className} count-roll`}>
      <span className="visually-hidden">{value}</span>
      <span aria-hidden="true" className="count-cells">
        {slots.map((slot, index) => {
          if (slot.kind === "static") {
            return (
              <span key={index} className="count-slot">
                <span className="count-cell">{slot.char}</span>
              </span>
            );
          }
          const reel = reelBySlot.get(index);
          if (!reel) return null;
          return (
            <span key={index} className="count-slot">
              <span
                ref={setReelRef(index)}
                className="count-reel"
                style={{ transform: "translateY(0em)" } as CSSProperties}
              >
                {reel.cells.map((digit, cellIndex) => (
                  <span key={cellIndex} className="count-cell">
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
