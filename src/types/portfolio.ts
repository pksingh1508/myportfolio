/**
 * Canonical portfolio content types (Step 2).
 *
 * `src/constant/data.ts` holds the values; this module owns the shapes so
 * components import types from here and facts stay in exactly one place.
 * Media metadata is required at the type level: every record carries
 * intrinsic dimensions plus either meaningful alt text or an explicit
 * decorative flag, and video additionally requires a poster.
 */

export type SocialLink = {
  readonly label: string;
  readonly href: string;
  readonly kind: "email" | "phone" | "social" | "live" | "source" | "store";
  readonly external: boolean;
};

export type DateRange = {
  /** ISO-like month value used for sorting. */
  readonly start: `${number}-${number}`;
  /** `null` means the role is current. */
  readonly end: `${number}-${number}` | null;
  readonly label: string;
};

export type Profile = {
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly initials: string;
  readonly roles: readonly string[];
  readonly headline: string;
  readonly shortBio: string;
  readonly email: string;
  readonly phone: {
    readonly display: string;
    readonly href: `tel:${string}`;
  };
  readonly location: string | null;
  readonly availability: string | null;
  readonly links: readonly SocialLink[];
};

export type SiteConfig = {
  readonly title: string;
  readonly description: string;
  /**
   * Production origin (e.g. "https://example.com"). `null` until the owner
   * supplies the domain; absolute-URL metadata (canonical, sitemap) stays
   * omitted rather than shipping a guessed host.
   */
  readonly url: string | null;
  readonly navigation: readonly {
    readonly label: string;
    readonly href: `#${string}`;
  }[];
};

export type ResumeSource = {
  readonly label: string;
  readonly fileName: string;
  readonly focus: "Full-stack" | "Mobile";
};

export type SkillGroup = {
  readonly id: string;
  readonly label: string;
  readonly items: readonly string[];
};

export type ImpactMetric = {
  readonly value: string;
  readonly label: string;
  readonly context: string;
  readonly relatedSlug: string | null;
};

export type ExperienceItem = {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly engagementType: "Employment" | "Freelance";
  readonly workplace: "Remote";
  readonly period: DateRange;
  readonly techStack: readonly string[];
  readonly highlights: readonly string[];
  readonly relatedProjectSlug: string | null;
};

export type ProjectMetric = {
  readonly value: string;
  readonly label: string;
};

type ProjectMediaBase = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
};

export type ProjectMedia = ProjectMediaBase &
  (
    | {
        readonly type: "image";
        readonly alt: string;
        readonly decorative?: false;
        readonly poster?: string;
      }
    | {
        readonly type: "image";
        readonly alt: "";
        readonly decorative: true;
        readonly poster?: string;
      }
    | {
        readonly type: "video";
        readonly alt: string;
        readonly decorative?: false;
        readonly poster: string;
      }
    | {
        readonly type: "video";
        readonly alt: "";
        readonly decorative: true;
        readonly poster: string;
      }
  );

export type Project = {
  readonly slug: string;
  readonly title: string;
  readonly category: "Full-stack web" | "Mobile application" | "EdTech platform";
  readonly status: "Live";
  readonly date: `${number}-${number}`;
  readonly dateLabel: string;
  readonly role: string;
  readonly summary: string;
  readonly techStack: readonly string[];
  readonly highlights: readonly string[];
  readonly metrics: readonly ProjectMetric[];
  readonly links: readonly SocialLink[];
  readonly featured: boolean;
  /** Approved portfolio media; empty until the owner supplies visuals. */
  readonly media: readonly ProjectMedia[];
};

export type EducationItem = {
  readonly id: string;
  readonly qualification: string;
  readonly shortName: string;
  /** Institution names are not present in either supplied resume. */
  readonly institution: string | null;
  readonly period: {
    readonly startYear: number;
    readonly endYear: number;
    readonly label: string;
  };
};

export type PortfolioData = {
  readonly site: SiteConfig;
  readonly profile: Profile;
  readonly resumeSources: readonly ResumeSource[];
  readonly skillGroups: readonly SkillGroup[];
  readonly impactMetrics: readonly ImpactMetric[];
  readonly experience: readonly ExperienceItem[];
  readonly projects: readonly Project[];
  readonly education: readonly EducationItem[];
  readonly contact: {
    readonly heading: string;
    readonly body: string;
    readonly primaryAction: SocialLink;
  };
};
