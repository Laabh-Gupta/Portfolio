import { ArrowDownRight } from 'lucide-react';
import { experience } from '../data/portfolio';
import { Reveal, SectionHeading } from './ui';

export default function Experience() {
  const [current, internship, hal] = experience;
  return (
    <section id="experience" tabIndex={-1} className="section experience-section">
      <div className="container">
        <SectionHeading number="02" label="IN PRACTICE" title="Engineering, in the real world." />
        <Reveal>
          <article className="ey-experience">
            <div className="career-identity">
              <p className="micro-label">2026 — PRESENT</p>
              <p className="employer-wordmark" translate="no">
                EY<span>GDS</span>
              </p>
              <p className="employer-full">
                Ernst &amp; Young
                <br />
                Global Delivery Services
              </p>
              <div className="career-progression">
                <div>
                  <h3>{internship.role}</h3>
                  <p>January — May 2026</p>
                </div>
                <ArrowDownRight size={22} aria-hidden="true" />
                <div className="current-role">
                  <h3>{current.role}</h3>
                  <p>June 2026 — Present</p>
                  <span>Converted to full-time</span>
                </div>
              </div>
            </div>
            <div className="career-work">
              <p className="experience-intro">
                Enterprise AI needs more than a model. It needs dependable data, visible experiments
                and software that connects the two.
              </p>
              <p className="micro-label">SELECTED WORK FROM THE INTERNSHIP</p>
              {internship.projects.map((project, i) => (
                <section className="enterprise-story" key={project.name}>
                  <span className="story-number" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                    <div
                      className="enterprise-route"
                      aria-label={`${project.name} workflow outline`}
                    >
                      {(i === 0
                        ? ['Cloud sources', 'Configurable ingestion', 'Unity Catalog']
                        : ['MLflow runs', 'Delta + SQL', 'Model comparison']
                      ).map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                    <p className="experience-stack">
                      {i === 0
                        ? 'Streamlit · Databricks · LangChain · REST APIs'
                        : 'React · FastAPI · MLflow · PySpark · Databricks SQL'}
                    </p>
                  </div>
                </section>
              ))}
            </div>
          </article>
        </Reveal>
        <Reveal>
          <article className="hal-experience">
            <div>
              <p className="micro-label">JUNE — JULY 2025</p>
              <h3>Hindustan Aeronautics Limited</h3>
              <p className="role-date">{hal.role}</p>
            </div>
            <div>
              <h4>Software for aerospace manufacturing.</h4>
              <p>{hal.description}</p>
              <p>
                Session authentication, bcrypt and role-based access secured the workflow. An MVC
                backend handled cost computations, with GitHub-based CI/CD for deployment.
              </p>
              <p className="experience-stack">
                Node.js · MySQL · express-session · bcrypt · MVC · CI/CD
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
