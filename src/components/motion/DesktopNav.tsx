"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, type Transition } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";
import type { MenuItem } from "./SiteMenu";

const ACTIVE_SPRING: Transition = {
  layout: { type: "spring", stiffness: 380, damping: 34, mass: 0.9 },
  opacity: { duration: 0.2 },
};
const HOVER_SPRING: Transition = { type: "spring", stiffness: 520, damping: 40 };
const INSTANT: Transition = { duration: 0 };

/**
 * Glass segmented control. The ink thumb marks the section in view and
 * slides between items (Motion owns this layout spring); a lighter thumb
 * follows the pointer. The active item also carries aria-current, so state
 * is never encoded by color alone.
 */
export default function DesktopNav({ items }: { readonly items: readonly MenuItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  // The thumb stays mounted on the last active item and fades out between
  // sections, so it glides from there instead of popping in.
  const [thumb, setThumb] = useState<string | null>(null);
  const reduced = useReducedMotionPreference();
  const pathname = usePathname();

  useEffect(() => {
    setActive(null);
    setThumb(null);
    if (pathname !== "/") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let found: string | null = null;
      const line = window.innerHeight * 0.4;
      for (const item of items) {
        const section = document.getElementById(item.href.split("#")[1]);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top < line && rect.bottom > line) found = item.href;
      }
      setActive(found);
      if (found) setThumb(found);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, pathname]);

  return (
    <LayoutGroup id="desktop-navigation">
      <motion.nav
        layoutRoot
        aria-label="Primary"
        className="desktop-nav"
        onPointerLeave={() => setHovered(null)}
      >
        <ul className="desktop-nav-list">
          {items.map((item) => {
            const isActive = active === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  onPointerEnter={(event) => {
                    if (
                      event.pointerType === "mouse" &&
                      window.matchMedia("(hover: hover) and (pointer: fine)").matches
                    ) {
                      setHovered(item.href);
                    }
                  }}
                >
                  {thumb === item.href ? (
                    <motion.span
                      className="nav-active"
                      layoutId="nav-active"
                      initial={false}
                      animate={{ opacity: active ? 1 : 0 }}
                      transition={reduced ? INSTANT : ACTIVE_SPRING}
                      style={{ borderRadius: 999 }}
                    />
                  ) : null}
                  {hovered === item.href && !isActive ? (
                    <motion.span
                      className="nav-hover"
                      layoutId="nav-hover"
                      initial={false}
                      transition={reduced ? INSTANT : HOVER_SPRING}
                      style={{ borderRadius: 999 }}
                    />
                  ) : null}
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </LayoutGroup>
  );
}
