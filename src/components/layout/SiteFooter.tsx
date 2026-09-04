import { profile, site } from "../../constant/data";
import { describeLink } from "../../lib/describe-link";
import Container from "./Container";
import Divider from "../ui/Divider";
import SmartLink from "../ui/SmartLink";

/** Static global footer. Server Component. */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  const socialLinks = profile.links.filter(
    (link) => link.kind === "social" || link.kind === "email",
  );

  return (
    <footer>
      <Container>
        <Divider />
        <div className="site-footer-inner">
          <p className="meta" suppressHydrationWarning>
            © {year} {profile.fullName}
          </p>
          <nav aria-label="Footer">
            <ul className="link-row">
              {site.navigation.map((item) => (
                <li key={item.href}>
                  <SmartLink href={`/${item.href}`}>{item.label}</SmartLink>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="link-row" aria-label="Profiles and contact">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <SmartLink href={link.href} external={link.external}>
                  {describeLink(link, profile.fullName)}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
