import { projects } from "../../constant/data";
import Container from "../layout/Container";
import WorkExpand from "../motion/WorkExpand";
import WorkStory from "../motion/WorkStory";
import SmartLink from "../ui/SmartLink";
import ProjectArtwork from "../ui/ProjectArtwork";

export default function SelectedWork() {
  const featured = projects.filter((project) => project.featured);
  return (
    <WorkExpand>
      <Container className="flow work-shell">
        <div className="work-heading-grid">
          <p className="section-index meta">A few things I’ve built</p>
          <h2 id="work-heading">Selected work</h2>
          <p className="section-lede work-intro">Web platforms, mobile experiences, and the engineering behind them.</p>
        </div>
        <WorkStory>
          <nav className="project-index" aria-label="Selected project case studies">
            {featured.map((project, index) => <SmartLink key={project.slug} href={`/work/${project.slug}`} className="project-index-link"><span className="mono">{String(index + 1).padStart(2, "0")}</span>{project.title}<span className="project-index-track" aria-hidden="true"><span /></span></SmartLink>)}
          </nav>
          <div className="project-slides">
            {featured.map((project) => (
              <article key={project.slug} className="project-slide" aria-labelledby={`${project.slug}-title`}>
                <div className="project-slide-copy">
                  <p className="meta">{project.category} <span className="project-date">{project.date.slice(0, 4)}</span></p>
                  <h3 id={`${project.slug}-title`}><SmartLink href={`/work/${project.slug}`}>{project.title}</SmartLink></h3>
                  <p className="project-summary">{project.summary}</p>
                  <p className="project-contribution">{project.highlights[0]}</p>
                  {project.metrics.length > 0 && <ul className="project-highlights" aria-label={`${project.title} outcomes`}>{project.metrics.slice(0, 2).map(metric => <li key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></li>)}</ul>}
                  <p className="project-stack">{project.techStack.slice(0, 4).join(" / ")}</p>
                  <SmartLink className="text-link case-study-link" href={`/work/${project.slug}`} arrow ariaLabel={`Read the ${project.title} case study`}>Explore project</SmartLink>
                </div>
                <SmartLink className="project-art-link" href={`/work/${project.slug}`} ariaLabel={`Explore ${project.title}`}><ProjectArtwork project={project} /><span className="art-open" aria-hidden="true">↗</span></SmartLink>
              </article>
            ))}
          </div>
          <div className="work-stage-footer"><p>Selected work / {featured.length} projects</p><SmartLink href="/#skills" className="text-link">Continue to skills <span aria-hidden="true">↓</span></SmartLink></div>
        </WorkStory>
      </Container>
    </WorkExpand>
  );
}
