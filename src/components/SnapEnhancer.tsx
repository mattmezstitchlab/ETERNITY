'use client';

import { useEffect } from 'react';

/**
 * Active le scroll-snap doux (proximity, sans hijack) sur la page courante.
 * Retiré au démontage — aucun impact sur les autres routes.
 */
export function SnapEnhancer() {
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.scrollSnapType;
    el.style.scrollSnapType = 'y proximity';
    return () => {
      el.style.scrollSnapType = prev;
    };
  }, []);
  return null;
}
