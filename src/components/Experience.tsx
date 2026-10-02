import { ArrowUpRight, Database, GitBranch } from 'lucide-react';
import { experience } from '../data/portfolio';
import { Reveal, SectionHeading } from './ui';

export default function Experience() {
  const [current, internship, hal] = experience;
  return (
    <section id="experience" tabIndex={-1} className="section experience-section">
      <div className="container">
        <SectionHeading
          number="02"
          label="PROFESSIONAL EXPERIENCE"
          title="Real problems. Real systems."
          description="Enterprise AI and data at EY. Manufacturing software at HAL."
        />
        <Reveal>
          <article className="ey-experience">
            <header className="employer-heading">
              <div>
                <p className="micro-label">ERNST & YOUNG GLOBAL DELIVERY SERVICES</p>
                <h3>{current.role}</h3>
                <p className="role-date">
                  <span className="status-dot" /> June 2026 — Present
                </p>
              </div>
              <span className="ey-monogram" aria-hidden="true">
                EY<span>GDS</span>
              </span>
            </header>
            <div className="career-transition">
              <div>
                <span className="micro-label">JAN — MAY 2026</span>
                <h3>AI & Data Intern</h3>
              </div>
              <ArrowUpRight size={23} />
              <div>
                <span className="micro-label">JUNE 2026 — PRESENT</span>
                <strong>Converted to full-time</strong>
              </div>
            </div>
            <p className="experience-intro">
              My work at EY began with building enterprise AI and data workflows during the
              internship. Two systems brought together agentic AI, data platforms and full-stack
              engineering.
            </p>
            <div className="ey-projects">
              {internship.projects.map((project, i) => (
                <div className="ey-project" key={project.name}>
                  <span className="experience-icon">
                    {i === 0 ? <Database size={23} /> : <GitBranch size={23} />}
                  </span>
                  <p className="micro-label">0{i + 1} / INTERNSHIP PROJECT</p>
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                  <div
                    className="enterprise-outline"
                    aria-label={`${project.name} workflow outline`}
                  >
                    {(i === 0
                      ? [
                          ['Discover', 'Cloud sources'],
                          ['Configure', 'JSON + agents'],
                          ['Ingest', 'Databricks'],
                        ]
                      : [
                          ['Track', 'MLflow runs'],
                          ['Query', 'Delta + SQL'],
                          ['Compare', 'React + FastAPI'],
                        ]
                    ).map(([label, detail], index) => (
                      <div key={label}>
                        <span>0{index + 1}</span>
                        <strong>{label}</strong>
                        <small>{detail}</small>
                      </div>
                    ))}
                  </div>
                  <div className="experience-stack">
                    {i === 0
                      ? 'Streamlit / Databricks / Unity Catalog / LangChain / REST APIs'
                      : 'React / FastAPI / MLflow / PySpark / Delta Tables / Databricks SQL'}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
        <Reveal>
          <article className="hal-experience">
            <div>
              <p className="micro-label">HINDUSTAN AERONAUTICS LIMITED</p>
              <h3>{hal.role}</h3>
              <p className="role-date">{hal.period}</p>
            </div>
            <div>
              <h4>Software for aerospace manufacturing.</h4>
              <p>{hal.description}</p>
              <p>
                Session authentication, bcrypt and role-based access secured the workflow. An MVC
                backend handled cost computations, with GitHub-based CI/CD for deployment.
              </p>
              <div className="experience-stack">
                Node.js / MySQL / Express-session / bcrypt / MVC / CI/CD
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
