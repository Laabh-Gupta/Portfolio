import { Link } from 'react-router-dom';
import { ArrowRight, AudioLines, BookOpen, Database, FileText, MoveUpRight } from 'lucide-react';
import { argulab, personal } from '../data/portfolio';
import { ExternalLink, Reveal, Tags } from './ui';
import ArgulabPreview from './ArgulabPreview';
import GlowCard from './GlowCard';
import ProjectGallery from './ProjectGallery';

export default function Projects() {
  return (
    <section
      id="projects"
      tabIndex={-1}
      className="section container projects-section work-section"
    >
      <div className="work-section-heading">
        <div>
          <p className="work-kicker">
            <span>01</span> / SELECTED WORK
          </p>
          <h2>
            Built to be <span>used.</span>
          </h2>
        </div>
        <p>
          From the first experiment
          <br />
          to the experience on your screen.
        </p>
      </div>

      <Reveal>
        <GlowCard id="argulab" tabIndex={-1} className="work-flagship">
          <div className="work-flagship-topline">
            <span>
              <i aria-hidden="true" /> THE FLAGSHIP PROJECT
            </span>
            <span>FULL-STACK AI PRODUCT / 2026</span>
          </div>
          <div className="work-flagship-layout">
            <div className="work-flagship-copy">
              <div className="work-product-icon" aria-hidden="true">
                <AudioLines size={27} />
              </div>
              <h3 translate="no">
                ArguLab<span>.</span>
              </h3>
              <p className="work-flagship-tagline">
                Find your voice.
                <br />
                Then make it stronger.
              </p>
              <p className="work-description">
                A personal practice space for the conversations that matter. Nine AI modes,
                real-time dialogue, and adaptive difficulty that builds on your saved progress.
              </p>
              <Tags items={argulab.stack} />
              <div className="work-flagship-actions">
                <Link to="/projects/argulab" className="work-case-link" data-magnetic>
                  Explore case study <ArrowRight size={19} aria-hidden="true" />
                </Link>
                <div className="work-secondary-actions">
                  <ExternalLink href={argulab.live}>Try ArguLab</ExternalLink>
                  <ExternalLink href={argulab.github}>Product guide</ExternalLink>
                </div>
              </div>
            </div>
            <div className="work-product-stage">
              <div className="work-preview-label">
                <span>THE LEARNING LOOP</span>
                <span>INTERACTIVE PREVIEW</span>
              </div>
              <ArgulabPreview />
              <p className="work-preview-note">Illustrative workflow. Explore each stage above.</p>
            </div>
          </div>
          <div className="work-feature-rail">
            <div>
              <span>01 / PRACTICE</span>
              <p>Nine ways to find your voice.</p>
            </div>
            <div>
              <span>02 / REFLECT</span>
              <p>Feedback you can act on.</p>
            </div>
            <div>
              <span>03 / GROW</span>
              <p>Your next session starts ahead.</p>
            </div>
            <MoveUpRight size={22} aria-hidden="true" />
          </div>
        </GlowCard>
      </Reveal>

      <div className="work-support-grid">
        <Reveal>
          <GlowCard className="work-support-card work-voice-card">
            <div className="work-support-visual work-voice-art" aria-hidden="true">
              <div className="work-art-caption">
                <span>AUDIO INTELLIGENCE</span>
                <AudioLines size={18} />
              </div>
              <div className="work-waveform">
                {Array.from({ length: 72 }, (_, index) => (
                  <i
                    key={index}
                    style={{
                      height: `${10 + ((index * 29 + (index % 7) * 17) % 87)}%`,
                      opacity: 0.35 + (index % 5) * 0.15,
                    }}
                  />
                ))}
              </div>
              <div className="work-signal-axis">
                <span>HUMAN</span>
                <span className="work-signal-core">SIGNAL / CLASSIFY</span>
                <span>SYNTHETIC</span>
              </div>
              <span className="work-art-note">SIGNAL ILLUSTRATION</span>
            </div>
            <div className="work-support-copy">
              <p className="work-kicker">02 / APPLIED MACHINE LEARNING</p>
              <h3>
                Voice Anti-Spoofing<span className="work-title-dot">.</span>
              </h3>
              <p className="work-description">
                A closer listen to what is real. An audio classification pipeline exploring Mel
                spectrograms, CNNs and Vision Transformers to distinguish human and synthetic
                speech.
              </p>
              <Tags items={['PyTorch', 'CNN / ViT', 'FastAPI', 'React']} />
              <p className="work-research-note">
                <span>RESEARCH → APPLICATION</span>99.75% reported test-set accuracy in the original
                research. The web app serves a CNN baseline.
              </p>
              <ExternalLink
                href={`${personal.github}/Voice-Anti-Spoofing-Web-App`}
                className="work-repository-link"
              >
                Explore repository
              </ExternalLink>
            </div>
          </GlowCard>
        </Reveal>

        <Reveal>
          <GlowCard className="work-support-card work-truth-card">
            <div className="work-support-visual work-truth-art" aria-hidden="true">
              <div className="work-art-caption">
                <span>LOCAL KNOWLEDGE / CONNECTED</span>
                <BookOpen size={18} />
              </div>
              <div className="work-rag-drawing">
                <div className="work-documents">
                  <FileText size={31} />
                  <span>YOUR DOCUMENTS</span>
                </div>
                <div className="work-rag-path">
                  <i />
                  <i />
                  <i />
                  <ArrowRight size={18} />
                </div>
                <div className="work-context-node">
                  <Database size={28} />
                  <span>CONTEXT</span>
                </div>
                <div className="work-rag-path">
                  <i />
                  <i />
                  <i />
                  <ArrowRight size={18} />
                </div>
                <div className="work-answer-node">
                  <span>“</span>
                  <span>ANSWERS</span>
                </div>
              </div>
              <div className="work-local-label">
                <span />
                DOCUMENTS IN. GROUNDED ANSWERS OUT.
              </div>
              <span className="work-art-note">PIPELINE ILLUSTRATION</span>
            </div>
            <div className="work-support-copy">
              <p className="work-kicker">03 / RETRIEVAL-AUGMENTED GENERATION</p>
              <h3>
                TruthGuard<span className="work-title-dot">.</span>
              </h3>
              <p className="work-description">
                Ask questions of your own documents. A local document-QA prototype that connects
                retrieval, an Ollama language model and RAGAS evaluation in a Streamlit interface.
              </p>
              <Tags items={['Python', 'LangChain', 'ChromaDB', 'Ollama']} />
              <p className="work-research-note">
                <span>BUILT TO EXPLORE</span>A hands-on RAG workflow, from document context to
                answer evaluation.
              </p>
              <ExternalLink href={`${personal.github}/TruthGuard`} className="work-repository-link">
                Explore repository
              </ExternalLink>
            </div>
          </GlowCard>
        </Reveal>
      </div>

      <div className="work-index">
        <ProjectGallery />
      </div>
    </section>
  );
}
