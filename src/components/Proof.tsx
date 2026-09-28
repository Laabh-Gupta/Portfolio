import { ArrowUpRight, Award, GraduationCap } from 'lucide-react';
import { certifications, personal } from '../data/portfolio';
import { ExternalLink, SectionHeading } from './ui';

export default function Proof() {
  return (
    <section id="learning" tabIndex={-1} className="section container proof-section">
      <SectionHeading
        number="05"
        label="FOUNDATIONS & CONTINUED LEARNING"
        title="Education & continued learning."
      />
      <div className="proof-grid">
        <div className="education-block">
          <GraduationCap size={27} />
          <span className="micro-label">EDUCATION</span>
          <h3>
            Vellore Institute of Technology<span>Chennai</span>
          </h3>
          <p>
            B.Tech in Computer Science Engineering with Artificial Intelligence and Machine Learning
          </p>
          <div>
            <span>2022 – 2026</span>
            <strong>
              8.1 <span>/ 10 CGPA</span>
            </strong>
          </div>
        </div>
        <div className="certifications">
          <p className="micro-label">CERTIFICATIONS & LEARNING</p>
          {certifications.map((cert) => (
            <details className="certification" key={cert.name}>
              <summary>
                <Award size={19} />
                <span>
                  <strong>{cert.name}</strong>
                  <span>
                    {cert.issuer} <b>·</b> {cert.detail}
                  </span>
                </span>
                <span className="cert-expand" aria-hidden="true">
                  +
                </span>
              </summary>
              <div>
                <p>{cert.topics}</p>
                {cert.href && (
                  <ExternalLink href={cert.href} className="text-link">
                    View certificate
                  </ExternalLink>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
      <div className="achievement-row">
        <ExternalLink href={personal.leetcode} arrow={false}>
          <strong>
            370<span>+</span>
          </strong>
          <span>
            LeetCode problems
            <ArrowUpRight size={13} />
          </span>
        </ExternalLink>
        <ExternalLink href={personal.leetcode} arrow={false}>
          <strong>
            Top 2<span>%</span>
          </strong>
          <span>
            LeetCode globally
            <ArrowUpRight size={13} />
          </span>
        </ExternalLink>
        <div>
          <strong>Top 20</strong>
          <span>National HackClub AI/ML selection</span>
        </div>
        <div>
          <strong>
            8.1<span>/10</span>
          </strong>
          <span>VIT Chennai CGPA</span>
        </div>
      </div>
    </section>
  );
}
