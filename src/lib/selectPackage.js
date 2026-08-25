export const PACKAGES = [
  { value: 'zakladni', label: 'Základní web' },
  { value: 'standard', label: 'Standardní web' },
  { value: 'na-miru', label: 'Web na míru' }
];

export function selectPackageAndScroll(balicek) {
  if (!balicek) return;

  window.dispatchEvent(new CustomEvent('prefillPackage', { detail: balicek }));

  const formSection = document.getElementById('kontakt');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
}
