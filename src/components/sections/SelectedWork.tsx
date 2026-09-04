import { projects } from "../../constant/data";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";

/**
 * Selected work as stacked articles. The pinned scrollytelling enhancement
 * arrives in Step 11; this DOM stays the content source.
 */
export default function SelectedWork() {
  const featured = projects.filter((project) => project.featured);

  return (
    <section id="work" aria-labelledby="work-heading" className="night">
      <Container>
        <div className="flow">
          <h2 id="work-heading">Selected work</h2>
          <p className="section-lede">
            Three projects with the strongest evidence: what they are, what I
            changed, and what moved.
          </p>
        </div>
        {featured.map((project) => (
          <article
            key={project.slug}
            aria-labelledby={`${project.slug}-title`}
            className="work-article"
          >
            <div className="flow">
              <p className="meta">
                {project.category} — {project.dateLabel}
              </p>
              <h3 id={`${project.slug}-title`}>
                <SmartLink href={`/work/${project.slug}`}>
                  {project.title}
                </SmartLink>
              </h3>
              <div className="split">
                <div className="flow">
                  <p>{project.summary}</p>
                  <ul aria-label={`What ${project.title} involved`}>
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <p>
                    <SmartLink href={`/work/${project.slug}`}>
                      Read the {project.title} case study
                    </SmartLink>
                  </p>
                </div>
                <div className="flow">
                  {project.metrics.length > 0 ? (
                    <div className="flow">
                      <p className="meta">Outcome</p>
                      <ul className="metrics-grid">
                        {project.metrics.map((metric) => (
                          <li key={`${metric.value}-${metric.label}`}>
                            <span className="metric-value">
                              {metric.value}
                            </span>
                            <span className="metric-label">
                              {metric.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="flow">
                    <p className="meta">Stack</p>
                    <p className="mono stack">{project.techStack.join(", ")}</p>
                  </div>
                  <div className="flow">
                    <p className="meta">Links</p>
                    <ul className="link-row">
                      {project.links.map((link) => (
                        <li key={link.href}>
                          <SmartLink
                            href={link.href}
                            external={link.external}
                          >
                            {link.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </Container>
    </section>
  );
}
