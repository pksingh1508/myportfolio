"use client";

import { useRef } from "react";
import { gsap, markersEnabled, ScrollTrigger, useGSAP } from "./scroll";

/** Viewport line the reading position is measured against. */
const READ_LINE = "center 55%";

/**
 * Reading progress for the experience timeline, after a sticky changelog
 * reference: an ink line draws down the rail from the first role's marker
 * to the last as they pass the reading line, and each marker it reaches
 * takes an ink ring. Scroll is the clock (linear, lightly scrubbed). The
 * gray rail and markers are server-rendered; reduced motion and no-JS keep
 * them exactly as they are. Renders inside the timeline's positioned track.
 */
export default function TimelineProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const line = ref.current;
    const track = line?.parentElement;
    if (!line || !track) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const items = Array.from(track.querySelectorAll<HTMLElement>(".timeline-item"));
      const markers = items.map((item) => item.querySelector<HTMLElement>(".timeline-marker"));
      const first = markers[0];
      const last = markers[markers.length - 1];
      if (!first || !last || first === last) return;

      // Span the line between the first and last marker centres.
      const place = () => {
        const origin = track.getBoundingClientRect().top;
        const from = first.getBoundingClientRect();
        const to = last.getBoundingClientRect();
        const top = from.top + from.height / 2 - origin;
        const bottom = to.top + to.height / 2 - origin;
        line.style.top = `${top}px`;
        line.style.height = `${Math.max(0, bottom - top)}px`;
      };
      place();

      const tween = gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: first,
            start: READ_LINE,
            endTrigger: last,
            end: READ_LINE,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onRefresh: place,
            markers: markersEnabled(),
          },
        },
      );
      const reached = items.map((item, index) =>
        ScrollTrigger.create({
          trigger: markers[index] ?? item,
          start: READ_LINE,
          onEnter: () => item.setAttribute("data-reached", ""),
          onLeaveBack: () => item.removeAttribute("data-reached"),
        }),
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        reached.forEach((trigger) => trigger.kill());
        items.forEach((item) => item.removeAttribute("data-reached"));
        gsap.set(line, { clearProps: "transform" });
        line.style.removeProperty("top");
        line.style.removeProperty("height");
      };
    });
    return () => media.revert();
  });

  return <span ref={ref} className="timeline-progress" aria-hidden="true" />;
}
