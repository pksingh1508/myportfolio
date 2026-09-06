import Image from "next/image";
import type { Project } from "../../types/portfolio";

/**
 * Editorial card cover: tinted frame with top/bottom labels and the product
 * screenshot set in a bordered rectangle in the middle band. The shot comes
 * from the project's first gallery image (the ImageKit screenshot in
 * `data.ts`), so each card shows the correct product. Cards without a usable
 * image keep the original abstract shapes.
 */
export default function ProjectArtwork({
  project,
}: {
  readonly project: Project;
}) {
  const shot = project.media[0];
  const showShot = shot !== undefined && shot.type === "image";
  return (
    <div className={`project-art art-${project.slug}`} aria-hidden="true">
      <div className="art-top">
        <span>{project.category}</span>
        <span>{project.date.slice(0, 4)}</span>
      </div>
      <div className="art-object">
        {showShot ? (
          <div className="art-shot">
            <Image
              src={shot.src}
              alt=""
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 640px"
            />
          </div>
        ) : project.slug === "eu-career-serwis" ? (
          <div className="art-pathways">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <span>EU</span>
          </div>
        ) : project.slug === "eu-work-support" ? (
          <div className="art-documents">
            <i />
            <i />
            <i />
            <span>
              EU
              <br />
              Work
              <br />
              Support<span className="art-document-line" />
            </span>
          </div>
        ) : (
          <div className="art-pages">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      <div className="art-bottom">
        <strong>{project.title}</strong>
        <span>{project.techStack.slice(0, 2).join(" / ")}</span>
      </div>
    </div>
  );
}
