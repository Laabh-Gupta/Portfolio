import { personal } from "../data/portfolio";
import { useFadeIn } from "../components/useFadeIn";
import "./GetInTouch.css";

export default function Contact() {
  useFadeIn();

  return (
    <div className="contact-page">

      <section className="contact-hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />

        <div className="contact-content fade-in">
          <p className="section-label">Let's Connect</p>

          <h1 className="contact-title">
            Get In <span className="accent">Touch</span>
          </h1>

          <p className="contact-desc">
            Interested in AI, Machine Learning, Full Stack Development,
            or discussing opportunities? Feel free to reach out.
          </p>
        </div>
      </section>

      <section className="home-section">
        <div className="contact-grid fade-in">

          <a
            href={`mailto:${personal.email}`}
            className="contact-card"
          >
            <span className="contact-icon">✉</span>
            <h3>Email</h3>
            <p>{personal.email}</p>
          </a>

          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >
            <span className="contact-icon">in</span>
            <h3>LinkedIn</h3>
            <p>Connect professionally</p>
          </a>

          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >
            <span className="contact-icon">⌥</span>
            <h3>GitHub</h3>
            <p>View projects & code</p>
          </a>

          <a
            href={`tel:${personal.phone}`}
            className="contact-card"
          >
            <span className="contact-icon">📞</span>
            <h3>Phone</h3>
            <p>{personal.phone}</p>
          </a>

          <a
            href="/Laabh_Gupta_Resume.pdf"
            download
            className="contact-card"
          >
            <span className="contact-icon">📄</span>
            <h3>Resume</h3>
            <p>Download CV</p>
          </a>

        </div>
      </section>

    </div>
  );
}