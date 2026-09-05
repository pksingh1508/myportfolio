import type { Project } from "../../types/portfolio";

/** Original abstract editorial covers; these are not product screenshots. */
export default function ProjectArtwork({ project }: { readonly project: Project }) {
  return (
    <div className={`project-art art-${project.slug}`} aria-hidden="true">
      <div className="art-top"><span>{project.category}</span><span>{project.date.slice(0, 4)}</span></div>
      <div className="art-object">
        {project.slug === "eu-career-serwis" ? (
          <div className="art-pathways"><i /><i /><i /><i /><i /><i /><span>EU</span></div>
        ) : project.slug === "eu-work-support" ? (
          <div className="art-documents"><i /><i /><i /><span>EU<br />Work<br />Support<span className="art-document-line" /></span></div>
        ) : (
          <div className="art-pages"><i /><i /><i /><i /><i /><i /></div>
        )}
      </div>
      <div className="art-bottom"><strong>{project.title}</strong><span>{project.techStack.slice(0, 2).join(" / ")}</span></div>
    </div>
  );
}
