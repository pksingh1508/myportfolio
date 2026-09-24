"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, markersEnabled } from "./scroll";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Share of each project's scroll segment spent handing over to the next. */
const HANDOFF = 0.42;
/** Scroll distance per project, as a share of the viewport height. */
const SEGMENT = 0.6;
/** Matches --radius-lg so the rising clip keeps the card's corners. */
const ART_RADIUS = 24;

/**
 * Pinned project story. The server supplies the articles; only this scoped
 * controller owns their scroll transforms. Scroll is the clock (a scrubbed,
 * linear proxy smooths wheel steps without adding an ease), copy and art
 * hand over separately so two titles never overlap, and the incoming card
 * rises into view through a clip while the outgoing one recedes.
 */
export default function WorkStory({ children }: { readonly children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
        () => {
          const stage = root.querySelector<HTMLElement>(".work-stage");
          const parts = Array.from(root.querySelectorAll<HTMLElement>(".project-slide")).map(
            (slide) => ({
              slide,
              copy: slide.querySelector<HTMLElement>(".project-slide-copy"),
              art: slide.querySelector<HTMLElement>(".project-art-link"),
            }),
          );
          const links = Array.from(root.querySelectorAll<HTMLElement>(".project-index-link"));
          const rails = Array.from(
            root.querySelectorAll<HTMLElement>(".project-index-track > span"),
          );
          if (!stage || parts.length < 2) return;

          let alive = true;
          root.dataset.enhanced = "true";
          let interacted = false;
          const markInteraction = () => {
            interacted = true;
          };
          window.addEventListener("wheel", markInteraction, { passive: true });
          window.addEventListener("touchstart", markInteraction, { passive: true });
          window.addEventListener("keydown", markInteraction);

          const setters = parts.map(({ copy, art }) => ({
            copyOpacity: copy ? gsap.quickSetter(copy, "opacity") : null,
            copyY: copy ? gsap.quickSetter(copy, "y", "px") : null,
            artOpacity: art ? gsap.quickSetter(art, "opacity") : null,
            artScale: art ? gsap.quickSetter(art, "scale") : null,
          }));
          const railSetters = rails.map((rail) => gsap.quickSetter(rail, "scaleX"));
          let active = -1;

          const render = (progress: number) => {
            const count = parts.length;
            const position = clamp01(progress) * count;
            const segment = Math.min(Math.floor(position), count - 1);
            const blend =
              segment === count - 1
                ? 0
                : clamp01((position - segment - (1 - HANDOFF)) / HANDOFF);
            const current = Math.min(count - 1, segment + (blend >= 0.5 ? 1 : 0));

            parts.forEach(({ slide, art }, index) => {
              const set = setters[index];
              const incoming = index === segment + 1 && blend > 0;
              let copyOpacity = 0;
              let copyY = 0;
              let artOpacity = 0;
              let artScale = 1;
              let reveal = 0;
              if (index === segment) {
                // Outgoing: copy leaves during the first half of the handoff.
                const leave = clamp01(blend / 0.5);
                copyOpacity = 1 - leave;
                copyY = -32 * leave;
                artOpacity = 1 - 0.85 * blend;
                artScale = 1 - 0.08 * blend;
                reveal = 1;
              } else if (incoming) {
                // Incoming: art rises through the whole handoff, copy arrives
                // only after the outgoing copy has gone.
                const arrive = clamp01((blend - 0.5) / 0.5);
                copyOpacity = arrive;
                copyY = 32 * (1 - arrive);
                artOpacity = 1;
                artScale = 1.04 - 0.04 * blend;
                reveal = blend;
              }
              set.copyOpacity?.(copyOpacity);
              set.copyY?.(copyY);
              set.artOpacity?.(artOpacity);
              set.artScale?.(artScale);
              if (art) {
                art.style.clipPath =
                  reveal >= 1
                    ? ""
                    : `inset(${((1 - reveal) * 100).toFixed(3)}% 0% 0% 0% round ${ART_RADIUS}px)`;
              }
              slide.style.visibility = index === segment || incoming ? "visible" : "hidden";
              slide.style.pointerEvents = index === current ? "auto" : "none";
              railSetters[index]?.(clamp01(position - index));
            });

            if (active !== current) {
              active = current;
              parts.forEach(({ slide }, index) => {
                slide.inert = index !== current;
              });
              links.forEach((link, index) => {
                link.dataset.active = String(index === current);
              });
            }
          };

          const clock = { progress: 0 };
          const tween = gsap.to(clock, {
            progress: 1,
            ease: "none",
            onUpdate: () => render(clock.progress),
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * SEGMENT * parts.length)}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              markers: markersEnabled(),
            },
          });
          render(tween.scrollTrigger?.progress ?? 0);

          let settled = false;
          const refresh = () => {
            if (!alive) return;
            ScrollTrigger.refresh();
            if (!settled && !interacted) {
              const id = window.location.hash.slice(1);
              if (id) {
                try {
                  document.getElementById(decodeURIComponent(id))?.scrollIntoView({ behavior: "instant" });
                } catch {
                  /* Malformed fragments do not prevent enhancement. */
                }
              }
            }
            settled = true;
          };
          const frame = requestAnimationFrame(refresh);
          void document.fonts.ready.then(() => {
            if (alive) ScrollTrigger.refresh();
          });

          return () => {
            alive = false;
            cancelAnimationFrame(frame);
            window.removeEventListener("wheel", markInteraction);
            window.removeEventListener("touchstart", markInteraction);
            window.removeEventListener("keydown", markInteraction);
            tween.scrollTrigger?.kill();
            tween.kill();
            delete root.dataset.enhanced;
            parts.forEach(({ slide, art }) => {
              slide.inert = false;
              slide.style.removeProperty("visibility");
              slide.style.removeProperty("pointer-events");
              art?.style.removeProperty("clip-path");
            });
            links.forEach((link) => delete link.dataset.active);
            const animated = parts.flatMap(({ copy, art }) =>
              [copy, art].filter((node): node is HTMLElement => node !== null),
            );
            gsap.set(animated, { clearProps: "opacity,transform" });
            gsap.set(rails, { clearProps: "transform" });
          };
        },
      );
      return () => media.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="work-story">
      <div className="work-stage">{children}</div>
    </div>
  );
}
