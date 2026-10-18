import { ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react';
import { experience } from '../data/portfolio';
import { Reveal } from './ui';

export default function Experience() {
  const [current, internship, hal] = experience;

  return (
    <section id="experience" tabIndex={-1} className="career-section">
      <div className="container career-shell">
        <Reveal className="career-heading">
          <p className="career-eyebrow">
            <span>02</span> / THE WORK BEHIND THE WORK
          </p>
          <div className="career-heading-line">
            <h2>
              Good work.
              <br />
              <span>Real-world impact.</span>
            </h2>
            <p>
              From enterprise data platforms to aerospace software. Learning by building things that
              have a job to do.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <article className="career-employer career-ey">
            <div className="career-company">
              <p className="career-year">2026 — PRESENT</p>
              <div className="career-wordmark" translate="no">
                EY<span>GDS</span>
              </div>
              <h3>
                Ernst &amp; Young
                <br />
                Global Delivery Services
              </h3>
              <span className="career-current">
                <span /> CURRENTLY HERE
              </span>
            </div>
            <div className="career-record">
              <div className="career-role-line">
                <div>
                  <p className="career-small-label">CURRENT ROLE</p>
                  <h4>{current.role}</h4>
                  <p className="career-date">June 2026 — Present</p>
                </div>
                <ArrowUpRight size={27} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <div className="career-previous">
                <ArrowDownRight size={19} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <h4>{internship.role}</h4>
                  <span>January — May 2026</span>
                </div>
                <span className="career-conversion">Converted to full-time</span>
              </div>
              <p className="career-summary">
                Connecting enterprise data, intelligent workflows and the software that makes model
                experiments visible.
              </p>
              <p className="career-small-label career-project-label">SELECTED INTERNSHIP WORK</p>
              <div className="career-projects">
                {internship.projects.map((project, index) => (
                  <details className="career-project" key={project.name}>
                    <summary>
                      <span className="career-project-index">0{index + 1}</span>
                      <span className="career-project-name">{project.name}</span>
                      <span className="career-detail-affordance">
                        <span>Details</span>
                        <Plus size={18} aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="career-project-body">
                      <p>{project.description}</p>
                      <div className="career-route" aria-label={`${project.name} workflow`}>
                        {(index === 0
                          ? ['Cloud sources', 'Configurable ingestion', 'Unity Catalog']
                          : ['MLflow runs', 'Delta + SQL', 'Model comparison']
                        ).map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                      <p className="career-stack">{project.stack}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="career-employer career-hal">
            <div className="career-company">
              <p className="career-year">JUNE — JULY 2025</p>
              <div className="career-hal-initials" translate="no">
                HAL
              </div>
              <h3>
                Hindustan
                <br />
                Aeronautics Limited
              </h3>
            </div>
            <div className="career-record">
              <div className="career-role-line">
                <div>
                  <p className="career-small-label">EARLY EXPERIENCE</p>
                  <h4>{hal.role}</h4>
                  <p className="career-date">Aerospace manufacturing · 2025</p>
                </div>
                <ArrowUpRight size={27} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <p className="career-summary">
                A secure cost estimator for the parts that keep aircraft moving.
              </p>
              <p className="career-body-copy">{hal.description}</p>
              <details className="career-project career-hal-project">
                <summary>
                  <span className="career-project-name">Behind the application</span>
                  <span className="career-detail-affordance">
                    <span>Details</span>
                    <Plus size={18} aria-hidden="true" />
                  </span>
                </summary>
                <div className="career-project-body">
                  <p>{hal.projects[0].description}</p>
                  <p className="career-stack">{hal.projects[0].stack}</p>
                </div>
              </details>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
