import { notFound } from "next/navigation";
import ProjectModal from "../../../../components/motion/ProjectModal";
import ProjectSheet, { sheetTitleId } from "../../../../components/sections/ProjectSheet";
import { profile, projects } from "../../../../constant/data";
import type { Project } from "../../../../types/portfolio";

type ProjectParams = {
  slug: string;
};

export async function generateStaticParams(): Promise<ProjectParams[]> {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

/**
 * Intercepted `/work/[slug]`: a client navigation from the homepage opens
 * the project in a modal over the page instead of leaving it. A direct
 * visit, a refresh, or a no-JS click still renders the full case-study
 * page at `src/app/work/[slug]`.
 */
export default async function ProjectModalPage({
  params,
}: {
  params: Promise<ProjectParams>;
}) {
  const { slug } = await params;
  const project: Project | undefined = projects.find((item) => item.slug === slug);
  if (!project) {
    notFound();
  }
  return (
    <ProjectModal
      slug={project.slug}
      title={`${project.title} — ${profile.fullName}`}
      labelledBy={sheetTitleId(project.slug)}
    >
      <ProjectSheet project={project} />
    </ProjectModal>
  );
}
