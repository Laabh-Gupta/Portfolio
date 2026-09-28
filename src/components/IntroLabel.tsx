import { useEffect, useRef } from 'react';

const label = 'INTELLIGENCE, ENGINEERED.';
export default function IntroLabel() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    const media = matchMedia('(prefers-reduced-motion: no-preference)');
    if (!element || !media.matches) return;
    let frame = 0;
    let start = 0;
    let last = 0;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    function tick(time: number) {
      if (!element) return;
      if (!start) start = time;
      const elapsed = time - start;
      if (elapsed > 650 || !media.matches || document.hidden) {
        element.textContent = label;
        return;
      }
      if (time - last > 45) {
        const count = Math.floor((elapsed / 650) * label.length);
        element.textContent = [...label]
          .map((letter, i) =>
            i < count || letter === ' ' || letter === '.' || letter === ','
              ? letter
              : alphabet[(i + Math.floor(elapsed / 45)) % alphabet.length],
          )
          .join('');
        last = time;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    const stop = () => {
      cancelAnimationFrame(frame);
      element.textContent = label;
    };
    media.addEventListener('change', stop);
    return () => {
      stop();
      media.removeEventListener('change', stop);
    };
  }, []);
  return (
    <p className="hero-kicker">
      <span className="sr-only">{label}</span>
      <span ref={ref} aria-hidden="true">
        {label}
      </span>
    </p>
  );
}
