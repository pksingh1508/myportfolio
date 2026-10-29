import type { Project } from "../../types/portfolio";
import SharedShot from "../motion/SharedShot";
import { LinkArrow } from "../ui/SmartLink";
import { PlatformIcon } from "../ui/Icons";
import ProjectFrame from "../ui/ProjectFrame";
import ProjectMediaFigure from "../ui/ProjectMediaFigure";
import SmartLink from "../ui/SmartLink";
import ProjectStory from "./ProjectStory";

/** Id of the sheet's title, which names the project dialog. */
export const sheetTitleId = (slug: string) => `sheet-${slug}-title`;

/**
 * Everything about one project, laid out for the project modal: identity,
 * the product frame (the landing spot of the selected-work morph), facts,
 * links, and the full case-study story. Server Component; the dialog
 * behavior lives in ProjectModal.
 *
 * The full-page link is a plain anchor on purpose: a client navigation to
 * `/work/[slug]` would be intercepted into this modal again.
 */
export default function ProjectSheet({ project }: { readonly project: Project }) {
  return (
    <article className="sheet">
      <header className="sheet-head">
        <p className="sheet-meta">
          <span className="sheet-category">{project.category}</span>
          <span className="tnum">{project.date.slice(0, 4)}</span>
          <span>{project.status}</span>
        </p>
        <h2 id={sheetTitleId(project.slug)}>{project.title}</h2>
        <p className="lede">{project.summary}</p>
      </header>

      {/* The stage carries the frame's shadow outside the flying element,
          so the shadow stays with the panel instead of stretching in flight. */}
      <div className="sheet-stage">
        <SharedShot slug={project.slug} always>
          <div className="sheet-shot">
            <ProjectFrame project={project} fit="intrinsic" />
          </div>
        </SharedShot>
      </div>

      <dl className="project-facts">
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Timeline</dt>
          <dd className="tnum">{project.dateLabel}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span className="status-dot" aria-hidden="true" />
            {project.status}
          </dd>
        </div>
      </dl>

      <p className="btn-row sheet-actions">
        {project.links.map((link, linkIndex) => (
          <SmartLink
            key={link.href}
            href={link.href}
            external={link.external}
            className={linkIndex === 0 ? "btn btn-primary" : "btn btn-secondary"}
            arrow
            icon={link.platform ? <PlatformIcon platform={link.platform} /> : undefined}
          >
            {link.label}
          </SmartLink>
        ))}
        <a
          className={project.links.length === 0 ? "btn btn-primary" : "btn btn-secondary"}
          href={`/work/${project.slug}`}
        >
          <span>Open full page</span>
          <LinkArrow direction="right" />
        </a>
      </p>

      {project.media.length > 1 ? (
        <section aria-label={`More ${project.title} media`} className="project-media sheet-media">
          {project.media.slice(1).map((media) => (
            <ProjectMediaFigure key={media.src} media={media} />
          ))}
        </section>
      ) : null}

      <ProjectStory project={project} level={3} idPrefix={`sheet-${project.slug}`} />
    </article>
  );
}
