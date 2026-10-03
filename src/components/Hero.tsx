import { ArrowUpRight, Download } from 'lucide-react';
import { personal } from '../data/portfolio';
import { ExternalLink } from './ui';
import Identity from './Identity';

export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title" data-atmosphere="hero">
      <h1 id="hero-title" className="hero-name">
        <span>Laabh</span>{' '}
        <span>
          Gupta<span className="name-period">.</span>
        </span>
      </h1>
      <div className="hero-main">
        <div className="hero-copy">
          <p className="hero-roles">
            AI/ML Engineer.
            <br />
            Software Engineer.
            <span>MLOps &amp; DevOps</span>
          </p>
          <p className="hero-description">
            From models and data to products that work.
            <br />I build the systems around the intelligence.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" data-magnetic href="#projects">
              Explore my work <ArrowUpRight size={17} />
            </a>
            <a
              className="hero-resume text-link"
              aria-label="Download resume"
              href={personal.resume}
              download
            >
              Resume <Download size={14} />
            </a>
          </div>
        </div>
        <Identity />
      </div>
      <div className="hero-index">
        <a href="#experience" className="hero-current">
          AI &amp; Data Engineer <strong>@ EY GDS</strong>
        </a>
        <div className="hero-socials">
          <ExternalLink href={personal.github} className="text-link">
            GitHub
          </ExternalLink>
          <ExternalLink href={personal.linkedin} className="text-link">
            LinkedIn
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
