import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pages, siteBase } from '../data/seo';

export default function PageBehavior() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '') || '/';
    const page = pages.find((page) => page.path === path) ?? pages[2];
    const canonical = `${siteBase}${page.path}`;
    document.title = page.title;
    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.append(canonicalTag);
    }
    canonicalTag.href = canonical;
    const metadata = [
      ['name', 'description', page.description],
      ['property', 'og:title', page.title],
      ['property', 'og:description', page.description],
      ['property', 'og:url', canonical],
      ['name', 'twitter:title', page.title],
      ['name', 'twitter:description', page.description],
      ['name', 'robots', page.schema ? 'index,follow' : 'noindex'],
    ];
    for (const [attribute, key, content] of metadata) {
      let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.append(tag);
      }
      tag.content = content;
    }
    let schema = document.querySelector<HTMLScriptElement>('script[data-portfolio-schema]');
    if (page.schema) {
      if (!schema) {
        schema = document.createElement('script');
        schema.type = 'application/ld+json';
        schema.setAttribute('data-portfolio-schema', '');
        document.head.append(schema);
      }
      schema.textContent = JSON.stringify({ '@context': 'https://schema.org', ...page.schema });
    } else schema?.remove();
  }, [location.pathname]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
    let dispose: (() => void) | undefined;
    let generation = 0;
    async function configure() {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;
      const { default: Lenis } = await import('lenis');
      if (current !== generation) return;
      const lenis = new Lenis({
        autoRaf: true,
        anchors: true,
        duration: 0.9,
        prevent: (node) => node.hasAttribute('data-lenis-prevent'),
      });
      dispose = () => lenis.destroy();
    }
    void configure();
    media.addEventListener('change', configure);
    return () => {
      generation++;
      dispose?.();
      media.removeEventListener('change', configure);
    };
  }, []);
  return null;
}
