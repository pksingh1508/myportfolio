import { skillGroups } from "../../constant/data";
import Container from "../layout/Container";
import MotionReveal from "../motion/MotionReveal";

/**
 * Skills index rendered from verified skill groups. Editorial capability
 * statements are omitted until the owner supplies them.
 */
export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading">
      <Container>
        <MotionReveal className="section-grid">
          <div className="section-heading flow">
            <p className="section-index meta">How I build</p>
            <h2 id="skills-heading">Skills</h2>
            <p className="section-lede">
              The languages, frameworks, and services behind the work above.
            </p>
          </div>
          <dl className="ruled skills-list">
            {skillGroups.map((group) => (
              <div key={group.id} className="skill-row">
                <dt>{group.label}</dt>
                <dd className="stack">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </MotionReveal>
      </Container>
    </section>
  );
}
