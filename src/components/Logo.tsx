import { cn } from '@/lib/utils';

export const LEMNISCATE_PATH =
  'M88.00 30.00L87.89 31.42L87.55 32.81L86.99 34.14L86.23 35.39L85.30 36.55L84.21 37.59L82.99 38.50L81.67 39.28L80.27 39.92L78.81 40.42L77.33 40.80L75.83 41.04L74.33 41.17L72.85 41.20L71.39 41.12L69.97 40.95L68.59 40.71L67.25 40.39L65.95 40.02L64.70 39.58L63.50 39.11L62.34 38.59L61.22 38.03L60.14 37.45L59.10 36.84L58.09 36.20L57.12 35.55L56.17 34.89L55.24 34.21L54.34 33.52L53.45 32.83L52.57 32.13L51.71 31.42L50.85 30.71L50.00 30.00L49.15 29.29L48.29 28.58L47.43 27.87L46.55 27.17L45.66 26.48L44.76 25.79L43.83 25.11L42.88 24.45L41.91 23.80L40.90 23.16L39.86 22.55L38.78 21.97L37.66 21.41L36.50 20.89L35.30 20.42L34.05 19.98L32.75 19.61L31.41 19.29L30.03 19.05L28.61 18.88L27.15 18.80L25.67 18.83L24.17 18.96L22.67 19.20L21.19 19.58L19.73 20.08L18.33 20.72L17.01 21.50L15.79 22.41L14.70 23.45L13.77 24.61L13.01 25.86L12.45 27.19L12.11 28.58L12.00 30.00L12.11 31.42L12.45 32.81L13.01 34.14L13.77 35.39L14.70 36.55L15.79 37.59L17.01 38.50L18.33 39.28L19.73 39.92L21.19 40.42L22.67 40.80L24.17 41.04L25.67 41.17L27.15 41.20L28.61 41.12L30.03 40.95L31.41 40.71L32.75 40.39L34.05 40.02L35.30 39.58L36.50 39.11L37.66 38.59L38.78 38.03L39.86 37.45L40.90 36.84L41.91 36.20L42.88 35.55L43.83 34.89L44.76 34.21L45.66 33.52L46.55 32.83L47.43 32.13L48.29 31.42L49.15 30.71L50.00 30.00L50.85 29.29L51.71 28.58L52.57 27.87L53.45 27.17L54.34 26.48L55.24 25.79L56.17 25.11L57.12 24.45L58.09 23.80L59.10 23.16L60.14 22.55L61.22 21.97L62.34 21.41L63.50 20.89L64.70 20.42L65.95 19.98L67.25 19.61L68.59 19.29L69.97 19.05L71.39 18.88L72.85 18.80L74.33 18.83L75.83 18.96L77.33 19.20L78.81 19.58L80.27 20.08L81.67 20.72L82.99 21.50L84.21 22.41L85.30 23.45L86.23 24.61L86.99 25.86L87.55 27.19L87.89 28.58L88.00 30.00Z';

let gradientSeed = 0;

/** Symbole infini ETERNITY — lemniscate en stroke doré */
export function InfinityMark({ className }: { className?: string }) {
  const gid = `egold-${++gradientSeed}`;
  return (
    <svg viewBox="0 0 100 60" fill="none" className={cn('h-5 w-auto', className)} aria-hidden>
      <path d={LEMNISCATE_PATH} stroke={`url(#${gid})`} strokeWidth="9" strokeLinecap="round" />
      <defs>
        <linearGradient id={gid} x1="12" y1="30" x2="88" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E6CD9C" />
          <stop offset="0.5" stopColor="#C9A96E" />
          <stop offset="1" stopColor="#9A7A42" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Wordmark({ className, muted }: { className?: string; muted?: boolean }) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className="text-[15px] font-medium tracking-[6px] text-white">ETERNITY</span>
      <span
        className={cn('text-[11px] font-light tracking-[2px]', muted ? 'text-mist/70' : 'text-gold')}
      >
        by Aime
      </span>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <InfinityMark className="h-4" />
      <Wordmark />
    </span>
  );
}
