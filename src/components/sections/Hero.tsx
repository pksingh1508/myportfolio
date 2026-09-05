import { profile, projects } from "../../constant/data";
import { describeLink } from "../../lib/describe-link";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";
import HeroArchive from "../motion/HeroArchive";
import HeroIntro from "../motion/HeroIntro";

/** Identity hero with the Orbital Archive docked beside the copy on desktop. */
export default function Hero() {
  const frameSlugs = projects
    .filter((project) => project.featured)
    .map((project) => project.slug);

  return (
    <section aria-labelledby="intro-heading" className="hero-section">
      <Container className="hero-grid">
        <HeroIntro>
          <p data-intro className="hero-kicker meta">
            {profile.roles[0]}
          </p>
          <h1 data-intro id="intro-heading" className="display">
            {profile.fullName}
          </h1>
          <p data-intro className="hero-headline lede">
            {profile.headline}
          </p>
          <p data-intro className="hero-bio">{profile.heroDescription}</p>
          <p data-intro className="btn-row">
            <SmartLink href="/#work" className="btn btn-primary" arrow>
              View selected work
            </SmartLink>
            <SmartLink href="/#contact" className="btn btn-secondary">
              Contact me
            </SmartLink>
          </p>
          <ul data-intro className="link-row hero-links" aria-label="Contact and profiles">
            {profile.links.filter((link) => link.kind === "social").map((link) => (
              <li key={link.href}>
                <SmartLink href={link.href} external={link.external} ariaLabel={describeLink(link, profile.fullName)} className="text-link" arrow>
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </HeroIntro>
        <HeroArchive frameSlugs={frameSlugs} />
      </Container>
      <Container className="hero-bottom">
        <span>Full-stack thinking. Front-to-back care.</span>
        <SmartLink href="/#work" className="scroll-cue"><span>Explore the work</span><span aria-hidden="true">↓</span></SmartLink>
      </Container>
    </section>
  );
}
