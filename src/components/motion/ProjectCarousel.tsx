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
// The fan behaves as a flywheel: it idles at a steady spin, scrolling feeds a
// decaying drive, and the spin speed follows idle + drive through a critically
// damped spring, so speed and acceleration both stay continuous.
const IDLE_SPEED = 0.16; // radians/second (one turn in ~40s)
// Gentle scrolling nudges the spin; fast scrolling hits much harder, because
// each scrolled pixel counts for more the faster the page moves. The boost
// saturates softly at MAX_BOOST, and the drive is capped so a long flick
// glides out within about a second instead of pinning the top speed.
const MAX_BOOST = 3.2; // radians/second
const SCROLL_IMPULSE = 0.004; // drive per scrolled pixel, in either scroll direction
const FAST_SCROLL = 1200; // px/s of scroll at which each pixel counts double
const MAX_DRIVE = MAX_BOOST * 2;
const DRIVE_DECAY = 1.1; // per second; a scroll boost glides out over ~2s
const LAUNCH_DRIVE = 1.2; // the entrance's opening flick (~0.95 rad/s)
// Spring settle times in seconds: quick to pick up a scroll, slow to coast
// back to idle, and a short brake when a card is hovered or focused.
const RISE = 0.22;
const FALL = 0.9;
const BRAKE = 0.2;
// Leaving one card for an overlapping neighbour must not release the brake.
const HOVER_RELEASE_DELAY = 120;
const ENTRANCE_DELAY = 0.8;

const easeOut = (progress: number) => 1 - (1 - Math.max(0, Math.min(1, progress))) ** 3;
const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

type Spring = { velocity: number };

/**
 * Critically damped smoothing (Game Programming Gems 4, §1.10). `spring`
 * carries the rate of change between frames, so retiming the spring (rise,
 * fall, brake) never produces a jolt, and any frame interval is stable.
 */
function smoothDamp(current: number, target: number, spring: Spring, smoothTime: number, dt: number) {
  const omega = 2 / smoothTime;
  const k = omega * dt;
  const decay = 1 / (1 + k + 0.48 * k * k + 0.235 * k * k * k);
  const change = current - target;
  const temp = (spring.velocity + omega * change) * dt;
  spring.velocity = (spring.velocity - omega * temp) * decay;
  return target + (change + temp) * decay;
}

/** Shared by the server-rendered still and the animation; CSS owns responsive sizing. */
function cardPose(angle: number, radiusScale = 1, scale = 1) {
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  return {
    // The roll follows sin(angle): level at the front, ±12.6° at the top and
    // bottom, and continuous all the way round (no flip at the far right).
    transform: `translate(-50%, -50%) translate3d(calc(var(--arc-radius) * ${(x * radiusScale).toFixed(5)}), calc(var(--arc-radius) * ${(y * radiusScale).toFixed(5)}), 0) perspective(1100px) rotateX(${(4 * y).toFixed(3)}deg) rotateY(${(10 * x).toFixed(3)}deg) rotateZ(${(-12.6 * y).toFixed(3)}deg) scale(${scale})`,
    // Fine depth steps, so overlapping neighbours trade places exactly where
    // they are level rather than wherever DOM order breaks a tie.
    zIndex: Math.round(1000 * (1 - x)),
  };
}

/**
 * A circular fan entering from the right. It idles at a steady spin and
 * native scrolling drives it like a flywheel; hovering or focusing a card
 * brakes it to rest and leaving lets it pick back up from that state.
 */
export default function ProjectCarousel({ images }: { readonly images: readonly CarouselImage[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const phase = useRef(Math.PI);
  const entered = useRef(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    // Hand-off from the CSS fallback: the window is shown only once the
    // client owns the cards, so the still pose never flashes before the
    // entrance. Reduced motion keeps the still pose.
    const goLive = () => element.setAttribute("data-live", "");
    if (reducedMotion || images.length === 0) {
      goLive();
      return;
    }
    const cards = Array.from(element.querySelectorAll<HTMLElement>(".project-carousel-card"));
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const entrance = !entered.current && window.scrollY < window.innerHeight * 0.5;
    entered.current = true;
    // Each card opens from one right-hand origin. Its direction round the
    // circle is fixed at launch, so frame timing can never flip it.
    const entranceOffsets: (number | undefined)[] = [];
    const entranceSides: number[] = [];
    // The fan opens along its radius while each card fades in; whichever
    // finishes last ends the entrance.
    const entranceEnd = ENTRANCE_DELAY + Math.max(1.9, (cards.length - 1) * 0.08 + 0.85);
    let introTime = entrance ? 0 : Infinity;
    let launched = !entrance;
    let fading = entrance;
    const zIndexes: number[] = [];
    let intersecting = false;
    let hovering = finePointer.matches && cards.some(card => card.matches(":hover"));
    let focused = element.contains(document.activeElement);
    let releaseTimer = 0;
    let frame = 0;
    let lastTime = 0;
    let lastScroll = window.scrollY;
    let drive = 0;
    let speed = IDLE_SPEED;
    const spring: Spring = { velocity: 0 };
    // `away`: the loop stopped because the fan left view (or never started).
    // `resting`: the brake brought it fully to rest under a hover or focus.
    let away = true;
    let resting = false;

    const draw = () => {
      const age = introTime - ENTRANCE_DELAY;
      const radiusScale = 0.45 + 0.55 * easeOut(age / 1.9);
      if (age >= 0 && entranceSides.length === 0) {
        cards.forEach((_, index) => {
          entranceSides[index] = Math.sign(wrapAngle(-0.25 - phase.current - index * TURN / SLOT_COUNT)) || 1;
        });
      }
      cards.forEach((card, index) => {
        const angle = phase.current + index * TURN / SLOT_COUNT;
        const progress = easeOut((age - index * 0.08) / 0.85);
        if (progress > 0 && entranceOffsets[index] === undefined) {
          let offset = wrapAngle(-0.25 - angle);
          if (Math.sign(offset) !== entranceSides[index]) offset += entranceSides[index] * TURN;
          entranceOffsets[index] = offset;
        }
        const entryAngle = angle + (entranceOffsets[index] ?? 0) * (1 - progress);
        const pose = cardPose(entryAngle, radiusScale, 0.7 + 0.3 * progress);
        card.style.transform = pose.transform;
        if (zIndexes[index] !== pose.zIndex) {
          zIndexes[index] = pose.zIndex;
          card.style.zIndex = String(pose.zIndex);
        }
        if (fading) card.style.opacity = String(progress);
      });
      // Once every card has landed, stop restyling opacity each frame.
      if (fading && introTime >= entranceEnd) {
        fading = false;
        cards.forEach(card => card.style.removeProperty("opacity"));
      }
    };

    // Hover and focus brake the spin so a card can be read or clicked, but
    // never hold the entrance: a pointer resting where the cards fly in
    // would otherwise leave them half-faded.
    const held = () => (hovering || focused) && introTime >= entranceEnd;

    const tick = (now: number) => {
      frame = 0;
      const elapsed = Math.min(Math.max((now - lastTime) / 1000, 0), 0.064);
      lastTime = now;
      introTime += elapsed;
      const scroll = window.scrollY;
      // Scrolling either way feeds the same one-way spin.
      const scrolled = Math.abs(scroll - lastScroll);
      const scrollSpeed = elapsed > 0 ? Math.min(scrolled / elapsed, 4000) : 0;
      drive = Math.min(MAX_DRIVE, drive + scrolled * SCROLL_IMPULSE * (1 + scrollSpeed / FAST_SCROLL));
      lastScroll = scroll;
      if (!launched && introTime >= ENTRANCE_DELAY) {
        drive = Math.max(drive, LAUNCH_DRIVE);
        launched = true;
      }
      drive *= Math.exp(-DRIVE_DECAY * elapsed);
      const hold = held();
      // tanh saturates the boost softly instead of clipping it at a corner.
      const target = hold ? 0 : IDLE_SPEED + MAX_BOOST * Math.tanh(drive / MAX_BOOST);
      const smoothTime = hold ? BRAKE : target > speed ? RISE : FALL;
      speed = smoothDamp(speed, target, spring, smoothTime, elapsed);
      phase.current = (phase.current - speed * elapsed) % TURN;
      draw();
      if (hold && Math.abs(speed) < 1e-4 && Math.abs(spring.velocity) < 1e-3) {
        speed = 0;
        spring.velocity = 0;
        drive = 0;
        resting = true;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      const visible = intersecting && !document.hidden;
      const run = visible && !(resting && held());
      if (run && !frame) {
        // Back in view, it carries on at idle as if it kept turning while
        // away; after a brake it picks up from rest through the spring.
        if (away) {
          speed = IDLE_SPEED;
          spring.velocity = 0;
          drive = 0;
        }
        away = false;
        resting = false;
        lastTime = performance.now();
        lastScroll = window.scrollY;
        frame = requestAnimationFrame(tick);
      } else if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (!visible) away = true;
    };
    const onEnter = () => {
      if (!finePointer.matches) return;
      window.clearTimeout(releaseTimer);
      hovering = true;
      sync();
    };
    const onLeave = () => {
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        hovering = false;
        sync();
      }, HOVER_RELEASE_DELAY);
    };
    const onFocus = () => { focused = true; sync(); };
    const onBlur = () => { focused = false; sync(); };
    const onPointerChange = () => {
      window.clearTimeout(releaseTimer);
      hovering = false;
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    });

    draw();
    goLive();
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
      window.clearTimeout(releaseTimer);
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
                <Image src={image.src} alt="" width={image.width} height={image.height} loading="eager" fetchPriority="low" sizes="(max-width: 767px) 200px, (max-width: 1023px) 250px, (max-height: 740px) 250px, (max-height: 1000px) 340px, 431px" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
