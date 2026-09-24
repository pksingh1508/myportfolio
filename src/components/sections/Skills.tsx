import { skillGroups } from "../../constant/data";
import Container from "../layout/Container";
import Reveal from "../motion/Reveal";

/**
 * Skills index rendered from verified skill groups. Editorial capability
 * statements are omitted until the owner supplies them.
 */
export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading">
      <Container className="section-grid">
        <Reveal className="section-heading" stagger>
          <p className="eyebrow">How I build</p>
          <h2 id="skills-heading">Skills</h2>
          <p className="section-lede">
            The languages, frameworks, and services behind the work above.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <dl className="skills-list">
            {skillGroups.map((group, index) => (
              <div key={group.id} className="skill-row row-fill">
                <dt>
                  <span className="row-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {group.label}
                </dt>
                <dd>
                  <ul className="skill-items">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
