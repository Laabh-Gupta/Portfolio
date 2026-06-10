import { personal } from "../data/portfolio";
import { useFadeIn } from "../components/useFadeIn";
import "./Contact.css";

const SOCIAL_LINKS = [
  { label: "GitHub", icon: "⌥", href: personal.github },
  { label: "LinkedIn", icon: "in", href: personal.linkedin },
  { label: "LeetCode", icon: "⚡", href: personal.leetcode },
  { label: "HackerRank", icon: "◈", href: personal.hackerrank },
];

export default function Contact() {
  useFadeIn();
  return (
    <div className="contact-page">
      <div className="contact-hero fade-in">
        <p className="section-label">Let's Connect</p>
        <h1 className="contact-title">Get In Touch</h1>
        <p className="contact-subtitle">
          Open to full-time roles and interesting project collaborations in software engineering, AI/ML, and data engineering.
        </p>

        <a href={`mailto:${personal.email}`} className="contact-email-link">
          {personal.email}
        </a>

        <div className="contact-actions">
          <a href={`mailto:${personal.email}`} className="btn btn-primary">✉ Send Email</a>
          <a href="/Laabh_Gupta_Resume.pdf" download className="btn btn-outline">↓ Download Resume</a>
        </div>
      </div>

      <div className="contact-socials fade-in">
        <p className="section-label" style={{ marginBottom: "1.2rem" }}>Find me on</p>
        <div className="social-grid">
          {SOCIAL_LINKS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-card">
              <span className="social-icon">{s.icon}</span>
              <span className="social-label">{s.label}</span>
              <span className="social-arrow">→</span>
            </a>
          ))}
        </div>
      </div>

      <div className="contact-details fade-in">
        <div className="contact-detail-card">
          <span>📍</span>
          <div>
            <strong>Location</strong>
            <p>{personal.location}</p>
          </div>
        </div>
        <div className="contact-detail-card">
          <span>📞</span>
          <div>
            <strong>Phone</strong>
            <p>{personal.phone}</p>
          </div>
        </div>
        <div className="contact-detail-card">
          <span>🎓</span>
          <div>
            <strong>Currently</strong>
            <p>B.Tech CS (AI & ML) · VIT Chennai · 2026</p>
          </div>
        </div>
        <div className="contact-detail-card">
          <span>💼</span>
          <div>
            <strong>Open To</strong>
            <p>SDE roles, AI/ML engineering, Data engineering</p>
          </div>
        </div>
      </div>
    </div>
  );
}
