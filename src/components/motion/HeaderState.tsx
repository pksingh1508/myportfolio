"use client";

import { useEffect, useRef, type ReactNode } from "react";

type HeaderStateProps = {
  readonly children: ReactNode;
};

/**
 * Owns the <header> element so scroll state can toggle the backdrop without
 * pulling static brand/nav markup into the client bundle: children are
 * passed from the server parent and stay server-rendered.
 */
export default function HeaderState({ children }: HeaderStateProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    document.documentElement.classList.add("js");
    let frame = 0;
    const update = () => {
      frame = 0;
      el.dataset.scrolled = String(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <header ref={ref} data-scrolled="false" className="site-header">
      {children}
    </header>
  );
}
