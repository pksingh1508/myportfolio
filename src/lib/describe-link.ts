import type { SocialLink } from "../types/portfolio";

/** Human-readable link text. Labels stay factual; only the phrasing is composed here. */
export function describeLink(link: SocialLink, fullName: string): string {
  switch (link.kind) {
    case "email":
      return `Email ${fullName}`;
    case "phone":
      return `Call ${fullName}`;
    case "social":
      return `${fullName} on ${link.label}`;
    case "live":
    case "store":
    case "source":
    default:
      return link.label;
  }
}
