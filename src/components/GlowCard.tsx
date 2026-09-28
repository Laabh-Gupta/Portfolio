import { useRef, type ComponentPropsWithoutRef } from 'react';

/** Local, event-driven spotlight adapted from the supplied 21st.dev GlowCard concept. */
export default function GlowCard({
  children,
  className = '',
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  const ref = useRef<HTMLElement>(null);
  return (
    <article
      {...props}
      ref={ref}
      className={`glow-card ${className}`}
      onPointerMove={(event) => {
        if (
          event.pointerType !== 'mouse' ||
          !matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)').matches
        )
          return;
        const card = ref.current;
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
      }}
    >
      {children}
    </article>
  );
}
