import { projects } from "../../constant/data";
import Container from "../layout/Container";
import WorkStory from "../motion/WorkStory";

/**
 * Selected work dark chapter. The article DOM inside WorkStory is the
 * content source in every mode; Step 11 enhances it into a pinned split
 * stage on desktop with motion safe.
 */
export default function SelectedWork() {
  const featured = projects.filter((project) => project.featured);

  return (
    <section id="work" aria-labelledby="work-heading" className="night">
      <Container className="flow">
        <div className="flow">
          <h2 id="work-heading">Selected work</h2>
          <p className="section-lede">
            Three projects with the strongest evidence: what they are, what I
            changed, and what moved.
          </p>
        </div>
        <WorkStory projects={featured} />
      </Container>
    </section>
  );
}
