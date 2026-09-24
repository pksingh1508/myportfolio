import { contact, profile } from "../../constant/data";
import { describeLink } from "../../lib/describe-link";
import CopyEmail from "../motion/CopyEmail";
import Reveal from "../motion/Reveal";
import Container from "../layout/Container";
import SmartLink from "../ui/SmartLink";

/**
 * Contact finale: a dark panel that bookends the selected-work chapter.
 * The only centered text on the page.
 */
export default function ContactFinale() {
  const secondaryLinks = profile.links.filter(
    (link) => link.kind === "social" || link.kind === "phone",
  );

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <Container>
        <div className="finale-panel" data-header-theme="dark">
          <Reveal className="finale-copy" stagger>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-heading" className="finale-title">
              {contact.heading}
            </h2>
            <p className="finale-body">{contact.body}</p>
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
            <ul className="link-row finale-links" aria-label="More ways to reach me">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <SmartLink
                    href={link.href}
                    external={link.external}
                    ariaLabel={describeLink(link, profile.fullName)}
                    className="text-link"
                    arrow
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
