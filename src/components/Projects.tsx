import { Link } from 'react-router-dom';
import { ArrowRight, AudioLines } from 'lucide-react';
import { argulab, personal } from '../data/portfolio';
import { ExternalLink, Reveal, SectionHeading, Tags } from './ui';
import ArgulabPreview from './ArgulabPreview';
import GlowCard from './GlowCard';
import ProjectGallery from './ProjectGallery';

export default function Projects() {
  return (
    <section id="projects" tabIndex={-1} className="section container projects-section">
      <div className="section-heading-row">
        <SectionHeading
          number="01"
          label="SELECTED WORK"
          title="Ideas, made operational."
          description="AI products, applied machine learning, and the systems around them."
        />
        <span className="section-side-note">SELECTED PROJECTS / 2024 — 2026</span>
      </div>
      <Reveal>
        <GlowCard id="argulab" tabIndex={-1} className="featured-project">
          <header className="flagship-heading">
            <p className="eyebrow">01 / FLAGSHIP AI PRODUCT</p>
            <h3 translate="no">
              ArguLab<span className="brand-dot">.</span>
            </h3>
            <p className="flagship-issue">DESIGNED, BUILT &amp; DEPLOYED / 2026</p>
          </header>
          <div className="flagship-spread">
            <div className="flagship-intro">
              <p className="project-subtitle">
                A conversation.
                <br />A learning signal.
                <br />
                <span>A better next session.</span>
              </p>
              <p className="project-description">
                A complete AI communication practice platform. Nine modes, streaming conversations
                and persistent context that makes practice personal.
              </p>
              <Tags items={argulab.stack} />
              <div className="project-actions">
                <Link to="/projects/argulab" className="button button-primary" data-magnetic>
                  Explore case study <ArrowRight size={17} />
                </Link>
                <ExternalLink href={argulab.live} className="text-link">
                  Open live app
                </ExternalLink>
                <ExternalLink href={argulab.github} className="text-link">
                  GitHub / Product guide
                </ExternalLink>
              </div>
            </div>
            <ArgulabPreview />
          </div>
          <div className="project-quality">
            <div>
              <strong>09</strong>
              <span>AI practice modes</span>
            </div>
            <div>
              <strong>47</strong>
              <span>Unit / integration tests</span>
            </div>
            <div>
              <strong>21</strong>
              <span>Playwright browser tests</span>
            </div>
            <p>
              Documented verification
              <br />
              <span>Release v3.0.1</span>
            </p>
          </div>
        </GlowCard>
      </Reveal>
      <Reveal>
        <GlowCard className="voice-project">
          <div className="voice-visual" aria-hidden="true">
            <div className="voice-visual-label">
              <AudioLines size={19} /> SIGNAL / REPRESENTATION / INFERENCE
            </div>
            <div className="spectrogram">
              {Array.from({ length: 62 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${15 + ((i * 17 + (i % 8) * 13) % 76)}%`,
                    opacity: 0.25 + (i % 4) * 0.18,
                  }}
                />
              ))}
            </div>
            <div className="voice-pipeline">
              <span>Audio</span>
              <ArrowRight size={15} />
              <span>Mel spectrogram</span>
              <ArrowRight size={15} />
              <span>CNN / ViT</span>
            </div>
          </div>
          <div className="voice-copy">
            <p className="eyebrow">02 / APPLIED MACHINE LEARNING</p>
            <h3>Human or synthetic?</h3>
            <p className="voice-project-name">Voice Anti-Spoofing System</p>
            <p>
              A PyTorch pipeline that distinguishes AI-generated voices from human speech, using Mel
              spectrograms, CNNs, a Vision Transformer and data augmentation.
            </p>
            <Tags items={['PyTorch', 'CNN / ViT', 'FastAPI', 'React']} />
            <div className="voice-bottom">
              <span className="accuracy">
                <strong>99.75%</strong> test-set accuracy
              </span>
              <ExternalLink
                href={`${personal.github}/Voice-Anti-Spoofing-Web-App`}
                className="text-link"
              >
                View repository
              </ExternalLink>
            </div>
            <p className="metric-note">
              Project Lead · Dec 2024 – Mar 2025. Reported test performance; results depend on the
              evaluation data.
            </p>
          </div>
        </GlowCard>
      </Reveal>
      <ProjectGallery />
    </section>
  );
}
