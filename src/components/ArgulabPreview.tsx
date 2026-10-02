import { AudioLines, Database, ScanLine, ArrowUpRight, Repeat2 } from 'lucide-react';
import { Tabs } from '@base-ui/react/tabs';

const steps = [
  {
    id: 'practice',
    title: 'Practice',
    icon: AudioLines,
    headline: 'Find your voice.',
    description: 'A structured conversation in one of nine practice modes, through text or voice.',
    label: '01 / THE CONVERSATION',
    output: 'Streaming conversation',
    detail: 'Groq · AI SDK · Voice + text',
    signals: ['Debate', 'Interview', 'Public speaking', '+ 6 modes'],
  },
  {
    id: 'review',
    title: 'Review',
    icon: ScanLine,
    headline: 'See what matters.',
    description:
      'Turn a session into a structured review of arguments, evidence, strengths and weaknesses.',
    label: '02 / THE EVALUATION',
    output: 'Structured learning signals',
    detail: 'Evidence · Weak claims · Counterarguments',
    signals: ['Strengths', 'Weaknesses', 'Fallacies', 'Next steps'],
  },
  {
    id: 'remember',
    title: 'Remember',
    icon: Database,
    headline: 'Carry it forward.',
    description:
      'Save user-specific context and bring previous learning into the next practice session.',
    label: '03 / THE PERSONALIZATION',
    output: 'A more personal next session',
    detail: 'PostgreSQL · Supabase · Session history',
    signals: ['Past sessions', 'User context', 'Training signals', 'Next session'],
  },
];

export default function ArgulabPreview() {
  return (
    <figure className="argulab-preview" aria-label="ArguLab product workflow illustration">
      <figcaption className="preview-toolbar">
        <span className="argulab-brand">
          <AudioLines size={23} /> argulab.
        </span>
        <span className="micro-label">INTERACTIVE WORKFLOW / ILLUSTRATED</span>
        <span className="preview-window-controls" aria-hidden="true">
          •••
        </span>
      </figcaption>
      <Tabs.Root defaultValue="practice" className="product-explorer">
        <Tabs.List className="product-phases" aria-label="Explore the ArguLab workflow">
          {steps.map((step, i) => (
            <Tabs.Tab className="product-phase" value={step.id} key={step.id}>
              <span>0{i + 1}</span>
              <step.icon size={16} />
              {step.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {steps.map((step) => (
          <Tabs.Panel className="product-panel" value={step.id} key={step.id}>
            <div className="product-story">
              <p className="micro-label">{step.label}</p>
              <p className="product-headline">{step.headline}</p>
              <p>{step.description}</p>
              <div className="product-signal-tags">
                {step.signals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </div>
            <div className={`product-diagram diagram-${step.id}`} aria-hidden="true">
              <div className="diagram-orbit orbit-one" />
              <div className="diagram-orbit orbit-two" />
              <div className="diagram-core">
                <step.icon size={48} strokeWidth={0.8} />
              </div>
              <span className="diagram-marker marker-one">INPUT</span>
              <span className="diagram-marker marker-two">CONTEXT</span>
              <span className="diagram-marker marker-three">OUTPUT</span>
              {step.id === 'practice' && (
                <div className="diagram-wave">
                  {Array.from({ length: 29 }, (_, i) => (
                    <i key={i} style={{ height: 4 + Math.sin(i * 0.63) ** 2 * 29 }} />
                  ))}
                </div>
              )}
              {step.id === 'review' && (
                <div className="diagram-review">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              )}
              {step.id === 'remember' && (
                <Repeat2 className="diagram-repeat" size={27} strokeWidth={1} />
              )}
            </div>
            <div className="product-output">
              <span className="tiny-dot" />
              <div>
                <strong>{step.output}</strong>
                <span>{step.detail}</span>
              </div>
              <ArrowUpRight size={20} />
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
      <div className="preview-footer">
        <span>09 PRACTICE MODES</span>
        <span>ONE CONNECTED LEARNING LOOP</span>
        <Repeat2 size={13} />
      </div>
    </figure>
  );
}
