import type {
  PortfolioData,
  Project,
  ProjectMedia,
  SocialLink,
} from "../types/portfolio";

export type { PortfolioData } from "../types/portfolio";

/** Project screenshots served from ImageKit. Single source of truth for every `<Image>` in the site. */
export const projectImages = {
  eucareerserwis: "https://ik.imagekit.io/eucareerserwis/Portfolio/eucareerserwis.png",
  eucrm: "https://ik.imagekit.io/eucareerserwis/Portfolio/eucrm.png",
  euprimeserwis: "https://ik.imagekit.io/eucareerserwis/Portfolio/euprimeserwis.png",
  euworksupport: "https://ik.imagekit.io/eucareerserwis/Portfolio/euworksupport.png",
  hackathonwallah: "https://ik.imagekit.io/eucareerserwis/Portfolio/hackathonwallah.png",
  invoice: "https://ik.imagekit.io/eucareerserwis/Portfolio/invoice.png",
  learnifi: "https://ik.imagekit.io/eucareerserwis/Portfolio/learnifi.png",
} as const;

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
 * Canonical portfolio content from the supplied resumes and owner-authorized
 * local project review. DHH and MJ were checked against their READMEs,
 * package manifests, feature screens, and data/backend implementations on
 * 2026-10-12. Keep facts here instead of duplicating them inside components.
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
      { label: "Skills", href: "#skills" },
      { label: "Experience", href: "#experience" },
      { label: "Education", href: "#education" },
      { label: "Contact", href: "#contact" },
    ],
  },

  profile: {
    firstName: "Pawan",
    lastName: "Kumar",
    fullName: "Pawan Kumar",
    initials: "PK",
    roles: ["Software Engineer", "Full-stack Developer", "Mobile Developer"],
    headline: "I build dependable products for web and mobile.",
    shortBio:
      "Software development engineer experienced in full-stack platforms, cross-platform mobile applications, real-time call operations, performance optimization, SEO, and production deployment.",
    heroDescription:
      "From the first interaction to the systems behind it. Full-stack platforms, mobile applications, and the details that make them work better.",
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
      items: ["Next.js", "React", "React Native", "Expo", "Tailwind CSS"],
    },
    {
      id: "backend-realtime",
      label: "Backend and real-time systems",
      items: ["Node.js", "Express", "Laravel", "Redis", "Twilio", "Pusher"],
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
      items: ["Clerk", "OneSignal", "Brevo", "Stripe", "Cloudinary", "Resend"],
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
      slug: "dhh-health-fitness",
      title: "DHH Health & Fitness",
      category: "Mobile application",
      status: "In development",
      date: "2026-10",
      dateLabel: "2026 · Ongoing",
      role: "Mobile developer · Personal project",
      summary:
        "A personal health and fitness journal for iOS and Android, bringing food, workouts, water, and weight into one daily view.",
      techStack: [
        "React Native", "Expo", "TypeScript", "SQLite", "Supabase", "Clerk",
        "NativeWind", "Reanimated", "Expo Widgets", "OpenRouter",
      ],
      highlights: [
        "Built an offline journal with local SQLite storage and queued changes that sync to Supabase when connectivity returns.",
        "Connected food search, barcode lookups, flexible portions, reusable meals, and calorie and macro tracking in one food diary.",
        "Created strength and cardio logging with reusable routines, set history, rest timers, and resumable workout sessions.",
        "Added water and weight tracking, optional goals, progress charts, configurable reminders, and home-screen widgets.",
        "Implemented CSV export, passphrase-protected backup and restore, and in-app journal and account deletion.",
        "Added a meal-photo flow that produces editable AI estimates for review before any food is added to the journal.",
      ],
      metrics: [],
      links: [],
      featured: true,
      media: [],
      artwork: {
        icon: {
          src: "/images/project/dhh-icon.png",
          width: 1024,
          height: 1024,
          alt: "DHH Health & Fitness app icon",
        },
        tagline: "Food, movement, and daily habits.",
      },
      caseStudy: {
        context:
          "DHH brings everyday health logging into a single journal. The Today dashboard combines meals, movement, hydration, and weight, while reusable meals and workout routines reduce the effort of recording a familiar day.",
        constraints: [
          "Everyday entries need to remain usable offline after sign-in and setup. Online food search and new barcode lookups still require a connection.",
          "Nutrition sources can be incomplete. Missing values remain distinct from zero, and progress averages use recorded days rather than treating unlogged days as results.",
          "Goals, reminders, units, and the visibility of weight tracking need to adapt to the person using the journal.",
        ],
        implementation: [
          "SQLite stores the journal on the device. An outbox queues mutations for Supabase; the sync engine pushes changes in batches, pulls revision pages, retries network failures with backoff, and keeps rejected changes available for retry.",
          "Typed domain logic handles portions, nutrition, units, energy balance, and progress. Feature screens connect that model to meal logging, strength sessions, cardio, water, and weigh-ins.",
          "Clerk handles account identity. Export and restore use CSV and encrypted archives with a passphrase-derived key. Widgets and quick actions provide shortcuts into daily logging.",
          "A Supabase Edge Function sends meal photos to OpenRouter and returns a draft of foods, portions, and estimated nutrition. The app lets the person edit, remove, or match each item to a catalog food before saving.",
        ],
        outcome:
          "The daily journal, workout flows, sync engine, progress views, widgets, and data-management features are implemented, with tests for domain logic and sync scenarios. The app remains in development, with store-release preparation still underway.",
      },
    },
    {
      slug: "mj-movie-journal",
      title: "MJ — Movie Journal",
      category: "Mobile application",
      status: "In development",
      date: "2026-10",
      dateLabel: "2026 · Ongoing",
      role: "Mobile developer · Personal project",
      summary:
        "A personal movie journal for iOS and Android to discover films, plan movie nights, and preserve the memories of every viewing.",
      techStack: [
        "React Native", "Expo", "TypeScript", "Convex", "Better Auth", "TMDB",
        "Cloudflare R2", "RevenueCat", "Expo Widgets", "Reanimated",
      ],
      highlights: [
        "Built a viewing-based journal where every rewatch keeps its own rating, notes, companions, photos, and ticket stubs.",
        "Connected TMDB discovery, watchlists, custom and automatic collections, and rules-based Watch Tonight recommendations with reasons for each pick.",
        "Implemented real-time movie-night plans, friend invitations, nominations, voting, and marathon schedules with Convex.",
        "Added private-by-default sharing controls and spoiler-safe notes that unlock after the viewer logs the film.",
        "Created On this day memories, movie capsules, recaps, taste insights, import and export, and iPhone widgets.",
      ],
      metrics: [],
      links: [],
      featured: true,
      media: [],
      artwork: {
        icon: {
          src: "/images/project/mj-icon.png",
          width: 1024,
          height: 1024,
          alt: "MJ Movie Journal app icon",
        },
        tagline: "Plan. Watch. Remember.",
      },
      caseStudy: {
        context:
          "MJ treats a movie and a viewing as different things. A film can be watched many times, with different people and different reactions. Each journal entry preserves that occasion, connecting discovery and planning to a personal history of movie nights.",
        constraints: [
          "A rewatch must add a new memory rather than overwrite an earlier viewing. Ratings, dates, notes, and companions belong to each journal entry.",
          "Sharing needs explicit privacy controls. Friends can only see the categories shared with them, and written reactions stay hidden until they have logged the movie themselves.",
          "Recommendations need understandable reasons. Watch Tonight uses journal history, available time, mood, and exclusions through rules rather than an AI model.",
        ],
        implementation: [
          "Expo Router organizes the React Native app. Convex stores journal entries, movie snapshots, watchlists, collections, friendships, and plans, with server functions and real-time updates for group coordination.",
          "TMDB supplies movie discovery and metadata. Better Auth handles sign-in, Cloudflare R2 holds private photos, and RevenueCat supports the subscription integration.",
          "The backend separates viewing records from movie state and enforces ownership and friendship checks. Memories, capsules, recaps, and taste profiles build on that journal, while calendar integration and iPhone widgets bring upcoming plans outside the app.",
        ],
        outcome:
          "The repository implements the core journal and planning loop alongside memories, social coordination, insights, and data portability, with backend tests for these features. MJ is in active development and is not yet released on the App Store or Google Play.",
      },
    },
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
      media: [
        {
          type: "image",
          src: projectImages.eucareerserwis,
          width: 3208,
          height: 1912,
          alt: "EU Career Serwis homepage screenshot",
        },
      ],
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
          platform: "android",
        },
        {
          label: "View on the App Store",
          href: "https://apps.apple.com/app/eu-work-support/id6802320607",
          kind: "store",
          external: true,
          platform: "ios",
        },
      ],
      featured: true,
      media: [
        {
          type: "image",
          src: projectImages.euworksupport,
          width: 3272,
          height: 1916,
          alt: "EU Work Support app preview",
        },
      ],
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
      media: [
        {
          type: "image",
          src: projectImages.learnifi,
          width: 3420,
          height: 1918,
          alt: "LearniFi platform screenshot",
        },
      ],
    },
    {
      slug: "eu-prime-serwis",
      title: "EU Prime Serwis",
      category: "Full-stack web",
      status: "Live",
      date: "2025-07",
      dateLabel: "Jul 2025 - Dec 2025",
      role: "Freelance Software Development Engineer",
      summary:
        "A full-stack immigration and employment platform connecting candidates with legal work opportunities across Europe.",
      techStack: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Strapi CMS",
        "Bigin CRM",
      ],
      highlights: [
        "Built and deployed the platform for candidates seeking legal employment across Europe.",
        "Connected Strapi CMS and Bigin CRM to scale content and automate lead capture.",
        "Implemented SSR, structured data, and keyword optimization for organic discovery.",
        "Shipped a fully responsive mobile experience with Next.js and Tailwind CSS.",
      ],
      metrics: [],
      links: [
        {
          label: "Visit EU Prime Serwis",
          href: "https://euprimeserwis.pl",
          kind: "live",
          external: true,
        },
      ],
      featured: true,
      media: [
        {
          type: "image",
          src: projectImages.euprimeserwis,
          width: 2972,
          height: 1920,
          alt: "EU Prime Serwis homepage screenshot",
        },
      ],
    },
    {
      slug: "crm-lead-management",
      title: "CRM - Lead Management",
      category: "Full-stack web",
      status: "Live",
      date: "2026-01",
      dateLabel: "2026",
      role: "Full-stack Developer",
      summary:
        "A private CRM for lead management with team workspaces, role-based access, and reusable email templates for outreach.",
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Supabase",
        "Resend",
      ],
      highlights: [
        "Connected a Google Workspace mailbox in one click for outbound mail.",
        "Created teams and assigned a workspace email to each team member for sending mail to leads.",
        "Separated admin and team access so each role sees only what it needs.",
        "Added an editor for email templates the team reuses for outreach.",
      ],
      metrics: [],
      links: [],
      featured: true,
      media: [
        {
          type: "image",
          src: projectImages.eucrm,
          width: 3420,
          height: 1914,
          alt: "CRM lead management dashboard screenshot",
        },
      ],
    },
    {
      slug: "invoice-generator",
      title: "Invoice Generator",
      category: "Full-stack web",
      status: "Live",
      date: "2026-01",
      dateLabel: "2026",
      role: "Full-stack Developer",
      summary:
        "A private invoicing website that turns selected products, tax, and VAT into a signed, company-branded PDF invoice.",
      techStack: [
        "Next.js",
        "Supabase",
        "Tailwind CSS",
        "jspdf-autotable",
      ],
      highlights: [
        "Added a product dropdown so invoice line items are selected, not typed.",
        "Computed tax and VAT automatically on every invoice.",
        "Generated a company-signed, print-ready PDF invoice with jspdf-autotable.",
      ],
      metrics: [],
      links: [],
      featured: true,
      media: [
        {
          type: "image",
          src: projectImages.invoice,
          width: 3400,
          height: 1914,
          alt: "Invoice generator invoice preview",
        },
      ],
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

/**
 * Landing-page rotating fan. Each card links to its case study. Decorative
 * images (alt stays empty; the link label carries identity). `hackathonwallah`
 * is intentionally excluded until it gets a project page, so every visible
 * card has a destination.
 */
export const heroCarouselImages = [
  { src: projectImages.eucareerserwis, alt: "", width: 3208, height: 1912, href: "/work/eu-career-serwis", title: "EU Career Serwis" },
  { src: projectImages.eucrm, alt: "", width: 3420, height: 1914, href: "/work/crm-lead-management", title: "CRM - Lead Management" },
  { src: projectImages.euprimeserwis, alt: "", width: 2972, height: 1920, href: "/work/eu-prime-serwis", title: "EU Prime Serwis" },
  { src: projectImages.euworksupport, alt: "", width: 3272, height: 1916, href: "/work/eu-work-support", title: "EU Work Support" },
  { src: projectImages.invoice, alt: "", width: 3400, height: 1914, href: "/work/invoice-generator", title: "Invoice Generator" },
  { src: projectImages.learnifi, alt: "", width: 3420, height: 1918, href: "/work/learnifi", title: "LearniFi" },
];
