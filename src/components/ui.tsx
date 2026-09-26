import { useRef, type ReactNode } from 'react';
import { m, useInView, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Tabs } from '@base-ui/react/tabs';

export function SectionHeading({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{number}</span> / {label}
      </p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const reduced = useReducedMotion();
  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
      animate={{ y: inView || reduced ? 0 : 12 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  );
}

export function ExternalLink({
  href,
  children,
  className = '',
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {arrow && <ArrowUpRight size={16} aria-hidden="true" />}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TabList({
  items,
  label,
  className = '',
}: {
  items: { value: string; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <Tabs.List className={`tab-list ${className}`} aria-label={label}>
      {items.map((item) => (
        <Tabs.Tab key={item.value} value={item.value} className="tab-button">
          {item.label}
        </Tabs.Tab>
      ))}
    </Tabs.List>
  );
}
