import type { Project } from "../../types/portfolio";
import ProjectSectionReveal from "../motion/ProjectSectionReveal";
import Odometer from "../ui/Odometer";

type HeadingLevel = 2 | 3;

const pad = (value: number) => String(value).padStart(2, "0");

const countLabel = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

/** Label column shared by every case-study section, so all lists align. */
function SectionHead({
  id,
  title,
  meta,
  level,
}: {
  readonly id: string;
  readonly title: string;
  readonly meta: string;
  readonly level: HeadingLevel;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className="case-section-head">
      <Heading id={id}>{title}</Heading>
      <p className="case-section-meta">{meta}</p>
    </div>
  );
}

/**
 * The case-study narrative, shared by the project page and the project
 * modal: context, contribution, constraints, implementation, current state,
 * outcome, and stack, each rendered only when the model holds it. `level`
 * keeps the outline correct under either an `h1` page or an `h2` dialog;
 * `idPrefix` keeps heading ids unique while the modal sits over the
 * homepage.
 */
export default function ProjectStory({
  project,
  level = 2,
  idPrefix = "case",
}: {
  readonly project: Project;
  readonly level?: HeadingLevel;
  readonly idPrefix?: string;
}) {
  const id = (name: string) => `${idPrefix}-${name}-heading`;
  return (
    <>
      {project.caseStudy ? (
        <section className="case-section case-section-static" aria-labelledby={id("context")}>
          <SectionHead id={id("context")} title="Context" meta="The product" level={level} />
          <div className="case-prose"><p>{project.caseStudy.context}</p></div>
        </section>
      ) : null}

      <ProjectSectionReveal labelledBy={id("contribution")}>
        <SectionHead
          id={id("contribution")}
          title="Contribution"
          meta={countLabel(project.highlights.length, "highlight", "highlights")}
          level={level}
        />
        <ol className="contribution-list" role="list">
          {project.highlights.map((highlight, itemIndex) => (
            <li key={highlight}>
              <span className="case-index" aria-hidden="true">
                {pad(itemIndex + 1)}
              </span>
              <p>{highlight}</p>
            </li>
          ))}
        </ol>
      </ProjectSectionReveal>

      {project.caseStudy ? (
        <>
          <section className="case-section case-section-static" aria-labelledby={id("constraints")}>
            <SectionHead id={id("constraints")} title="Constraints" meta="Design decisions" level={level} />
            <ul className="contribution-list" role="list">
              {project.caseStudy.constraints.map((constraint, itemIndex) => (
                <li key={constraint}>
                  <span className="case-index" aria-hidden="true">{pad(itemIndex + 1)}</span>
                  <p>{constraint}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="case-section case-section-static" aria-labelledby={id("implementation")}>
            <SectionHead id={id("implementation")} title="Implementation" meta="How it works" level={level} />
            <ol className="contribution-list" role="list">
              {project.caseStudy.implementation.map((detail, itemIndex) => (
                <li key={detail}>
                  <span className="case-index" aria-hidden="true">{pad(itemIndex + 1)}</span>
                  <p>{detail}</p>
                </li>
              ))}
            </ol>
          </section>
          <section className="case-section case-section-static" aria-labelledby={id("development")}>
            <SectionHead id={id("development")} title="Current state" meta={project.status} level={level} />
            <div className="case-prose"><p>{project.caseStudy.outcome}</p></div>
          </section>
        </>
      ) : null}

      {project.metrics.length > 0 ? (
        <ProjectSectionReveal labelledBy={id("outcome")}>
          <SectionHead
            id={id("outcome")}
            title="Outcome"
            meta={countLabel(project.metrics.length, "result", "results")}
            level={level}
          />
          <ul className="outcome-grid" role="list">
            {project.metrics.map((metric) => (
              <li key={`${metric.value}-${metric.label}`} className="outcome-card">
                <strong className="outcome-value">
                  <Odometer value={metric.value} />
                </strong>{" "}
                <span className="outcome-label">{metric.label}</span>
              </li>
            ))}
          </ul>
        </ProjectSectionReveal>
      ) : null}

      <ProjectSectionReveal labelledBy={id("stack")}>
        <SectionHead
          id={id("stack")}
          title="Stack"
          meta={countLabel(project.techStack.length, "technology", "technologies")}
          level={level}
        />
        <ul className="stack-grid" role="list">
          {project.techStack.map((technology, itemIndex) => (
            <li key={technology}>
              <span className="case-index" aria-hidden="true">
                {pad(itemIndex + 1)}
              </span>
              {technology}
            </li>
          ))}
        </ul>
      </ProjectSectionReveal>
    </>
  );
}
