"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export type MenuItem = {
  readonly label: string;
  readonly href: string;
};

type SiteMenuProps = {
  readonly items: readonly MenuItem[];
};

/**
 * Mobile disclosure menu (< 768px). CSS owns the open/close transition so
 * rapid toggles retarget instead of restarting; the panel stays mounted and
 * uses `inert` when closed to keep tab order logical.
 *
 * No-JS fallback: the trigger stays hidden and the panel renders as a static
 * list (see `html:not(.js)` rules), so every link works without JavaScript.
 */
export default function SiteMenu({ items }: SiteMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("js");
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        if (menuRef.current.contains(document.activeElement)) triggerRef.current?.focus({ preventScroll: true });
      }
    };
    const onFocusOut = (event: FocusEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const media = window.matchMedia("(min-width: 768px)");
    const onMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusOut);
    media.addEventListener("change", onMediaChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusOut);
      media.removeEventListener("change", onMediaChange);
    };
  }, [open]);

  const handleNavigate = (href: string) => {
    setOpen(false);
    if (!href.startsWith("/#")) {
      return;
    }
    // Same-page anchor: hand screen-reader focus to the section heading
    // after the native scroll, without moving the visual viewport.
    requestAnimationFrame(() => {
      const heading = document
        .querySelector(href.slice(1))
        ?.querySelector("h1, h2");
      if (heading instanceof HTMLElement) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    });
  };

  return (
    <div ref={menuRef} className="site-menu">
      <button
        ref={triggerRef}
        type="button"
        className="menu-trigger"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className="menu-icon">
          <span />
          <span />
        </span>
        {open ? "Close" : "Menu"}
      </button>
      <div
        id="mobile-menu"
        className="menu-panel"
        data-open={String(open)}
        inert={!open && mounted}
      >
        <nav aria-label="Mobile">
          <ul>
            {items.map((item, index) => (
              <li
                key={item.href}
                className="menu-item"
                style={{ "--menu-index": index } as CSSProperties}
              >
                <Link
                  href={item.href}
                  className="menu-link"
                  onClick={() => handleNavigate(item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
