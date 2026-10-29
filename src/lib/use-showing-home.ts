"use client";

import { useSelectedLayoutSegment } from "next/navigation";

/**
 * True while the homepage fills the root layout's page slot, including
 * under the project modal, whose intercepted URL is `/work/[slug]` while the
 * homepage stays on screen. Call it only from components the root layout
 * renders (the header), where the selected segment is the page's.
 */
export function useShowingHome(): boolean {
  return useSelectedLayoutSegment() === null;
}
