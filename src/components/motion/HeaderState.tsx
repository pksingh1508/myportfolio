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
      const chapter = document.getElementById("work");
      const rect = chapter?.getBoundingClientRect();
      el.dataset.theme = rect && rect.top < el.offsetHeight && rect.bottom > el.offsetHeight ? "dark" : "light";
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    const pointerInput = () => { document.documentElement.dataset.input = "pointer"; };
    const keyboardInput = () => { document.documentElement.dataset.input = "keyboard"; };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointerdown", pointerInput, { passive: true });
    window.addEventListener("keydown", keyboardInput);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointerdown", pointerInput);
      window.removeEventListener("keydown", keyboardInput);
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
