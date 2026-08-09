'use client';

import { motion } from 'framer-motion';
import { Heart, Lock, MessageCircle, QrCode, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, LiveDots } from '@/components/ui-kit';
import { LocalClipMedia } from '@/components/app/LocalClipMedia';
import { useEternity } from '@/lib/store';
import { cn, timeAgoFr } from '@/lib/utils';

export function Feed() {
  const { clips, capsule, folder } = useEternity();
  const sealed = capsule.status === 'sealed';

  return (
    <div className="mx-auto max-w-md lg:max-w-2xl">
      {/* Header mobile */}
      <header className="sticky top-0 z-30 glass flex items-center justify-between px-5 py-4 lg:hidden">
        <h1 className="text-lg font-light tracking-wide">Souvenirs</h1>
        <div className="flex items-center gap-2.5">
          <Link href={`/app/qr/${capsule.code}`} aria-label="QR de la capsule" className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-gold">
            <QrCode size={16} />
          </Link>
          <Link href="/app/messagerie" aria-label="Messagerie" className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-mist">
            <MessageCircle size={16} />
          </Link>
        </div>
      </header>

      {/* Bandeau capsule */}
      <div className="px-5 pt-5 lg:px-0 lg:pt-8">
        <Link
          href="/app/capsule/cap_jourj"
          className="rainbow-ring-soft block rounded-card"
        >
          <div className="flex items-center justify-between rounded-card bg-card px-5 py-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-kicker text-gold">
                {sealed ? (
                  <>
                    <Lock size={10} /> Capsule scellée
                  </>
                ) : (
                  <>
                    Collecte en cours <LiveDots />
                  </>
                )}
              </p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {capsule.name} — {folder.name}
              </p>
            </div>
            <span className="chip shrink-0 font-mono tracking-[1.5px] text-gold">{capsule.code}</span>
          </div>
        </Link>
      </div>

      {/* Feed */}
      <div className="mt-5 space-y-5 px-5 pb-10 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:px-0">
        {clips.map((clip, i) => (
          <FeedCard key={clip.id} clipId={clip.id} index={i} />
        ))}
      </div>
    </div>
  );
}

function FeedCard({ clipId, index }: { clipId: string; index: number }) {
  const { clips, likeClip } = useEternity();
  const clip = clips.find((c) => c.id === clipId);
  const [burst, setBurst] = useState(false);
  if (!clip) return null;

  const like = () => {
    likeClip(clip.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 450);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.08 }}
      className="overflow-hidden rounded-card bg-card"
    >
      {/* Média 9:16 */}
      <div className="relative aspect-[4/5] w-full sm:aspect-[9/12]">
        <LocalClipMedia clip={clip} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
        <span className="absolute right-3.5 top-3.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
          {clip.duration}s
        </span>
        {clip.local && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-medium text-black">
            Votre capture
          </span>
        )}

        {/* Auteur + caption */}
        <div className="absolute inset-x-4 bottom-4">
          <div className="flex items-center gap-2.5">
            <Avatar src={clip.author_avatar} name={clip.author_name} size={34} className="ring-2 ring-white/10" />
            <div>
              <p className="text-sm font-medium text-white">{clip.author_name}</p>
              <p className="text-[11px] text-white/60">{timeAgoFr(clip.created_at)}</p>
            </div>
          </div>
          <p className="mt-2.5 text-sm leading-snug text-white/90">{clip.caption}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={like}
            aria-label={`Aimer le clip de ${clip.author_name}`}
            className="group relative flex items-center gap-2 text-mist transition-colors hover:text-gold"
          >
            <motion.span animate={burst ? { scale: [1, 1.45, 1] } : {}} transition={{ duration: 0.4 }}>
              <Heart size={19} strokeWidth={1.6} className={cn(burst && 'fill-gold text-gold')} />
            </motion.span>
            <span className="text-xs tabular-nums">{clip.likes}</span>
          </button>
          <span className="flex items-center gap-2 text-mist">
            <MessageCircle size={18} strokeWidth={1.6} />
            <span className="text-xs">{Math.max(2, Math.round(clip.likes / 6))}</span>
          </span>
          <button
            type="button"
            aria-label="Partager le clip"
            className="flex items-center gap-2 text-mist transition-colors hover:text-gold"
          >
            <Share2 size={17} strokeWidth={1.6} />
          </button>
        </div>
        <span className="text-[10px] uppercase tracking-[2px] text-mist/50">Capsule Jour J</span>
      </div>
    </motion.article>
  );
}
