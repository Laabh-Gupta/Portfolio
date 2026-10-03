import { useEffect, useId, useRef } from 'react';
import type { IdentityScene } from './identity/scene';

function IdentityArtwork() {
  const id = useId().replaceAll(':', '');
  const shape =
    'M45 76H104V239Q104 251 116 251H200V307H69Q45 307 45 283Z M412 117C362 46 242 52 204 141C159 245 232 321 323 311C395 306 434 260 434 204V170H313V219H373C352 282 267 276 255 204C241 128 337 98 371 155Z';
  return (
    <svg
      className="identity-fallback"
      data-testid="identity-fallback"
      viewBox="0 0 500 400"
      fill="none"
    >
      <defs>
        <linearGradient
          id={id + 'face'}
          x1="90"
          y1="50"
          x2="335"
          y2="330"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" />
          <stop offset=".2" stopColor="#dededb" />
          <stop offset=".4" stopColor="#737373" />
          <stop offset=".49" stopColor="#b8b8b6" />
          <stop offset=".54" stopColor="#fafafa" />
          <stop offset=".8" stopColor="#999997" />
          <stop offset="1" stopColor="#eaeae7" />
        </linearGradient>
        <linearGradient
          id={id + 'edge'}
          x1="100"
          y1="70"
          x2="390"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9c9c9a" />
          <stop offset=".35" stopColor="#303030" />
          <stop offset=".65" stopColor="#080808" />
          <stop offset=".88" stopColor="#929290" />
          <stop offset="1" stopColor="#303030" />
        </linearGradient>
      </defs>
      <g transform="translate(-5 -4) rotate(-10 250 200) skewY(4)">
        {Array.from({ length: 32 }, (_, i) => (
          <path
            key={i}
            d={shape}
            transform={`translate(${32 - i} ${(32 - i) * 0.9})`}
            fill={`url(#${id}edge)`}
          />
        ))}
        <path
          d={shape}
          fill={`url(#${id}face)`}
          stroke="#d6d6d3"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d={shape} fill="none" stroke="#ffffff" strokeOpacity=".15" strokeWidth="5" />
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
        <IdentityArtwork />
        <span className="identity-shadow" />
        <span className="identity-loading">Preparing interactive view</span>
      </div>
    </figure>
  );
}
