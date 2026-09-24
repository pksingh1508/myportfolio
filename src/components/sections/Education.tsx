import { education } from "../../constant/data";
import Container from "../layout/Container";
import Reveal from "../motion/Reveal";

/** Education list. Institutions are omitted until the owner supplies them. */
export default function Education() {
  return (
    <section id="education" aria-labelledby="education-heading">
      <Container className="section-grid">
        <Reveal className="section-heading" stagger>
          <p className="eyebrow">Learning path</p>
          <h2 id="education-heading">Education</h2>
        </Reveal>
        <Reveal delay={120}>
          <ol className="edu-list">
            {education.map((item) => (
              <li key={item.id} className="edu-row row-fill">
                <span className="edu-badge">{item.shortName}</span>
                <p className="edu-title">{item.qualification}</p>
                <p className="edu-period">{item.period.label}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
