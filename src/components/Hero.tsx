import { ArrowDown, ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { personal } from '../data/portfolio';
import IntroLabel from './IntroLabel';
import FloatingAvatar from './FloatingAvatar';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    let visible = false;
    const update = () => {
      element.dataset.animate = visible && !document.hidden ? 'true' : 'false';
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return (
    <section
      ref={section}
      className="intro container"
      aria-labelledby="hero-title"
      data-atmosphere="hero"
    >
      <div className="intro-topline">
        <IntroLabel />
        <span className="intro-location">
          BASED IN INDIA <span>↗</span> BUILDING FOR EVERYWHERE
        </span>
      </div>
      <div className="intro-grid">
        <div className="intro-copy">
          <p className="intro-hello">Hello, I’m</p>
          <h1 id="hero-title" tabIndex={-1} translate="no">
            Laabh{' '}
            <span>
              Gupta<span className="intro-period">.</span>
            </span>
          </h1>
          <p className="intro-statement">
            Making intelligence work
            <br />
            in the real world.
          </p>
          <p className="intro-description">
            AI/ML engineer. Software builder. I connect models, data and thoughtful interfaces to
            create products people can use.
          </p>
          <div className="intro-actions">
            <a className="button button-primary" data-magnetic href="#projects">
              Explore my work <ArrowDownRight size={18} />
            </a>
            <a
              className="intro-resume text-link"
              aria-label="Download resume"
              href={personal.resume}
              download
            >
              Resume <Download size={16} />
            </a>
          </div>
        </div>
        <FloatingAvatar />
      </div>
      <div className="intro-bottom">
        <a href="#experience" className="intro-current">
          <span className="status-dot" />
          <span>
            Currently building at <strong>EY GDS</strong>
            <small>AI &amp; Data Engineer</small>
          </span>
          <ArrowUpRight size={17} />
        </a>
        <Link to="/projects/argulab" className="intro-feature">
          <span>IN THE SPOTLIGHT</span>
          <strong>
            ArguLab<span> — practice. learn. evolve.</span>
          </strong>
          <ArrowUpRight size={20} />
        </Link>
        <a className="intro-scroll" href="#projects" aria-label="Scroll to selected work">
          <ArrowDown size={16} />
          <span>SCROLL TO EXPLORE</span>
        </a>
      </div>
    </section>
  );
}
