'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, RefreshCcw, SwitchCamera, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEternity } from '@/lib/store';

const MAX_SECONDS = 10;

type Phase = 'idle' | 'recording' | 'preview' | 'denied' | 'demo';

export function Capture() {
  const router = useRouter();
  const { uploadClip, user } = useEternity();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [caption, setCaption] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedCloud, setSavedCloud] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(
    async (facing: 'user' | 'environment') => {
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1080 }, height: { ideal: 1920 } },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setPhase('idle');
      } catch {
        setPhase('denied');
      }
    },
    [stopStream],
  );

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setPhase('denied');
      return;
    }
    startCamera(facingMode);
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
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
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
      setRecordedBlob(blob);
      setRecordedUrl(URL.createObjectURL(blob));
      setPhase('preview');
    };
    recorder.start(250);
    setElapsed(0);
    setPhase('recording');
    timerRef.current = setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= MAX_SECONDS) {
          stopRecording();
          return MAX_SECONDS;
        }
        return s + 1;
      });
    }, 1000);
  }, [stopRecording]);

  const retake = useCallback(() => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setRecordedBlob(null);
    setCaption('');
    setElapsed(0);
    startCamera(facingMode);
  }, [recordedUrl, facingMode, startCamera]);

  const save = useCallback(async () => {
    if (!recordedBlob) return;
    const synced = await uploadClip(recordedBlob, {
      caption: caption.trim() || 'Un instant capturé pour la capsule.',
      authorName: user.name.split(' ')[0],
      duration: Math.min(MAX_SECONDS, Math.max(1, elapsed)),
    });
    setSavedCloud(synced);
    setSaved(true);
    setTimeout(() => router.push('/app'), 1000);
  }, [recordedBlob, caption, elapsed, uploadClip, user, router]);

  const progress = elapsed / MAX_SECONDS;
  const RADIUS = 34;
  const CIRC = 2 * Math.PI * RADIUS;

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-black lg:static lg:h-[calc(100dvh-0px)]">
      {/* Vue caméra */}
      <div className="relative flex-1 overflow-hidden">
        {phase !== 'preview' ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
            autoPlay
            aria-label="Aperçu caméra"
          />
        ) : (
          recordedUrl && (
            <video src={recordedUrl} className="h-full w-full object-cover" controls autoPlay loop playsInline muted />
          )
        )}

        {/* Overlay refus caméra */}
        <AnimatePresence>
          {phase === 'denied' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-raise via-ink to-black px-8 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-gold">
                <Camera size={24} strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-xl font-light">Caméra indisponible</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-mist">
                  Autorisez l’accès caméra et micro pour capturer vos 10 secondes. Certains
                  contextes (iframe, navigation privée) bloquent l’accès.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button type="button" onClick={() => startCamera(facingMode)} className="btn-gold">
                  <RefreshCcw size={15} />
                  Réessayer
                </button>
                <button type="button" onClick={() => setPhase('demo')} className="btn-outline">
                  Continuer en mode démo
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'demo' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/20 via-ink to-raise"
            >
              <p className="px-8 text-center text-sm leading-relaxed text-mist">
                Mode démo — la capture est simulée.
                <br />
                <span className="text-gold">Le flux fonctionne exactement pareil.</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cadre + compteur */}
        {(phase === 'idle' || phase === 'recording' || phase === 'demo') && (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-x-6 top-6 flex justify-center">
              <p className="rounded-full bg-black/50 px-4 py-1.5 text-[10px] uppercase tracking-[2px] text-white/80 backdrop-blur">
                Consigne : votre meilleur souvenir avec eux
              </p>
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-4 rounded-[28px] border border-white/15" />
            {phase === 'recording' && (
              <div className="absolute right-7 top-6 rounded-full bg-black/60 px-3 py-1 text-sm font-medium tabular-nums text-white backdrop-blur">
                {MAX_SECONDS - elapsed}s
              </div>
            )}
          </>
        )}

        {/* Boutons caméra */}
        {phase === 'idle' && (
          <button
            type="button"
            onClick={() => {
              const next = facingMode === 'user' ? 'environment' : 'user';
              setFacingMode(next);
              startCamera(next);
            }}
            aria-label="Changer de caméra"
            className="absolute left-6 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:text-gold"
          >
            <SwitchCamera size={20} strokeWidth={1.6} />
          </button>
        )}
      </div>

      {/* Contrôles */}
      <div className="glass border-t border-white/5 px-6 pb-24 pt-5 lg:pb-8">
        {phase === 'preview' ? (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={90}
              placeholder="Ajoutez une légende à cet instant…"
              className="input"
              aria-label="Légende du clip"
            />
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={retake} className="btn-outline px-5 py-3 text-[13px]">
                <X size={14} />
                Refaire
              </button>
              <button type="button" onClick={save} disabled={saved} className="btn-gold flex-1">
                {saved ? (
                  <>
                    <Check size={16} />
                    {savedCloud ? 'Dans la capsule !' : 'Enregistré (hors-ligne)'}
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Ajouter à la capsule
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* Bouton enregistrer + anneau 10s */}
            <button
              type="button"
              onClick={phase === 'recording' ? stopRecording : startRecording}
              disabled={phase === 'denied'}
              aria-label={phase === 'recording' ? 'Arrêter l’enregistrement' : 'Démarrer l’enregistrement de 10 secondes'}
              className="relative flex h-[88px] w-[88px] items-center justify-center disabled:opacity-40"
            >
              <svg viewBox="0 0 88 88" className="absolute inset-0 -rotate-90">
                <circle cx="44" cy="44" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3.5" />
                <circle
                  cx="44"
                  cy="44"
                  r={RADIUS}
                  fill="none"
                  stroke={phase === 'recording' ? '#C9A96E' : 'rgba(201,169,110,0.4)'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - progress)}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <motion.span
                animate={phase === 'recording' ? { scale: [1, 1, 0.9] } : {}}
                className={
                  phase === 'recording'
                    ? 'h-8 w-8 rounded-md bg-gold'
                    : 'h-16 w-16 rounded-full bg-gold transition-transform hover:scale-95 active:scale-90'
                }
              />
            </button>
            <p className="text-[11px] text-mist">
              {phase === 'recording' ? 'Enregistrement… arrêt automatique à 10 s' : 'Touchez pour filmer · 10 s max'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
