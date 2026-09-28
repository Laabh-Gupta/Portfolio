import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  AudioLines,
  Check,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Github } from '../components/BrandIcons';
import { argulab, modes } from '../data/portfolio';
import { ExternalLink, Tags } from '../components/ui';
import TrainingLoop from '../components/TrainingLoop';
import Architecture from '../components/Architecture';
import ArgulabPreview from '../components/ArgulabPreview';

export default function ProjectCaseStudy() {
  return (
    <div className="case-study container">
      <Link to="/#argulab" className="text-link case-back">
        <ArrowLeft size={16} />
        Back to selected work
      </Link>
      <header className="case-hero">
        <div>
          <p className="eyebrow">
            <span className="tiny-dot" /> FLAGSHIP CASE STUDY / AI APPLICATION ENGINEERING
          </p>
          <h1>
            ArguLab<span>.</span>
          </h1>
          <p className="case-subtitle">
            Practice with AI.
            <br />
            <span>Improve with context.</span>
          </p>
          <p>
            {argulab.subtitle}. Built as an adaptive application that connects structured
            conversation, evaluation and user-specific training context.
          </p>
          <Tags items={argulab.stack} />
          <div className="case-actions">
            <ExternalLink className="button button-primary" href={argulab.live}>
              Try ArguLab
            </ExternalLink>
            <ExternalLink className="button button-secondary" href={argulab.github} arrow={false}>
              <Github size={17} />
              Product guide
            </ExternalLink>
          </div>
        </div>
        <ArgulabPreview />
      </header>
      <div className="case-summary">
        <div>
          <span>PRODUCT</span>
          <strong>9 practice modes</strong>
        </div>
        <div>
          <span>EXPERIENCE</span>
          <strong>Responsive mobile-first</strong>
        </div>
        <div>
          <span>CORE IDEA</span>
          <strong>Personalized training loop</strong>
        </div>
        <div>
          <span>ENGINEERING</span>
          <strong>Model → Deployed product</strong>
        </div>
      </div>
      <section className="case-section case-problem">
        <div>
          <p className="eyebrow">THE PROBLEM</p>
          <h2>
            Practice is easy to start.
            <br />
            Harder to personalize.
          </h2>
        </div>
        <div>
          <p>
            A single AI conversation can be useful. Communication practice becomes more valuable
            when the next session can build on what happened before.
          </p>
          <p>
            ArguLab connects practice to structured feedback and persistent training context, so a
            user’s previous strengths and weaknesses can shape future sessions.
          </p>
        </div>
      </section>
      <section className="case-section">
        <div className="case-section-heading">
          <p className="eyebrow">THE PRODUCT</p>
          <h2>Nine ways to find your voice.</h2>
          <p>Different situations. A shared practice, review and improvement workflow.</p>
        </div>
        <div className="modes-grid">
          {modes.map((mode, index) => (
            <details className="mode-card" key={mode.name}>
              <summary>
                <span className="micro-label">0{index + 1}</span>
                <span>{mode.name}</span>
                <span className="mode-expand" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{mode.detail}</p>
            </details>
          ))}
        </div>
        <div className="product-capabilities">
          <span>
            <MessageSquare size={16} />
            Structured AI conversations
          </span>
          <span>
            <AudioLines size={16} />
            Voice + text
          </span>
          <span>
            <Check size={16} />
            Post-session evaluation
          </span>
        </div>
      </section>
      <section className="case-section" id="personalization">
        <div className="case-section-heading">
          <p className="eyebrow">THE DIFFERENCE</p>
          <h2>Context that carries forward.</h2>
          <p>Select a step to explore how practice becomes personalized training.</p>
        </div>
        <TrainingLoop />
      </section>
      <section className="case-section" id="architecture">
        <div className="case-section-heading">
          <p className="eyebrow">UNDER THE HOOD</p>
          <h2>
            The AI is one layer.
            <br />
            The engineering connects it.
          </h2>
          <p>Explore the application, its AI workflows and the infrastructure around them.</p>
        </div>
        <Architecture />
      </section>
      <section className="case-section engineering-decisions">
        <p className="eyebrow">ENGINEERING DECISIONS</p>
        <div className="decision-grid">
          <div>
            <span className="micro-label">01 / CONTINUITY</span>
            <h3>Keep the useful context.</h3>
            <p>
              Session persistence and saved training context connect an isolated conversation to
              longer-term practice. History, transcripts and reviews stay useful after a session
              ends.
            </p>
          </div>
          <div>
            <span className="micro-label">02 / USER CONTROL</span>
            <h3>Review before sending.</h3>
            <p>
              Audio becomes an editable transcript before submission. Reports and JSON exports let
              users keep a copy of their practice data.
            </p>
          </div>
          <div>
            <span className="micro-label">03 / APPLICATION BOUNDARIES</span>
            <h3>Keep AI on the server.</h3>
            <p>
              Authenticated APIs, rate limiting and data ownership checks put application controls
              around streaming responses and model requests.
            </p>
          </div>
        </div>
      </section>
      <div className="glass case-closing">
        <ShieldCheck size={29} />
        <div>
          <h2>Explore the working product.</h2>
          <p>A communication training platform, from AI interaction to deployed application.</p>
        </div>
        <ExternalLink href={argulab.live} className="button button-primary">
          Open ArguLab <ArrowUpRight size={17} />
        </ExternalLink>
      </div>
      <div className="case-source-links">
        <ExternalLink href={argulab.github} className="text-link">
          Public product repository
        </ExternalLink>
        <ExternalLink href={argulab.history} className="text-link">
          Public development history
        </ExternalLink>
        <Link to="/#contact" className="text-link">
          Talk about the engineering <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
