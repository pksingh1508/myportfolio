"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type Ref } from "react";

type RevealProps = {
  readonly children: ReactNode;
  readonly className?: string;
  /** Reveal direct children one after another instead of the block as one. */
  readonly stagger?: boolean;
  /** Extra delay in milliseconds before the first element moves. */
  readonly delay?: number;
  /** Render a list so staggered items keep their list semantics. */
  readonly as?: "div" | "ul" | "ol";
};

/**
 * One-shot entrance for a block that arrives by scrolling. The server HTML
 * is complete and readable; CSS owns the pose and the motion (see "One-shot
 * scroll reveals" in globals.css) and this island only flips
 * `data-revealed` once the block enters the viewport. Reduced motion, no
 * JavaScript, and failed hydration all leave the content visible.
 */
export default function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (stagger) {
      Array.from(element.children).forEach((child, index) => {
        (child as HTMLElement).style.setProperty("--i", String(index));
      });
    }
    if (typeof IntersectionObserver === "undefined") {
      element.dataset.revealed = "true";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        element.dataset.revealed = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [stagger]);

  const style = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : undefined;

  return (
    <Tag
      // One ref serves all three tags; each is an HTMLElement.
      ref={ref as Ref<HTMLDivElement & HTMLUListElement & HTMLOListElement>}
      // Unstyled lists lose their semantics in Safari; keep them announced.
      role={Tag === "div" ? undefined : "list"}
      className={className}
      data-reveal={stagger ? "stagger" : "self"}
      style={style}
    >
      {children}
    </Tag>
  );
}
