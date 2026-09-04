import { experience, projects } from "../../constant/data";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";

/** Compact chronological experience list. Server Component. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <Container className="flow">
        <h2 id="experience-heading">Experience</h2>
        <ul className="ruled">
          {experience.map((job) => {
            const related = job.relatedProjectSlug
              ? projects.find(
                  (project) => project.slug === job.relatedProjectSlug,
                )
              : undefined;
            return (
              <li key={job.id}>
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
                  <ul>
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
        </ul>
      </Container>
    </section>
  );
}
