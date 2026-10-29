"use client";

import { ViewTransition, type ReactNode } from "react";
import { PROJECT_OPEN, projectShotName } from "../../lib/view-transitions";

type SharedShotProps = {
  readonly slug: string;
  readonly children: ReactNode;
  /**
   * Morph on every transition that pairs this shot, not only PROJECT_OPEN.
   * The selected-work card and the project modal use it, so the frame also
   * flies when the hero carousel or the experience timeline opens the
   * modal, whose links carry no transition type.
   */
  readonly always?: boolean;
};

/**
 * Shared-element morph for a project's browser-framed shot: the selected-work
 * frame grows into the project modal's frame, or into the case-study hero
 * frame (CSS: "Shared project shot" in globals.css). The case-study page
 * morphs only for navigations tagged PROJECT_OPEN; every other transition
 * leaves its shot inside the normal page cross-fade, and browsers without the
 * View Transitions API simply navigate.
 *
 * The child must carry `data-shot={slug}`. On arrival the case-study media
 * would otherwise still be waiting on its CSS page-load rise, so the morph
 * finishes that entrance at once: the frame has already flown into place.
 */
export default function SharedShot({ slug, children, always = false }: SharedShotProps) {
  return (
    <ViewTransition
      name={projectShotName(slug)}
      share={always ? "morph" : { [PROJECT_OPEN]: "morph", default: "none" }}
      default="none"
      onShare={() => {
        const shot = document.querySelector(`[data-shot="${CSS.escape(slug)}"]`);
        shot
          ?.closest<HTMLElement>(".intro")
          ?.getAnimations()
          .forEach((animation) => animation.finish());
      }}
    >
      {children}
    </ViewTransition>
  );
}
