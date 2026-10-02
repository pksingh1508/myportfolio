import { experience, profile } from "../../constant/data";
import Container from "../layout/Container";
import DecodeText from "../motion/DecodeText";
import Reveal from "../motion/Reveal";
import ScrollInk from "../motion/ScrollInk";

/**
 * About: the verified short bio set as one large statement that inks in
 * word by word with scroll, followed by the current role. Only approved
 * facts appear: the bio from the profile and the one role without an end
 * date. Server Component; the ink is the ScrollInk island.
 */
export default function About() {
  const current = experience.find((job) => job.period.end === null);

  return (
    <section id="about" aria-labelledby="about-heading" className="about-section">
      <Container className="about-shell">
        <Reveal className="about-head" stagger>
          <h2 id="about-heading" className="eyebrow">
            <DecodeText text="About" />
          </h2>
        </Reveal>
        <ScrollInk className="about-statement" text={profile.shortBio} />
        {current ? (
          <Reveal className="about-now" delay={120}>
            <p>
              <span className="now-dot" aria-hidden="true" />
              <span className="about-now-label">Currently</span>
              <span>
                {current.role}, {current.company}
              </span>
            </p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
