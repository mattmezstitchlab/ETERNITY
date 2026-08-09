'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Lock, MessageCircle, Music2, QrCode, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, LiveDots } from '@/components/ui-kit';
import { InfinityMark } from '@/components/Logo';
import { idbGet, isIdbAvailable } from '@/lib/idb';
import { useEternity } from '@/lib/store';
import type { Clip } from '@/lib/types';
import { cn, timeAgoFr } from '@/lib/utils';

/**
 * Feed immersif — mécanique TikTok, peau ETERNITY.
 * Player 100dvh snap, auto-play au viewport, rail d'actions,
 * double-tap like, barre de progression, navigation clavier.
 */
export function Feed() {
  const { clips, capsule } = useEternity();
  const [tab, setTab] = useState<'pour-toi' | 'capsule'>('pour-toi');
  const containerRef = useRef<HTMLDivElement>(null);

  const shown = tab === 'pour-toi' ? clips : clips.filter((c) => c.capsule_id === capsule.id);

  // Navigation clavier ↑ ↓ (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = containerRef.current;
      if (!el || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      el.scrollBy({ top: e.key === 'ArrowDown' ? el.clientHeight : -el.clientHeight, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative -mb-20 h-dvh lg:mb-0">
      {/* Barre supérieure flottante */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-center gap-8 px-4 pt-5">
        {(
          [
            { id: 'pour-toi', label: 'Pour toi' },
            { id: 'capsule', label: 'Capsule' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'pointer-events-auto relative pb-1 text-[15px] transition-all',
              tab === t.id ? 'font-semibold text-white' : 'text-white/55 hover:text-white/80',
            )}
          >
            {t.label}
            {tab === t.id && (
              <motion.span layoutId="feed-tab-dot" className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
            )}
          </button>
        ))}
        <Link
          href={`/app/qr/${capsule.code}`}
          aria-label="QR de la capsule"
          className="pointer-events-auto absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-gold backdrop-blur transition-transform active:scale-95 lg:right-8"
        >
          <QrCode size={17} />
        </Link>
      </div>

      {/* Rail de slides */}
      <div ref={containerRef} className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll overscroll-contain">
        {shown.map((clip, i) => (
          <Slide key={clip.id} clip={clip} index={i} />
        ))}
        <EndSlide total={shown.length} code={capsule.code} sealed={capsule.status === 'sealed'} />
      </div>
    </div>
  );
}

/* ================= SLIDE ================= */
function Slide({ clip, index }: { clip: Clip; index: number }) {
  const { likeClip } = useEternity();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [burst, setBurst] = useState<{ x: number; y: number; id: number } | null>(null);
  const [shared, setShared] = useState(false);
  const tapState = useRef({ last: 0, timer: null as ReturnType<typeof setTimeout> | null });

  const isVideo = clip.local && !!clip.video_url;

  // Blob local → objectURL
  useEffect(() => {
    if (!isVideo || !clip.video_url || !isIdbAvailable()) return;
    let url: string | null = null;
    idbGet(clip.video_url)
      .then((b) => {
        if (b) {
          url = URL.createObjectURL(b);
          setObjectUrl(url);
        }
      })
      .catch(() => undefined);
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [isVideo, clip.video_url]);

  // Visibilité → auto-play
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio > 0.6), {
      threshold: [0, 0.6, 1],
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => undefined);
    else v.pause();
  }, [inView, objectUrl]);

  // Progression (vidéo réelle ou simulée pour les posters)
  useEffect(() => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    if (!inView) return;
    if (isVideo) return; // la vidéo pilote via timeupdate
    const start = Date.now();
    setProgress(0);
    progressTimer.current = setInterval(() => {
      setProgress(((Date.now() - start) / 1000 / clip.duration) % 1);
    }, 120);
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [inView, isVideo, clip.duration]);

  const onVideoTime = () => {
    const v = videoRef.current;
    if (v && v.duration) setProgress(v.currentTime / v.duration);
  };

  /* ------ tap / double-tap ------ */
  const toggleSoundOrPause = useCallback(() => {
    if (isVideo && videoRef.current) {
      setMuted((m) => {
        if (videoRef.current) videoRef.current.muted = !m;
        return !m;
      });
    }
  }, [isVideo]);

  const like = useCallback(
    (x?: number, y?: number) => {
      likeClip(clip.id);
      if (x !== undefined && y !== undefined) {
        setBurst({ x, y, id: Date.now() });
        setTimeout(() => setBurst(null), 750);
      }
    },
    [clip.id, likeClip],
  );

  const onMediaTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    const s = tapState.current;
    if (now - s.last < 280) {
      if (s.timer) clearTimeout(s.timer);
      s.last = 0;
      like(x, y);
    } else {
      s.last = now;
      s.timer = setTimeout(() => {
        toggleSoundOrPause();
      }, 285);
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `Clip de ${clip.author_name}`, text: clip.caption, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 1600);
      }
    } catch {
      /* annulé */
    }
  };

  return (
    <section
      ref={wrapRef}
      className="relative flex h-full w-full snap-start items-center justify-center bg-black"
      aria-label={`Clip de ${clip.author_name} : ${clip.caption}`}
    >
      <div className="flex h-full w-full items-center justify-center gap-6 lg:h-[88vh] lg:max-w-3xl">
        {/* Cadre média */}
        <div
          className="absolute inset-0 overflow-hidden lg:relative lg:aspect-[9/16] lg:h-full lg:w-auto lg:rounded-[28px] lg:border lg:border-white/8"
          onClick={onMediaTap}
          role="button"
          aria-label={isVideo ? (muted ? 'Activer le son' : 'Couper le son') : 'Aimer'}
          tabIndex={-1}
        >
          {isVideo && objectUrl ? (
            <video
              ref={videoRef}
              src={objectUrl}
              className="h-full w-full object-cover"
              loop
              muted={muted}
              playsInline
              onTimeUpdate={onVideoTime}
            />
          ) : clip.poster ? (
            <motion.img
              src={clip.poster}
              alt={clip.caption}
              className="h-full w-full object-cover"
              animate={inView ? { scale: [1, 1.1] } : { scale: 1 }}
              transition={{ duration: clip.duration, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-raise">
              <Music2 size={28} className="text-mist/40" />
            </div>
          )}

          {/* Dégradés de lisibilité */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />

          {/* État muet */}
          {isVideo && muted && (
            <span className="pointer-events-none absolute left-4 top-16 rounded-full bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[2px] text-white/70 backdrop-blur lg:top-4">
              Touchez pour le son
            </span>
          )}

          {/* Explosion de cœur (double-tap) */}
          <AnimatePresence>
            {burst && (
              <motion.span
                key={burst.id}
                initial={{ scale: 0, opacity: 0, rotate: -12 }}
                animate={{ scale: [0, 1.4, 1], opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, y: -30 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="pointer-events-none absolute z-20"
                style={{ left: burst.x - 42, top: burst.y - 42 }}
              >
                <Heart size={84} className="fill-gold text-gold drop-shadow-[0_4px_24px_rgba(201,169,110,0.7)]" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Infos bas — mobile uniquement (desktop : sous le cadre) */}
          <div className="absolute inset-x-0 bottom-0 p-4 pb-24 pr-20 lg:hidden">
            <SlideInfo clip={clip} />
          </div>

          {/* Barre de progression */}
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15 lg:rounded-b-[28px]">
            <div className="h-full bg-gold transition-[width] duration-150 ease-linear" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        {/* Rail d'actions */}
        <div className="absolute bottom-24 right-3 z-20 flex flex-col items-center gap-5 lg:static lg:bottom-auto lg:right-auto lg:pb-2">
          <RailAvatar clip={clip} />
          <RailButton
            icon={<Heart size={27} strokeWidth={1.5} />}
            filled={clip.likes > 0}
            label={String(clip.likes)}
            ariaLabel="Aimer"
            onClick={() => like()}
          />
          <RailButton
            icon={<MessageCircle size={26} strokeWidth={1.5} />}
            label={String(Math.max(2, Math.round(clip.likes / 6)))}
            ariaLabel="Commentaires (bientôt)"
            onClick={() => undefined}
          />
          <RailButton
            icon={<Share2 size={24} strokeWidth={1.5} />}
            label={shared ? 'Copié !' : 'Partager'}
            ariaLabel="Partager"
            onClick={share}
          />
          <span className="mt-1 hidden h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur lg:flex" title="Son original">
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              <Music2 size={18} className="text-gold" />
            </motion.span>
          </span>
        </div>
      </div>

      {/* Infos bas — desktop */}
      <div className="absolute bottom-6 left-1/2 hidden w-full max-w-3xl -translate-x-1/2 px-6 lg:block">
        <SlideInfo clip={clip} />
      </div>

      {/* Indicateur index mobile */}
      <span className="absolute left-4 top-16 rounded-full bg-black/45 px-2.5 py-1 text-[10px] tabular-nums text-white/60 backdrop-blur lg:hidden">
        {index + 1}
      </span>
    </section>
  );
}

function SlideInfo({ clip }: { clip: Clip }) {
  return (
    <div className="pointer-events-none">
      <p className="text-sm font-semibold text-white">
        @{clip.author_name.replace(/\s+/g, '').toLowerCase()}
        <span className="ml-2 font-normal text-white/50">{timeAgoFr(clip.created_at)}</span>
      </p>
      <p className="mt-1.5 max-w-md text-sm leading-snug text-white/85">{clip.caption}</p>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-gold/90">
        <Music2 size={11} />
        son original · {clip.author_name}
        <span className="text-white/40">· {clip.duration}s</span>
      </p>
    </div>
  );
}

function RailAvatar({ clip }: { clip: Clip }) {
  return (
    <div className="relative mb-1">
      <Avatar src={clip.author_avatar} name={clip.author_name} size={48} className="ring-2 ring-white/25" />
      <span
        className="absolute -bottom-1.5 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-gold text-[11px] font-semibold text-black"
        style={{ height: 18, width: 18 }}
      >
        +
      </span>
    </div>
  );
}

function RailButton({
  icon,
  label,
  ariaLabel,
  onClick,
  filled,
}: {
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  filled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className="group flex flex-col items-center gap-1 text-white transition-transform active:scale-90">
      <span className={cn('drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-colors', filled ? 'text-gold' : 'group-hover:text-gold')}>
        {icon}
      </span>
      <span className="text-[11px] font-medium text-white/80 tabular-nums">{label}</span>
    </button>
  );
}

/* ================= SLIDE DE FIN ================= */
function EndSlide({ total, code, sealed }: { total: number; code: string; sealed: boolean }) {
  return (
    <section className="relative flex h-full w-full snap-start flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
      <InfinityMark className="h-5 opacity-90" />
      <div>
        <h2 className="text-2xl font-light">Vous avez vu les {total} instants.</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-mist">
          {sealed
            ? 'La capsule est scellée. Ces instants vivront pour toujours.'
            : 'La capsule est encore ouverte — ajoutez vos dix secondes.'}
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        {sealed ? (
          <Link href="/mini-site" className="btn-gold px-7 py-3 text-[13px]">
            <Lock size={14} />
            Voir le mini-site scellé
          </Link>
        ) : (
          <Link href="/app/capture" className="btn-gold px-7 py-3 text-[13px]">
            Capturer mes 10 secondes
          </Link>
        )}
        <Link href="/app/capsule/cap_jourj" className="btn-outline px-6 py-3 text-[13px]">
          Ouvrir la capsule ({code})
        </Link>
      </div>
      <span className="absolute bottom-24 flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-mist/50 lg:bottom-10">
        Collecte en cours <LiveDots />
      </span>
    </section>
  );
}
