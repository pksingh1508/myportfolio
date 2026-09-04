import { profile, site } from "../../constant/data";
import HeaderState from "../motion/HeaderState";
import SiteMenu from "../motion/SiteMenu";
import Container from "./Container";
import SmartLink from "../ui/SmartLink";

/**
 * Static global header shell. Scroll backdrop lives in HeaderState and the
 * mobile disclosure in SiteMenu; brand and desktop nav stay server-rendered.
 */
export default function SiteHeader() {
  const items = site.navigation.map((item) => ({
    label: item.label,
    href: `/${item.href}`,
  }));

  return (
    <HeaderState>
      <Container className="site-header-inner">
        <SmartLink href="/" className="brand">
          <span aria-hidden="true" className="brand-mark">
            {profile.initials}
          </span>
          {profile.fullName}
        </SmartLink>
        <nav aria-label="Primary" className="desktop-nav">
          <ul className="desktop-nav-list">
            {items.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href}>{item.label}</SmartLink>
              </li>
            ))}
          </ul>
        </nav>
        <SiteMenu items={items} />
      </Container>
    </HeaderState>
  );
}
