import { education } from "../../constant/data";
import Container from "../layout/Container";
import MotionReveal from "../motion/MotionReveal";

/** Education list. Institutions are omitted until the owner supplies them. */
export default function Education() {
  return (
    <section id="education" aria-labelledby="education-heading">
      <Container>
        <MotionReveal className="section-grid" delay={0.04}>
          <div className="section-heading flow">
            <p className="section-index meta">Learning path</p>
            <h2 id="education-heading">Education</h2>
          </div>
          <ol className="ruled education-list">
            {education.map((item) => (
              <li key={item.id}>
                <div className="item-head">
                  <p>
                    <strong>{item.qualification}</strong>{" "}
                    <span className="meta">{item.shortName}</span>
                  </p>
                  <p className="meta tnum">{item.period.label}</p>
                </div>
              </li>
            ))}
          </ol>
        </MotionReveal>
      </Container>
    </section>
  );
}
