import { useSyncExternalStore } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Keep meaningful explorer state shareable, without navigating away from its scroll position. */
export function useQueryState(
  key: string,
  fallback: string,
  allowed: readonly string[],
  anchor?: string,
) {
  const location = useLocation();
  const navigate = useNavigate();
  // Prerendered pages use the default state. Hydrate that markup before reading URL state.
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const supplied = new URLSearchParams(location.search).get(key);
  const value = hydrated && supplied && allowed.includes(supplied) ? supplied : fallback;
  function setValue(next: string) {
    if (!allowed.includes(next) || value === next) return;
    const query = new URLSearchParams(location.search);
    if (next === fallback) query.delete(key);
    else query.set(key, next);
    void navigate(
      {
        pathname: location.pathname,
        search: query.toString(),
        hash: anchor ? `#${anchor}` : location.hash,
      },
      { preventScrollReset: true, state: { preserveScroll: true } },
    );
  }
  return [value, setValue] as const;
}
