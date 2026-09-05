"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

type CarouselImage = {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
};

/** CSS owns the arc; React only manages playback and its lifecycle. */
export default function ProjectCarousel({ images }: { readonly images: readonly CarouselImage[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let intersecting = false;
    const sync = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={stage} className="project-carousel" data-running={visible && !paused && !reducedMotion}>
      <div className="project-carousel-window" aria-hidden="true">
        {images.map((image, index) => (
          <div className="project-carousel-card" key={image.src} style={{
            "--card-delay": `${-(index + 0.5) * 56 / images.length}s`,
          } as CSSProperties}>
            <Image {...image} alt="" loading="eager" sizes="(max-width: 767px) 65vw, (max-width: 1023px) 30vw, 360px" />
          </div>
        ))}
      </div>
      <div className="project-carousel-caption">
        <span>Work in perspective</span>
        {!reducedMotion && (
          <button type="button" className="carousel-toggle" aria-label={paused ? "Play project carousel" : "Pause project carousel"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              {paused ? <path d="m4 2 8 5-8 5Z" fill="currentColor" /> : <path d="M4 2v10M10 2v10" stroke="currentColor" strokeWidth="2" />}
            </svg>
            {paused ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}
