import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoveUpRight, RotateCcw, ScanFace } from 'lucide-react';
import { identityMetadata, identityFeatureEdges } from '../data/identity';
import {
  basePose,
  drawIdentity,
  facetPath,
  identityFrame,
  type IdentityMode,
} from './identity/raster';

const still = identityFrame();
type Controller = { wake: () => void; scan: () => void };
const views: { id: IdentityMode; label: string }[] = [
  { id: 'wireframe', label: 'Wireframe' },
  { id: 'solid', label: 'Solid' },
  { id: 'particles', label: 'Points' },
];

/** A neutral, multi-reference 3D mesh. All styling is geometric, independent of photo lighting. */
export default function ParticlePortrait() {
  const [mode, setMode] = useState<IdentityMode>('wireframe');
  const [scanMessage, setScanMessage] = useState('');
  const figure = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<Controller | null>(null);

  useEffect(() => {
    const host = figure.current,
      surface = canvas.current,
      context = surface?.getContext('2d');
    if (!host || !surface || !context) return;
    const element = host,
      drawing = surface,
      ctx = context;
    const motion = matchMedia('(prefers-reduced-motion: no-preference)');
    const fine = matchMedia('(hover:hover) and (pointer:fine)');
    let frame = 0,
      visible = false,
      scanning: number | null = null;
    let pose = { ...basePose },
      target = { ...basePose };
    let drag: { x: number; y: number; active: boolean } | null = null;

    function paint(scan: number | null = null) {
      const mode = element.dataset.mode as IdentityMode;
      drawIdentity(ctx, drawing.width, identityFrame(pose.yaw, pose.pitch), mode, scan);
      element.dataset.ready = 'true';
      element.style.setProperty('--portrait-yaw', pose.yaw.toFixed(3));
    }
    function tick(time: number) {
      frame = 0;
      if (!visible || document.hidden) return;
      if (!motion.matches) {
        pose = { ...target };
        scanning = null;
        paint();
        element.dataset.motion = 'static';
        element.dataset.scan = 'idle';
        return;
      }
      pose.yaw += (target.yaw - pose.yaw) * 0.13;
      pose.pitch += (target.pitch - pose.pitch) * 0.13;
      let scan: number | null = null;
      if (scanning != null) {
        scan = Math.min(1, (time - scanning) / 1900);
        if (scan >= 1) {
          scanning = null;
          scan = null;
          element.dataset.scan = 'idle';
          setScanMessage('Scan complete.');
        }
      }
      paint(scan);
      const moving =
        scanning != null ||
        Math.abs(target.yaw - pose.yaw) + Math.abs(target.pitch - pose.pitch) > 0.0003;
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
      const size = Math.round(drawing.clientWidth * Math.min(devicePixelRatio || 1, 1.5));
      drawing.width = drawing.height = Math.max(size, 1);
      wake();
    }
    function move(event: PointerEvent) {
      if (!motion.matches) return;
      const rect = drawing.getBoundingClientRect();
      if (event.pointerType === 'mouse' && fine.matches) {
        const x = (event.clientX - rect.left) / rect.width,
          y = (event.clientY - rect.top) / rect.height;
        target = { yaw: basePose.yaw + (x - 0.5) * 0.7, pitch: basePose.pitch + (y - 0.5) * 0.32 };
        wake();
      } else if (drag) {
        const dx = event.clientX - drag.x,
          dy = event.clientY - drag.y;
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.3) drag.active = true;
        if (!drag.active) return;
        target = {
          yaw: basePose.yaw + Math.max(-0.45, Math.min(0.45, dx / rect.width)),
          pitch: basePose.pitch,
        };
        wake();
      }
    }
    function leave() {
      target = { ...basePose };
      drag = null;
      wake();
    }
    function down(event: PointerEvent) {
      if (event.pointerType !== 'mouse')
        drag = { x: event.clientX, y: event.clientY, active: false };
    }
    function keys(event: KeyboardEvent) {
      if (event.target !== element) return;
      const rotations: Record<string, [number, number]> = {
        ArrowLeft: [-0.13, 0],
        ArrowRight: [0.13, 0],
        ArrowUp: [0, -0.09],
        ArrowDown: [0, 0.09],
      };
      if (event.key === 'Home') {
        event.preventDefault();
        leave();
        return;
      }
      const rotation = rotations[event.key];
      if (!rotation) return;
      event.preventDefault();
      target = {
        yaw: Math.max(-0.7, Math.min(0.7, target.yaw + rotation[0])),
        pitch: Math.max(-0.3, Math.min(0.3, target.pitch + rotation[1])),
      };
      wake();
    }
    function preferences() {
      target = { ...basePose };
      scanning = null;
      element.dataset.scan = 'idle';
      availability();
    }
    function scan() {
      if (!motion.matches) {
        setScanMessage('Still view: scan animation follows your reduced-motion preference.');
        return;
      }
      scanning = performance.now();
      element.dataset.scan = 'running';
      setScanMessage('Scanning the 3D face.');
      wake();
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
    drawing.addEventListener('pointerdown', down, { passive: true });
    drawing.addEventListener('pointerleave', leave);
    drawing.addEventListener('pointerup', leave);
    drawing.addEventListener('pointercancel', leave);
    element.addEventListener('keydown', keys);
    document.addEventListener('visibilitychange', availability);
    motion.addEventListener('change', preferences);
    fine.addEventListener('change', preferences);
    controller.current = { wake, scan };
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizes.disconnect();
      controller.current = null;
      drawing.removeEventListener('pointermove', move);
      drawing.removeEventListener('pointerdown', down);
      drawing.removeEventListener('pointerleave', leave);
      drawing.removeEventListener('pointerup', leave);
      drawing.removeEventListener('pointercancel', leave);
      element.removeEventListener('keydown', keys);
      document.removeEventListener('visibilitychange', availability);
      motion.removeEventListener('change', preferences);
      fine.removeEventListener('change', preferences);
    };
  }, []);
  useEffect(() => {
    controller.current?.wake();
  }, [mode]);

  return (
    <figure
      ref={figure}
      tabIndex={0}
      className="intro-sculpture face-portrait identity-portrait"
      data-mode={mode}
      data-reference-count={identityMetadata.referenceCount}
      aria-label="Interactive 3D face of Laabh Gupta"
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
          <ScanFace size={13} /> IDENTITY / LAABH GUPTA
        </span>
        <span>07 REFERENCES → ONE FORM</span>
      </div>
      <div className="portrait-stage">
        <svg className="portrait-guides" viewBox="0 0 520 520" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="identity-halo">
              <stop offset="0" stopColor="#d7e2ce" stopOpacity=".06" />
              <stop offset="1" stopColor="#c9f85c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="260" cy="260" r="246" fill="url(#identity-halo)" />
          <circle className="orbit-guide" cx="260" cy="260" r="235" />
          <path
            className="portrait-brackets"
            d="M122 94h-13v27M398 94h13v27M122 426h-13v-27M398 426h13v-27"
          />
          <path className="identity-registration" d="M23 260h16M481 260h16M260 23v16M260 481v16" />
        </svg>
        <svg
          className="portrait-fallback identity-fallback"
          viewBox="0 0 520 520"
          aria-hidden="true"
          focusable="false"
        >
          {still.facets.map((f, i) => (
            <path
              key={i}
              d={facetPath(still, f)}
              fill={
                mode === 'solid'
                  ? `rgb(${Math.round(25 + f.light * 200)},${Math.round(27 + f.light * 200)},${Math.round(25 + f.light * 200)})`
                  : '#141813'
              }
              stroke={mode === 'solid' ? '#dce4d718' : '#e2e9e080'}
              strokeWidth=".55"
            />
          ))}
          {Array.from({ length: identityFeatureEdges.length / 2 }, (_, i) => {
            const ai = identityFeatureEdges[i * 2],
              bi = identityFeatureEdges[i * 2 + 1];
            if (!still.visible.has(ai) || !still.visible.has(bi)) return null;
            const a = still.vertices[ai],
              b = still.vertices[bi];
            return (
              <path
                key={`feature-${i}`}
                d={`M${a.x} ${a.y}L${b.x} ${b.y}`}
                fill="none"
                stroke="#c9f85c"
                strokeOpacity=".65"
                strokeWidth=".8"
              />
            );
          })}
        </svg>
        <canvas ref={canvas} className="portrait-canvas" aria-hidden="true" />
      </div>
      <figcaption className="identity-caption">
        <div className="portrait-bottomline">
          <span className="identity-instruction" id="portrait-help">
            MOVE / DRAG TO TURN
            <span className="sr-only">
              . Focus the face and use the arrow keys to rotate. Press Home to reset.
            </span>
          </span>
          <div className="identity-view-tools">
            <div className="portrait-controls" role="group" aria-label="Face display">
              {views.map((view) => (
                <button
                  type="button"
                  key={view.id}
                  aria-pressed={mode === view.id}
                  onClick={() => setMode(view.id)}
                >
                  {view.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="identity-scan"
              aria-label="Scan face"
              onClick={() => controller.current?.scan()}
              title="Run a single scanning pass"
            >
              <RotateCcw size={13} />
              <span>Scan</span>
            </button>
          </div>
        </div>
        <div className="identity-hotspots" aria-label="Explore my work through the face study">
          <Link to="/?skill=genai#skills">
            <span className="identity-node" />
            Intelligence
            <MoveUpRight size={10} />
          </Link>
          <Link to="/#projects">
            <span className="identity-node" />
            Applications
            <MoveUpRight size={10} />
          </Link>
          <Link to="/#experience">
            <span className="identity-node" />
            Engineering
            <MoveUpRight size={10} />
          </Link>
        </div>
        <span className="sr-only" aria-live="polite">
          {scanMessage}
        </span>
      </figcaption>
    </figure>
  );
}
