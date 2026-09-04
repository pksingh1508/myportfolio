import type { Metadata } from "next";
import Container from "../../components/layout/Container";
import MotionSelfTest from "../../components/motion/MotionSelfTest";
import Divider from "../../components/ui/Divider";

/*
 * DEV-ONLY specimen for Step 3 token/type calibration.
 * Remove before launch (tracked in the Step 12-17 todo) and exclude from
 * the sitemap in Step 14. Never link to it from production UI.
 */
export const metadata: Metadata = {
  title: "Design specimen (dev only)",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "paper", hex: "#F7F8FC", use: "Page canvas" },
  { name: "white", hex: "#FFFFFF", use: "Elevated media" },
  { name: "ink", hex: "#090A0C", use: "Body copy, dark chapter" },
  { name: "muted", hex: "#51555E", use: "Small secondary text, light" },
  { name: "graphite", hex: "#6F737B", use: "Large text and UI only" },
  { name: "fog", hex: "#C6C9D1", use: "Secondary text, dark" },
  { name: "line", hex: "#DDE1E8", use: "Dividers, outlines" },
  { name: "signal", hex: "#635BFF", use: "Focus, progress, live" },
  { name: "signal-soft", hex: "#B9B6FF", use: "Edges, dark accents" },
  { name: "night-surface", hex: "#15171B", use: "Raised media, dark" },
] as const;

export default function SpecimenPage() {
  return (
    <main id="main-content">
      <Container>
        <p className="mono">Dev-only specimen — remove before launch</p>
        <h1 className="display">Orbital Archive specimen</h1>
        <p>
          Instrument Sans carries display and body copy; IBM Plex Mono carries
          project metadata, coordinates, dates, and status readouts.
        </p>
        <p>
          <a className="btn btn-primary" href="#swatches">
            Primary control
          </a>{" "}
          <a className="btn btn-secondary" href="#type">
            Secondary control
          </a>
        </p>
      </Container>

      <Container>
        <section id="swatches" aria-labelledby="swatches-heading">
          <h2 id="swatches-heading">Color tokens</h2>
          <ul>
            {swatches.map((swatch) => (
              <li key={swatch.name}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: "2rem",
                    height: "2rem",
                    backgroundColor: swatch.hex,
                    border: "1px solid #DDE1E8",
                    verticalAlign: "middle",
                  }}
                />{" "}
                <strong>{swatch.name}</strong>{" "}
                <span className="mono">{swatch.hex}</span> — {swatch.use}
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <Container>
        <section id="type" aria-labelledby="type-heading">
          <h2 id="type-heading">Type scale</h2>
          <h1>Page title at clamp(2.25rem, 5vw, 3.5rem)</h1>
          <h2>Section heading at clamp(1.5rem, 3vw, 2.25rem)</h2>
          <h3>Subsection heading at 1.25rem</h3>
          <p>
            Body copy stays within 68ch at 1.6 line height. Sentences stay in
            sentence case, left-aligned, with room to breathe around them.
          </p>
          <p className="mono">Mono metadata — EU Career Serwis · 2025 · 95+</p>
          <p className="muted">
            Secondary copy uses the muted token so it holds AA contrast.
          </p>
          <p className="tnum">Tabular figures hold alignment: 1,000+ 45% 95+</p>
        </section>
      </Container>

      <Container>
        <Divider />
        <section aria-labelledby="motion-heading">
          <h2 id="motion-heading">Motion runtime self-test</h2>
          <MotionSelfTest />
        </section>
      </Container>

      <Container>
        <Divider />
        <p className="mono">Hairline divider above encodes a group change.</p>
      </Container>
    </main>
  );
}
