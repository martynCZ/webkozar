import { applyAnalyticsConsent } from './analytics';

export const CONSENT_STORAGE_KEY = 'webkozar-cookie-consent';
// Verzi zvyšte, pokud se změní rozsah zpracovávaných cookies – uživatelům se lišta zobrazí znovu.
export const CONSENT_VERSION = 1;
// Souhlas dle ePrivacy/GDPR doporučení platí 12 měsíců, poté se zeptáme znovu.
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export const COOKIE_CATEGORIES = [
  {
    id: 'necessary',
    title: 'Nezbytné cookies',
    description:
      'Zajišťují základní funkce webu – odeslání formuláře, chat a zapamatování vaší volby cookies. Bez nich by web nefungoval, proto je nelze vypnout.',
    required: true,
  },
  {
    id: 'analytics',
    title: 'Analytické cookies',
    description:
      'Anonymně nám ukazují, které stránky vás zajímají a kde se web zasekává. Díky nim ho umíme dělat rychlejší a přehlednější.',
    required: false,
  },
];

export const DENY_ALL = { necessary: true, analytics: false };
export const ALLOW_ALL = { necessary: true, analytics: true };

export const CONSENT_EVENT = 'cookieConsentChange';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Načte uložený souhlas. Vrací null, pokud souhlas chybí, je poškozený,
 * pochází ze starší verze nebo už vypršel – ve všech případech se zeptáme znovu.
 */
export function loadConsent() {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.version !== CONSENT_VERSION) return null;

    const timestamp = Date.parse(parsed.timestamp);
    if (Number.isNaN(timestamp) || Date.now() - timestamp > CONSENT_MAX_AGE_MS) return null;

    return {
      necessary: true,
      analytics: parsed.analytics === true,
      timestamp: parsed.timestamp,
    };
  } catch {
    // Např. zakázané úložiště v privátním režimu – chováme se, jako by souhlas nebyl.
    return null;
  }
}

export function saveConsent(preferences) {
  const record = {
    necessary: true,
    analytics: preferences.analytics === true,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };

  if (isBrowser()) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Souhlas nelze uložit – respektujeme ho alespoň pro aktuální relaci.
    }

    // Signál pro zbytek aplikace (např. načtení měřicích skriptů).
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));

    // GA4 + Google Consent Mode v2: promítne souhlas a po udělení načte gtag.js.
    // Bez platného Measurement ID v analytics.js je to no-op.
    applyAnalyticsConsent(record.analytics);
  }

  return record;
}

/** Otevře nastavení cookies odkudkoli, např. z odkazu v patičce. */
export function openCookieSettings() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent('openCookieSettings'));
}

/** Otevře zásady ochrany osobních údajů a cookies odkudkoli. */
export function openCookiePolicy() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent('openCookiePolicy'));
}

/** Alias – tentýž dokument se odkazuje i jako „zásady ochrany osobních údajů". */
export const openPrivacyPolicy = openCookiePolicy;
