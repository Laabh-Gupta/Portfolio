import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail, MapPin } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
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
    <section id="contact" tabIndex={-1} className="section container contact-section">
      <div className="glass contact-panel">
        <div>
          <p className="eyebrow">
            <span>06</span> / START A CONVERSATION
          </p>
          <h2>
            Let’s build something
            <br />
            <span>intelligent.</span>
          </h2>
          <p>
            Have an AI product, an engineering challenge or
            <br className="desktop-break" /> an idea worth exploring? Let’s talk.
          </p>
          <div className="contact-actions">
            <a href={`mailto:${personal.email}`} className="button button-primary">
              <Mail size={17} />
              Email me
              <ArrowUpRight size={17} />
            </a>
            <ExternalLink
              href={personal.linkedin}
              className="button button-secondary"
              arrow={false}
            >
              <Linkedin size={17} />
              LinkedIn
            </ExternalLink>
            <ExternalLink href={personal.github} className="icon-button" arrow={false}>
              <Github size={19} />
              <span className="sr-only">GitHub</span>
            </ExternalLink>
          </div>
        </div>
        <div className="contact-details">
          <span className="contact-orbit" aria-hidden="true">
            <span />
            <ArrowUpRight size={48} />
          </span>
          <div className="email-copy">
            <a href={`mailto:${personal.email}`}>{personal.email}</a>
            <button className="icon-button" onClick={copyEmail} aria-label="Copy email address">
              {copyState === 'Email copied' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <span className="copy-status" role="status">
            {copyState}
          </span>
          <span className="contact-location">
            <MapPin size={14} />
            {personal.location}
            <span>·</span>
            <a href="tel:+919793084444">{personal.phone}</a>
          </span>
        </div>
      </div>
    </section>
  );
}
