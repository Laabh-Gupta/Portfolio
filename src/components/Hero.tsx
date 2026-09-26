import { ArrowDown, ArrowUpRight, Download, MapPin } from 'lucide-react';
import { Github } from './BrandIcons';
import { personal } from '../data/portfolio';
import { ExternalLink } from './ui';
import SystemVisual from './SystemVisual';

export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <a className="current-status" href="#experience">
            <span className="status-dot" />
            <span>
              Currently <strong>AI & Data Engineer @ EY GDS</strong>
            </span>
            <ArrowUpRight size={14} />
          </a>
          <p className="hero-kicker">ENGINEERING INTELLIGENCE. END TO END.</p>
          <h1 id="hero-title">
            Laabh Gupta<span>.</span>
          </h1>
          <p className="hero-roles">
            AI/ML Engineer <span>/</span> Software Engineer
            <br />
            <span className="role-secondary">MLOps & DevOps</span>
          </p>
          <p className="hero-description">
            Building AI systems, full-stack products and
            <br className="desktop-break" /> production-oriented ML infrastructure.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#argulab">
              View ArguLab <ArrowUpRight size={18} />
            </a>
            <ExternalLink href={personal.github} className="button button-secondary" arrow={false}>
              <Github size={17} />
              View GitHub
            </ExternalLink>
          </div>
          <div className="hero-secondary">
            <a href={personal.resume} download>
              <Download size={15} />
              Download resume
            </a>
            <span />
            <a href="#contact">
              Contact me <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <SystemVisual />
      </div>
      <div className="hero-foot">
        <span>
          <MapPin size={14} />
          Kanpur, India <span className="foot-divider">/</span> Building across the stack
        </span>
        <a href="#about">
          Explore the work <ArrowDown size={15} />
        </a>
      </div>
    </section>
  );
}
