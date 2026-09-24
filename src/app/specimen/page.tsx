import type { Metadata } from "next";
import Container from "../../components/layout/Container";
import ArchiveLab from "../../components/motion/ArchiveLab";
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
  { name: "paper", hex: "#FFFFFF", use: "Page canvas" },
  { name: "surface", hex: "#FAFAFA", use: "Raised light rows and tags" },
  { name: "ink", hex: "#0A0A0A", use: "Body copy, primary controls, dark chapters" },
  { name: "muted", hex: "#525252", use: "Small secondary text, light" },
  { name: "graphite", hex: "#737373", use: "Large text, metadata, non-text UI" },
  { name: "line", hex: "#EBEBEB", use: "Hairline dividers" },
  { name: "line-strong", hex: "#D9D9D9", use: "Control outlines, rails" },
  { name: "night-raised", hex: "#131313", use: "Raised cards on dark" },
  { name: "night-line", hex: "#262626", use: "Hairlines on dark" },
  { name: "fog", hex: "#A3A3A3", use: "Secondary text, dark" },
  { name: "mist", hex: "#D4D4D4", use: "Body text, dark" },
] as const;

export default function SpecimenPage() {
  return (
    <main id="main-content">
      <Container>
        <p className="mono">Dev-only specimen — remove before launch</p>
        <h1 className="display">Orbital Archive specimen</h1>
        <p>
          Geist carries display and body copy; Geist Mono is reserved for
          small numeric indices where fixed-width alignment is functional.
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
          <h1 className="display">Display at var(--text-display)</h1>
          <h2>Section heading at var(--text-section)</h2>
          <h3>Subsection heading at clamp(1.375rem, 1.15rem + 0.9vw, 1.875rem)</h3>
          <p>
            Body copy stays within 68ch at 1.6 line height. Sentences stay in
            sentence case, left-aligned, with room to breathe around them.
          </p>
          <p className="mono">Mono metadata — Project name · Year · Metric</p>
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
        <section aria-labelledby="archive-heading">
          <h2 id="archive-heading">Isolated archive prototype</h2>
          <p>
            Procedural monolith, three project frames, one orbit line, and
            instanced dust. Switch backends to verify each path; the poster
            holds the same box while loading or on failure.
          </p>
          <ArchiveLab />
        </section>
      </Container>

      <Container>
        <Divider />
        <p className="mono">Hairline divider above encodes a group change.</p>
      </Container>
    </main>
  );
}
