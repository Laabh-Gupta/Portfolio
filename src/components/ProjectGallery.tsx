import { useQueryState } from './useQueryState';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { personal, selectedProjects } from '../data/portfolio';
import { ExternalLink, Tags } from './ui';
import ProjectArtwork from './ProjectArtwork';

const filters = ['All work', 'AI / ML', 'Software'];
const projectIds = selectedProjects.map((project) =>
  project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
);

export default function ProjectGallery() {
  const [filter, setFilter] = useQueryState('filter', filters[0], filters, 'workbench');
  const [selected, setSelected] = useQueryState('project', projectIds[0], projectIds, 'workbench');
  const projects = selectedProjects.filter((p) => filter === 'All work' || p.category === filter);
  const active =
    projects.find((p) => projectIds[selectedProjects.indexOf(p)] === selected) ?? projects[0];
  const activeIndex = selectedProjects.indexOf(active);
  return (
    <div className="workbench" id="workbench" tabIndex={-1}>
      <div className="selected-work-heading">
        <div>
          <p className="eyebrow">03 — 07 / THE PROJECT INDEX</p>
          <h3>From the workbench.</h3>
          <p>Experiments, applications, and the ideas between them.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter selected projects">
          {filters.map((item) => (
            <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="gallery-layout">
        <figure className="gallery-stage" aria-label={`${active.name} concept illustration`}>
          <div className="gallery-stage-head">
            <span>SELECTED / 0{activeIndex + 3}</span>
            <ArrowUpRight size={18} />
          </div>
          <ProjectArtwork index={activeIndex} />
          <figcaption>
            <span>{active.category}</span>
            <span>CONCEPT ILLUSTRATION</span>
          </figcaption>
        </figure>
        <div className="selected-projects">
          {projects.map((project) => {
            const index = selectedProjects.indexOf(project);
            const isActive = project === active;
            return (
              <article className="selected-project" data-active={isActive} key={project.name}>
                <div className="gallery-row-head">
                  <span className="project-number">0{index + 3}</span>
                  <h4>
                    <button
                      aria-expanded={isActive}
                      aria-controls={`project-detail-${index}`}
                      onClick={() => setSelected(projectIds[index])}
                    >
                      {project.name}
                      <span aria-hidden="true">
                        {isActive ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>
                  </h4>
                </div>
                <div className="gallery-detail" id={`project-detail-${index}`} hidden={!isActive}>
                  <div className="gallery-mobile-art">
                    <ProjectArtwork index={index} />
                    <span>CONCEPT ILLUSTRATION</span>
                  </div>
                  <p className="micro-label">{project.type}</p>
                  <p className="selected-description">{project.description}</p>
                  <Tags items={project.stack} />
                  <ExternalLink href={project.github} className="text-link">
                    View {project.name} repository
                  </ExternalLink>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="projects-footer">
        <span>More ideas. More commits.</span>
        <ExternalLink href={personal.github} className="text-link">
          All repositories
        </ExternalLink>
      </div>
    </div>
  );
}
