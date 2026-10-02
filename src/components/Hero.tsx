import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { personal } from '../data/portfolio';
import { ExternalLink } from './ui';
import Identity from './Identity';
import IntroLabel from './IntroLabel';

export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-topline">
        <IntroLabel />
        <span className="micro-label">AI / SOFTWARE / SYSTEMS</span>
      </div>
      <div className="hero-main">
        <div className="hero-copy">
          <p className="hero-roles">
            AI/ML Engineer · Software Engineer
            <br />
            MLOps & DevOps
          </p>
          <p className="hero-statement">
            Intelligence is
            <br />
            only the beginning.
          </p>
          <p className="hero-description">
            I build the systems around it.
            <br />
            From models and data to products that work.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" data-magnetic href="#projects">
              Explore my work <ArrowUpRight size={18} />
            </a>
            <a
              className="hero-resume text-link"
              aria-label="Download resume"
              href={personal.resume}
              download
            >
              Resume <Download size={16} />
            </a>
          </div>
        </div>
        <Identity />
      </div>
      <h1 id="hero-title" className="hero-name">
        <span>Laabh</span>{' '}
        <span>
          Gupta<span className="name-period">.</span>
        </span>
      </h1>
      <div className="hero-index">
        <a href="#experience" className="hero-current">
          <span className="status-dot" />
          <span>
            AI & Data Engineer <strong>@ EY GDS</strong>
          </span>
        </a>
        <div className="hero-socials">
          <ExternalLink href={personal.github} className="text-link">
            GitHub
          </ExternalLink>
          <ExternalLink href={personal.linkedin} className="text-link">
            LinkedIn
          </ExternalLink>
        </div>
        <a href="#projects" className="scroll-cue" aria-label="Explore the work">
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={16} />
        </a>
      </div>
    </section>
  );
}
