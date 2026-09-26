import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, AudioLines, Check } from 'lucide-react';
import { Github } from './BrandIcons';
import { argulab, personal, selectedProjects } from '../data/portfolio';
import { ExternalLink, Reveal, SectionHeading, Tags } from './ui';
import ArgulabPreview from './ArgulabPreview';

export default function Projects() {
  const [filter, setFilter] = useState('All work');
  const projects = selectedProjects.filter(
    (project) => filter === 'All work' || project.category === filter,
  );
  return (
    <section id="projects" tabIndex={-1} className="section container">
      <div className="section-heading-row">
        <SectionHeading
          number="02"
          label="SELECTED WORK"
          title="Ideas, engineered into products."
        />
        <span className="section-side-note">WHAT I BUILT. HOW IT WORKS.</span>
      </div>
      <Reveal>
        <article id="argulab" tabIndex={-1} className="glass featured-project">
          <div className="featured-copy">
            <div className="project-eyebrow">
              <span className="flagship-badge">
                <span className="tiny-dot" />
                FLAGSHIP PROJECT
              </span>
              <span className="micro-label">01 / AI PRODUCT</span>
            </div>
            <h3>
              ArguLab<span className="brand-dot">.</span>
            </h3>
            <p className="project-subtitle">
              AI communication practice.
              <br />
              Personalized with every session.
            </p>
            <p className="project-description">
              A complete training platform with nine practice modes, structured AI feedback and
              persistent user context that shapes the next conversation.
            </p>
            <Tags items={argulab.stack} />
            <div className="project-features">
              <span>
                <Check size={14} />
                Adaptive training loop
              </span>
              <span>
                <Check size={14} />
                Voice + text interaction
              </span>
              <span>
                <Check size={14} />
                Mobile-first experience
              </span>
            </div>
            <div className="project-actions">
              <Link to="/projects/argulab" className="button button-primary">
                Explore case study <ArrowRight size={17} />
              </Link>
              <ExternalLink href={argulab.live} className="text-link">
                Open live app
              </ExternalLink>
            </div>
            <div className="project-quality">
              <span className="quality-mark">
                <Check size={12} />
              </span>
              <span>v3.0.1 verification</span>
              <strong>47</strong> unit / integration <span className="quality-separator">·</span>
              <strong>21</strong> browser tests
            </div>
          </div>
          <ArgulabPreview />
        </article>
      </Reveal>
      <Reveal>
        <article className="glass voice-project">
          <div className="voice-visual" aria-hidden="true">
            <div className="voice-visual-label">
              <AudioLines size={17} /> SIGNAL → SPECTROGRAM → MODEL
            </div>
            <div className="spectrogram">
              {Array.from({ length: 62 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${25 + ((i * 17 + (i % 8) * 13) % 76)}%`,
                    opacity: 0.25 + ((i * 7) % 7) / 10 + (i % 3) * 0.19,
                  }}
                />
              ))}
            </div>
            <div className="voice-visual-foot">
              <span>DEEP LEARNING / AUDIO</span>
              <span>01: HUMAN OR SYNTHETIC</span>
            </div>
          </div>
          <div className="voice-copy">
            <p className="eyebrow">
              <span>02</span> / FEATURED PROJECT
            </p>
            <div className="voice-title">
              <h3>Voice Anti-Spoofing</h3>
              <span className="accuracy">
                <strong>99.75%</strong>test accuracy
              </span>
            </div>
            <p>
              Distinguishing AI-generated speech from genuine human speech. An
              audio-to-Mel-Spectrogram pipeline with CNNs, Vision Transformers and data
              augmentation, delivered through a full-stack application.
            </p>
            <Tags items={['PyTorch', 'CNN / ViT', 'FastAPI', 'React']} />
            <div className="voice-bottom">
              <span>Project Lead · Dec 2024 – Mar 2025</span>
              <ExternalLink
                href={`${personal.github}/Voice-Anti-Spoofing-Web-App`}
                className="text-link"
              >
                View repository
              </ExternalLink>
            </div>
            <p className="metric-note">
              Reported project test-set accuracy; performance depends on the evaluation data.
            </p>
          </div>
        </article>
      </Reveal>
      <div className="selected-work-heading">
        <div>
          <h3>More from the workbench</h3>
          <p>Earlier explorations in machine learning and software.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter selected projects">
          {['All work', 'AI / ML', 'Software'].map((item) => (
            <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="selected-projects" aria-live="polite">
        {projects.map((project) => (
          <article className="selected-project" key={project.name}>
            <div className="selected-top">
              <span className="micro-label">{project.type}</span>
              <Github size={17} />
            </div>
            <h4>
              <ExternalLink href={project.github}>{project.name}</ExternalLink>
            </h4>
            <p>{project.description}</p>
            <Tags items={project.stack} />
          </article>
        ))}
      </div>
      <div className="projects-footer">
        <span>Curiosity, with a commit history.</span>
        <ExternalLink href={personal.github} className="text-link">
          All repositories <ArrowUpRight size={15} />
        </ExternalLink>
      </div>
    </section>
  );
}
