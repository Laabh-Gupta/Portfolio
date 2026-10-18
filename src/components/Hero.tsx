import { ArrowDown, ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { personal } from '../data/portfolio';
import IntroLabel from './IntroLabel';
import { useEffect, useRef } from 'react';

// A deterministic point sculpture, built in code without a WebGL or image download.
const points = Array.from({ length: 64 * 25 }, (_, i) => {
  const u = ((i % 64) / 64) * Math.PI * 2;
  const v = (Math.floor(i / 64) / 25) * Math.PI * 2;
  const r = 132 + 53 * Math.cos(v);
  const x = r * Math.cos(u),
    y = r * Math.sin(u),
    z = 53 * Math.sin(v);
  const yy = y * Math.cos(0.92) - z * Math.sin(0.92);
  const zz = y * Math.sin(0.92) + z * Math.cos(0.92);
  return {
    x: 260 + (x * Math.cos(-0.58) - yy * Math.sin(-0.58)) * 1.14,
    y: 260 + (x * Math.sin(-0.58) + yy * Math.cos(-0.58)) * 1.14,
    z: zz,
  };
}).sort((a, b) => a.z - b.z);

function IntelligenceSculpture() {
  return (
    <div className="intro-sculpture" aria-hidden="true">
      <div className="intro-cross cross-one">+</div>
      <div className="intro-cross cross-two">+</div>
      <div className="intro-code-rain">
        {Array.from({ length: 13 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * -0.83}s`, left: `${i * 8}%` }}>
            {['0 1 ∑ 0 1 λ 0 1', '1 0 ∂ 1 0 1 φ 0', 'λ 0 1 0 ∑ 1 0 1'][i % 3]}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 520 520" className="intro-orbit" focusable="false">
        <defs>
          <radialGradient id="orbit-halo">
            <stop offset="0" stopColor="#c9f85c" stopOpacity=".06" />
            <stop offset="1" stopColor="#c9f85c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="260" r="255" fill="url(#orbit-halo)" />
        <circle className="orbit-guide" cx="260" cy="260" r="238" />
        <circle className="orbit-guide inner-guide" cx="260" cy="260" r="218" />
        <path className="orbit-axis" d="M0 260H520M260 0V520" />
        <g className="orbit-points">
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.z > 65 ? 1.75 : 1.25}
              fill={p.z > 90 ? '#e3ffa1' : '#c9f85c'}
              opacity={0.15 + ((p.z + 190) / 380) * 0.8}
            />
          ))}
        </g>
        <circle cx="433" cy="96" r="4" fill="#c9f85c" />
        <circle cx="87" cy="424" r="3" fill="#c9f85c" />
        <path d="M414 112l19-16h32M105 407l-18 17H55" className="orbit-callout" />
      </svg>
      <span className="sculpture-coordinate">ART + ALGORITHMS</span>
      <div className="sculpture-caption">
        <span className="tiny-dot" /> IDEAS → INTELLIGENCE → IMPACT
      </div>
      <span className="sculpture-index">FIG. 01 / CONNECTED THINKING</span>
    </div>
  );
}

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
          <h1 id="hero-title" translate="no">
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
        <IntelligenceSculpture />
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
