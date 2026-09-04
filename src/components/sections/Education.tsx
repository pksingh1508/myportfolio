import { education } from "../../constant/data";
import Container from "../layout/Container";

/** Education list. Institutions are omitted until the owner supplies them. */
export default function Education() {
  return (
    <section id="education" aria-labelledby="education-heading">
      <Container className="flow">
        <h2 id="education-heading">Education</h2>
        <ul className="ruled">
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
        </ul>
      </Container>
    </section>
  );
}
