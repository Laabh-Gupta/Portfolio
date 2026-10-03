import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './ui';

export default function About() {
  return (
    <section id="about" tabIndex={-1} className="section container about-section">
      <Reveal className="about-layout">
        <p className="eyebrow">
          <span>03</span> / PERSPECTIVE
        </p>
        <div className="about-statement">
          <h2>
            The model is
            <br />
            only the beginning.
          </h2>
          <div className="about-copy">
            <p>
              I’m Laabh, an AI &amp; Data Engineer interested in everything that makes intelligence
              useful.
            </p>
            <p>
              At EY, I work across enterprise data and experiment visibility. In ArguLab, I connect
              streaming AI to authenticated APIs, persistent context and a product people can
              practice with.
            </p>
            <p>
              My work spans the whole path: the data going in, the model’s output, the interface
              around it, and the infrastructure that keeps it running.
            </p>
            <a href="#skills" className="text-link">
              Explore the engineering toolkit <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </Reveal>
      <ol className="engineering-path" aria-label="My engineering approach">
        <li>
          <span>01</span>
          <strong>Understand</strong>
          <p>Data, context, the actual problem.</p>
        </li>
        <li>
          <span>02</span>
          <strong>Connect</strong>
          <p>Models, APIs, interfaces, persistence.</p>
        </li>
        <li>
          <span>03</span>
          <strong>Deliver</strong>
          <p>Evaluation, testing, deployment.</p>
        </li>
      </ol>
    </section>
  );
}
