import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contact, profile, projects, site } from "../../../constant/data";
import type { Project } from "../../../types/portfolio";
import Container from "../../../components/layout/Container";
import Divider from "../../../components/ui/Divider";
import ProjectMediaFigure from "../../../components/ui/ProjectMediaFigure";
import SmartLink from "../../../components/ui/SmartLink";

type ProjectParams = {
  slug: string;
};

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
 * the owner supplies that prose; nothing here is invented. Motion stays at
 * zero on this route so reading remains primary.
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
    <main id="main-content">
      <Container className="flow">
        <nav aria-label="Breadcrumb">
          <p className="meta">
            <Link href="/">Home</Link> / <Link href="/#work">Work</Link> /{" "}
            <span aria-current="page">{project.title}</span>
          </p>
        </nav>

        <header className="flow">
          <p className="meta">
            {project.category} — {project.dateLabel}
          </p>
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
          <dl>
            <div className="item-head">
              <div>
                <dt className="meta">Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt className="meta">Status</dt>
                <dd>{project.status}</dd>
              </div>
            </div>
          </dl>
          {project.links.length > 0 ? (
            <p className="btn-row">
              {project.links.map((link) => (
                <SmartLink
                  key={link.href}
                  href={link.href}
                  external={link.external}
                  className="btn btn-secondary"
                >
                  {link.label}
                </SmartLink>
              ))}
            </p>
          ) : null}
        </header>

        {project.media.length > 0 ? (
          <section aria-label={`${project.title} media`}>
            {project.media.map((media) => (
              <ProjectMediaFigure key={media.src} media={media} />
            ))}
          </section>
        ) : null}

        <section aria-labelledby="contribution-heading">
          <h2 id="contribution-heading">Contribution</h2>
          <ul>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>

        {project.metrics.length > 0 ? (
          <section aria-labelledby="outcome-heading">
            <h2 id="outcome-heading">Outcome</h2>
            <ul className="metrics-grid">
              {project.metrics.map((metric) => (
                <li key={`${metric.value}-${metric.label}`}>
                  <span className="metric-value">{metric.value}</span>
                  <span className="metric-label">{metric.label}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="stack-heading">
          <h2 id="stack-heading">Stack</h2>
          <p className="mono stack">{project.techStack.join(", ")}</p>
        </section>

        <Divider />

        <nav aria-label="More projects">
          <ul className="link-row">
            {previous ? (
              <li>
                <Link href={`/work/${previous.slug}`}>
                  Previous: {previous.title}
                </Link>
              </li>
            ) : null}
            {next ? (
              <li>
                <Link href={`/work/${next.slug}`}>Next: {next.title}</Link>
              </li>
            ) : null}
          </ul>
        </nav>

        <section aria-labelledby="project-contact-heading" className="flow">
          <h2 id="project-contact-heading">{contact.heading}</h2>
          <p>{contact.body}</p>
          <p className="btn-row">
            <SmartLink
              href={contact.primaryAction.href}
              external={contact.primaryAction.external}
              className="btn btn-primary"
            >
              {contact.primaryAction.label}: {profile.email}
            </SmartLink>
            <Link href="/#contact" className="btn btn-secondary">
              Contact details
            </Link>
          </p>
          <p>
            <Link href="/#work">Back to work</Link>
          </p>
        </section>
      </Container>
    </main>
  );
}
