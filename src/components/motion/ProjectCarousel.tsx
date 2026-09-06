"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

type CarouselImage = {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly href: string;
  readonly title: string;
};

const SLOT_COUNT = 10;
const TURN = Math.PI * 2;
const IDLE_SPEED = 0.1; // radians/second, independent of frame rate
const SCROLL_IMPULSE = 0.004;
const MAX_MOMENTUM = 5;
const MOMENTUM_DECAY = 1.6;
const ENTRANCE_DELAY = 0.8;

const easeOut = (progress: number) => 1 - (1 - Math.max(0, Math.min(1, progress))) ** 3;
const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

/** Shared by the server-rendered still and the animation; CSS owns responsive sizing. */
function cardPose(angle: number, radiusScale = 1, scale = 1) {
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  return {
    transform: `translate(-50%, -50%) translate3d(calc(var(--arc-radius) * ${(x * radiusScale).toFixed(5)}), calc(var(--arc-radius) * ${(y * radiusScale).toFixed(5)}), 0) perspective(1100px) rotateX(${(4 * y).toFixed(3)}deg) rotateY(${(10 * x).toFixed(3)}deg) rotateZ(${(wrapAngle(angle - Math.PI) * 180 / Math.PI * 0.14).toFixed(3)}deg) scale(${scale})`,
    zIndex: Math.round(40 * (1 - x)),
  };
}

/** A circular fan entering from the right, driven by native-scroll momentum. */
export default function ProjectCarousel({ images }: { readonly images: readonly CarouselImage[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const phase = useRef(Math.PI);
  const entered = useRef(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const element = stage.current;
    if (!element || reducedMotion || images.length === 0) return;
    const cards = Array.from(element.querySelectorAll<HTMLElement>(".project-carousel-card"));
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const entrance = !entered.current && window.scrollY < window.innerHeight * 0.5;
    entered.current = true;
    const entranceOffsets: (number | undefined)[] = [];
    let introTime = entrance ? 0 : Infinity;
    let launched = !entrance;
    let intersecting = false;
    let hovering = finePointer.matches && cards.some(card => card.matches(":hover"));
    let focused = element.contains(document.activeElement);
    let frame = 0;
    let lastTime = 0;
    let lastScroll = window.scrollY;
    let momentum = 0;

    const draw = () => {
      const age = introTime - ENTRANCE_DELAY;
      const radiusScale = 0.45 + 0.55 * easeOut(age / 1.9);
      cards.forEach((card, index) => {
        const angle = phase.current + index * TURN / SLOT_COUNT;
        const progress = easeOut((age - index * 0.08) / 0.85);
        // Every card starts at the same right-hand origin and opens along its arc.
        if (progress > 0 && entranceOffsets[index] === undefined) {
          entranceOffsets[index] = wrapAngle(-0.25 - angle);
        }
        const entryAngle = angle + (entranceOffsets[index] ?? 0) * (1 - progress);
        const pose = cardPose(entryAngle, radiusScale, 0.7 + 0.3 * progress);
        card.style.transform = pose.transform;
        card.style.zIndex = String(pose.zIndex);
        card.style.opacity = String(progress);
      });
    };

    const tick = (now: number) => {
      const elapsed = Math.min((now - lastTime) / 1000, 0.064);
      lastTime = now;
      introTime += elapsed;
      const distance = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      momentum = Math.min(MAX_MOMENTUM, momentum + distance * SCROLL_IMPULSE);
      if (!launched && introTime >= ENTRANCE_DELAY) {
        momentum = Math.max(momentum, 3);
        launched = true;
      }
      momentum *= Math.exp(-MOMENTUM_DECAY * elapsed);
      phase.current = (phase.current - (IDLE_SPEED + momentum) * elapsed) % TURN;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      momentum = 0;
      if (intersecting && !document.hidden && !hovering && !focused) {
        lastTime = performance.now();
        lastScroll = window.scrollY;
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

    draw();
    observer.observe(element);
    cards.forEach(card => {
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
    });
    element.addEventListener("focusin", onFocus);
    element.addEventListener("focusout", onBlur);
    finePointer.addEventListener("change", onPointerChange);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      cards.forEach((card, index) => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
        const pose = cardPose(Math.PI + index * TURN / SLOT_COUNT);
        card.style.transform = pose.transform;
        card.style.zIndex = String(pose.zIndex);
        card.style.removeProperty("opacity");
      });
      element.removeEventListener("focusin", onFocus);
      element.removeEventListener("focusout", onBlur);
      finePointer.removeEventListener("change", onPointerChange);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [images, reducedMotion]);

  if (images.length === 0) return null;

  return (
    <div ref={stage} className="project-carousel" role="group" aria-label="Featured project previews">
      <div className="project-carousel-window">
        {Array.from({ length: SLOT_COUNT }, (_, index) => {
          const image = images[index % images.length];
          return (
            <Link className="project-carousel-card" key={index} href={image.href} aria-label={`Open the ${image.title} case study`} style={cardPose(Math.PI + index * TURN / SLOT_COUNT)}>
              <div className="project-carousel-surface">
                <Image src={image.src} alt="" width={image.width} height={image.height} loading="eager" sizes="(max-width: 767px) 200px, (max-width: 1023px) 250px, (max-height: 740px) 250px, (max-height: 1000px) 340px, 431px" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
