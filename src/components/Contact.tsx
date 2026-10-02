import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { personal } from '../data/portfolio';
import { ExternalLink } from './ui';
import FlowField from './FlowField';

export default function Contact() {
  const [copyState, setCopyState] = useState('');
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopyState('Email copied');
    } catch {
      setCopyState('Please select and copy the email address.');
    }
  }
  return (
    <section id="contact" tabIndex={-1} className="contact-section">
      <div className="container contact-panel">
        <FlowField />
        <div className="contact-heading">
          <p className="eyebrow">
            <span>06</span> / START A CONVERSATION
          </p>
          <h2>
            What are
            <br />
            you <span>building?</span>
          </h2>
          <p>
            AI products, data systems, and engineering challenges.
            <br />
            I’d like to hear what you have in mind.
          </p>
          <a href={`mailto:${personal.email}`} className="button button-primary" data-magnetic>
            Let’s talk <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="contact-details">
          <ArrowUpRight className="contact-arrow" size={100} strokeWidth={0.7} aria-hidden="true" />
          <span className="micro-label">THE BEST WAY TO REACH ME</span>
          <div className="email-copy">
            <a href={`mailto:${personal.email}`}>{personal.email}</a>
            <button className="icon-button" onClick={copyEmail} aria-label="Copy email address">
              {copyState === 'Email copied' ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <span role="status" className="copy-status">
            {copyState}
          </span>
          <div className="contact-socials">
            <ExternalLink href={personal.linkedin} className="text-link">
              LinkedIn
            </ExternalLink>
            <ExternalLink href={personal.github} className="text-link">
              GitHub
            </ExternalLink>
          </div>
          <p className="contact-location">
            {personal.location}
            <span> / </span>
            <a href="tel:+919793084444">{personal.phone}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
