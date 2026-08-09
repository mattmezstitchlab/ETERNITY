'use client';

import { Plus, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { cn, countdownTo } from '@/lib/utils';

/** Bouton « + » — cercle 64px, stroke rainbow angular 7 stops */
export function PlusButton({
  href,
  onClick,
  size = 64,
  label = 'Créer une capsule',
  className,
}: {
  href?: string;
  onClick?: () => void;
  size?: number;
  label?: string;
  className?: string;
}) {
  const inner = (
    <>
      <span className="rainbow-ring absolute inset-0 rounded-full transition-transform duration-300 group-hover:scale-105" />
      <span className="relative flex h-full w-full items-center justify-center rounded-full">
        <Plus style={{ width: size * 0.36, height: size * 0.36 }} strokeWidth={1.6} className="text-white transition-transform duration-300 group-hover:rotate-90" />
      </span>
    </>
  );
  const cls = cn('group relative rounded-full', className);
  const style = { width: size, height: size };
  if (href) {
    return (
      <Link href={href} aria-label={label} className={cls} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cls} style={style}>
      {inner}
    </button>
  );
}

export function QRBadge({ code, size = 148 }: { code: string; size?: number }) {
  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="rounded-3xl bg-white p-4 shadow-[0_0_60px_-12px_rgba(201,169,110,0.55)]">
        <QRCode value={`https://eternity.video/c/${code}`} size={size} fgColor="#0A0A0A" bgColor="#FFFFFF" />
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-raise px-3.5 py-1.5 font-mono text-xs tracking-[2px] text-gold">
        <QrCode size={13} />
        {code}
      </span>
    </div>
  );
}

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-raise text-gold', className)}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <span className="font-medium">{initials}</span>
      )}
    </span>
  );
}

export function Countdown({ targetIso, compact = false }: { targetIso: string; compact?: boolean }) {
  const [parts, setParts] = useState(() => countdownTo(targetIso));
  useEffect(() => {
    const t = setInterval(() => setParts(countdownTo(targetIso)), 1000);
    return () => clearInterval(t);
  }, [targetIso]);

  const cells: Array<{ value: number; label: string }> = compact
    ? [
        { value: parts.days, label: 'jours' },
        { value: parts.hours, label: 'h' },
        { value: parts.minutes, label: 'min' },
        { value: parts.seconds, label: 's' },
      ]
    : [
        { value: parts.days, label: 'Jours' },
        { value: parts.hours, label: 'Heures' },
        { value: parts.minutes, label: 'Minutes' },
        { value: parts.seconds, label: 'Secondes' },
      ];

  return (
    <div className={cn('grid grid-cols-4', compact ? 'gap-2' : 'gap-3 md:gap-4')}>
      {cells.map((c) => (
        <div
          key={c.label}
          className={cn(
            'card flex flex-col items-center justify-center text-center',
            compact ? 'py-3' : 'py-5 md:py-7',
          )}
        >
          <span
            className={cn(
              'font-light tabular-nums text-white',
              compact ? 'text-xl' : 'text-3xl md:text-5xl',
            )}
          >
            {String(c.value).padStart(2, '0')}
          </span>
          <span className={cn('mt-1 uppercase text-mist', compact ? 'text-[9px] tracking-[2px]' : 'text-[10px] tracking-[3px]')}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-raise', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  sub,
  align = 'center',
  className,
}: {
  kicker: string;
  title: string;
  sub?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto text-center' : 'text-left', 'max-w-2xl', className)}>
      <p className="kicker">{kicker}</p>
      <h2 className="mt-4 text-balance text-4xl font-light leading-[1.08] text-white md:text-5xl">{title}</h2>
      {sub ? <p className="mt-5 text-base leading-relaxed text-mist md:text-lg">{sub}</p> : null}
    </div>
  );
}

export function LiveDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 animate-pulse-soft rounded-full bg-gold"
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </span>
  );
}
