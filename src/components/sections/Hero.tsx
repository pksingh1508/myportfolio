import type { CSSProperties } from "react";
import { profile, heroCarouselImages } from "../../constant/data";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";
import ProjectCarousel from "../motion/ProjectCarousel";

/** Stagger slot for the CSS page-load entrance (see `.intro` in globals.css). */
const step = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * Identity and a scroll-responsive circular fan of project previews. The
 * entrance is pure CSS: it plays on first paint, needs no hydration, and
 * always ends on the visible server-rendered copy.
 */
export default function Hero() {
  const [primaryRole, ...specialties] = profile.roles;

  return (
    <section aria-labelledby="intro-heading" className="hero-section">
      <Container className="hero-grid">
        <div className="hero-copy">
          {specialties.length > 0 ? (
            <p className="eyebrow intro" style={step(0)}>
              {specialties.join(" · ")}
            </p>
          ) : null}
          <h1 id="intro-heading" className="hero-title">
            <span className="hero-line">
              <span style={step(1)}>{profile.fullName}</span>
            </span>{" "}
            <span className="hero-line hero-line-muted">
              <span style={step(2)}>{primaryRole}</span>
            </span>
          </h1>
          <p className="hero-bio intro" style={step(3)}>
            {profile.heroDescription}
          </p>
          <p className="btn-row intro" style={step(4)}>
            <SmartLink href="/#work" className="btn btn-primary" arrow="down">
              View selected work
            </SmartLink>
            <SmartLink href="/#contact" className="btn btn-secondary">
              Contact me
            </SmartLink>
          </p>
        </div>
        <ProjectCarousel images={heroCarouselImages} />
      </Container>
    </section>
  );
}
