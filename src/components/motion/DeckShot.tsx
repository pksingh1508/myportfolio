"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import SharedShot from "./SharedShot";

type DeckShotProps = {
  readonly slug: string;
  readonly children: ReactNode;
};

/**
 * The selected-work card's end of the project-modal morph. A view-transition
 * name may exist only once per document, so while this project's modal is
 * open (the intercepted `/work/[slug]` URL over the homepage) the card gives
 * its name up and keeps an invisible copy of the frame as the hole the shot
 * lifted out of. React pairs the unmounting card shot with the mounting
 * modal shot, so the frame flies into the modal; ProjectModal's close flies
 * it back here by hand.
 *
 * The invisible copy also keeps the screenshot decoded in memory, so the
 * frame paints at once when it lands back in the card. `data-slug` lets
 * ProjectModal find this frame as the landing spot of its manual close.
 */
export default function DeckShot({ slug, children }: DeckShotProps) {
  const lifted = usePathname() === `/work/${slug}`;
  if (lifted) {
    return (
      <div className="deck-shot" data-slug={slug} data-lifted="">
        {children}
      </div>
    );
  }
  return (
    <SharedShot slug={slug} always>
      <div className="deck-shot" data-slug={slug}>
        {children}
      </div>
    </SharedShot>
  );
}
