import { useEffect } from 'react';
import { PAGE_META, DEFAULT_META, OG_IMAGE, canonicalFor } from './seo';

// Za běhu (SPA navigace) nastaví <title> a hlavičkové meta podle routy.
// Při prerenderu tohle neběží – hlavičku tam vyměňuje `scripts/prerender.mjs`.

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, name] = selector.match(/\[(?:name|property)="(.+)"\]/) || [];
    if (selector.includes('property=')) el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function usePageMeta(pathname) {
  useEffect(() => {
    const meta = PAGE_META[pathname] || DEFAULT_META;
    const canonical = canonicalFor(pathname);

    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', OG_IMAGE);
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }, [pathname]);
}
