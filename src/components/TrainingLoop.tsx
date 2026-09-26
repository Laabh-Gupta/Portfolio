import { useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  Database,
  MessageSquare,
  Repeat2,
  ScanLine,
  Sparkles,
} from 'lucide-react';
import { m } from 'motion/react';
import { trainingLoop } from '../data/portfolio';

const icons = {
  message: MessageSquare,
  sparkles: Sparkles,
  scan: ScanLine,
  database: Database,
  repeat: Repeat2,
};
export default function TrainingLoop() {
  const [step, setStep] = useState(0);
  const selected = trainingLoop[step];
  const Icon = icons[selected.icon];
  return (
    <div className="training-loop glass">
      <div className="loop-intro">
        <span className="feature-icon">
          <BrainCircuit size={24} />
        </span>
        <div>
          <p className="eyebrow">THE PERSONALIZATION LOOP</p>
          <h3>Every session informs the next.</h3>
        </div>
      </div>
      <div className="loop-steps" role="group" aria-label="Explore the personalization loop">
        {trainingLoop.map((item, index) => {
          const StepIcon = icons[item.icon];
          return (
            <button
              key={item.title}
              aria-pressed={step === index}
              aria-controls="loop-detail"
              onClick={() => setStep(index)}
            >
              <span className="loop-number">0{index + 1}</span>
              <StepIcon size={23} />
              <span>{item.short}</span>
              <ArrowRight className="loop-arrow" size={17} />
            </button>
          );
        })}
      </div>
      <div id="loop-detail" className="loop-detail" aria-live="polite">
        <m.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={21} />
          <div>
            <h4>{selected.title}</h4>
            <p>{selected.detail}</p>
            <span className="loop-output">
              OUTPUT <ArrowRight size={13} />
              {selected.output}
            </span>
          </div>
        </m.div>
      </div>
      <div className="loop-return">
        <Repeat2 size={15} /> Saved context feeds back into future session requests.
      </div>
    </div>
  );
}
