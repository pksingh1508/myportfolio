import { contact, profile, site } from "../../constant/data";
import { describeLink } from "../../lib/describe-link";
import Container from "./Container";
import SmartLink from "../ui/SmartLink";

/**
 * Global footer. Server Component, no client JavaScript.
 *
 * Reference-inspired composition: personal mark, positioning line, and the
 * primary conversion pair on the left; exactly two link columns
 * (Links, Social) on the right; copyright plus stack note; and the
 * oversized cropped first-name mark as a decorative finale.
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
        <div className="footer-top">
          <div className="footer-brand">
            <span aria-hidden="true" className="footer-mark">
              {profile.initials}
            </span>
            <p className="footer-tagline">{profile.headline}</p>
            <div className="btn-row footer-actions">
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
            <div>
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
            <div>
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
        </div>
        <div className="footer-bottom">
          <p suppressHydrationWarning>
            © {year} {profile.fullName}
          </p>
          <p>Built with Next.js, TypeScript and Tailwind CSS.</p>
        </div>
      </Container>
      <div aria-hidden="true" className="footer-giant">
        {profile.firstName}
      </div>
    </footer>
  );
}
