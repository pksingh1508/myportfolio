import { experience, projects } from "../../constant/data";
import Container from "../layout/Container";
import Reveal from "../motion/Reveal";
import SmartLink from "../ui/SmartLink";

/** Chronological experience timeline. Server Component. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <Container className="section-grid">
        <Reveal className="section-heading" stagger>
          <p className="eyebrow">In production</p>
          <h2 id="experience-heading">Experience</h2>
        </Reveal>
        <ol className="timeline">
          {experience.map((job) => {
            const related = job.relatedProjectSlug
              ? projects.find((project) => project.slug === job.relatedProjectSlug)
              : undefined;
            const current = job.period.end === null;
            return (
              <li key={job.id} className="timeline-item" data-current={current}>
                <span className="timeline-marker" aria-hidden="true" />
                <Reveal stagger>
                  <p className="timeline-period">{job.period.label}</p>
                  <h3>{job.role}</h3>
                  <p className="timeline-org">
                    {job.company} <span aria-hidden="true">·</span>{" "}
                    {job.engagementType} <span aria-hidden="true">·</span>{" "}
                    {job.workplace}
                  </p>
                  <ul className="detail-list">
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <ul className="tag-list" aria-label={`${job.company} stack`}>
                    {job.techStack.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                  {related ? (
                    <p className="timeline-link">
                      <SmartLink href={`/work/${related.slug}`} className="text-link" arrow="right">
                        Related project: {related.title}
                      </SmartLink>
                    </p>
                  ) : null}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
