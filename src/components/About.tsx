import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './ui';

export default function About() {
  return (
    <section id="about" tabIndex={-1} className="section container about-section">
      <Reveal className="about-layout">
        <div>
          <p className="eyebrow">
            <span>03</span> / THE WAY I WORK
          </p>
          <h2>
            The model is
            <br />
            just <span>the beginning.</span>
          </h2>
        </div>
        <div className="about-copy">
          <p>
            I’m Laabh, an AI & Data Engineer working across machine learning, software and the
            infrastructure that makes them useful.
          </p>
          <p>
            At EY, that means enterprise data ingestion and experiment visibility. In ArguLab, it
            means connecting streaming AI to authenticated APIs, persistent memory and an interface
            people can actually practice with.
          </p>
          <p>
            I’m interested in the whole path: what goes into the model, how someone uses its output,
            and what it takes to keep the application running.
          </p>
          <a href="#skills" className="text-link">
            Explore my engineering toolkit <ArrowUpRight size={17} />
          </a>
        </div>
      </Reveal>
      <div className="principle-line">
        <div>
          <span>01</span>
          <h3>Understand the data.</h3>
          <p>Ingestion, representation, context.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Build the application.</h3>
          <p>Models, interfaces, APIs, persistence.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Own the delivery.</h3>
          <p>Evaluation, testing, deployment.</p>
        </div>
      </div>
    </section>
  );
}
