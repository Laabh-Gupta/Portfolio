import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { experience } from '../data/portfolio';
import { Reveal, SectionHeading } from './ui';

export default function Experience() {
  return (
    <section id="experience" tabIndex={-1} className="section experience-section">
      <div className="container">
        <SectionHeading
          number="03"
          label="PROFESSIONAL EXPERIENCE"
          title="Growing through real engineering."
          description="From aerospace software to enterprise AI and data systems."
        />
        <div className="timeline">
          {experience.map((item, index) => (
            <Reveal key={item.role} className="timeline-row">
              <div className="timeline-meta">
                <span className={`timeline-node ${item.current ? 'is-current' : ''}`} />
                <span>{item.period}</span>
                {item.current && <span className="current-label">CURRENT</span>}
              </div>
              <article
                className={`glass experience-card ${item.current ? 'current-experience' : ''}`}
              >
                <div className="experience-heading">
                  <div className={`company-monogram ${item.short === 'HAL' ? 'hal-monogram' : ''}`}>
                    {item.short === 'HAL' ? 'HAL' : 'EY'}
                  </div>
                  <div>
                    <p className="company-name">{item.company}</p>
                    <h3>{item.role}</h3>
                  </div>
                  {item.current && <ArrowUpRight size={20} className="accent-text" />}
                </div>
                <p>{item.description}</p>
                {item.current && (
                  <div className="conversion">
                    <span className="tiny-dot" /> Internship → Full-time{' '}
                    <span>Jan–May 2026 → Jun 2026</span>
                  </div>
                )}
                {item.projects.length > 0 && (
                  <div className="experience-details">
                    {item.projects.map((project) => (
                      <details key={project.name} open={index === 1 ? true : undefined}>
                        <summary>
                          {project.name}
                          <ChevronDown size={16} />
                        </summary>
                        <div className="detail-content">
                          <p>{project.description}</p>
                          <span className="experience-stack">{project.stack}</span>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
