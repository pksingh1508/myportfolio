"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import ArchivePoster from "../three/ArchivePoster";
import type { ArchivePoseName } from "../three/archive-poses";
import type { Project } from "../../types/portfolio";
import { ScrollTrigger, gsap, markersEnabled, useGSAP } from "./scroll";

const StageScene = dynamic(() => import("../three/ArchiveScene"), {
  ssr: false,
  loading: () => <ArchivePoster label="Selected work visual…" />,
});

type WorkStoryProps = {
  readonly projects: readonly Project[];
};

/**
 * Selected-work scrollytelling enhancement. The article DOM below is the
 * content source in every mode; on desktop with motion safe, one pinned
 * timeline crossfades slides, fills the progress rail, and retargets the
 * stage's named 3D pose — all scrubbed with linear mapping so scroll
 * position is the single source of truth. Anywhere else (mobile, short
 * viewports, reduced motion, failed scene) the same DOM renders as a normal
 * stacked list with no pin and no second renderer.
 */
export default function WorkStory({ projects }: WorkStoryProps) {
  const scope = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<Array<HTMLElement | null>>([]);
  const railsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);

  const count = projects.length;
  const safeIndex = Math.min(activeIndex, count - 1);
  const activeSlug = projects[safeIndex]?.slug ?? "";
  const pose: ArchivePoseName = `project:${activeSlug}`;
  const slugs = projects.map((project) => project.slug);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (sceneFailed) {
            return;
          }
          setEnhanced(true);
          const slides = slidesRef.current.filter(
            (element): element is HTMLElement => element !== null,
          );
          const rails = railsRef.current.filter(
            (element): element is HTMLDivElement => element !== null,
          );
          if (slides.length === 0) {
            return;
          }

          gsap.set(slides, { autoAlpha: 0, y: 24 });
          gsap.set(slides[0], { autoAlpha: 1, y: 0 });
          gsap.set(rails, { scaleX: 0, transformOrigin: "left center" });

          const total = slides.length;
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: "[data-work-pin]",
              start: "top top",
              end: "+=200%",
              scrub: true,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              markers: markersEnabled(),
              onUpdate: (self) => {
                const next = Math.min(
                  total - 1,
                  Math.floor(self.progress * total),
                );
                setActiveIndex((previous) =>
                  previous === next ? previous : next,
                );
              },
            },
          });
          slides.forEach((slide, index) => {
            if (index > 0) {
              timeline.fromTo(
                slide,
                { autoAlpha: 0, y: 24 },
                { autoAlpha: 1, y: 0, duration: 0.3 },
                index - 0.15,
              );
            }
            if (index < total - 1) {
              timeline.to(
                slide,
                { autoAlpha: 0, y: -24, duration: 0.3 },
                index + 1 - 0.15,
              );
            }
            const rail = rails[index];
            if (rail) {
              timeline.fromTo(
                rail,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.8 },
                index + 0.1,
              );
            }
          });

          const refresh = () => ScrollTrigger.refresh();
          // Pin spacers inserted above shift every fragment target down after
          // the browser's initial hash jump. Re-assert the hash position once
          // (and only if the user hasn't scrolled meanwhile) so direct visits
          // to /#work, /#contact, and case-study "Back to work" links land
          // where they point.
          const entryScrollY = window.scrollY;
          let hashSettled = false;
          const settleHash = () => {
            if (hashSettled) {
              return;
            }
            hashSettled = true;
            if (Math.abs(window.scrollY - entryScrollY) > 4) {
              return;
            }
            try {
              const hash = window.location.hash;
              if (hash.length > 1) {
                document.querySelector(hash)?.scrollIntoView();
              }
            } catch {
              // Invalid selector: leave the scroll position alone.
            }
          };
          const refreshAndSettle = () => {
            refresh();
            settleHash();
          };
          if (document.fonts) {
            document.fonts.ready.then(refreshAndSettle).catch(() => {});
          }
          window.addEventListener("load", refreshAndSettle);
          requestAnimationFrame(() => {
            refresh();
            settleHash();
          });

          return () => {
            setEnhanced(false);
            window.removeEventListener("load", refreshAndSettle);
          };
        },
      );
      return () => {
        mm.revert();
      };
    },
    { scope, dependencies: [sceneFailed], revertOnUpdate: true },
  );

  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div ref={scope} className="work-story">
      <div data-work-pin className="work-pin">
        <div className="work-cols">
          <div className="work-slides">
            {projects.map((project, index) => (
              <article
                key={project.slug}
                ref={(element) => {
                  slidesRef.current[index] = element;
                }}
                inert={enhanced && index !== safeIndex}
                aria-labelledby={`${project.slug}-title`}
                className="work-slide work-article flow"
              >
                <p className="meta">
                  {project.category} — {project.dateLabel}
                </p>
                <h3 id={`${project.slug}-title`}>
                  <Link href={`/work/${project.slug}`}>{project.title}</Link>
                </h3>
                <p>{project.summary}</p>
                <ul aria-label={`What ${project.title} involved`}>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                {project.metrics.length > 0 ? (
                  <ul
                    aria-label={`${project.title} outcomes`}
                    className="metrics-grid"
                  >
                    {project.metrics.map((metric) => (
                      <li key={`${metric.value}-${metric.label}`}>
                        <span className="metric-value">{metric.value}</span>
                        <span className="metric-label">{metric.label}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mono stack">{project.techStack.join(", ")}</p>
                <ul className="link-row" aria-label={`${project.title} links`}>
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link href={`/work/${project.slug}`}>
                      Read the {project.title} case study
                    </Link>
                  </li>
                </ul>
              </article>
            ))}
          </div>
          {!sceneFailed && (
            <div className="work-side" aria-hidden="true">
              <StageScene
                backend="auto"
                pose={pose}
                frameSlugs={slugs}
                label="Selected work stage"
                onError={() => setSceneFailed(true)}
              />
              <div className="work-progress">
                <div
                  className="work-rail"
                  style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
                >
                  {projects.map((project, index) => (
                    <div key={project.slug} className="work-rail-seg">
                      <div
                        ref={(element) => {
                          railsRef.current[index] = element;
                        }}
                        className="work-rail-fill"
                      />
                    </div>
                  ))}
                </div>
                <p className="mono work-counter">
                  {pad(safeIndex + 1)} / {pad(count)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
