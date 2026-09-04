import { experience, projects } from "../../constant/data";
import Container from "../layout/Container";
import MotionReveal from "../motion/MotionReveal";
import SmartLink from "../ui/SmartLink";

/** Compact chronological experience list. Server Component. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <Container>
        <MotionReveal className="section-grid">
          <div className="section-heading flow">
            <p className="section-index meta">In production</p>
            <h2 id="experience-heading">Experience</h2>
          </div>
          <ol className="ruled experience-list">
          {experience.map((job) => {
            const related = job.relatedProjectSlug
              ? projects.find(
                  (project) => project.slug === job.relatedProjectSlug,
                )
              : undefined;
            return (
              <li key={job.id} className="experience-item">
                <div className="flow">
                  <div className="item-head">
                    <div>
                      <h3>{job.role}</h3>
                      <p className="meta">
                        {job.company}, {job.engagementType}, {job.workplace}
                      </p>
                    </div>
                    <p className="meta tnum">{job.period.label}</p>
                  </div>
                  <ul className="detail-list">
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <p className="mono meta">{job.techStack.join(", ")}</p>
                  {related ? (
                    <p>
                      <SmartLink href={`/work/${related.slug}`}>
                        Related project: {related.title}
                      </SmartLink>
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
          </ol>
        </MotionReveal>
      </Container>
    </section>
  );
}
