import { BrainCircuit, Braces, Workflow, ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading } from './ui';

export default function About() {
  return (
    <section id="about" tabIndex={-1} className="section container about-section">
      <Reveal className="about-layout">
        <SectionHeading
          number="01"
          label="A LITTLE CONTEXT"
          title="A model is only the beginning."
        />
        <div className="about-copy">
          <p>
            I’m a Computer Science engineer specializing in AI/ML. My work has grown from academic
            machine learning projects into enterprise AI and data engineering at EY, alongside
            building independent AI products.
          </p>
          <p>
            I like working across the boundaries: connecting models to useful interfaces, dependable
            APIs, persistent data and deployment workflows.
          </p>
          <div className="about-education">
            <span className="tiny-dot" /> B.Tech, CSE (AI & ML) <span>VIT Chennai · 2022–2026</span>
          </div>
        </div>
      </Reveal>
      <div className="capabilities">
        {[
          {
            icon: BrainCircuit,
            title: 'Intelligence',
            text: 'Models, LLM workflows & evaluation',
            number: '01',
          },
          {
            icon: Braces,
            title: 'Applications',
            text: 'Interfaces, authenticated APIs & data',
            number: '02',
          },
          {
            icon: Workflow,
            title: 'Engineering',
            text: 'Testing, containers & deployment',
            number: '03',
          },
        ].map(({ icon: Icon, title, text, number }) => (
          <div className="capability" key={title}>
            <div className="capability-icon">
              <Icon size={22} />
            </div>
            <div>
              <span className="micro-label">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            <ArrowRight size={17} className="capability-arrow" />
          </div>
        ))}
      </div>
    </section>
  );
}
