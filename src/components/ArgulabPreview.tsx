import {
  ArrowRight,
  AudioLines,
  BrainCircuit,
  MessageSquare,
  Mic,
  Repeat2,
  Sparkles,
} from 'lucide-react';

export default function ArgulabPreview() {
  return (
    <div className="argulab-preview" aria-label="ArguLab product workflow illustration">
      <div className="preview-toolbar">
        <span className="argulab-brand">
          <span className="argulab-symbol">
            <AudioLines size={19} />
          </span>
          argulab<span className="brand-dot">.</span>
        </span>
        <span className="micro-label">THE PRACTICE LOOP</span>
      </div>
      <div className="preview-heading">
        <span className="micro-label accent-text">PRACTICE. REFLECT. IMPROVE.</span>
        <p>
          Every conversation.
          <br />
          <span>A better next session.</span>
        </p>
      </div>
      <div className="preview-modes">
        <span>
          <MessageSquare size={14} />
          Debate
        </span>
        <span>
          <Mic size={14} />
          Interview
        </span>
        <span>+7 modes</span>
      </div>
      <div className="preview-session">
        <div>
          <span className="preview-icon">
            <AudioLines size={19} />
          </span>
          <div>
            <strong>Your practice session</strong>
            <span>Structured conversation</span>
          </div>
        </div>
        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 26 }, (_, i) => (
            <i key={i} style={{ height: `${8 + ((i * 13 + 7) % 29)}px` }} />
          ))}
        </div>
        <span className="preview-format">VOICE + TEXT</span>
      </div>
      <div className="preview-connector" aria-hidden="true" />
      <div className="preview-evaluation">
        <Sparkles size={16} />
        <div>
          <strong>AI evaluation</strong>
          <span>Strengths · Weaknesses · Next steps</span>
        </div>
        <ArrowRight size={16} />
      </div>
      <div className="preview-context">
        <BrainCircuit size={16} />
        <span>Persistent training context</span>
        <Repeat2 size={15} />
      </div>
      <div className="preview-footer">
        <span className="tiny-dot" /> Personalized future sessions <span>↗</span>
      </div>
    </div>
  );
}
