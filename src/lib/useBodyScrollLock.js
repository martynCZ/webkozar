import { useEffect } from 'react';

// Sdílený zámek scrollu těla stránky. Víc vrstev (mobilní menu, cookie modal,
// úvodní loader) může být otevřených naráz – proto čítač: `overflow: hidden`
// se nastaví při prvním zámku a vrátí zpět až když se odemkne poslední.
// Dřív si každá komponenta přepisovala `document.body.style.overflow` sama a
// zavření jedné odemklo scroll i pod jinou otevřenou vrstvou.

let lockCount = 0;
let previousOverflow = '';

function lock() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

function unlock() {
  if (typeof document === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
}

/**
 * Zamkne scroll těla, dokud je `active` true (a komponenta je připojená).
 * @param {boolean} active
 */
export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    lock();
    return unlock;
  }, [active]);
}
