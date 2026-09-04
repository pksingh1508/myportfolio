import { impactMetrics, projects } from "../../constant/data";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";

/** Quiet credibility strip drawn from verified impact metrics. Static row, no marquee. */
export default function CredibilityStrip() {
  return (
    <section aria-labelledby="outcomes-heading">
      <Container>
        <h2 id="outcomes-heading" className="visually-hidden">
          Selected outcomes
        </h2>
        <ul className="metrics-grid">
          {impactMetrics.map((metric) => {
            const related = metric.relatedSlug
              ? projects.find((project) => project.slug === metric.relatedSlug)
              : undefined;
            return (
              <li key={`${metric.value}-${metric.label}`}>
                <span className="metric-value">{metric.value}</span>
                <span className="metric-label">{metric.label}</span>
                <span className="meta">
                  {related ? (
                    <SmartLink href={`/work/${related.slug}`}>
                      {metric.context}
                    </SmartLink>
                  ) : (
                    metric.context
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
