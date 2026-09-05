"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { MenuItem } from "./SiteMenu";

export default function DesktopNav({ items }: { readonly items: readonly MenuItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  useEffect(() => {
    setActive(null);
    if (pathname !== "/") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let found: string | null = null;
      for (const item of items) {
        const section = document.getElementById(item.href.split("#")[1]);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * .4 && rect.bottom > window.innerHeight * .4) found = item.href;
      }
      setActive(found);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [items, pathname]);
  return (
    <LayoutGroup id="desktop-navigation">
      <motion.nav layoutRoot aria-label="Primary" className="desktop-nav" onPointerLeave={() => setHovered(null)}>
        <ul className="desktop-nav-list">
          {items.map(item => <li key={item.href}>
            <Link href={item.href} aria-current={active === item.href ? "location" : undefined}
              onPointerEnter={event => { if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setHovered(item.href); }}>
              {hovered === item.href && <motion.span className="nav-hover" layoutId="nav-hover" initial={false} style={{ borderRadius: 30 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }} />}
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>)}
        </ul>
      </motion.nav>
    </LayoutGroup>
  );
}
