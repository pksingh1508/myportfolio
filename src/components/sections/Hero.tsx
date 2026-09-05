import { profile, heroCarouselImages } from "../../constant/data";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";
import ProjectCarousel from "../motion/ProjectCarousel";
import HeroIntro from "../motion/HeroIntro";

/** Identity and a slowly looping arc of project previews. */
export default function Hero() {
  return (
    <section aria-labelledby="intro-heading" className="hero-section">
      <Container className="hero-grid">
        <HeroIntro>
          <p data-intro className="hero-kicker meta">
            {profile.roles[0]}
          </p>
          <h1 data-intro id="intro-heading" className="display">
            <span>{profile.firstName}</span>{" "}
            <span className="hero-name-secondary">{profile.lastName}</span>
          </h1>
          <p data-intro className="hero-bio">{profile.heroDescription}</p>
          <p data-intro className="btn-row">
            <SmartLink href="/#work" className="btn btn-primary" arrow>
              View selected work
            </SmartLink>
            <SmartLink href="/#contact" className="btn btn-secondary">
              Contact me
            </SmartLink>
          </p>
        </HeroIntro>
        <ProjectCarousel images={heroCarouselImages} />
      </Container>
      <Container className="hero-bottom">
        <span>Full-stack thinking. Front-to-back care.</span>
        <SmartLink href="/#work" className="scroll-cue"><span>Explore the work</span><span aria-hidden="true">↓</span></SmartLink>
      </Container>
    </section>
  );
}
