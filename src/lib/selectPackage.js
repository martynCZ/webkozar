// PACKAGES se odvozují z jediného zdroje znalostí (public/ai-knowledge.json).
// Re-export tady drží zpětnou kompatibilitu importů `from '../lib/selectPackage'`.
export { PACKAGES } from './knowledge';

export function selectPackageAndScroll(balicek) {
  if (!balicek) return;

  window.dispatchEvent(new CustomEvent('prefillPackage', { detail: balicek }));

  const formSection = document.getElementById('kontakt');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
}
