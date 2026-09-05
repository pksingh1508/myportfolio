import { contact, profile, projects } from "../../constant/data";
import { describeLink } from "../../lib/describe-link";
import CopyEmail from "../motion/CopyEmail";
import FinaleMark from "../motion/FinaleMark";
import MotionReveal from "../motion/MotionReveal";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";

/** Centered contact finale. The only centered text on the page. */
export default function ContactFinale() {
  const secondaryLinks = profile.links.filter(
    (link) => link.kind === "social" || link.kind === "phone",
  );
  const frameSlugs = projects
    .filter((project) => project.featured)
    .map((project) => project.slug);

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <Container className="finale">
        <MotionReveal className="finale-copy flow">
        <p className="meta">Contact</p>
        <h2 id="contact-heading" className="display">
          {contact.heading}
        </h2>
        <p>{contact.body}</p>
        <div className="btn-row">
          <SmartLink
            href={contact.primaryAction.href}
            external={contact.primaryAction.external}
            className="btn btn-primary"
            arrow
          >
            Say hello
          </SmartLink>
          <CopyEmail email={profile.email} />
        </div>
        <ul className="link-row" aria-label="More ways to reach me">
          {secondaryLinks.map((link) => (
            <li key={link.href}>
              <SmartLink href={link.href} external={link.external} ariaLabel={describeLink(link, profile.fullName)} className="text-link" arrow>
                {link.label}
              </SmartLink>
            </li>
          ))}
        </ul>
        </MotionReveal>
        <FinaleMark frameSlugs={frameSlugs} />
      </Container>
    </section>
  );
}
