import { personal, skills, education } from "../data/portfolio";
import { useFadeIn } from "../components/useFadeIn";
import "./About.css";

export default function About() {
  useFadeIn();
  return (
    <div className="about-page">
      <section className="about-hero fade-in">
        <p className="section-label">About Me</p>
        <h1 className="about-title">Who I Am</h1>
        <p className="about-summary">{personal.summary}</p>
        <div className="about-meta">
          <span>📍 {personal.location}</span>
          <span>📧 <a href={`mailto:${personal.email}`}>{personal.email}</a></span>
          <span>📞 {personal.phone}</span>
        </div>
      </section>

      <section className="about-section bg-surface fade-in">
        <p className="section-label">Skills Breakdown</p>
        <h2 className="section-title">Technical Toolkit</h2>
        <div className="about-skills-grid">
          {skills.map(sg => (
            <div key={sg.group} className="about-skill-group">
              <div className="about-skill-group-title">{sg.group}</div>
              <div className="about-skill-tags">
                {sg.items.map(s => <span key={s} className="violet-tag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section fade-in">
        <p className="section-label">Where I Studied</p>
        <h2 className="section-title">Education</h2>
        <div className="about-edu-grid">
          {education.map((e, i) => (
            <div key={i} className="about-edu-card">
              <div className="about-edu-degree">{e.degree}</div>
              <div className="about-edu-school">{e.school}</div>
              <div className="about-edu-detail">{e.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section bg-surface fade-in">
        <p className="section-label">Working Style</p>
        <h2 className="section-title">How I Work</h2>
        <div className="about-traits">
          {[
            { icon: "🎯", title: "Impact-driven", desc: "I measure success by real outcomes — like the 25% decision-making speedup at HAL, or 99.75% accuracy in my anti-spoofing system." },
            { icon: "🔁", title: "Full-cycle thinking", desc: "From database schema to deployed UI, I think across the whole stack and take ownership end-to-end." },
            { icon: "🧪", title: "Research → Production", desc: "I bridge the gap between papers and working apps — like adapting Vision Transformers from research into a deployed web application." },
            { icon: "🤝", title: "Agile & collaborative", desc: "Comfortable in Agile/Scrum environments, CI/CD workflows, and working on large enterprise codebases at EY." },
          ].map((t, i) => (
            <div key={i} className="about-trait-card">
              <span>{t.icon}</span>
              <div>
                <strong>{t.title}</strong>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
