import { profile, site } from "../../constant/data";
import DesktopNav from "../motion/DesktopNav";
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
        <SmartLink href="/" className="brand" ariaLabel={profile.fullName}>
          <span aria-hidden="true" className="brand-mark">
            {profile.initials}
          </span>
          <span aria-hidden="true" className="brand-name">{profile.fullName}</span>
        </SmartLink>
        <DesktopNav items={items} />
        <SiteMenu items={items} />
      </Container>
    </HeaderState>
  );
}
