import { useEffect, useRef } from 'react';

/** A finite contact-section flow study, inspired by the supplied 21st.dev canvas. */
export default function FlowField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const media = matchMedia(
      '(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let width = 0,
      height = 0,
      frame = 0,
      visible = false,
      steps = 0,
      last = 0;
    let particles: { x: number; y: number }[] = [];
    function draw(time: number) {
      frame = 0;
      if (!context || !canvas || !visible || document.hidden || !media.matches || steps >= 120)
        return;
      if (time - last >= 33) {
        last = time;
        steps++;
        context.strokeStyle = '#98d6de';
        context.lineWidth = 0.7;
        context.globalAlpha = 0.16;
        particles.forEach((p) => {
          const angle = (Math.cos(p.x * 0.007) + Math.sin(p.y * 0.008)) * Math.PI;
          context.beginPath();
          context.moveTo(p.x, p.y);
          p.x += Math.cos(angle) * 2;
          p.y += Math.sin(angle) * 2;
          context.lineTo(p.x, p.y);
          context.stroke();
        });
      }
      if (steps < 120) frame = requestAnimationFrame(draw);
      else canvas.dataset.motion = 'settled';
    }
    function configure() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!canvas || !context) return;
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
    const resize = new ResizeObserver(() => {
      const box = canvas.getBoundingClientRect();
      if (Math.abs(width - box.width) < 1 && Math.abs(height - box.height) < 1) return;
      width = box.width;
      height = box.height;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 42 }, (_, i) => ({
        x: (i * 97) % width,
        y: (i * 61) % height,
      }));
      steps = 0;
      configure();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      configure();
    });
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
    };
  }, []);
  return <canvas className="flow-field" ref={ref} data-motion="static" aria-hidden="true" />;
}
