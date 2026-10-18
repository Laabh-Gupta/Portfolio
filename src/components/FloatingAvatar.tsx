import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

type AvatarState = 'hero' | 'travelling' | 'docked';
type AvatarMotion = 'floating' | 'static' | 'paused';
type Presentation = { state: AvatarState; motion: AvatarMotion; hidden: boolean };

const assets = {
  cartoon: '/images/laabh-avatar.png',
  portrait: '/images/laabh-avatar-portrait.png',
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const interpolate = (from: number, to: number, progress: number) => from + (to - from) * progress;

/** One reserved hero figure, with a decorative visual that can travel outside the page layers. */
export default function FloatingAvatar() {
  const navigate = useNavigate();
  const slot = useRef<HTMLElement>(null);
  const traveller = useRef<HTMLDivElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [variant, setVariant] = useState<'cartoon' | 'portrait'>('cartoon');
  const asset = assets[variant];
  const [presentation, setPresentation] = useState<Presentation>({
    state: 'hero',
    motion: 'static',
    hidden: true,
  });

  useEffect(() => {
    const portrait = new Image();
    portrait.src = assets.portrait;
    const frame = requestAnimationFrame(() => setPortalHost(document.body));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const anchor = slot.current;
    const visual = traveller.current;
    if (!portalHost || !anchor || !visual) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector<HTMLElement>('.site-header');
    let frame = 0;
    let disposed = false;
    let needsMeasurement = true;
    let initialized = false;
    let origin = { x: 0, y: 0, size: 0, headerHeight: 0 };

    function measure() {
      const rect = anchor!.getBoundingClientRect();
      origin = {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        size: rect.width,
        headerHeight: header?.getBoundingClientRect().height ?? 78,
      };
      needsMeasurement = false;
    }

    function modalIsOpen() {
      return [...document.querySelectorAll<HTMLElement>('[role="dialog"], dialog[open]')].some(
        (dialog) => {
          if (dialog.getAttribute('aria-hidden') === 'true' || dialog.hasAttribute('data-closed'))
            return false;
          const style = getComputedStyle(dialog);
          return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            dialog.getClientRects().length > 0
          );
        },
      );
    }

    function paint() {
      frame = 0;
      if (disposed) return;
      if (needsMeasurement) measure();
      if (!origin.size) return;

      const small = window.innerWidth <= 600;
      const dockSize = small ? 68 : 78;
      const dockRight = small ? 12 : 24;
      const dockTop = origin.headerHeight + 14;
      // On mobile the avatar follows the copy. Wait until that measured figure
      // reaches the upper viewport, rather than flying away on the first scroll.
      const start = Math.max(0, origin.y - dockTop - 64);
      const distance = Math.max(180, Math.min(360, origin.size * 0.72));
      const rawProgress = clamp((window.scrollY - start) / distance);
      const progress = reducedMotion.matches
        ? rawProgress >= 0.5
          ? 1
          : 0
        : rawProgress * rawProgress * (3 - 2 * rawProgress);
      const state: AvatarState = progress === 0 ? 'hero' : progress === 1 ? 'docked' : 'travelling';
      const size = interpolate(origin.size, dockSize, progress);
      const x = interpolate(
        origin.x - window.scrollX,
        window.innerWidth - dockRight - dockSize,
        progress,
      );
      const naturalY = origin.y - window.scrollY;
      const y = reducedMotion.matches
        ? progress === 1
          ? dockTop
          : naturalY
        : rawProgress === 0
          ? naturalY
          : interpolate(origin.y - start, dockTop, progress);
      const hidden = document.hidden || modalIsOpen();
      const outside = y + size < 0 || y > window.innerHeight;
      const motion: AvatarMotion =
        hidden || outside
          ? 'paused'
          : state === 'hero' && !reducedMotion.matches
            ? 'floating'
            : 'static';

      visual!.style.width = `${origin.size}px`;
      visual!.style.height = `${origin.size}px`;
      visual!.style.transform = `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) scale(${(size / origin.size).toFixed(6)})`;
      visual!.style.setProperty('--avatar-progress', progress.toFixed(5));
      visual!.style.setProperty('--avatar-scroll-progress', rawProgress.toFixed(5));
      visual!.style.setProperty('--avatar-scale', (size / origin.size).toFixed(6));
      visual!.style.setProperty('--avatar-inverse-scale', (origin.size / size).toFixed(6));
      setPresentation((previous) =>
        previous.state === state && previous.motion === motion && previous.hidden === hidden
          ? previous
          : { state, motion, hidden },
      );
      if (!initialized) {
        initialized = true;
        setReady(true);
      }
    }

    function schedule() {
      if (!disposed && !frame) frame = requestAnimationFrame(paint);
    }

    function remeasure() {
      needsMeasurement = true;
      schedule();
    }

    const sizes = new ResizeObserver(remeasure);
    sizes.observe(anchor);
    if (anchor.parentElement) sizes.observe(anchor.parentElement);
    if (header) sizes.observe(header);
    const dialogs = new MutationObserver(schedule);
    dialogs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-hidden', 'open', 'data-open', 'data-closed'],
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure, { passive: true });
    window.addEventListener('hashchange', remeasure);
    window.addEventListener('popstate', remeasure);
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', schedule);
    void document.fonts.ready.then(() => {
      if (!disposed) remeasure();
    });
    paint();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      sizes.disconnect();
      dialogs.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('hashchange', remeasure);
      window.removeEventListener('popstate', remeasure);
      document.removeEventListener('visibilitychange', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, [portalHost]);

  function backToTop() {
    navigate('/', { replace: true });
    document.getElementById('hero-title')?.focus({ preventScroll: true });
    window.scrollTo({
      top: 0,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  const interactive = presentation.state === 'docked' && !presentation.hidden;

  return (
    <>
      <figure
        ref={slot}
        tabIndex={-1}
        className="floating-avatar-slot"
        data-avatar-ready={ready}
        data-avatar={variant}
      >
        <div className="floating-avatar-stage">
          <div className="floating-avatar-placeholder">
            <span className="floating-avatar-halo" aria-hidden="true" />
            <img
              src={asset}
              width={1024}
              height={1024}
              alt="Illustrated avatar of Laabh Gupta"
              fetchPriority="high"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
        <figcaption>
          <span className="floating-avatar-label">
            <i aria-hidden="true" />A LITTLE MORE ME
          </span>
          <button
            type="button"
            className="work-case-link avatar-switch"
            data-magnetic
            aria-pressed={variant === 'portrait'}
            title={
              variant === 'cartoon' ? 'Show the illustrated portrait' : 'Show the cartoon avatar'
            }
            onClick={() =>
              setVariant((current) => (current === 'cartoon' ? 'portrait' : 'cartoon'))
            }
          >
            Switch <ArrowLeftRight size={19} aria-hidden="true" />
          </button>
          <span className="sr-only" aria-live="polite">
            {variant === 'portrait' ? 'Illustrated portrait selected.' : 'Cartoon avatar selected.'}
          </span>
        </figcaption>
      </figure>
      {portalHost &&
        createPortal(
          <div
            ref={traveller}
            className="floating-avatar-traveller"
            data-state={presentation.state}
            data-motion={presentation.motion}
            data-hidden={presentation.hidden}
            data-ready={ready}
            data-avatar={variant}
            inert={!interactive}
            aria-hidden={!interactive}
          >
            <div className="floating-avatar-art" aria-hidden="true">
              <span className="floating-avatar-halo" />
              <img
                src={asset}
                width={1024}
                height={1024}
                alt=""
                decoding="async"
                draggable={false}
              />
            </div>
            <button
              type="button"
              className="floating-avatar-return"
              aria-label="Back to top"
              title="Back to top"
              disabled={!interactive}
              aria-hidden={!interactive}
              onClick={backToTop}
            >
              <span aria-hidden="true">↑</span>
            </button>
          </div>,
          portalHost,
        )}
    </>
  );
}
