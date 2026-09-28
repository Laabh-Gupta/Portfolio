import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AudioLines } from 'lucide-react';
import { argulab, personal, selectedProjects } from '../data/portfolio';
import { ExternalLink, Reveal, SectionHeading, Tags } from './ui';
import ArgulabPreview from './ArgulabPreview';
import GlowCard from './GlowCard';

export default function Projects() {
  const [filter, setFilter] = useState('All work');
  const projects = selectedProjects.filter(
    (project) => filter === 'All work' || project.category === filter,
  );
  return (
    <section id="projects" tabIndex={-1} className="section container projects-section">
      <div className="section-heading-row">
        <SectionHeading
          number="01"
          label="SELECTED WORK"
          title="Built to be used."
          description="AI products, applied machine learning, and the systems around them."
        />
        <span className="section-side-note">FROM EXPERIMENT TO APPLICATION</span>
      </div>
      <Reveal>
        <GlowCard id="argulab" tabIndex={-1} className="featured-project">
          <div className="featured-copy">
            <p className="eyebrow">
              <span className="tiny-dot" /> FLAGSHIP / DEPLOYED AI PRODUCT
            </p>
            <h3>
              ArguLab<span className="brand-dot">.</span>
            </h3>
            <p className="project-subtitle">
              Better conversations.
              <br />
              <span>Built on what came before.</span>
            </p>
            <p className="project-description">
              Nine AI practice modes. Streaming conversations. A personalization loop that remembers
              your strengths, weaknesses and previous sessions.
            </p>
            <Tags items={argulab.stack} />
            <div className="project-actions">
              <Link to="/projects/argulab" className="button button-primary">
                Explore case study <ArrowRight size={17} />
              </Link>
              <ExternalLink href={argulab.live} className="text-link">
                Open live app
              </ExternalLink>
            </div>
            <ExternalLink href={argulab.github} className="project-source text-link">
              GitHub / Product guide
            </ExternalLink>
          </div>
          <ArgulabPreview />
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
      <div className="selected-work-heading">
        <div>
          <h3>From the workbench</h3>
          <p>More explorations in machine learning and software.</p>
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
          <GlowCard className="selected-project" key={project.name}>
            <span className="project-number">0{selectedProjects.indexOf(project) + 3}</span>
            <div>
              <p className="micro-label">{project.type}</p>
              <h4>
                <ExternalLink href={project.github}>{project.name}</ExternalLink>
              </h4>
              <p className="selected-description">{project.description}</p>
            </div>
            <Tags items={project.stack} />
          </GlowCard>
        ))}
      </div>
      <div className="projects-footer">
        <span>More ideas. More commits.</span>
        <ExternalLink href={personal.github} className="text-link">
          All repositories
        </ExternalLink>
      </div>
    </section>
  );
}
