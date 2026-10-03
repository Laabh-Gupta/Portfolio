import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; age: number; life: number };
type Profile = { opacity: number; density: number; scale: number; x: number; y: number };
const profiles: Record<string, Profile> = {
  hero: { opacity: 0.2, density: 0.24, scale: 0.72, x: 160, y: 0 },
  projects: { opacity: 0.17, density: 0.18, scale: 0.85, x: 0, y: 130 },
  experience: { opacity: 0.19, density: 0.16, scale: 0.65, x: 100, y: 60 },
  about: { opacity: 0.17, density: 0.2, scale: 0.8, x: 240, y: 110 },
  skills: { opacity: 0.17, density: 0.16, scale: 0.9, x: 70, y: 140 },
  learning: { opacity: 0.16, density: 0.16, scale: 0.75, x: 200, y: 70 },
  contact: { opacity: 0.28, density: 0.35, scale: 1, x: 0, y: 0 },
  case: { opacity: 0.18, density: 0.2, scale: 0.8, x: 130, y: 80 },
};

/** One viewport canvas: the original contact vector field, shared across all chapters. */
export default function FlowField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const context = ctx;
    const media = matchMedia(
      '(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let width = 0,
      height = 0,
      frame = 0,
      selectionFrame = 0,
      steps = 0,
      last = 0;
    let active = '';
    let profile = profiles.hero;
    let particles: Particle[] = [];
    let sections: Element[] = [];
    let pointer = { x: -1000, y: -1000 };
    function seed(i: number): Particle {
      return {
        x: (i * 137.51) % width,
        y: (i * 73.73) % height,
        vx: 0,
        vy: 0,
        age: 0,
        life: 100 + ((i * 37) % 200),
      };
    }
    function step() {
      // Transparent trail decay lets the same field sit over charcoal and paper.
      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = 'rgba(0,0,0,0.1)';
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = 'rgba(235,235,235,0.6)';
      particles.forEach((p, i) => {
        if (++p.age > p.life) Object.assign(p, seed(i + steps));
        const angle =
          (Math.cos((p.x + profile.x) * 0.005 * profile.scale) +
            Math.sin((p.y + profile.y) * 0.005 * profile.scale)) *
          Math.PI;
        p.vx += Math.cos(angle) * 0.16;
        p.vy += Math.sin(angle) * 0.16;
        const dx = p.x - pointer.x,
          dy = p.y - pointer.y,
          distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 150) {
          const force = ((150 - distance) / 150) * 0.65;
          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;
        }
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x = (p.x + p.vx + width) % width;
        p.y = (p.y + p.vy + height) % height;
        context.fillRect(p.x, p.y, 1.15, 1.15);
      });
    }
    function draw(time: number) {
      frame = 0;
      if (document.hidden || !media.matches || steps >= 120) return;
      if (time - last >= 40) {
        last = time;
        steps++;
        step();
      }
      if (steps < 120) frame = requestAnimationFrame(draw);
      else canvas!.dataset.motion = 'settled';
    }
    function configure() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!media.matches) {
        canvas!.dataset.motion = 'static';
        return;
      }
      if (!document.hidden && steps < 120) {
        canvas!.dataset.motion = 'running';
        frame = requestAnimationFrame(draw);
      } else canvas!.dataset.motion = steps >= 120 ? 'settled' : 'paused';
    }
    function prepare() {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      pointer = { x: -1000, y: -1000 };
      const count = media.matches
        ? Math.min(380, Math.round(width * profile.density))
        : Math.min(90, Math.round(width * 0.16));
      particles = Array.from({ length: count }, (_, i) => seed(i));
      // A composed still is present immediately, including on touch/reduced-motion devices.
      for (steps = 0; steps < 65; steps++) step();
      canvas!.dataset.particles = String(count);
      configure();
    }
    function selectSection() {
      selectionFrame = 0;
      const center = innerHeight * 0.48;
      const section = sections.find((node) => {
        const r = node.getBoundingClientRect();
        return r.top <= center && r.bottom > center;
      });
      const key =
        section?.getAttribute('data-atmosphere') ||
        section?.id ||
        (location.pathname.startsWith('/projects/') ? 'case' : 'hero');
      if (key === active) return;
      active = key;
      profile = profiles[key] || profiles.case;
      canvas!.dataset.section = key;
      canvas!.style.setProperty('--field-opacity', String(profile.opacity));
      prepare();
    }
    function queueSelection() {
      if (!selectionFrame) selectionFrame = requestAnimationFrame(selectSection);
    }
    function refreshSections() {
      sections = Array.from(document.querySelectorAll('main > section, main article > section'));
      queueSelection();
    }
    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType !== 'mouse' || document.hidden) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (steps >= 120) {
        steps = 90;
        configure();
      }
    }
    function leave() {
      pointer = { x: -1000, y: -1000 };
    }
    const resize = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      if (Math.abs(width - r.width) < 1 && Math.abs(height - r.height) < 1) return;
      width = r.width;
      height = r.height;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      prepare();
      queueSelection();
    });
    const mutation = new MutationObserver(refreshSections);
    const main = document.getElementById('main');
    if (main) mutation.observe(main, { childList: true, subtree: true });
    refreshSections();
    resize.observe(canvas);
    window.addEventListener('scroll', queueSelection, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    media.addEventListener('change', prepare);
    document.addEventListener('visibilitychange', configure);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(selectionFrame);
      resize.disconnect();
      mutation.disconnect();
      window.removeEventListener('scroll', queueSelection);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      media.removeEventListener('change', prepare);
      document.removeEventListener('visibilitychange', configure);
    };
  }, []);
  return <canvas className="flow-field" ref={ref} data-motion="static" aria-hidden="true" />;
}
