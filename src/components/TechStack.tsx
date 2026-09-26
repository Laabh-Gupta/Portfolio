import { ArrowUpRight, BookOpen, Layers3 } from 'lucide-react';
import { Tabs } from '@base-ui/react/tabs';
import { Link } from 'react-router-dom';
import { skillGroups } from '../data/portfolio';
import { ExternalLink, SectionHeading, Tags } from './ui';

export default function TechStack() {
  return (
    <section id="skills" tabIndex={-1} className="section container">
      <SectionHeading
        number="04"
        label="THE ENGINEERING TOOLKIT"
        title="A connected stack. Real evidence."
        description="Explore the tools, and the work behind them."
      />
      <Tabs.Root defaultValue="ai" orientation="vertical" className="glass skill-explorer">
        <Tabs.List className="skill-navigation" aria-label="Technical skill categories">
          {skillGroups.map((group, index) => (
            <Tabs.Tab className="skill-tab" key={group.id} value={group.id}>
              <span className="micro-label">0{index + 1}</span>
              {group.label}
              <ArrowUpRight size={15} />
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <div className="skill-panels">
          {skillGroups.map((group) => (
            <Tabs.Panel key={group.id} value={group.id} className="skill-panel">
              <div className="skill-panel-top">
                <span className="skill-icon">
                  <Layers3 size={22} />
                </span>
                <span className="micro-label">{group.label}</span>
              </div>
              <h3>{group.headline}</h3>
              <p>{group.description}</p>
              <Tags items={group.skills} />
              <div className="skill-evidence">
                <p className="micro-label">WHERE IT CONNECTS</p>
                {group.evidence.map((item) => (
                  <div className="evidence-item" key={item.name}>
                    <strong>
                      {item.href ? (
                        item.href.startsWith('/') ? (
                          <Link to={item.href}>
                            {item.name}
                            <ArrowUpRight size={14} />
                          </Link>
                        ) : (
                          <ExternalLink href={item.href}>{item.name}</ExternalLink>
                        )
                      ) : (
                        item.name
                      )}
                    </strong>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
              {group.learning && (
                <p className="learning-note">
                  <BookOpen size={16} />
                  {group.learning}
                </p>
              )}
            </Tabs.Panel>
          ))}
        </div>
      </Tabs.Root>
      <div className="engineering-line">
        <span>THE FULL PIPELINE</span>
        <p>
          Model / AI <b>→</b> Application <b>→</b> APIs <b>→</b> Database <b>→</b> Testing <b>→</b>{' '}
          Containers <b>→</b> Deployment
        </p>
      </div>
    </section>
  );
}
