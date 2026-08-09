'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Clapperboard, Heart, Lock, QrCode, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LocalClipMedia } from '@/components/app/LocalClipMedia';
import { Avatar, Countdown, LiveDots, ProgressBar } from '@/components/ui-kit';
import { GUESTS_SCANNED, GUESTS_TOTAL } from '@/lib/data';
import { useEternity } from '@/lib/store';
import { cn, formatDateFr, timeAgoFr } from '@/lib/utils';

export function CapsuleView() {
  const router = useRouter();
  const { capsule, folder, clips, contacts } = useEternity();
  const sealed = capsule.status === 'sealed';
  const sorted = [...clips].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

  return (
    <div className="mx-auto max-w-md px-5 pb-12 pt-6 lg:max-w-4xl lg:px-0 lg:pt-10">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs text-mist transition-colors hover:text-white"
      >
        <ArrowLeft size={14} />
        Souvenirs
      </button>

      {/* En-tête */}
      <header className="rainbow-ring-soft mt-5 rounded-card">
        <div className="rounded-card bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-kicker text-gold">
              {sealed ? (
                <>
                  <Lock size={10} />
                  Scellée · irréversible
                </>
              ) : (
                <>
                  Collecte en cours
                  <LiveDots />
                </>
              )}
            </p>
            <span className="chip font-mono tracking-[1.5px] text-gold">{capsule.code}</span>
          </div>
          <h1 className="mt-3 text-3xl font-light">{capsule.name}</h1>
          <p className="mt-1 text-sm text-mist">{folder.name}</p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              { v: String(clips.length), l: 'clips' },
              { v: String(contacts.filter((c) => c.scanned).length + GUESTS_SCANNED), l: 'scans' },
              { v: sealed ? '∞' : '10s', l: sealed ? 'pour toujours' : 'par clip' },
            ].map((s) => (
              <div key={s.l} className="rounded-card bg-raise py-3">
                <p className="text-xl font-light text-gold">{s.v}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[2px] text-mist">{s.l}</p>
              </div>
            ))}
          </div>

          {sealed ? (
            <p className="mt-5 rounded-card bg-gold/10 p-4 text-center text-xs leading-relaxed text-gold">
              Scellée le {formatDateFr(capsule.sealed_at as string, { hour: '2-digit', minute: '2-digit' })}
              <br />
              Horodatée. Plus personne ne peut la modifier.
            </p>
          ) : (
            <div className="mt-5">
              <Countdown targetIso={folder.metadata.date as string} compact />
              <div className="mt-4 flex items-center gap-3">
                <Users size={14} className="text-mist" />
                <ProgressBar value={GUESTS_SCANNED} max={GUESTS_TOTAL} className="flex-1" />
                <span className="text-xs tabular-nums text-mist">
                  {GUESTS_SCANNED}/{GUESTS_TOTAL}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href={`/app/qr/${capsule.code}`} className="btn-outline px-4 py-3 text-[13px]">
          <QrCode size={15} />
          QR invités
        </Link>
        {sealed ? (
          <Link href="/mini-site" className="btn-gold px-4 py-3 text-[13px]">
            <Clapperboard size={15} />
            Voir le mini-site
          </Link>
        ) : (
          <SealButton />
        )}
      </div>

      {/* Clips */}
      <h2 className="mt-8 text-xs font-medium uppercase tracking-kicker text-mist/70">
        Clips de la capsule
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <AnimatePresence>
          {sorted.map((c) => (
            <motion.article
              layout
              key={c.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'relative overflow-hidden rounded-card bg-raise',
                sealed && 'saturate-[0.85]',
              )}
            >
              <div className="relative aspect-[9/16]">
                <LocalClipMedia clip={c} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                <span className="absolute right-2.5 top-2.5 rounded-full bg-black/50 px-2 py-0.5 text-[9px] text-white backdrop-blur">
                  {c.duration}s
                </span>
                <div className="absolute inset-x-2.5 bottom-2.5">
                  <div className="flex items-center gap-1.5">
                    <Avatar src={c.author_avatar} name={c.author_name} size={20} />
                    <p className="truncate text-[11px] font-medium text-white">{c.author_name}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-white/70">{c.caption}</p>
                  <p className="mt-1 flex items-center gap-1 text-[9px] text-white/45">
                    <Heart size={8} />
                    {c.likes} · {timeAgoFr(c.created_at)}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SealButton() {
  const { sealCapsule } = useEternity();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-2 flex items-center gap-3 rounded-card bg-raise p-4"
      >
        <p className="flex-1 text-xs leading-relaxed text-white/85">
          Gestes <strong className="text-gold">irréversibles</strong> uniquement quand on est heureux.
          Sceller maintenant ?
        </p>
        <button type="button" onClick={sealCapsule} className="btn-gold shrink-0 px-4 py-2 text-xs">
          <Lock size={12} />
          Oui, sceller
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="btn-ghost shrink-0 px-2 py-2 text-xs">
          Annuler
        </button>
      </motion.div>
    );
  }

  return (
    <button type="button" onClick={() => setConfirming(true)} className="btn-gold px-4 py-3 text-[13px]">
      <Lock size={15} />
      Sceller la capsule
    </button>
  );
}
