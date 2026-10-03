import { AudioLines, ArrowUpRight, Database, Repeat2, ScanLine } from 'lucide-react';
import { Tabs } from '@base-ui/react/tabs';
import { useQueryState } from './useQueryState';

const steps = [
  {
    id: 'practice',
    title: 'Practice',
    icon: AudioLines,
    headline: 'Find your voice.',
    description: 'Choose one of nine modes and practice through a streaming conversation.',
    output: 'Streaming conversation',
    detail: 'Groq · AI SDK · Voice + text',
  },
  {
    id: 'review',
    title: 'Review',
    icon: ScanLine,
    headline: 'See what matters.',
    description:
      'Turn the conversation into a structured review of arguments, evidence and reasoning.',
    output: 'Structured learning signals',
    detail: 'Strengths · Weaknesses · Next steps',
  },
  {
    id: 'remember',
    title: 'Remember',
    icon: Database,
    headline: 'Carry it forward.',
    description: 'Persist useful context so the next session can build on previous practice.',
    output: 'A more personal next session',
    detail: 'PostgreSQL · Supabase · Session history',
  },
];

export default function ArgulabPreview({ anchor = 'argulab' }: { anchor?: string }) {
  const [phase, setPhase] = useQueryState(
    'workflow',
    'practice',
    steps.map((step) => step.id),
    anchor,
  );
  return (
    <figure className="argulab-preview" aria-label="ArguLab product workflow illustration">
      <figcaption className="preview-toolbar">
        <span className="argulab-brand" translate="no">
          <AudioLines size={22} /> argulab.
        </span>
        <span className="micro-label">WORKFLOW ILLUSTRATION</span>
      </figcaption>
      <Tabs.Root value={phase} onValueChange={setPhase} className="product-explorer">
        <Tabs.List className="product-phases" aria-label="Explore the ArguLab workflow">
          {steps.map((step, i) => (
            <Tabs.Tab className="product-phase" value={step.id} key={step.id}>
              <span>0{i + 1}</span>
              {step.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {steps.map((step) => (
          <Tabs.Panel className="product-panel" value={step.id} key={step.id}>
            <div className="product-story">
              <p className="product-headline">{step.headline}</p>
              <p>{step.description}</p>
            </div>
            <div className="workflow-drawing" aria-hidden="true">
              {step.id === 'practice' && (
                <>
                  <div className="conversation-meta">
                    <span>DEBATE PRACTICE</span>
                    <AudioLines size={18} />
                  </div>
                  <div className="conversation-line">
                    <span>AI</span>
                    <p>What is the strongest argument for your position?</p>
                  </div>
                  <div className="conversation-line response">
                    <span>YOU</span>
                    <div className="response-lines">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <div className="conversation-composer">
                    <span>Think it through. Make your case.</span>
                    <ArrowUpRight size={17} />
                  </div>
                </>
              )}
              {step.id === 'review' && (
                <div className="review-ledger">
                  {[
                    ['01', 'The claim', 'What are you arguing?'],
                    ['02', 'The evidence', 'What supports your position?'],
                    ['03', 'The counterargument', 'What might change your view?'],
                  ].map(([n, t, d]) => (
                    <div key={n}>
                      <span>{n}</span>
                      <p>
                        <strong>{t}</strong>
                        <small>{d}</small>
                      </p>
                      <ScanLine size={18} />
                    </div>
                  ))}
                </div>
              )}
              {step.id === 'remember' && (
                <div className="context-drawing">
                  <div>
                    <span>PREVIOUS SESSIONS</span>
                    <strong>Experience</strong>
                    <small>Conversations &amp; reviews</small>
                  </div>
                  <span className="context-connector">↓</span>
                  <div className="context-core">
                    <Database size={22} />
                    <p>
                      <strong>Persistent user context</strong>
                      <small>Strengths · Areas to improve</small>
                    </p>
                  </div>
                  <span className="context-connector">↓</span>
                  <p className="next-session">
                    <Repeat2 size={17} /> Personalized next session
                  </p>
                </div>
              )}
            </div>
            <div className="product-output">
              <span className="tiny-dot" />
              <div>
                <strong>{step.output}</strong>
                <span>{step.detail}</span>
              </div>
              <step.icon size={19} />
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
      <div className="preview-footer">
        <span>09 MODES</span>
        <span>ONE CONNECTED LEARNING LOOP</span>
      </div>
    </figure>
  );
}
