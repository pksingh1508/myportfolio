import { skillGroups } from "../../constant/data";
import Container from "../layout/Container";

/**
 * Skills index rendered from verified skill groups. Editorial capability
 * statements are omitted until the owner supplies them.
 */
export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading">
      <Container className="flow">
        <h2 id="skills-heading">Skills</h2>
        <p className="section-lede">
          The languages, frameworks, and services behind the work above.
        </p>
        <dl className="ruled">
          {skillGroups.map((group) => (
            <div key={group.id} className="skill-row">
              <dt>{group.label}</dt>
              <dd className="mono stack">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
