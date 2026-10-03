import { Tabs } from '@base-ui/react/tabs';
import {
  ArrowDown,
  Check,
  Cloud,
  Database,
  Globe,
  Layers3,
  LockKeyhole,
  Server,
  Sparkles,
} from 'lucide-react';
import { TabList, Tags } from './ui';
import { useQueryState } from './useQueryState';

export default function Architecture() {
  const [view, setView] = useQueryState(
    'view',
    'system',
    ['system', 'ai', 'quality'],
    'architecture',
  );
  return (
    <Tabs.Root value={view} onValueChange={setView} className="architecture">
      <TabList
        label="ArguLab engineering views"
        items={[
          { value: 'system', label: 'System architecture' },
          { value: 'ai', label: 'AI & audio workflows' },
          { value: 'quality', label: 'Delivery & quality' },
        ]}
      />
      <Tabs.Panel value="system" className="architecture-panel">
        <div className="architecture-diagram glass" aria-label="ArguLab application architecture">
          <div className="architecture-node">
            <Globe />
            <div>
              <span>01 / EXPERIENCE</span>
              <h4>React 19 + TypeScript</h4>
              <p>Vite · TanStack Router · Tailwind CSS</p>
            </div>
            <span className="host-label">NETLIFY</span>
          </div>
          <div className="architecture-connector">
            <ArrowDown size={17} />
            Authenticated APIs + streaming responses
          </div>
          <div className="architecture-node">
            <Server />
            <div>
              <span>02 / APPLICATION</span>
              <h4>Fastify + Better Auth</h4>
              <p>TypeScript · AI SDK · Rate limiting</p>
            </div>
            <span className="host-label">RENDER</span>
          </div>
          <div className="architecture-branches">
            <div>
              <ArrowDown size={17} />
              <div className="architecture-node">
                <Sparkles />
                <div>
                  <span>AI INTEGRATION</span>
                  <h4>Groq</h4>
                  <p>Conversations + structured evaluation</p>
                </div>
              </div>
            </div>
            <div>
              <ArrowDown size={17} />
              <div className="architecture-node">
                <Database />
                <div>
                  <span>PERSISTENT DATA</span>
                  <h4>PostgreSQL</h4>
                  <p>Users · Sessions · Training context</p>
                </div>
                <span className="host-label">SUPABASE</span>
              </div>
            </div>
          </div>
          <p className="diagram-caption">
            User context returns to the backend for personalized future inference.
          </p>
        </div>
        <div className="architecture-notes">
          <div>
            <LockKeyhole size={20} />
            <h4>Boundaries by design</h4>
            <p>
              Server-side AI integration, authenticated APIs, record ownership checks and database
              access controls.
            </p>
          </div>
          <div>
            <Database size={20} />
            <h4>Useful persistence</h4>
            <p>
              Resume unfinished sessions, revisit completed transcripts and reviews, track progress,
              generate reports and export JSON.
            </p>
          </div>
          <div>
            <Layers3 size={20} />
            <h4>A mobile-first product</h4>
            <p>
              Responsive mobile-first AI product experience, with touch-friendly practice and an
              editable transcript before submission.
            </p>
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="ai" className="architecture-panel ai-workflows">
        <div className="glass workflow-card">
          <Sparkles size={25} />
          <p className="eyebrow">CONVERSATION & EVALUATION</p>
          <h4>
            Specialized workflows,
            <br />
            shared application context.
          </h4>
          <p>
            Groq provides conversational and structured AI responses. The application supplies the
            practice mode, session history and persistent training context.
          </p>
          <code>openai/gpt-oss-120b</code>
          <div className="workflow-sequence">
            <span>Context</span>
            <ArrowDown size={16} />
            <span>Streaming conversation</span>
            <ArrowDown size={16} />
            <span>Structured evaluation</span>
          </div>
          <p className="metric-note">
            Uses existing models through server-side APIs; no custom LLM training or fine-tuning.
          </p>
        </div>
        <div className="glass workflow-card">
          <Globe size={25} />
          <p className="eyebrow">SPEECH INTERACTION</p>
          <h4>
            Speak. Review.
            <br />
            Then send.
          </h4>
          <p>
            Browser audio recording is transcribed with Whisper. Users can edit the transcript
            before submitting it. AI responses can be read aloud with browser Speech Synthesis.
          </p>
          <code>whisper-large-v3-turbo</code>
          <div className="workflow-sequence">
            <span>Record audio</span>
            <ArrowDown size={16} />
            <span>Transcribe → Edit → Submit</span>
            <ArrowDown size={16} />
            <span>AI response → Browser speech</span>
          </div>
          <p className="metric-note">
            The review evaluates submitted text; it is not a vocal-delivery assessment.
          </p>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="quality" className="architecture-panel quality-panel">
        <div className="glass quality-card">
          <span className="feature-icon">
            <Check />
          </span>
          <p className="eyebrow">DOCUMENTED v3.0.1 VERIFICATION</p>
          <h4>Quality you can inspect.</h4>
          <div className="test-metrics">
            <div>
              <strong>47</strong>
              <span>Unit / integration tests passed</span>
            </div>
            <div>
              <strong>21</strong>
              <span>Playwright browser tests passed</span>
            </div>
          </div>
          <p className="metric-note">
            Historical verification recorded for release v3.0.1, not a live test status.
          </p>
        </div>
        <div className="glass quality-card">
          <Cloud size={26} />
          <p className="eyebrow">DEPLOYMENT</p>
          <h4>Independent application layers.</h4>
          <p>
            A Netlify frontend, Render backend and Supabase PostgreSQL database. Docker
            configuration defines the backend container.
          </p>
          <Tags items={['Netlify', 'Render', 'Supabase', 'Docker']} />
          <p className="metric-note">
            Deployment configuration and automated testing are part of the product engineering,
            alongside the AI integration.
          </p>
        </div>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
