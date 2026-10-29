import type { CSSProperties } from "react";
import { projects } from "../../constant/data";
import { PROJECT_OPEN } from "../../lib/view-transitions";
import Container from "../layout/Container";
import DecodeText from "../motion/DecodeText";
import DeckShot from "../motion/DeckShot";
import PointerSpot from "../motion/PointerSpot";
import Reveal from "../motion/Reveal";
import WorkExpand from "../motion/WorkExpand";
import WorkStack from "../motion/WorkStack";
import ProjectFrame from "../ui/ProjectFrame";
import SmartLink from "../ui/SmartLink";

/**
 * Selected work as a deck of sticky project cards: each card docks a little
 * below the one before it, so scrolling lays the projects on top of each
 * other and the earlier ones stay visible as stacked edges. CSS owns the
 * sticky layout on phones, tablets, and desktops; WorkStack only lets
 * covered cards settle back into the deck. On short viewports or with
 * reduced motion the cards are a plain list.
 *
 * Each card opens its case study in the project modal (an intercepted
 * `/work/[slug]` route) and its browser frame flies into the modal. Without
 * JavaScript the same link loads the full case-study page. Server Component.
 */
export default function SelectedWork() {
  const featured = projects.filter((project) => project.featured);
  return (
    <WorkExpand>
      <Container className="work-shell">
        <Reveal className="work-heading-grid" stagger>
          <p className="eyebrow">
            <DecodeText text="A few things I’ve built" />
          </p>
          <h2 id="work-heading">Selected work</h2>
          <p className="work-intro">
            Web platforms, mobile experiences, and the engineering behind them.
          </p>
        </Reveal>
        <WorkStack count={featured.length}>
          {featured.map((project, index) => {
            const live = project.links.find((link) => link.kind === "live");
            return (
              <article
                key={project.slug}
                className="stack-slot"
                style={{ "--i": index } as CSSProperties}
                aria-labelledby={`${project.slug}-title`}
              >
                <div className="stack-card">
                  <PointerSpot className="art-glare" />
                  <div className="stack-copy">
                    <p className="stack-meta">
                      <span className="stack-num tnum" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="stack-category">{project.category}</span>
                      <span className="tnum">{project.date.slice(0, 4)}</span>
                      {project.status === "In development" ? (
                        <span>{project.status}</span>
                      ) : null}
                    </p>
                    <h3 id={`${project.slug}-title`}>{project.title}</h3>
                    <p className="stack-summary">{project.summary}</p>
                    {project.metrics.length > 0 ? (
                      <ul className="stack-metrics" aria-label={`${project.title} outcomes`}>
                        {project.metrics.slice(0, 2).map((metric) => (
                          <li key={metric.label}>
                            <strong>{metric.value}</strong>
                            <span>{metric.label}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <ul className="stack-tags" aria-label={`${project.title} stack`}>
                      {project.techStack.slice(0, 4).map((technology) => (
                        <li key={technology}>{technology}</li>
                      ))}
                    </ul>
                    <div className="stack-actions">
                      <SmartLink
                        className="btn btn-primary stack-cta"
                        href={`/work/${project.slug}`}
                        arrow
                        ariaLabel={`Open the ${project.title} case study`}
                        transitionTypes={[PROJECT_OPEN]}
                        scroll={false}
                      >
                        View case study
                      </SmartLink>
                      {live ? (
                        <SmartLink
                          className="text-link stack-live"
                          href={live.href}
                          external
                          arrow
                          ariaLabel={`${live.label} (opens in a new tab)`}
                        >
                          Visit live site
                        </SmartLink>
                      ) : null}
                    </div>
                  </div>
                  <DeckShot slug={project.slug}>
                    <ProjectFrame project={project} />
                  </DeckShot>
                  <span className="stack-shade" aria-hidden="true" />
                </div>
              </article>
            );
          })}
        </WorkStack>
        <div className="work-stage-footer">
          <p className="tnum">Selected work / {featured.length} projects</p>
          <SmartLink href="/#skills" className="text-link" arrow="down">
            Continue to skills
          </SmartLink>
        </div>
      </Container>
    </WorkExpand>
  );
}
