import { contact, profile, site } from "../../constant/data";
import { describeLink } from "../../lib/describe-link";
import Container from "./Container";
import SmartLink from "../ui/SmartLink";
import MotionReveal from "../motion/MotionReveal";
import FooterReveal from "../motion/FooterReveal";

/**
 * Server-rendered footer with small, progressive entrance boundaries.
 *
 * Reference-inspired composition: the shared navbar brand (same 44px mark
 * plus pill-reveal hover), positioning line, and the primary conversion
 * pair on the left; two link columns on the right; and an oversized
 * first-name backdrop that softens into the copyright baseline.
 *
 * Social labels stay short in the visible UI ("Email", "LinkedIn",
 * "GitHub") with the contact-section arrow affordance, while the
 * accessible name keeps the full "Email Pawan Kumar" phrasing.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  const socialLinks = profile.links.filter(
    (link) => link.kind === "email" || link.kind === "social",
  );

  return (
    <footer className="site-footer">
      <Container>
        <FooterReveal>
          <div className="footer-brand">
            <div data-footer-reveal>
            <SmartLink href="/" className="brand" ariaLabel={profile.fullName}>
              <span aria-hidden="true" className="brand-mark">
                {profile.initials}
              </span>
              <span aria-hidden="true" className="brand-name">{profile.fullName}</span>
            </SmartLink>
            </div>
            <p className="footer-tagline" data-footer-reveal>{profile.headline}</p>
            <div className="btn-row footer-actions" data-footer-reveal>
              <SmartLink
                href={contact.primaryAction.href}
                external={contact.primaryAction.external}
                className="btn btn-primary"
              >
                Say hello
              </SmartLink>
              <SmartLink href="/#work" className="btn btn-secondary">
                View selected work
              </SmartLink>
            </div>
          </div>
          <nav aria-label="Footer" className="footer-columns">
            <div data-footer-reveal>
              <h2 className="footer-heading">Links</h2>
              <ul className="footer-list">
                {site.navigation.map((item) => (
                  <li key={item.href}>
                    <SmartLink href={`/${item.href}`} className="footer-link">
                      {item.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
            <div data-footer-reveal>
              <h2 className="footer-heading">Social</h2>
              <ul className="footer-list" aria-label="Profiles and contact">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <SmartLink
                      href={link.href}
                      external={link.external}
                      ariaLabel={describeLink(link, profile.fullName)}
                      className="text-link footer-social-link"
                      arrow
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </FooterReveal>
        <MotionReveal className="footer-giant">
          <div aria-hidden="true" className="footer-wordmark">
            {Array.from(profile.firstName).map((letter, index) => (
              <span className="footer-letter" key={`${letter}-${index}`}>
                <span className="footer-letter-glyph">
                  <span className="footer-wordmark-sharp">{letter}</span>
                  <span className="footer-wordmark-blur">{letter}</span>
                </span>
              </span>
            ))}
          </div>
        </MotionReveal>
        <div className="footer-bottom">
          <p suppressHydrationWarning>
            © {year} {profile.fullName}
          </p>
        </div>
      </Container>
    </footer>
  );
}
