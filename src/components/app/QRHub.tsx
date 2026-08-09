'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, Copy, Download, ScanLine, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { Avatar } from '@/components/ui-kit';
import { useEternity } from '@/lib/store';
import { cn, isValidAimeCode, normalizeAimeCode } from '@/lib/utils';

type Tab = 'afficher' | 'scanner';

export function QRHub() {
  const params = useParams<{ code: string }>();
  const code = normalizeAimeCode(decodeURIComponent(params.code ?? 'AIME-742-PLM'));
  const [tab, setTab] = useState<Tab>('afficher');

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-md flex-col px-5 pb-10 pt-6 lg:min-h-0 lg:max-w-lg lg:pt-10">
      <header className="text-center">
        <p className="kicker">Identité capsule</p>
        <h1 className="mt-2 text-3xl font-light">Le QR passe-partout</h1>
      </header>

      {/* Onglets */}
      <div className="mx-auto mt-6 grid w-full max-w-xs grid-cols-2 rounded-full bg-card p-1">
        {(
          [
            { id: 'afficher', label: 'Afficher', icon: Copy },
            { id: 'scanner', label: 'Scanner', icon: ScanLine },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] transition-all',
              tab === t.id ? 'bg-gold text-black' : 'text-mist hover:text-white',
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-8 flex-1"
        >
          {tab === 'afficher' ? <QRAfficher code={code} /> : <QRScanner />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =============== AFFICHER =============== */
function QRAfficher({ code }: { code: string }) {
  const { folder, capsule } = useEternity();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const shareUrl = `https://eternity.video/app/qr/${code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Capsule ETERNITY',
          text: `Rejoignez « ${capsule.name} » et filmez 10 secondes : ${code}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        setTimeout(() => setShared(false), 1600);
      }
    } catch {
      /* partage annulé */
    }
  };

  const download = () => {
    const svg = document.querySelector<SVGSVGElement>('#qr-download-source');
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eternity-${code}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-center">
      <div className="card mx-auto max-w-xs p-7">
        <p className="text-sm font-medium text-white">{folder.name}</p>
        <p className="mt-1 text-xs text-mist">Capsule « {capsule.name} »</p>
        <div className="mt-6 inline-block rounded-3xl bg-white p-5 shadow-[0_0_70px_-14px_rgba(201,169,110,0.7)]">
          <QRCode id="qr-download-source" value={shareUrl} size={180} fgColor="#0A0A0A" bgColor="#FFFFFF" />
        </div>
        <button
          type="button"
          onClick={copy}
          className="mx-auto mt-5 flex items-center gap-2 rounded-full bg-raise px-4 py-2 font-mono text-sm tracking-[2px] text-gold transition-colors hover:text-gold-light"
        >
          {code}
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      <div className="mx-auto mt-5 grid max-w-xs grid-cols-2 gap-3">
        <button type="button" onClick={share} className="btn-gold px-4 py-3 text-[13px]">
          <Share2 size={14} />
          {shared ? 'Copié !' : 'Partager'}
        </button>
        <button type="button" onClick={download} className="btn-outline px-4 py-3 text-[13px]">
          <Download size={14} />
          Imprimer
        </button>
      </div>

      <p className="mx-auto mt-6 max-w-xs text-xs leading-relaxed text-mist">
        Sur les faire-part, les menus et les tables. Chaque scan ouvre la capsule — un clip de 10
        secondes, aucune app à installer.
      </p>
    </div>
  );
}

/* =============== SCANNER =============== */
function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const [cameraState, setCameraState] = useState<'pending' | 'on' | 'denied'>('pending');
  const [detected, setDetected] = useState<string | null>(null);
  const [manual, setManual] = useState('');
  const [manualResult, setManualResult] = useState<'idle' | 'ok' | 'ko'>('idle');
  const { markContactScanned } = useEternity();

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const extractCode = (text: string): string | null => {
    const match = text.toUpperCase().match(/AIME-[A-Z0-9]{3}-[A-Z0-9]{3}/);
    return match ? match[0] : null;
  };

  const startScan = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('denied');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setCameraState('on');

      const { default: jsQR } = await import('jsqr');
      const tick = () => {
        const canvas = canvasRef.current;
        const v = videoRef.current;
        if (canvas && v && v.readyState === v.HAVE_ENOUGH_DATA) {
          canvas.width = v.videoWidth;
          canvas.height = v.videoHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qr = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });
            if (qr?.data) {
              const found = extractCode(qr.data);
              if (found) {
                setDetected(found);
                stopCamera();
                return;
              }
            }
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setCameraState('denied');
    }
  }, [stopCamera]);

  useEffect(() => {
    startScan();
    return stopCamera;
  }, [startScan, stopCamera]);

  return (
    <div>
      {!detected ? (
        <>
          {/* Viseur */}
          <div className="relative mx-auto aspect-square max-w-xs overflow-hidden rounded-[28px] bg-card">
            {cameraState === 'on' && (
              <video ref={videoRef} className="h-full w-full object-cover" playsInline muted aria-label="Scanner QR" />
            )}
            <canvas ref={canvasRef} className="hidden" />
            {/* Cadre de visée */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute left-6 top-6 h-10 w-10 rounded-tl-2xl border-l-[3px] border-t-[3px] border-gold" />
              <div className="absolute right-6 top-6 h-10 w-10 rounded-tr-2xl border-r-[3px] border-t-[3px] border-gold" />
              <div className="absolute bottom-6 left-6 h-10 w-10 rounded-bl-2xl border-b-[3px] border-l-[3px] border-gold" />
              <div className="absolute bottom-6 right-6 h-10 w-10 rounded-br-2xl border-b-[3px] border-r-[3px] border-gold" />
              {cameraState === 'on' && (
                <motion.div
                  className="absolute inset-x-10 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                  animate={{ top: ['18%', '82%', '18%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
            {cameraState === 'denied' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
                <Camera size={22} className="text-gold" />
                <p className="text-xs leading-relaxed text-mist">
                  Caméra indisponible ici — saisissez le code manuellement ci-dessous.
                </p>
              </div>
            )}
          </div>

          {/* Saisie manuelle */}
          <form
            className="mx-auto mt-6 flex max-w-xs gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = isValidAimeCode(manual);
              setManualResult(ok ? 'ok' : 'ko');
              if (ok) setDetected(normalizeAimeCode(manual));
            }}
          >
            <input
              value={manual}
              onChange={(e) => {
                setManual(e.target.value.toUpperCase());
                setManualResult('idle');
              }}
              placeholder="AIME-742-PLM"
              className={cn(
                'input flex-1 font-mono tracking-[2px]',
                manualResult === 'ko' && 'ring-2 ring-red-500/60',
              )}
              aria-label="Saisir un code AIME"
            />
            <button type="submit" className="btn-gold shrink-0 px-5 py-3 text-[13px]">
              Valider
            </button>
          </form>
          {manualResult === 'ko' && (
            <p className="mt-2 text-center text-xs text-red-400">Format attendu : AIME-XXX-XXX</p>
          )}
        </>
      ) : (
        <ScannedResult code={detected} onRescan={() => { setDetected(null); setManual(''); startScan(); }} markContactScanned={markContactScanned} />
      )}
    </div>
  );
}

function ScannedResult({
  code,
  onRescan,
  markContactScanned,
}: {
  code: string;
  onRescan: () => void;
  markContactScanned: (id: string) => void;
}) {
  const { capsule, contacts } = useEternity();
  const isOwn = code === capsule.code;
  const known = contacts.find((c) => c.scanned);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card mx-auto max-w-xs p-8 text-center"
    >
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
        <Check size={26} strokeWidth={1.8} />
      </span>
      <p className="kicker mt-5">QR reconnu</p>
      <p className="mt-2 font-mono text-xl tracking-[3px] text-white">{code}</p>
      <p className="mt-4 text-sm leading-relaxed text-mist">
        {isOwn
          ? `C’est la capsule « ${capsule.name} ». Bienvenue — vous pouvez filmer vos 10 secondes.`
          : 'Code valide. La capsule associée va s’ouvrir pour votre clip de 10 secondes.'}
      </p>
      {known && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-mist">
          <Avatar src={known.avatar} name={known.name} size={22} />
          {known.name} a déjà scanné ce code
        </div>
      )}
      <div className="mt-7 space-y-2.5">
        <a href="/app/capsule/cap_jourj" className="btn-gold w-full">
          Ouvrir la capsule
        </a>
        <button
          type="button"
          onClick={() => {
            markContactScanned('ct_hugo');
            onRescan();
          }}
          className="btn-outline w-full"
        >
          Scanner un autre code
        </button>
      </div>
    </motion.div>
  );
}
