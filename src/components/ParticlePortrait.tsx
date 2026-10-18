import { useEffect, useRef, useState } from 'react';
import { MousePointer2, ScanFace } from 'lucide-react';
import { portraitPoints, portraitMesh, portraitContours } from '../data/portrait';

type Mode = 'particles' | 'wireframe';
type Point = readonly [number, number, number, number];
type Segment = readonly [number, number, number, number, number, number];

/** Photo-derived facial relief rendered locally. No photo, model inference or camera at runtime. */
export default function ParticlePortrait() {
  const [mode, setMode] = useState<Mode>('particles');
  const figure = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const redraw = useRef<(() => void) | null>(null);

  useEffect(() => {
    const host = figure.current;
    const surface = canvas.current;
    const context = surface?.getContext('2d');
    if (!host || !surface || !context) return;
    const element = host,
      drawing = surface,
      ctx = context;
    const motion = matchMedia('(prefers-reduced-motion: no-preference)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0,
      visible = false,
      started = 0,
      progress = 0;
    let pose = { x: 0, y: 0 },
      target = { x: 0, y: 0 };
    let mouse = { x: -1000, y: -1000, strength: 0, target: 0 };

    function project(x: number, y: number, z: number): [number, number] {
      const cx = x - 260,
        cy = y - 260;
      const xx = cx * Math.cos(pose.x) + z * Math.sin(pose.x);
      const zz = z * Math.cos(pose.x) - cx * Math.sin(pose.x);
      const yy = cy * Math.cos(pose.y) - zz * Math.sin(pose.y);
      const depth = zz * Math.cos(pose.y) + cy * Math.sin(pose.y);
      const perspective = 720 / (720 - depth);
      return [260 + xx * perspective, 260 + yy * perspective];
    }
    function lines(segments: readonly Segment[], opacity: number) {
      ctx.beginPath();
      for (const line of segments) {
        const a = project(line[0], line[1], line[2]);
        const b = project(line[3], line[4], line[5]);
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
      }
      ctx.strokeStyle = `rgba(201,248,92,${opacity * progress})`;
      ctx.lineWidth = 0.55;
      ctx.stroke();
    }
    function paint() {
      const width = drawing.width;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, width);
      ctx.setTransform(width / 520, 0, 0, width / 520, 0, 0);
      const wireframe = element.dataset.mode === 'wireframe';
      if (wireframe) lines(portraitMesh, 0.15);
      lines(portraitContours, wireframe ? 0.55 : 0.12);
      for (let i = 0; i < portraitPoints.length; i++) {
        const point = portraitPoints[i] as Point;
        let [x, y] = project(point[0], point[1], point[2]);
        const spread = 1 - progress;
        const angle = i * 2.39996;
        x += Math.cos(angle) * (50 + (i % 67)) * spread;
        y += Math.sin(angle) * (45 + (i % 83)) * spread;
        const dx = x - mouse.x,
          dy = y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 63) {
          const force = (1 - distance / 63) ** 2 * 14 * mouse.strength;
          x += (dx / distance) * force;
          y += (dy / distance) * force;
        }
        const intensity = point[3];
        ctx.fillStyle = intensity > 0.8 ? '#e7ffb0' : '#c9f85c';
        ctx.globalAlpha =
          (0.22 + intensity * 0.75) * (wireframe ? 0.65 : 1) * (0.2 + progress * 0.8);
        ctx.beginPath();
        ctx.arc(x, y, 0.55 + intensity * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      element.dataset.ready = 'true';
      element.style.setProperty('--portrait-yaw', pose.x.toFixed(3));
    }
    function tick(time: number) {
      frame = 0;
      if (!visible || document.hidden) return;
      if (!motion.matches) {
        progress = 1;
        pose = { x: 0, y: 0 };
        mouse.strength = 0;
        paint();
        element.dataset.motion = 'static';
        return;
      }
      if (!started) started = time;
      const t = Math.min(1, (time - started) / 1100);
      progress = 1 - (1 - t) ** 3;
      pose.x += (target.x - pose.x) * 0.12;
      pose.y += (target.y - pose.y) * 0.12;
      mouse.strength += (mouse.target - mouse.strength) * 0.14;
      paint();
      const moving =
        t < 1 ||
        Math.abs(target.x - pose.x) + Math.abs(target.y - pose.y) > 0.0003 ||
        Math.abs(mouse.target - mouse.strength) > 0.003;
      element.dataset.motion = moving ? 'running' : 'settled';
      if (moving) frame = requestAnimationFrame(tick);
    }
    function wake() {
      if (visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    }
    function availability() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!visible || document.hidden) {
        element.dataset.motion = 'paused';
        return;
      }
      wake();
    }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const size = Math.round(drawing.clientWidth * dpr);
      drawing.width = drawing.height = Math.max(size, 1);
      wake();
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !motion.matches || !pointer.matches) return;
      const rect = drawing.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      target = { x: (x - 0.5) * 0.5, y: (y - 0.5) * 0.28 };
      mouse = { ...mouse, x: x * 520, y: y * 520, target: 1 };
      wake();
    }
    function leave() {
      target = { x: 0, y: 0 };
      mouse.target = 0;
      wake();
    }
    function preferences() {
      leave();
      if (!motion.matches) {
        progress = 1;
        pose = { x: 0, y: 0 };
        mouse.strength = 0;
      }
      availability();
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        availability();
      },
      { threshold: 0.02 },
    );
    const sizes = new ResizeObserver(resize);
    observer.observe(drawing);
    sizes.observe(drawing);
    drawing.addEventListener('pointermove', move, { passive: true });
    drawing.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', availability);
    motion.addEventListener('change', preferences);
    pointer.addEventListener('change', preferences);
    redraw.current = wake;
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizes.disconnect();
      drawing.removeEventListener('pointermove', move);
      drawing.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', availability);
      motion.removeEventListener('change', preferences);
      pointer.removeEventListener('change', preferences);
      redraw.current = null;
    };
  }, []);

  useEffect(() => {
    redraw.current?.();
  }, [mode]);

  return (
    <figure
      ref={figure}
      className="intro-sculpture face-portrait"
      data-mode={mode}
      aria-label="Interactive particle portrait of Laabh Gupta"
      aria-describedby="portrait-help"
    >
      <div className="intro-cross cross-one" aria-hidden="true">
        +
      </div>
      <div className="intro-cross cross-two" aria-hidden="true">
        +
      </div>
      <div className="portrait-topline" aria-hidden="true">
        <span>
          <ScanFace size={13} /> A PORTRAIT IN POINTS
        </span>
        <span>LAABH GUPTA / 01</span>
      </div>
      <div className="portrait-stage">
        <svg className="portrait-guides" viewBox="0 0 520 520" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="portrait-halo">
              <stop offset="0" stopColor="#c9f85c" stopOpacity=".045" />
              <stop offset="1" stopColor="#c9f85c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="260" cy="260" r="250" fill="url(#portrait-halo)" />
          <circle className="orbit-guide" cx="260" cy="260" r="235" />
          <path className="orbit-axis" d="M20 260H500M260 20V500" />
          <path
            className="portrait-brackets"
            d="M130 98h-12v24M390 98h12v24M130 422h-12v-24M390 422h12v-24"
          />
        </svg>
        <svg
          className="portrait-fallback"
          viewBox="0 0 520 520"
          aria-hidden="true"
          focusable="false"
        >
          {portraitPoints
            .filter((_, i) => i % 2 === 0)
            .map((p, i) => (
              <circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r={0.55 + p[3] * 0.7}
                fill="#c9f85c"
                opacity={0.22 + p[3] * 0.75}
              />
            ))}
        </svg>
        <canvas ref={canvas} className="portrait-canvas" aria-hidden="true" />
      </div>
      <figcaption className="portrait-bottomline">
        <span className="portrait-explore" id="portrait-help">
          <MousePointer2 size={11} />
          <span>MOVE TO EXPLORE</span>
        </span>
        <div className="portrait-controls" role="group" aria-label="Portrait display">
          <button
            type="button"
            aria-pressed={mode === 'particles'}
            onClick={() => setMode('particles')}
          >
            Particles
          </button>
          <button
            type="button"
            aria-pressed={mode === 'wireframe'}
            onClick={() => setMode('wireframe')}
          >
            Wireframe
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
