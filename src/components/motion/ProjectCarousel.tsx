"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

type CarouselImage = {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
};

/** CSS defines the arc; one shared clock changes its speed without phase jumps. */
export default function ProjectCarousel({ images }: { readonly images: readonly CarouselImage[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const clock = useRef(0);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const element = stage.current;
    if (!element || reducedMotion) return;
    const cards = Array.from(element.querySelectorAll<HTMLElement>(".project-carousel-card"));
    const animations = cards.flatMap(card => card.getAnimations());
    animations.forEach(animation => {
      animation.pause();
      animation.currentTime = clock.current;
    });
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let intersecting = false;
    let hovering = finePointer.matches && cards.some(card => card.matches(":hover"));
    let focused = document.activeElement === element;
    let frame = 0;
    let lastTime = 0;
    let lastScroll = window.scrollY;
    let speed = 1;

    const tick = (now: number) => {
      const elapsed = Math.min((now - lastTime) / 1000, .05);
      lastTime = now;
      // Native scroll remains untouched. Both directions add forward momentum.
      const velocity = Math.abs(window.scrollY - lastScroll) / Math.max(elapsed, .001);
      lastScroll = window.scrollY;
      const target = 1 + Math.min(velocity / 700, 4.5);
      const response = target > speed ? .16 : .65;
      speed += (target - speed) * (1 - Math.exp(-elapsed / response));
      clock.current = (clock.current + elapsed * 1000 * speed) % 56000;
      animations.forEach(animation => { animation.currentTime = clock.current; });
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (intersecting && !document.hidden && !hovering && !focused) {
        lastTime = performance.now();
        lastScroll = window.scrollY;
        speed = 1;
        frame = requestAnimationFrame(tick);
      }
    };
    const onEnter = () => {
      if (!finePointer.matches) return;
      hovering = true;
      sync();
    };
    const onLeave = () => { hovering = false; sync(); };
    const onFocus = () => { focused = true; sync(); };
    const onBlur = () => { focused = false; sync(); };
    const onPointerChange = () => { hovering = false; sync(); };
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    cards.forEach(card => {
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
    });
    element.addEventListener("focus", onFocus);
    element.addEventListener("blur", onBlur);
    finePointer.addEventListener("change", onPointerChange);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      cards.forEach(card => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      });
      element.removeEventListener("focus", onFocus);
      element.removeEventListener("blur", onBlur);
      finePointer.removeEventListener("change", onPointerChange);
      document.removeEventListener("visibilitychange", sync);
      animations.forEach(animation => animation.pause());
    };
  }, [images, reducedMotion]);

  return (
    <div ref={stage} className="project-carousel" tabIndex={0} role="img" aria-label="Rotating project previews. Focus here to pause the animation.">
      <div className="project-carousel-window" aria-hidden="true">
        {images.map((image, index) => (
          <div className="project-carousel-card" key={image.src} style={{
            "--card-delay": `${-(index + 0.5) * 56 / images.length}s`,
          } as CSSProperties}>
            <div className="project-carousel-surface">
              <Image {...image} alt="" loading="eager" sizes="(max-width: 767px) 65vw, (max-width: 1023px) 30vw, 360px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
