import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Focus management pro modální okno:
 *  - při otevření přesune fokus dovnitř (na `initialFocusRef`, jinak na první
 *    fokusovatelný prvek),
 *  - drží Tab / Shift+Tab uvnitř kontejneru (cyklí dokola),
 *  - po zavření vrátí fokus na prvek, který okno otevřel.
 *
 * @param {boolean} active   modal je otevřený
 * @param {import('react').RefObject<HTMLElement>} containerRef  obal modalu
 * @param {import('react').RefObject<HTMLElement>} [initialFocusRef]  kam dát fokus po otevření
 */
export function useFocusTrap(active, containerRef, initialFocusRef) {
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    if (typeof document === 'undefined') return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    restoreRef.current = document.activeElement;

    const focusables = () =>
      Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );

    // Fokus dovnitř (po vykreslení).
    const raf = requestAnimationFrame(() => {
      const target = initialFocusRef?.current || focusables()[0] || container;
      target.focus?.();
    });

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey && (activeEl === first || !container.contains(activeEl))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      // Vrácení fokusu na spouštěč.
      const toRestore = restoreRef.current;
      if (toRestore && typeof toRestore.focus === 'function') {
        toRestore.focus();
      }
    };
  }, [active, containerRef, initialFocusRef]);
}
