import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { personal, skills, experience, achievements, education } from "../data/portfolio";
import { useFadeIn } from "../components/useFadeIn";
import "./Home.css";

const ROLES = [
  "AI and Data Engineer @ EY GDS",
  "Full-Stack Developer",
  "AI / ML Engineer",
  "Top 2% on LeetCode",
  "B.Tech CS (AI & ML)",
];

function Typewriter() {
  const [text, setText] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIdx];
    const speed = deleting ? 28 : charIdx === current.length ? 1800 : 55;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) { setText(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
        else setDeleting(true);
      } else {
        if (charIdx > 0) { setText(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
        else { setDeleting(false); setRoleIdx(i => (i + 1) % ROLES.length); }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, roleIdx, charIdx, deleting]);

  return (
    <div className="hero-typewriter">
      <span>{text}</span>
      <span className="cursor" />
    </div>
  );
}

export default function Home() {
  useFadeIn();
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-scanlines" />
        <div className="hero-content">
          <p className="hero-eyebrow">Hello, World</p>
          <h1 className="hero-name">Laabh<br /><span className="accent">Gupta</span></h1>
          <Typewriter />
          <p className="hero-desc">{personal.summary}</p>
          <div className="hero-btns">
            <Link to="/contact" target="_blank" rel="noreferrer" className="btn btn-outline">Get In Touch</Link>
            <a href={personal.github} target="_blank" rel="noreferrer" className="btn btn-outline">GitHub</a>
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline">LinkedIn</a>
            <Link to="/projects" target="_blank" rel="noreferrer" className="btn btn-outline">Projects</Link>
            <a href="/Laabh_Gupta_Resume.pdf" download target="_blank" rel="noreferrer" className="btn btn-outline">Resume</a>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="home-section bg-surface">
        <div className="fade-in">
          <p className="section-label">What I work with</p>
          <h2 className="section-title">Core Skills</h2>
        </div>
        <div className="skills-grid fade-in">
          {skills.map(sg => (
            <div key={sg.group} className="skill-group">
              <div className="skill-group-title">{sg.group}</div>
              <div className="skill-tags">{sg.items.map(s => <span key={s} className="violet-tag">{s}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="home-section">
        <div className="fade-in">
          <p className="section-label">Where I've worked</p>
          <h2 className="section-title">Experience</h2>
        </div>
        <div className="timeline fade-in">
          {experience.map((exp, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" style={i === 1 ? { background: "var(--violet)", boxShadow: "0 0 10px rgba(123,97,255,0.5)" } : {}} />
              <div className="exp-company">{exp.company}</div>
              <div className="exp-role">{exp.role}</div>
              <div className="exp-date">{exp.period}</div>
              <p className="exp-desc">{exp.desc}</p>
              {exp.projects && exp.projects.map((p, j) => (
                <div key={j} className="exp-subproject">
                  <div className="exp-subproject-title">{p.title}</div>
                  <p>{p.desc}</p>
                  <div className="stack-tags" style={{ marginTop: "0.6rem" }}>
                    {p.stack.map(s => <span key={s} className="stack-tag">{s}</span>)}
                  </div>
                </div>
              ))}
              {exp.bullets && (
                <ul className="exp-bullets">
                  {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
              {exp.stack && !exp.projects && (
                <div className="stack-tags" style={{ marginTop: "0.9rem" }}>
                  {exp.stack.map(s => <span key={s} className="stack-tag">{s}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="home-section bg-surface">
        <div className="fade-in">
          <p className="section-label">Highlights</p>
          <h2 className="section-title">Achievements</h2>
        </div>
        <div className="achievements-grid fade-in">
          {achievements.map((a, i) => (
            <div key={i} className="achievement-card">
              <span className="achievement-icon">{a.icon}</span>
              <div>
                <strong>{a.title}</strong>
                <p>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="home-section">
        <div className="fade-in">
          <p className="section-label">Academic background</p>
          <h2 className="section-title">Education</h2>
        </div>
        <div className="edu-grid fade-in">
          {education.map((e, i) => (
            <div key={i} className="edu-card">
              <div className="edu-degree">{e.degree}</div>
              <div className="edu-school">{e.school}</div>
              <div className="edu-detail">{e.detail}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
