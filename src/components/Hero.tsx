import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { personal } from '../data/portfolio';
import { ExternalLink } from './ui';
import Identity from './Identity';
import IntroLabel from './IntroLabel';

export default function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <IntroLabel />
          <h1 id="hero-title">
            Laabh{' '}
            <span>
              Gupta<span className="name-period">.</span>
            </span>
          </h1>
          <p className="hero-roles">
            AI/ML Engineer <span> / </span> Software Engineer
            <br />
            <span className="role-secondary">MLOps & DevOps</span>
          </p>
          <p className="hero-description">
            I build AI that goes beyond the model.
            <br />
            Enterprise data systems. Personalized AI products.
            <br className="desktop-break" /> The engineering that connects them.
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary magnetic-button"
              href="#projects"
              onPointerMove={(e) => {
                if (
                  e.pointerType !== 'mouse' ||
                  !matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches
                )
                  return;
                const box = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.translate = `${(e.clientX - box.left - box.width / 2) * 0.04}px ${(e.clientY - box.top - box.height / 2) * 0.08}px`;
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.translate = '';
              }}
              onBlur={(e) => {
                e.currentTarget.style.translate = '';
              }}
            >
              Explore my work <ArrowUpRight size={19} />
            </a>
            <a className="button button-secondary" href={personal.resume} download>
              Download resume <Download size={17} />
            </a>
          </div>
          <div className="hero-socials">
            <ExternalLink href={personal.github} className="text-link" arrow={false}>
              <Github size={16} /> GitHub
            </ExternalLink>
            <ExternalLink href={personal.linkedin} className="text-link" arrow={false}>
              <Linkedin size={16} /> LinkedIn
            </ExternalLink>
            <a href="#contact" className="text-link">
              Let’s talk <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <Identity />
      </div>
      <div className="hero-index">
        <a href="#experience">
          <span className="micro-label">
            <span className="status-dot" /> CURRENTLY
          </span>
          <strong>
            AI & Data Engineer <span>@ EY GDS</span>
          </strong>
        </a>
        <a href="#argulab">
          <span className="micro-label">FLAGSHIP PROJECT</span>
          <strong>
            ArguLab <span>— Personalized AI practice</span>
          </strong>
        </a>
        <a href="#projects" className="scroll-cue" aria-label="Explore the work">
          <span>Explore the work</span>
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}
