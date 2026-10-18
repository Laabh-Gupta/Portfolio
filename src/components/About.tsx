import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './ui';

export default function About() {
  return (
    <section id="about" tabIndex={-1} className="bio-section">
      <div className="container bio-shell">
        <Reveal className="bio-layout">
          <div className="bio-sidebar">
            <p className="bio-eyebrow">
              <span>03</span> / A LITTLE ABOUT ME
            </p>
            <div className="bio-monogram" aria-hidden="true">
              <span>l</span>
              <span>g.</span>
              <i />
            </div>
            <p className="bio-location">
              <span /> Kanpur, India
            </p>
          </div>
          <div className="bio-main">
            <h2>
              A systems mind.
              <br />
              <span>A maker’s instinct.</span>
            </h2>
            <div className="bio-copy">
              <p className="bio-intro">
                I’m Laabh. I build at the intersection of AI, product and infrastructure.
              </p>
              <p>
                I like the part where an interesting model becomes something useful: the data
                flowing in, the API connecting it, the interface someone actually uses.
              </p>
              <p>
                That curiosity takes me from enterprise AI and data engineering at EY to building
                ArguLab, a place to practice better conversations with AI. I care about how the
                whole system comes together.
              </p>
              <a href="#skills" className="bio-link">
                Explore my toolkit <ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
            <div className="bio-education">
              <p className="bio-small-label">THE FOUNDATION</p>
              <div>
                <h3>VIT Chennai</h3>
                <p>
                  B.Tech · Computer Science &amp; Engineering
                  <br />
                  <span>Specialization in Artificial Intelligence &amp; Machine Learning</span>
                </p>
              </div>
              <div className="bio-education-meta">
                <span>2022 — 2026</span>
                <strong>
                  8.1 <span>CGPA</span>
                </strong>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
