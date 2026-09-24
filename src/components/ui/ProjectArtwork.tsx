import Image from "next/image";
import type { Project } from "../../types/portfolio";

/**
 * Editorial card cover: a dark raised card with category and year on top,
 * the product screenshot in a neutral browser frame, and the core stack
 * below. The frame keeps each screenshot's intrinsic ratio, so dashboards
 * keep their sidebars. Projects without an image show a title plate.
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
        <span className="tnum">{project.date.slice(0, 4)}</span>
      </div>
      <div className="art-object">
        {showShot ? (
          <div className="art-window">
            <div className="art-window-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="art-window-view">
              <Image
                src={shot.src}
                alt=""
                width={shot.width}
                height={shot.height}
                sizes="(max-width: 767px) 92vw, (max-width: 1023px) 80vw, 640px"
              />
            </div>
          </div>
        ) : (
          <div className="art-plate">{project.title}</div>
        )}
      </div>
      <div className="art-bottom">
        <span>{project.techStack.slice(0, 3).join(" · ")}</span>
      </div>
    </div>
  );
}
