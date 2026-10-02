import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; age: number; life: number };

/** The supplied sin/cos vector field, adapted to monochrome and finite, visible bursts. */
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
      visible = false,
      steps = 0,
      last = 0;
    let particles: Particle[] = [];
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
      context.fillStyle = 'rgba(11,11,11,0.12)';
      context.fillRect(0, 0, width, height);
      context.fillStyle = 'rgba(229,229,222,0.58)';
      particles.forEach((p, i) => {
        if (++p.age > p.life) Object.assign(p, seed(i + steps));
        const angle = (Math.cos(p.x * 0.005) + Math.sin(p.y * 0.005)) * Math.PI;
        p.vx += Math.cos(angle) * 0.2;
        p.vy += Math.sin(angle) * 0.2;
        const dx = p.x - pointer.x,
          dy = p.y - pointer.y,
          distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 150) {
          const force = ((150 - distance) / 150) * 0.8;
          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;
        }
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x = (p.x + p.vx + width) % width;
        p.y = (p.y + p.vy + height) % height;
        context.fillRect(p.x, p.y, 1.3, 1.3);
      });
    }
    function draw(time: number) {
      frame = 0;
      if (!visible || document.hidden || !media.matches || steps >= 120) return;
      if (time - last >= 32) {
        last = time;
        steps++;
        step();
      }
      if (steps < 120) frame = requestAnimationFrame(draw);
      else if (canvas) canvas.dataset.motion = 'settled';
    }
    function configure() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!canvas) return;
      if (!media.matches) {
        context.clearRect(0, 0, width, height);
        canvas.dataset.motion = 'static';
        return;
      }
      if (visible && !document.hidden && steps < 120) {
        canvas.dataset.motion = 'running';
        frame = requestAnimationFrame(draw);
      } else canvas.dataset.motion = steps >= 120 ? 'settled' : 'paused';
    }
    function move(event: PointerEvent) {
      if (!canvas || !media.matches || event.pointerType !== 'mouse') return;
      const r = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - r.left, y: event.clientY - r.top };
      if (steps >= 120 && visible) {
        steps = 75;
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
      if (!width || !height) return;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(520, Math.round(width * 0.48)) }, (_, i) =>
        seed(i),
      );
      steps = 0;
      configure();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      configure();
    });
    const parent = canvas.parentElement;
    parent?.addEventListener('pointermove', move, { passive: true });
    parent?.addEventListener('pointerleave', leave);
    resize.observe(canvas);
    observer.observe(canvas);
    media.addEventListener('change', configure);
    document.addEventListener('visibilitychange', configure);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      media.removeEventListener('change', configure);
      document.removeEventListener('visibilitychange', configure);
      parent?.removeEventListener('pointermove', move);
      parent?.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <canvas className="flow-field" ref={ref} data-motion="static" aria-hidden="true" />;
}
