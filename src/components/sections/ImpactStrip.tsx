import { impactMetrics } from "../../constant/data";
import Container from "../layout/Container";
import DecodeText from "../motion/DecodeText";
import Reveal from "../motion/Reveal";
import Odometer from "../ui/Odometer";

/**
 * Quiet credibility strip between the hero and the selected work: the
 * verified impact figures, each with what it measured and where. Numbers
 * roll into place on a mechanical drum as the strip arrives (CSS, see
 * "Odometer"); without motion they are simply there. Server Component.
 */
export default function ImpactStrip() {
  return (
    <section aria-labelledby="impact-heading" className="impact-section">
      <Container>
        <Reveal className="impact-head" stagger>
          <h2 id="impact-heading" className="eyebrow">
            <DecodeText text="By the numbers" />
          </h2>
        </Reveal>
        <Reveal as="ul" className="impact-grid" stagger>
          {impactMetrics.map((metric) => (
            <li key={`${metric.value}-${metric.label}`} className="impact-item">
              <p className="impact-value">
                <Odometer value={metric.value} />
              </p>
              <p className="impact-label">{metric.label}</p>
              <p className="impact-context">{metric.context}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
