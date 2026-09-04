import type {
  PortfolioData,
  Project,
  ProjectMedia,
  SocialLink,
} from "../types/portfolio";

export type { PortfolioData } from "../types/portfolio";

const contactLinks = {
  email: {
    label: "Email",
    href: "mailto:pawankumarlearner@gmail.com",
    kind: "email",
    external: false,
  },
  phone: {
    label: "Call",
    href: "tel:+917275996676",
    kind: "phone",
    external: false,
  },
  linkedIn: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pawan-kumar-731ab3239/",
    kind: "social",
    external: true,
  },
  github: {
    label: "GitHub",
    href: "https://github.com/pksingh1508",
    kind: "social",
    external: true,
  },
} as const satisfies Record<string, SocialLink>;

/**
 * Canonical portfolio content extracted from the two resumes supplied at the
 * repository root. Keep professional facts here instead of duplicating them
 * inside components.
 *
 * Deliberately omitted: the LearniFi test password printed in the resume. Login
 * credentials do not belong in a client-delivered portfolio bundle.
 *
 * `location`, `availability`, education institutions, and project media remain
 * empty until the owner supplies those details.
 */
export const portfolioData = {
  site: {
    title: "Pawan Kumar - Software Development Engineer",
    description:
      "Portfolio of Pawan Kumar, a software development engineer building full-stack web platforms and cross-platform mobile applications.",
    // Production domain unknown (Step 0/14 decision). Absolute-URL metadata
    // activates the moment this is set; nothing guesses it before then.
    url: null,
    navigation: [
      { label: "Work", href: "#work" },
      { label: "Experience", href: "#experience" },
      { label: "Skills", href: "#skills" },
      { label: "Education", href: "#education" },
      { label: "Contact", href: "#contact" },
    ],
  },

  profile: {
    firstName: "Pawan",
    lastName: "Kumar",
    fullName: "Pawan Kumar",
    initials: "PK",
    roles: [
      "Software Development Engineer",
      "Full-stack Developer",
      "Mobile Developer",
    ],
    headline: "I build dependable products for web and mobile.",
    shortBio:
      "Software development engineer experienced in full-stack platforms, cross-platform mobile applications, real-time call operations, performance optimization, SEO, and production deployment.",
    email: "pawankumarlearner@gmail.com",
    phone: {
      display: "+91 72759 96676",
      href: "tel:+917275996676",
    },
    // Neither resume includes a location or an explicit availability statement.
    location: null,
    availability: null,
    links: [
      contactLinks.email,
      contactLinks.phone,
      contactLinks.linkedIn,
      contactLinks.github,
    ],
  },

  // These identify the source documents only. Move approved copies into
  // `public/resume/` before exposing a resume download link in the UI.
  resumeSources: [
    {
      label: "Full-stack resume",
      fileName: "pawankumar_resume.pdf",
      focus: "Full-stack",
    },
    {
      label: "Mobile developer resume",
      fileName: "Pawan Kumar (Mobile Developer).pdf",
      focus: "Mobile",
    },
  ],

  skillGroups: [
    {
      id: "languages",
      label: "Languages",
      items: ["TypeScript", "JavaScript", "C++", "PHP"],
    },
    {
      id: "frontend-mobile",
      label: "Frontend and mobile",
      items: [
        "Next.js",
        "React",
        "React Native",
        "Expo",
        "Tailwind CSS",
      ],
    },
    {
      id: "backend-realtime",
      label: "Backend and real-time systems",
      items: [
        "Node.js",
        "Express",
        "Laravel",
        "Redis",
        "Twilio",
        "Pusher",
      ],
    },
    {
      id: "data-content",
      label: "Data and content",
      items: [
        "Supabase",
        "SQL",
        "MongoDB",
        "PostgreSQL",
        "Strapi CMS",
        "Bigin CRM",
      ],
    },
    {
      id: "product-services",
      label: "Product services",
      items: ["Clerk", "OneSignal", "Brevo", "Stripe", "Cloudinary"],
    },
    {
      id: "tools-cloud",
      label: "Tools and cloud",
      items: [
        "GitHub",
        "VS Code",
        "Docker",
        "AWS (basic)",
        "OpenCode",
        "Codex CLI",
        "Claude Code",
        "SuperConductor",
        "AI-assisted development",
        "Terminal-based development",
      ],
    },
  ],

  impactMetrics: [
    {
      value: "20%",
      label: "call workflow efficiency improvement",
      context: "Recovery Law Group call operations",
      relatedSlug: null,
    },
    {
      value: "1,000+",
      label: "monthly visitors served",
      context: "EU Career Serwis",
      relatedSlug: "eu-career-serwis",
    },
    {
      value: "10+",
      label: "European countries supported",
      context: "EU Career Serwis",
      relatedSlug: "eu-career-serwis",
    },
    {
      value: "60%",
      label: "lead management efficiency improvement",
      context: "EU Career Serwis",
      relatedSlug: "eu-career-serwis",
    },
    {
      value: "45%",
      label: "organic traffic increase in two months",
      context: "EU Career Serwis",
      relatedSlug: "eu-career-serwis",
    },
    {
      value: "95+",
      label: "Lighthouse performance score",
      context: "EU Career Serwis",
      relatedSlug: "eu-career-serwis",
    },
  ],

  experience: [
    {
      id: "recovery-law-group",
      company: "Recovery Law Group",
      role: "Software Development Engineer - Call Operations",
      engagementType: "Employment",
      workplace: "Remote",
      period: {
        start: "2026-01",
        end: null,
        label: "Jan 2026 - Present",
      },
      techStack: ["Laravel", "PHP", "SQL", "Redis", "Twilio", "Pusher"],
      highlights: [
        "Managed and optimized Twilio-based call operations, improving call workflow efficiency by 20% through bug fixes, process automation, and backend improvements.",
        "Enhanced internal dashboard performance with Laravel, PHP, SQL, and Redis, reducing loading delays for call-related operational tasks.",
        "Improved platform search by optimizing SQL queries and backend logic for leads, call records, and user data.",
        "Fixed production bugs and improved real-time operational features with Pusher and Twilio, increasing stability and reducing manual work.",
      ],
      relatedProjectSlug: null,
    },
    {
      id: "eu-career-serwis",
      company: "EU Career Serwis",
      role: "Software Development Engineer",
      engagementType: "Freelance",
      workplace: "Remote",
      period: {
        start: "2025-07",
        end: "2025-12",
        label: "Jul 2025 - Dec 2025",
      },
      techStack: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Strapi CMS",
        "Bigin CRM",
      ],
      highlights: [
        "Built and deployed a full-stack job placement platform serving 1,000+ monthly visitors across 10+ European countries.",
        "Integrated Strapi CMS and automated form submissions through Bigin CRM, improving lead management efficiency by 60%.",
        "Implemented SSR, structured data, and keyword optimization, increasing organic traffic by 45% within two months.",
        "Achieved a 95+ Lighthouse performance score and a fully responsive mobile experience with Next.js and Tailwind CSS.",
      ],
      relatedProjectSlug: "eu-career-serwis",
    },
  ],

  projects: [
    {
      slug: "eu-career-serwis",
      title: "EU Career Serwis",
      category: "Full-stack web",
      status: "Live",
      date: "2025-07",
      dateLabel: "Jul 2025 - Dec 2025",
      role: "Freelance Software Development Engineer",
      summary:
        "A full-stack immigration and employment platform connecting candidates with legal non-skilled jobs across Europe.",
      techStack: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Strapi CMS",
        "Bigin CRM",
      ],
      highlights: [
        "Built and deployed the platform for more than 1,000 monthly visitors across more than 10 European countries.",
        "Connected Strapi CMS and Bigin CRM to scale content and automate lead capture.",
        "Implemented SSR, structured data, and keyword optimization for organic discovery.",
        "Optimized the responsive interface to achieve a 95+ Lighthouse performance score.",
      ],
      metrics: [
        { value: "1,000+", label: "monthly visitors" },
        { value: "10+", label: "European countries" },
        { value: "60%", label: "more efficient lead management" },
        { value: "45%", label: "organic traffic growth in two months" },
        { value: "95+", label: "Lighthouse performance score" },
      ],
      links: [
        {
          label: "Visit EU Career Serwis",
          href: "http://www.eucareerserwis.pl",
          kind: "live",
          external: true,
        },
      ],
      featured: true,
      media: [],
    },
    {
      slug: "eu-work-support",
      title: "EU Work Support",
      category: "Mobile application",
      status: "Live",
      date: "2026-06",
      dateLabel: "Jun 2026",
      role: "Mobile Application Developer",
      summary:
        "A cross-platform mobile application that gives users paid access to premium European work-document content.",
      techStack: [
        "Expo",
        "React Native",
        "Clerk",
        "Supabase",
        "OneSignal",
        "Brevo",
        "Stripe",
      ],
      highlights: [
        "Built a cross-platform application for EU Work Support.",
        "Designed the purchase and premium-content access flow for European country documentation.",
        "Owned end-to-end application development and Google Play deployment.",
      ],
      metrics: [],
      links: [
        {
          label: "View on Google Play",
          href: "https://play.google.com/store/apps/details?id=com.euworksupport.app",
          kind: "store",
          external: true,
        },
      ],
      featured: true,
      media: [],
    },
    {
      slug: "learnifi",
      title: "LearniFi",
      category: "EdTech platform",
      status: "Live",
      date: "2024-01",
      dateLabel: "Jan 2024",
      role: "Team Lead and Full-stack Developer",
      summary:
        "An EdTech platform where students can purchase and consume courses while instructors can publish and sell them.",
      techStack: [
        "React",
        "Node.js",
        "Tailwind CSS",
        "MongoDB",
        "Express",
        "Cloudinary",
      ],
      highlights: [
        "Led a team of four while building the platform for students and instructors.",
        "Designed the course purchasing, consumption, publishing, and selling workflows.",
        "Contributed backend improvements that reduced response time by 100ms and made future changes more flexible.",
      ],
      metrics: [
        { value: "4", label: "team members led" },
        { value: "100ms", label: "backend response-time reduction" },
      ],
      links: [
        {
          label: "Visit LearniFi",
          href: "https://learnifi-seven.vercel.app/",
          kind: "live",
          external: true,
        },
        {
          label: "View LearniFi source",
          href: "https://github.com/pksingh1508/LearniFi",
          kind: "source",
          external: true,
        },
      ],
      featured: true,
      media: [],
    },
  ],

  education: [
    {
      id: "mca",
      qualification: "Master of Computer Applications",
      shortName: "MCA",
      institution: null,
      period: {
        startYear: 2024,
        endYear: 2026,
        label: "2024 - 2026",
      },
    },
    {
      id: "bca",
      qualification: "Bachelor of Computer Applications",
      shortName: "BCA",
      institution: null,
      period: {
        startYear: 2021,
        endYear: 2024,
        label: "2021 - 2024",
      },
    },
    {
      id: "intermediate",
      qualification: "Intermediate",
      shortName: "XII",
      institution: null,
      period: {
        startYear: 2019,
        endYear: 2021,
        label: "2019 - 2021",
      },
    },
    {
      id: "high-school",
      qualification: "High School",
      shortName: "X",
      institution: null,
      period: {
        startYear: 2017,
        endYear: 2019,
        label: "2017 - 2019",
      },
    },
  ],

  contact: {
    heading: "Have a product worth building? Let's talk.",
    body: "Reach out to discuss full-stack web platforms, mobile applications, and software engineering opportunities.",
    primaryAction: contactLinks.email,
  },
} as const satisfies PortfolioData;

export const {
  site,
  profile,
  resumeSources,
  skillGroups,
  impactMetrics,
  experience,
  projects,
  education,
  contact,
} = portfolioData;

/**
 * Step 2 content guards. These run at module scope so every consumer —
 * homepage, case-study routes, metadata — fails loudly on bad data instead
 * of shipping a broken route. The static `media: []` arrays pass today;
 * each future record must carry dimensions plus alt text (or an explicit
 * decorative flag) and video must carry a poster.
 */
function assertUniqueProjectSlugs(items: readonly Project[]): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (item.slug.length === 0) {
      throw new Error("portfolioData: project with an empty slug.");
    }
    if (seen.has(item.slug)) {
      throw new Error(`portfolioData: duplicate project slug "${item.slug}".`);
    }
    seen.add(item.slug);
  }
}

function assertAccessibleProjectMedia(items: readonly Project[]): void {
  for (const item of items) {
    const media: readonly ProjectMedia[] = item.media;
    for (const record of media) {
      if (record.width <= 0 || record.height <= 0) {
        throw new Error(
          `portfolioData: "${item.slug}" media "${record.src}" needs positive intrinsic dimensions.`,
        );
      }
      if (!record.decorative && record.alt.length === 0) {
        throw new Error(
          `portfolioData: "${item.slug}" media "${record.src}" needs meaningful alt text or an explicit decorative flag.`,
        );
      }
      if (record.type === "video" && record.poster.length === 0) {
        throw new Error(
          `portfolioData: "${item.slug}" video "${record.src}" needs a poster.`,
        );
      }
    }
  }
}

assertUniqueProjectSlugs(projects);
assertAccessibleProjectMedia(projects);
