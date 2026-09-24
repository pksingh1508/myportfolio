import PageTransition from "../../../components/motion/PageTransition";
import ProjectSectionReveal from "../../../components/motion/ProjectSectionReveal";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contact, profile, projects, site } from "../../../constant/data";
import type { Project } from "../../../types/portfolio";
import Container from "../../../components/layout/Container";
import { ArrowIcon } from "../../../components/ui/Icons";
import ProjectMediaFigure from "../../../components/ui/ProjectMediaFigure";
import ProjectArtwork from "../../../components/ui/ProjectArtwork";
import SmartLink from "../../../components/ui/SmartLink";

type ProjectParams = {
  slug: string;
};

/** Stagger slot for the CSS page-load entrance (see `.intro` in globals.css). */
const step = (index: number) => ({ "--i": index }) as CSSProperties;

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
 * quiet so reading remains primary: a CSS entrance on load and the tree
 * reveals as each section arrives.
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
            <h2 id="contribution-heading">Contribution</h2>
            <ul className="project-detail-list" role="list">
              {project.highlights.map((highlight) => (
                <li key={highlight}>
                  <span className="project-detail-branch" aria-hidden="true" />
                  <span className="project-detail-copy">{highlight}</span>
                </li>
              ))}
            </ul>
          </ProjectSectionReveal>

          {project.metrics.length > 0 ? (
            <ProjectSectionReveal labelledBy="outcome-heading">
              <h2 id="outcome-heading">Outcome</h2>
              <ul className="project-detail-list" role="list">
                {project.metrics.map((metric) => (
                  <li key={`${metric.value}-${metric.label}`}>
                    <span className="project-detail-branch" aria-hidden="true" />
                    <span className="project-detail-copy">
                      <strong>{metric.value}</strong> {metric.label}
                    </span>
                  </li>
                ))}
              </ul>
            </ProjectSectionReveal>
          ) : null}

          <ProjectSectionReveal labelledBy="stack-heading">
            <h2 id="stack-heading">Stack</h2>
            <ul className="project-detail-list" role="list">
              {project.techStack.map((technology) => (
                <li key={technology}>
                  <span className="project-detail-branch" aria-hidden="true" />
                  <span className="project-detail-copy">{technology}</span>
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
