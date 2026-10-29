import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "../../types/portfolio";

/**
 * One `sizes` for every frame of a project, so the selected-work card and the
 * project modal resolve the same image candidate: the modal's frame paints
 * from cache in the very commit that starts the morph between them.
 */
const SHOT_SIZES = "(max-width: 1023px) 92vw, 880px";

/** Bare host of a live link, shown in the frame's address bar. */
function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

/**
 * A project's evidence in a dark browser frame: the product screenshot, or
 * the app's real identity artwork. The card crops the shot to its slot; the
 * modal (`fit="intrinsic"`) shows it whole at its own aspect ratio. Callers
 * own the shared-element name (DeckShot, SharedShot) and the `data-shot` hook.
 */
export default function ProjectFrame({
  project,
  fit = "cover",
}: {
  readonly project: Project;
  readonly fit?: "cover" | "intrinsic";
}) {
  const shot = project.media[0];
  const live = project.links.find((link) => link.kind === "live");
  const image = shot !== undefined && shot.type === "image" ? shot : undefined;
  const view = image ? (
    <Image
      className="stack-shot"
      src={image.src}
      alt=""
      width={image.width}
      height={image.height}
      sizes={SHOT_SIZES}
      loading={fit === "intrinsic" ? "eager" : undefined}
    />
  ) : project.artwork ? (
    <div className="stack-plate">
      <Image
        className="stack-plate-icon"
        src={project.artwork.icon.src}
        alt=""
        width={project.artwork.icon.width}
        height={project.artwork.icon.height}
        sizes="128px"
        loading={fit === "intrinsic" ? "eager" : undefined}
      />
      <span className="stack-plate-title">{project.title}</span>
      <span className="stack-plate-tagline">{project.artwork.tagline}</span>
    </div>
  ) : (
    <div className="stack-plate">
      <span className="stack-plate-title">{project.title}</span>
    </div>
  );
  const ratio =
    fit === "intrinsic" && image
      ? ({ "--shot-ratio": `${image.width} / ${image.height}` } as CSSProperties)
      : undefined;
  return (
    <div
      className="stack-frame"
      data-fit={fit}
      data-kind={image ? "shot" : "plate"}
      style={ratio}
      aria-hidden="true"
    >
      <div className="stack-bar">
        <i />
        <i />
        <i />
        {live ? <span>{hostOf(live.href)}</span> : null}
      </div>
      <div className="stack-view">{view}</div>
    </div>
  );
}
