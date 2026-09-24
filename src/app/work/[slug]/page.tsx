import PageTransition from "../../../components/motion/PageTransition";
import ProjectSectionReveal from "../../../components/motion/ProjectSectionReveal";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contact, profile, projects, site } from "../../../constant/data";
import type { Project } from "../../../types/portfolio";
import Container from "../../../components/layout/Container";
import { ArrowIcon, PlatformIcon } from "../../../components/ui/Icons";
import ProjectMediaFigure from "../../../components/ui/ProjectMediaFigure";
import ProjectArtwork from "../../../components/ui/ProjectArtwork";
import SmartLink from "../../../components/ui/SmartLink";

type ProjectParams = {
  slug: string;
};

/** Stagger slot for the CSS page-load entrance (see `.intro` in globals.css). */
const step = (index: number) => ({ "--i": index }) as CSSProperties;

const pad = (value: number) => String(value).padStart(2, "0");

const countLabel = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

/** Label column shared by every case-study section, so all lists align. */
function SectionHead({
  id,
  title,
  meta,
}: {
  readonly id: string;
  readonly title: string;
  readonly meta: string;
}) {
  return (
    <div className="case-section-head">
      <h2 id={id}>{title}</h2>
      <p className="case-section-meta">{meta}</p>
    </div>
  );
}

export async function generateStaticParams(): Promise<ProjectParams[]> {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<ProjectParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return { title: `Project not found — ${profile.fullName}` };
  }

  const title = `${project.title} — ${profile.fullName}`;
  const url = `/work/${project.slug}`;
  return {
    title,
    description: project.summary,
    alternates: site.url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description: project.summary,
      type: "article",
      ...(site.url ? { url } : {}),
    },
    twitter: {
      card: "summary",
      title,
      description: project.summary,
    },
  };
}

/**
 * Launch-quality case study rendered entirely from the typed model.
 * Context, constraints, approach, and reflection sections stay omitted until
 * the owner supplies that prose; nothing here is invented. Motion stays
 * quiet so reading remains primary: a CSS entrance on load, then each
 * section's items rise in as it arrives.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<ProjectParams>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  // Annotate with the canonical type: the as-const data narrows the still-
  // empty media tuples to `never`, which would make the gallery below
  // unrepresentable the moment real media arrives.
  const project: Project | undefined =
    index >= 0 ? projects[index] : undefined;

  if (!project) {
    notFound();
  }

  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;

  return (
    <PageTransition>
      <main id="main-content" className="project-page">
        <Container className="project-shell">
          <nav aria-label="Breadcrumb" className="breadcrumbs intro" style={step(0)}>
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/#work">Work</Link>
              </li>
              <li>
                <span aria-current="page">{project.title}</span>
              </li>
            </ol>
          </nav>

          <header className="project-hero">
            <p className="eyebrow intro" style={step(1)}>
              {project.category}
            </p>
            <h1 className="intro" style={step(2)}>
              {project.title}
            </h1>
            <p className="lede intro" style={step(3)}>
              {project.summary}
            </p>
            <dl className="project-facts intro" style={step(4)}>
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd className="tnum">{project.dateLabel}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className="status-dot" aria-hidden="true" />
                  {project.status}
                </dd>
              </div>
            </dl>
            {project.links.length > 0 ? (
              <p className="btn-row intro" style={step(5)}>
                {project.links.map((link, linkIndex) => (
                  <SmartLink
                    key={link.href}
                    href={link.href}
                    external={link.external}
                    className={linkIndex === 0 ? "btn btn-primary" : "btn btn-secondary"}
                    arrow
                    icon={link.platform ? <PlatformIcon platform={link.platform} /> : undefined}
                  >
                    {link.label}
                  </SmartLink>
                ))}
              </p>
            ) : null}
          </header>

          {project.media.length === 0 && <ProjectArtwork project={project} />}
          {project.media.length > 0 ? (
            <section
              aria-label={`${project.title} media`}
              className="project-media intro"
              style={step(6)}
            >
              {project.media.map((media) => (
                <ProjectMediaFigure key={media.src} media={media} />
              ))}
            </section>
          ) : null}

          <ProjectSectionReveal labelledBy="contribution-heading">
            <SectionHead
              id="contribution-heading"
              title="Contribution"
              meta={countLabel(project.highlights.length, "highlight", "highlights")}
            />
            <ol className="contribution-list" role="list">
              {project.highlights.map((highlight, itemIndex) => (
                <li key={highlight}>
                  <span className="case-index" aria-hidden="true">
                    {pad(itemIndex + 1)}
                  </span>
                  <p>{highlight}</p>
                </li>
              ))}
            </ol>
          </ProjectSectionReveal>

          {project.metrics.length > 0 ? (
            <ProjectSectionReveal labelledBy="outcome-heading">
              <SectionHead
                id="outcome-heading"
                title="Outcome"
                meta={countLabel(project.metrics.length, "result", "results")}
              />
              <ul className="outcome-grid" role="list">
                {project.metrics.map((metric) => (
                  <li key={`${metric.value}-${metric.label}`} className="outcome-card">
                    <strong className="outcome-value">{metric.value}</strong>{" "}
                    <span className="outcome-label">{metric.label}</span>
                  </li>
                ))}
              </ul>
            </ProjectSectionReveal>
          ) : null}

          <ProjectSectionReveal labelledBy="stack-heading">
            <SectionHead
              id="stack-heading"
              title="Stack"
              meta={countLabel(project.techStack.length, "technology", "technologies")}
            />
            <ul className="stack-grid" role="list">
              {project.techStack.map((technology, itemIndex) => (
                <li key={technology}>
                  <span className="case-index" aria-hidden="true">
                    {pad(itemIndex + 1)}
                  </span>
                  {technology}
                </li>
              ))}
            </ul>
          </ProjectSectionReveal>

          <section
            className="project-cta"
            aria-labelledby="project-contact-heading"
            data-header-theme="dark"
          >
            <h2 id="project-contact-heading">{contact.heading}</h2>
            <p className="btn-row">
              <SmartLink
                href={contact.primaryAction.href}
                external={contact.primaryAction.external}
                className="btn btn-primary"
                arrow
              >
                Say hello
              </SmartLink>
            </p>
          </section>

          {previous || next ? (
            <nav aria-label="More projects" className="project-nav">
              <ul>
                {previous ? (
                  <li data-dir="previous">
                    <Link href={`/work/${previous.slug}`} className="project-nav-card">
                      <span className="project-nav-label">
                        <ArrowIcon direction="left" />
                        Previous project
                      </span>
                      <span className="project-nav-title">{previous.title}</span>
                    </Link>
                  </li>
                ) : null}
                {next ? (
                  <li data-dir="next">
                    <Link href={`/work/${next.slug}`} className="project-nav-card">
                      <span className="project-nav-label">
                        Next project
                        <ArrowIcon direction="right" />
                      </span>
                      <span className="project-nav-title">{next.title}</span>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>
          ) : null}
        </Container>
      </main>
    </PageTransition>
  );
}
