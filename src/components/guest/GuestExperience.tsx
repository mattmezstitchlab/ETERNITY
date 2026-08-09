'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Lock,
  RefreshCcw,
  SwitchCamera,
  Timer,
  Upload,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InfinityMark } from '@/components/Logo';
import { GUESTS_TOTAL } from '@/lib/data';
import { idbPut, isIdbAvailable } from '@/lib/idb';
import { useEternity } from '@/lib/store';
import { cn, formatDateFr, isValidAimeCode, uid } from '@/lib/utils';

const MAX_SECONDS = 10;

type Step = 'welcome' | 'consigne' | 'camera' | 'preview' | 'sent';

/**
 * /c/:code — LA page invité.
 * Zéro app, zéro compte : scan → consigne → 10 s → envoi → merci.
 * C'est 80 % de la valeur du produit. Si cette page met plus de
 * 15 s à être utilisable ou plante, le produit est mort.
 */
export function GuestExperience({ code }: { code: string }) {
  const { capsule, folder, clips, addClip } = useEternity();
  const valid = isValidAimeCode(code);
  const known = valid && code === capsule.code;

  const event = known
    ? {
        couple: 'Sophie & Lucas',
        dateIso: folder.metadata.date as string,
        lieu: folder.metadata.lieu as string,
        capsuleName: capsule.name,
        consigne: 'Racontez votre meilleur souvenir avec nous.',
        known: true,
      }
    : {
        couple: 'Un événement ETERNITY',
        dateIso: null as string | null,
        lieu: null as string | null,
        capsuleName: 'Capsule privée',
        consigne: 'Dix secondes pour dire l’essentiel.',
        known: false,
      };

  const [step, setStep] = useState<Step>(valid ? 'welcome' : 'sent'); // invalid → écran dédié plus bas

  // Segments story (1·2·3·4) — mécanique qui réduit l'abandon
  const segmentIndex = step === 'welcome' ? 0 : step === 'consigne' ? 1 : step === 'sent' ? 3 : 2;

  return (
    <main className="relative flex min-h-dvh flex-col bg-ink">
      <Header code={code} />
      {valid && <StorySegments current={segmentIndex} />}
      {!valid ? (
        <InvalidCode />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col"
          >
            {step === 'welcome' && (
              <Welcome event={event} clipsCount={clips.length} onStart={() => setStep('consigne')} />
            )}
            {step === 'consigne' && (
              <Consigne
                event={event}
                onBack={() => setStep('welcome')}
                onReady={() => setStep('camera')}
              />
            )}
            {(step === 'camera' || step === 'preview') && (
              <GuestCamera
                step={step}
                setStep={setStep}
                onDone={() => setStep('sent')}
                event={event}
                addClip={addClip}
              />
            )}
            {step === 'sent' && <Sent clipsCount={clips.length} known={event.known} />}
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
}

/* ---------------- Segments story ---------------- */
const SEGMENTS = ['Accueil', 'Consigne', 'Captation', 'Merci'] as const;

function StorySegments({ current }: { current: number }) {
  return (
    <div className="mx-auto flex w-full max-w-sm items-center gap-1.5 px-6 pb-2 pt-1" aria-hidden>
      {SEGMENTS.map((_, i) => (
        <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
          {i < current && <span className="absolute inset-0 rounded-full bg-gold" />}
          {i === current && (
            <motion.span
              layoutId="guest-segment"
              className="absolute inset-y-0 left-0 rounded-full bg-gold"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          )}
        </span>
      ))}
    </div>
  );
}

/* ---------------- Header minimal ---------------- */
function Header({ code }: { code: string }) {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <Link href="/" aria-label="ETERNITY" className="flex items-center gap-2.5 opacity-90 transition-opacity hover:opacity-100">
        <InfinityMark className="h-3.5" />
        <span className="text-[11px] font-medium tracking-[5px] text-white">ETERNITY</span>
      </Link>
      <span className="chip font-mono tracking-[1.5px] text-gold/90">{code}</span>
    </header>
  );
}

/* ---------------- Écran code invalide ---------------- */
function InvalidCode() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-gold">
        <X size={24} strokeWidth={1.5} />
      </span>
      <div>
        <h1 className="text-3xl font-light">Ce code ne dit rien</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-mist">
          Le format attendu est <span className="font-mono text-gold">AIME-XXX-XXX</span> —
          vérifiez le QR ou demandez le lien aux organisateurs.
        </p>
      </div>
      <Link href="/" className="btn-outline">
        Découvrir ETERNITY
      </Link>
    </div>
  );
}

/* ---------------- 1 · Bienvenue ---------------- */
function Welcome({
  event,
  clipsCount,
  onStart,
}: {
  event: { couple: string; dateIso: string | null; lieu: string | null; capsuleName: string };
  clipsCount: number;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="kicker"
      >
        Vous êtes attendu·e
      </motion.p>
      <h1 className="mt-5 text-balance text-5xl font-light leading-[1.02] text-white md:text-6xl">
        {event.couple}
      </h1>
      {event.dateIso && (
        <p className="mt-4 text-sm text-white/70">
          {formatDateFr(event.dateIso)} {event.lieu ? `· ${event.lieu}` : ''}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <span className="chip bg-gold/12 text-gold">
          <Timer size={12} />
          {clipsCount > 0 ? `${clipsCount} clips déjà dans la capsule` : 'La capsule vous attend'}
        </span>
        {event.dateIso && <span className="chip">{GUESTS_TOTAL} invités</span>}
      </div>

      <p className="mx-auto mt-8 max-w-sm text-balance text-base leading-relaxed text-mist">
        Ils ne vous demandent ni cadeau, ni discours.
        <br />
        <span className="text-white">Dix secondes de vous, rien de plus.</span>
      </p>

      <button type="button" onClick={onStart} className="btn-gold mt-10 px-9 py-4 text-base">
        Filmer mes 10 secondes
        <ChevronRight size={17} />
      </button>

      <p className="mt-6 text-[11px] text-mist/70">
        Pas d’app à installer · Pas de compte · Juste vous
      </p>
    </div>
  );
}

/* ---------------- 2 · Consigne ---------------- */
function Consigne({
  event,
  onBack,
  onReady,
}: {
  event: { couple: string; consigne: string };
  onBack: () => void;
  onReady: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
      <p className="kicker">La consigne de {event.couple.split(' ')[0]} & co</p>
      <blockquote className="mx-auto mt-8 max-w-xl text-balance text-3xl font-light leading-snug text-white md:text-4xl">
        « {event.consigne} »
      </blockquote>
      <ul className="mt-10 space-y-2.5 text-left text-sm text-mist">
        {[
          'Parlez comme vous parleriez à un ami, pas à une caméra.',
          'Vertical ou horizontal — les deux vivront très bien.',
          `L’enregistrement s’arrête tout seul à ${MAX_SECONDS} secondes.`,
        ].map((t) => (
          <li key={t} className="flex items-start gap-3">
            <Check size={15} className="mt-0.5 shrink-0 text-gold" />
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-11 flex items-center gap-3">
        <button type="button" onClick={onBack} className="btn-ghost px-4 py-3 text-[13px]">
          <ArrowLeft size={14} />
        </button>
        <button type="button" onClick={onReady} className="btn-gold px-9 py-4 text-base">
          Je suis prêt·e
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- 3 & 4 · Caméra + Aperçu ---------------- */
function GuestCamera({
  step,
  setStep,
  onDone,
  event,
  addClip,
}: {
  step: Step;
  setStep: (s: Step) => void;
  onDone: () => void;
  event: { couple: string };
  addClip: ReturnType<typeof useEternity>['addClip'];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [camDenied, setCamDenied] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [facing, setFacing] = useState<'user' | 'environment'>('user');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(
    async (mode: 'user' | 'environment') => {
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setCamDenied(false);
      } catch {
        setCamDenied(true);
      }
    },
    [stopStream],
  );

  useEffect(() => {
    if (step !== 'camera') return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamDenied(true);
      return;
    }
    startCamera(facing);
    return stopStream;
  }, [step, facing, startCamera, stopStream]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    chunksRef.current = [];
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4'].find((m) =>
      MediaRecorder.isTypeSupported(m),
    );
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    recorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const b = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
      setBlob(b);
      setBlobUrl(URL.createObjectURL(b));
      stopStream();
      setStep('preview');
    };
    recorder.start(250);
    setElapsed(0);
    setRecording(true);
    timerRef.current = setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= MAX_SECONDS) {
          stopRecording();
          return MAX_SECONDS;
        }
        return s + 1;
      });
    }, 1000);
  }, [setStep, stopRecording, stopStream]);

  const onUpload = (file: File) => {
    const b = new Blob([file], { type: file.type || 'video/mp4' });
    setBlob(b);
    setBlobUrl(URL.createObjectURL(b));
    stopStream();
    setStep('preview');
  };

  const retake = () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlob(null);
    setBlobUrl(null);
    setElapsed(0);
    setStep('camera');
  };

  const send = async () => {
    if (!blob || sending) return;
    setSending(true);
    const key = `clip-${uid('blob')}`;
    if (isIdbAvailable()) {
      try {
        await idbPut(key, blob);
      } catch {
        /* le clip reste lié à la session */
      }
    }
    addClip({
      user_id: 'guest',
      author_name: name.trim() || 'Un invité',
      author_avatar: null,
      video_url: key,
      poster: null,
      caption: message.trim() || `Dix secondes pour ${event.couple}.`,
      duration: Math.max(1, Math.min(MAX_SECONDS, elapsed || MAX_SECONDS)),
      local: true,
    });
    onDone();
  };

  const R = 34;
  const CIRC = 2 * Math.PI * R;

  if (step === 'preview' && blobUrl) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10">
        <div className="relative overflow-hidden rounded-[28px] bg-black">
          <video src={blobUrl} controls autoPlay loop playsInline muted className="aspect-[3/4] w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[10px] font-medium text-black">
            Vos 10 secondes
          </span>
        </div>
        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs text-mist">Votre prénom (pour le générique)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="Ex. Mamie Colette"
              className="input"
              autoFocus
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-mist">Un mot pour le film (optionnel)</span>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={90}
              placeholder="À dans 50 ans pour la revoir ensemble."
              className="input"
            />
          </label>
        </div>
        <div className="mt-6 flex items-center gap-3 pb-4">
          <button type="button" onClick={retake} className="btn-outline px-5 py-3.5 text-[13px]">
            <X size={14} />
            Refaire
          </button>
          <button type="button" onClick={send} disabled={sending} className="btn-gold flex-1 py-4">
            {sending ? 'Envoi…' : 'Sceller dans la capsule'}
            <Lock size={15} />
          </button>
        </div>
      </div>
    );
  }

  /* étape caméra */
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8">
      <div className="relative flex-1 overflow-hidden rounded-[28px] bg-black">
        {!camDenied ? (
          <video ref={videoRef} autoPlay playsInline muted className="h-full min-h-[380px] w-full object-cover" />
        ) : (
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-gold">
              <Upload size={20} strokeWidth={1.5} />
            </span>
            <p className="text-sm leading-relaxed text-mist">
              Caméra bloquée sur cet appareil.
              <br />
              <span className="text-white">Importez une vidéo de 10 s depuis votre galerie.</span>
            </p>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-gold px-6 py-3 text-[13px]">
              Choisir une vidéo
            </button>
            <button type="button" onClick={() => startCamera(facing)} className="btn-ghost px-4 py-2 text-xs">
              <RefreshCcw size={12} />
              Réessayer la caméra
            </button>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />

        {!camDenied && (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[22px] border border-white/15" />
            {recording && (
              <div className="absolute right-5 top-5 rounded-full bg-black/60 px-3 py-1 text-sm font-medium tabular-nums text-white backdrop-blur">
                {MAX_SECONDS - elapsed}s
              </div>
            )}
            {!recording && (
              <button
                type="button"
                onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
                aria-label="Retourner la caméra"
                className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:text-gold"
              >
                <SwitchCamera size={18} strokeWidth={1.6} />
              </button>
            )}
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              aria-label={recording ? 'Arrêter' : `Filmer ${MAX_SECONDS} secondes`}
              className="absolute bottom-5 left-1/2 flex h-[84px] w-[84px] -translate-x-1/2 items-center justify-center"
            >
              <svg viewBox="0 0 88 88" className="absolute inset-0 -rotate-90">
                <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" />
                <circle
                  cx="44"
                  cy="44"
                  r={R}
                  fill="none"
                  stroke="#C9A96E"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - elapsed / MAX_SECONDS)}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className={recording ? 'h-8 w-8 rounded-md bg-gold' : 'h-16 w-16 rounded-full bg-gold transition-transform hover:scale-95 active:scale-90'} />
            </button>
          </>
        )}
      </div>
      <p className="mt-4 text-center text-[11px] text-mist">
        {recording ? 'Enregistrement… arrêt automatique à 10 s' : 'Touchez le cercle or — 10 s, pas une de plus'}
      </p>
    </div>
  );
}

/* ---------------- 5 · Merci ---------------- */
function Sent({ clipsCount, known }: { clipsCount: number; known: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-gold"
      >
        <Heart size={30} strokeWidth={1.4} className="fill-gold/20" />
      </motion.span>
      <h1 className="mt-8 text-4xl font-light">Merci.</h1>
      <p className="mx-auto mt-4 max-w-sm text-balance text-sm leading-relaxed text-mist">
        {known
          ? 'Votre clip est horodaté. À minuit, la capsule sera scellée — irréversiblement — et vos dix secondes vivront dans le film pour toujours.'
          : 'Votre clip est horodaté et rejoint la capsule. Il vivra dans le film scellé pour toujours.'}
      </p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card mt-8 px-6 py-4"
      >
        <p className="text-2xl font-light text-gold tabular-nums">{clipsCount}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-[2px] text-mist">clips dans la capsule</p>
      </motion.div>
      <div className="mt-10 flex flex-col items-center gap-3">
        <p className="text-xs text-mist/70">Envie du même rituel pour votre événement ?</p>
        <Link href="/" className="btn-outline px-7 py-3 text-[13px]">
          Découvrir ETERNITY
        </Link>
      </div>
      <p className="mt-12 flex items-center gap-2 text-[10px] tracking-[2px] text-mist/50">
        <Check size={11} className="text-gold" />
        ETERNITY by Aime · instants scellés
      </p>
    </div>
  );
}
