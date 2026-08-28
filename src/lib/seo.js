// Jediný zdroj SEO metadat pro jednotlivé routy.
// Používá ho `usePageMeta` (za běhu) i `scripts/prerender.mjs` (při buildu).

export const SITE_URL = 'https://webkozar.cz';
export const OG_IMAGE = `${SITE_URL}/logos/og-image.jpg`;

export const DEFAULT_META = {
  title: 'Tvorba webových stránek a SEO Nový Jičín | webkozar',
  description:
    'Tvorba webových stránek, webdesign a SEO optimalizace v Novém Jičíně. Rychlé, moderní weby na míru pro firmy z Nového Jičína, Ostravy a okolí. Nezávazná poptávka zdarma.',
};

export const PAGE_META = {
  '/': DEFAULT_META,

  '/connect': {
    title: 'Webkozar Connect — klientský portál ke každému webu | webkozar',
    description:
      'Ke každému webu od nás dostanete přístup do klientského portálu Webkozar Connect: zadávání úprav, sledování stavu v reálném čase a přehled o fakturaci na jednom místě.',
  },

  '/tvorba-webovych-stranek-novy-jicin': {
    title: 'Tvorba webových stránek Nový Jičín | webkozar',
    description:
      'Tvorba webových stránek v Novém Jičíně na míru. Moderní, rychlé a responzivní weby se SEO pro firmy z Nového Jičína a okolí. Od návrhu po spuštění. Nezávazná poptávka.',
  },

  '/seo-novy-jicin': {
    title: 'SEO Nový Jičín — SEO optimalizace webu | webkozar',
    description:
      'SEO optimalizace v Novém Jičíně: technické SEO, on-page, obsah a local SEO, aby vás zákazníci v regionu našli ve vyhledávání. Analýza zdarma, měřitelné výsledky.',
  },

  '/webdesign-novy-jicin': {
    title: 'Webdesign Nový Jičín — návrh a design webu | webkozar',
    description:
      'Webdesign v Novém Jičíně: moderní, přehledný a responzivní návrh webu s důrazem na použitelnost a konverze. Design na míru vaší značce. Nezávazná konzultace zdarma.',
  },
};

export const PRERENDER_ROUTES = Object.keys(PAGE_META);

export function canonicalFor(pathname) {
  return pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
}
