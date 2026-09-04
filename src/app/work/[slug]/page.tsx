import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contact, portfolioData, profile, projects } from "../../../constant/data";

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

  return {
    title: `${project.title} — ${profile.fullName}`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<ProjectParams>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  const project = index >= 0 ? projects[index] : undefined;

  if (!project) {
    notFound();
  }

  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;

  return (
    <main id="main-content">
    <article>
      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/#work">Work</Link> /{" "}
        <span aria-current="page">{project.title}</span>
      </nav>

      <header>
        <p>
          {project.category} — {project.dateLabel}
        </p>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <dl>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
        </dl>
      </header>

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
          <dl>
            {project.metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section aria-labelledby="stack-heading">
        <h2 id="stack-heading">Stack</h2>
        <ul>
          {project.techStack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {project.links.length > 0 ? (
        <section aria-labelledby="links-heading">
          <h2 id="links-heading">Links</h2>
          <ul>
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav aria-label="More projects">
        <ul>
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

      <footer>
        <h2>{contact.heading}</h2>
        <p>{contact.body}</p>
        <p>
          <a href={contact.primaryAction.href}>
            {contact.primaryAction.label}: {profile.email}
          </a>{" "}
          / <Link href="/#contact">Contact details</Link> /{" "}
          <Link href={portfolioData.site.navigation[0].href}>Back to work</Link>
        </p>
      </footer>
    </article>
    </main>
  );
}
