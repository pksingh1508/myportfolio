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
  const entered = useRef(false);
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
    let momentum = 0;
    let introTime = 0;
    const playEntrance = !entered.current && window.scrollY < window.innerHeight * .5;
    entered.current = true;
    let launchPending = playEntrance;
    const entrances = playEntrance ? cards.map((card, index) => {
      const surface = card.querySelector<HTMLElement>(".project-carousel-entrance")!;
      return surface.animate([
        { opacity: 0, transform: "translate3d(100px, 32px, 0) rotate(-12deg) scale(.72)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)" },
      ], { duration: 900, delay: 450 + index * 65, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" });
    }) : [];

    const tick = (now: number) => {
      const elapsed = Math.min((now - lastTime) / 1000, .05);
      lastTime = now;
      // Each scroll movement adds an impulse; momentum survives between events.
      // Convert the reference's angular response to our 56-second arc clock.
      const distance = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      momentum = Math.min(44, momentum + distance * .0356);
      introTime += elapsed;
      if (launchPending && introTime >= .6) {
        momentum = Math.max(momentum, 12);
        launchPending = false;
      }
      momentum *= Math.exp(-1.6 * elapsed);
      speed += (1 + momentum - speed) * (1 - Math.exp(-elapsed / .075));
      clock.current = (clock.current + elapsed * 1000 * speed) % 56000;
      animations.forEach(animation => { animation.currentTime = clock.current; });
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      momentum = 0;
      const running = intersecting && !document.hidden && !hovering && !focused;
      entrances.forEach(animation => {
        if (animation.playState !== "finished") {
          if (running) animation.play();
          else animation.pause();
        }
      });
      if (running) {
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
      entrances.forEach(animation => animation.cancel());
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
            <div className="project-carousel-entrance">
              <div className="project-carousel-surface">
                <Image {...image} alt="" loading="eager" sizes="(max-width: 767px) 65vw, (max-width: 1023px) 30vw, 360px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
