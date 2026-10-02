import { useEffect, useRef } from 'react';

/** Magnetic target morph and contrast inversion; native pointer everywhere else. */
export default function MagneticCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const media = matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let frame = 0,
      active = false;
    let current = { x: 0, y: 0, w: 0, h: 0 },
      target = { ...current };
    function draw() {
      frame = 0;
      if (!node || !active) return;
      let distance = 0;
      for (const key of ['x', 'y', 'w', 'h'] as const) {
        const delta = target[key] - current[key];
        current[key] += delta * 0.2;
        distance += Math.abs(delta);
      }
      node.style.transform = `translate3d(${current.x}px,${current.y}px,0)`;
      node.style.width = `${current.w}px`;
      node.style.height = `${current.h}px`;
      if (distance > 0.15) frame = requestAnimationFrame(draw);
      else node.dataset.motion = 'settled';
    }
    function hide() {
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      if (node) {
        node.style.opacity = '0';
        node.dataset.motion = 'idle';
      }
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) {
        hide();
        return;
      }
      const control = event.target.closest<HTMLElement>('[data-magnetic]');
      if (!control) {
        hide();
        return;
      }
      const r = control.getBoundingClientRect();
      target = {
        x: r.x - 5 + (event.clientX - r.x - r.width / 2) * 0.08,
        y: r.y - 5 + (event.clientY - r.y - r.height / 2) * 0.08,
        w: r.width + 10,
        h: r.height + 10,
      };
      if (!active) {
        current = { x: event.clientX - 12, y: event.clientY - 12, w: 24, h: 24 };
        active = true;
      }
      if (node) {
        node.style.opacity = '1';
        node.dataset.motion = 'running';
      }
      if (!frame) frame = requestAnimationFrame(draw);
    }
    function configure() {
      hide();
      document.removeEventListener('pointermove', move);
      document.documentElement.classList.toggle('magnetic-enabled', media.matches);
      if (media.matches) document.addEventListener('pointermove', move, { passive: true });
    }
    configure();
    media.addEventListener('change', configure);
    document.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('scroll', hide, { passive: true });
    return () => {
      hide();
      document.documentElement.classList.remove('magnetic-enabled');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('scroll', hide);
      media.removeEventListener('change', configure);
    };
  }, []);
  return <div ref={ref} className="magnetic-cursor" data-motion="idle" aria-hidden="true" />;
}
