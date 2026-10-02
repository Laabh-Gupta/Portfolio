import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';

/** Supplied GlowCard structure: local surface, masked luminous rim, exterior bloom. */
export default function GlowCard({
  children,
  className = '',
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const media = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    function move(event: PointerEvent) {
      if (!card || event.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      const x = event.clientX - r.left,
        y = event.clientY - r.top;
      const near = x > -100 && x < r.width + 100 && y > -100 && y < r.height + 100;
      card.dataset.glow = near ? 'near' : 'off';
      if (near) {
        card.style.setProperty('--glow-x', `${x}px`);
        card.style.setProperty('--glow-y', `${y}px`);
      }
    }
    function hide() {
      if (card) card.dataset.glow = 'off';
    }
    function configure() {
      document.removeEventListener('pointermove', move);
      hide();
      if (media.matches) document.addEventListener('pointermove', move, { passive: true });
    }
    configure();
    media.addEventListener('change', configure);
    document.addEventListener('pointerleave', hide);
    window.addEventListener('scroll', hide, { passive: true });
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('scroll', hide);
      media.removeEventListener('change', configure);
    };
  }, []);
  return (
    <article {...props} ref={ref} className={`glow-card ${className}`}>
      <span className="glow-surface" aria-hidden="true" />
      {children}
    </article>
  );
}
