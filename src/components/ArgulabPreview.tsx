import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  Database,
  MessageSquare,
  Mic,
  Repeat2,
  ScanLine,
} from 'lucide-react';

export default function ArgulabPreview() {
  return (
    <figure className="argulab-preview" aria-label="ArguLab product workflow illustration">
      <figcaption className="preview-toolbar">
        <span className="argulab-brand">
          <AudioLines size={23} /> argulab<span>.</span>
        </span>
        <span className="micro-label">PRODUCT WORKFLOW / ILLUSTRATED</span>
      </figcaption>
      <div className="preview-workspace">
        <aside className="preview-sidebar" aria-hidden="true">
          <span className="micro-label">PRACTICE MODES</span>
          <span className="preview-mode-active">
            <MessageSquare size={14} /> Debate
          </span>
          <span>
            <Mic size={14} /> Interview
          </span>
          <span>
            <AudioLines size={14} /> Public speaking
          </span>
          <span className="preview-more">+ 6 more modes</span>
          <div className="preview-sidebar-bottom">
            <Database size={14} /> Session history
          </div>
        </aside>
        <div className="preview-canvas">
          <p className="micro-label">A CONTINUOUS LEARNING LOOP</p>
          <p className="preview-title">
            Your next conversation
            <br />
            <span>starts with context.</span>
          </p>
          <div className="preview-session">
            <span className="preview-node-icon">
              <AudioLines size={20} />
            </span>
            <div>
              <strong>Practice session</strong>
              <span>Streaming AI · Voice + text</span>
            </div>
            <div className="waveform" aria-hidden="true">
              {Array.from({ length: 13 }, (_, i) => (
                <i key={i} style={{ height: `${7 + ((i * 13 + 7) % 23)}px` }} />
              ))}
            </div>
          </div>
          <div className="preview-connector">
            <ArrowDown size={16} />
          </div>
          <div className="preview-evaluation">
            <ScanLine size={19} />
            <div>
              <strong>Structured feedback</strong>
              <span>Strengths · Weaknesses · Next steps</span>
            </div>
          </div>
          <div className="preview-connector">
            <ArrowDown size={16} />
          </div>
          <div className="preview-context">
            <Database size={18} />
            <div>
              <strong>Persistent user context</strong>
              <span>PostgreSQL / Supabase</span>
            </div>
            <Repeat2 size={16} />
          </div>
          <div className="preview-return">
            <span /> Personalized next session <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
      <div className="preview-footer">
        <span className="tiny-dot" /> NINE MODES. ONE CONNECTED SYSTEM.<span>01 → 02 → 03 ↗</span>
      </div>
    </figure>
  );
}
