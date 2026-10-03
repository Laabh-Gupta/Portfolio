import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { personal } from '../data/portfolio';
import Identity from './Identity';

export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title" data-atmosphere="hero">
      <div className="hero-main">
        <div className="hero-copy">
          <p className="hero-kicker">Independent thinking. Connected systems.</p>
          <h1 id="hero-title" className="hero-name" translate="no">
            <span>Laabh</span>{' '}
            <span>
              Gupta<span className="name-period">.</span>
            </span>
          </h1>
          <p className="hero-roles">
            AI/ML Engineer <span>Software Engineer</span>
            <span>MLOps &amp; DevOps</span>
          </p>
          <p className="hero-description">
            I turn models, data and ideas into software people can use. From the first experiment to
            the deployed product.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" data-magnetic href="#projects">
              Explore my work <ArrowDownRight size={18} />
            </a>
            <a
              className="hero-resume text-link"
              aria-label="Download resume"
              href={personal.resume}
              download
            >
              Resume <Download size={15} />
            </a>
          </div>
        </div>
        <div className="identity-installation">
          <div className="identity-panel" aria-hidden="true" />
          <Identity />
          <span className="identity-signature" aria-hidden="true">
            Form follows function.
          </span>
        </div>
      </div>
      <div className="hero-index">
        <a href="#experience" className="hero-current">
          <span className="tiny-dot" />
          <span>
            Currently at <strong>EY GDS</strong>
            <small>AI &amp; Data Engineer · June 2026 — Present</small>
          </span>
          <ArrowUpRight size={17} />
        </a>
        <Link to="/projects/argulab" className="hero-feature">
          <span>
            Selected project<strong>ArguLab — AI that learns with you</strong>
          </span>
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </section>
  );
}
