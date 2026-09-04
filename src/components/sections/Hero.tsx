import { profile } from "../../constant/data";
import { describeLink } from "../../lib/describe-link";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";

/** Identity hero. Typographic in Step 4; the archive visual docks here in Step 10. */
export default function Hero() {
  return (
    <section aria-labelledby="intro-heading">
      <Container className="flow">
        <p className="meta">{profile.roles.join(", ")}</p>
        <h1 id="intro-heading" className="display">
          {profile.fullName}
        </h1>
        <p className="lede">{profile.headline}</p>
        <p>{profile.shortBio}</p>
        <p className="btn-row">
          <SmartLink href="/#work" className="btn btn-primary">
            View selected work
          </SmartLink>
          <SmartLink href="/#contact" className="btn btn-secondary">
            Contact me
          </SmartLink>
        </p>
        <ul className="link-row" aria-label="Contact and profiles">
          {profile.links.map((link) => (
            <li key={link.href}>
              <SmartLink href={link.href} external={link.external}>
                {describeLink(link, profile.fullName)}
              </SmartLink>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
