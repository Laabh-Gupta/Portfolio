import { useEffect, useId, useRef } from 'react';
import type { IdentityScene } from './identity/scene';

function IdentityArtwork() {
  const id = useId().replaceAll(':', '');
  const shape =
    'M70 70H125V239H211V294H70Z M396 70H270L236 104V260L270 294H396V168H316V217H342V240H291V124H396Z';
  return (
    <svg
      className="identity-fallback"
      data-testid="identity-fallback"
      viewBox="0 0 500 420"
      fill="none"
    >
      <defs>
        <linearGradient
          id={id + 'face'}
          x1="100"
          y1="60"
          x2="345"
          y2="320"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e0eaf0" />
          <stop offset=".25" stopColor="#90a8b7" />
          <stop offset=".6" stopColor="#425c6c" />
          <stop offset="1" stopColor="#a4cee8" />
        </linearGradient>
        <linearGradient
          id={id + 'edge'}
          x1="100"
          y1="100"
          x2="380"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#405e70" />
          <stop offset=".6" stopColor="#14232e" />
          <stop offset="1" stopColor="#659bbd" />
        </linearGradient>
      </defs>
      <g transform="translate(4 12) rotate(-8 250 200) skewY(5)">
        {Array.from({ length: 22 }, (_, i) => (
          <path
            key={i}
            d={shape}
            transform={`translate(${22 - i} ${(22 - i) * 0.8})`}
            fill={`url(#${id}edge)`}
          />
        ))}
        <path
          d={shape}
          fill={`url(#${id}face)`}
          stroke="#b3d3e6"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d={shape} fill="none" stroke="#edf2f6" strokeOpacity=".18" strokeWidth="3" />
      </g>
    </svg>
  );
}

export default function Identity() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const media = matchMedia(
      '(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let controller: IdentityScene | null = null;
    let visible = false;
    let pending = false;
    let failed = false;
    let generation = 0;
    let timer: ReturnType<typeof setTimeout>;
    const dispose = () => {
      generation++;
      clearTimeout(timer);
      controller?.dispose();
      controller = null;
      pending = false;
      host.dataset.render = 'static';
    };
    const fallback = () => {
      failed = true;
      dispose();
      host.dataset.render = 'fallback';
    };
    async function load() {
      if (!host || !media.matches || !visible || failed || pending || controller || document.hidden)
        return;
      pending = true;
      const version = ++generation;
      host.dataset.render = 'loading';
      try {
        const { mountIdentityScene } = await import('./identity/scene');
        if (version !== generation) return;
        controller = mountIdentityScene(host, fallback);
        if (controller) host.dataset.render = 'webgl';
        else fallback();
        controller?.setVisible(visible);
      } catch {
        fallback();
      } finally {
        if (version === generation) pending = false;
      }
    }
    const configure = () => {
      clearTimeout(timer);
      if (!media.matches) dispose();
      else timer = setTimeout(() => void load(), 180);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      controller?.setVisible(visible);
      if (visible) configure();
    });
    observer.observe(host);
    media.addEventListener('change', configure);
    document.addEventListener('visibilitychange', configure);
    return () => {
      dispose();
      observer.disconnect();
      media.removeEventListener('change', configure);
      document.removeEventListener('visibilitychange', configure);
    };
  }, []);
  return (
    <figure className="identity">
      <div className="identity-stage" ref={ref} data-render="static" aria-hidden="true">
        <div className="identity-halo" />
        <div className="identity-orbit orbit-one" />
        <div className="identity-orbit orbit-two" />
        <IdentityArtwork />
        <span className="identity-coordinate coordinate-top">LG — 01</span>
        <span className="identity-coordinate coordinate-side">INTELLIGENCE / ENGINEERED</span>
        <span className="identity-shadow" />
        <span className="identity-loading">Preparing interactive view</span>
      </div>
      <figcaption>
        <span className="tiny-dot" /> From model to real-world system <span>↗</span>
      </figcaption>
    </figure>
  );
}
