// Google Analytics 4 – měření návštěvnosti.
// Skript gtag.js se načte teprve po souhlasu s analytickými cookies; do té doby
// je přes Google Consent Mode v2 `analytics_storage` = denied. Reklamní signály
// jsou vypnuté natrvalo – web reklamní cookies nepoužívá.
//
// TODO: doplnit reálné Measurement ID z GA4 (Správce → Datové toky → web).
// Dokud je hodnota placeholder „G-XXXXXXXXXX", měření se celé přeskočí.
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

let scriptInjected = false;

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function hasValidId() {
  return /^G-[A-Z0-9]{6,}$/.test(GA_MEASUREMENT_ID);
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
  }
}

/**
 * Nastaví gtag stub a výchozí (odmítavý) stav Consent Mode.
 * Volat co nejdřív po startu aplikace, ještě před `applyAnalyticsConsent`.
 */
export function initConsentMode() {
  if (!isBrowser() || !hasValidId()) return;
  ensureGtag();
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
}

/** Načte vlastní gtag.js a spustí měření – jen po uděleném souhlasu. */
export function loadAnalytics() {
  if (!isBrowser() || !hasValidId() || scriptInjected) return;
  scriptInjected = true;
  ensureGtag();
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
}

/**
 * Promítne aktuální souhlas do Consent Mode; při udělení načte i samotný skript.
 * @param {boolean} granted souhlas s analytickými cookies
 */
export function applyAnalyticsConsent(granted) {
  if (!isBrowser() || !hasValidId()) return;
  ensureGtag();
  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
  if (granted) loadAnalytics();
}
