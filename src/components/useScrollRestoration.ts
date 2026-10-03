import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** Restore visits while keeping local explorer interactions in place. */
export function useScrollRestoration() {
  const location = useLocation();
  const navigation = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const previous = useRef<{ pathname: string; hash: string; visitKey: string } | null>(null);

  useEffect(() => {
    const original = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => {
      history.scrollRestoration = original;
    };
  }, []);

  useEffect(() => {
    // Native fragment navigation can reuse the router's history key.
    const visitKey = `${location.key}|${location.pathname}${location.search}${location.hash}`;
    const prior = previous.current?.visitKey !== visitKey ? previous.current : null;
    previous.current = { ...location, visitKey };
    const saved = positions.current.get(visitKey);
    const remember = () => {
      positions.current.set(visitKey, window.scrollY);
    };
    window.addEventListener('scroll', remember, { passive: true });
    let cancelled = false;
    let frame = 0;
    let observer: MutationObserver | undefined;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    const unchangedSection = prior?.pathname === location.pathname && prior.hash === location.hash;
    const preserve =
      prior && navigation !== 'POP' && (location.state?.preserveScroll || unchangedSection);
    if (!preserve) {
      let id = location.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        /* Ignore a malformed external hash. */
      }
      void document.fonts.ready.then(() => {
        if (cancelled) return;
        const restore = () => {
          if (cancelled) return;
          const ready =
            location.pathname === '/'
              ? document.querySelector('.hero')
              : document.querySelector('.case-study, .not-found');
          const target = id ? document.getElementById(id) : null;
          if (!ready && !target) return;
          // A visitor may begin keyboard interaction before fonts settle. Do not steal it.
          const focusedControl = document.activeElement?.closest(
            'a, button, input, select, textarea, summary, [role="tab"]',
          );
          if (!prior && focusedControl) {
            observer?.disconnect();
            clearTimeout(deadline);
            remember();
            return;
          }
          if (navigation === 'POP' && saved !== undefined) {
            window.scrollTo({ top: saved, behavior: 'instant' });
          } else if (target) {
            target.scrollIntoView({ behavior: 'instant' });
            target.focus({ preventScroll: true });
          } else window.scrollTo({ top: 0, behavior: 'instant' });
          observer?.disconnect();
          clearTimeout(deadline);
          remember();
        };
        observer = new MutationObserver(restore);
        observer.observe(document.querySelector('main') ?? document.body, {
          childList: true,
          subtree: true,
        });
        deadline = setTimeout(() => observer?.disconnect(), 3000);
        frame = requestAnimationFrame(restore);
      });
    } else remember();
    return () => {
      cancelled = true;
      window.removeEventListener('scroll', remember);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      clearTimeout(deadline);
    };
  }, [location, navigation]);
}
