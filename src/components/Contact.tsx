import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { personal } from '../data/portfolio';
import { ExternalLink } from './ui';

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
    <section id="contact" tabIndex={-1} className="contact-section" data-atmosphere="contact">
      <div className="container contact-panel">
        <p className="eyebrow">
          <span>06</span> / THE NEXT CONVERSATION
        </p>
        <div className="contact-heading">
          <h2>
            Something worth
            <br />
            <span>building together.</span>
          </h2>
          <a
            href={`mailto:${personal.email}`}
            className="contact-invite"
            aria-label="Let’s talk by email"
            data-magnetic
          >
            <ArrowUpRight size={70} strokeWidth={1} />
          </a>
        </div>
        <div className="contact-bottom">
          <p>
            AI products. Data systems. Thoughtful engineering.
            <br />
            I’d like to hear what you have in mind.
          </p>
          <div className="contact-details">
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
              <a href="tel:+919793084444" className="text-link">
                {personal.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
