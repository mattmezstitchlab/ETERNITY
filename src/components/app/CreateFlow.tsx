'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { QRBadge } from '@/components/ui-kit';
import { UNIVERSES } from '@/lib/universes';
import { cn, generateAimeCode } from '@/lib/utils';

const TOTAL = 4;

/** Flow de création mobile — étapes 1 à 4 (version rapide du parcours 8 étapes web) */
export function CreateFlow() {
  const [step, setStep] = useState(1);
  const [univers, setUnivers] = useState('mariage');
  const [nom, setNom] = useState('');
  const [date, setDate] = useState('2027-06-15');
  const [invites, setInvites] = useState(89);
  const [done, setDone] = useState(false);
  const code = useMemo(() => generateAimeCode(), []);

  const canNext = step !== 1 || !!univers;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-md flex-col px-5 pb-10 pt-6 lg:min-h-0 lg:max-w-lg lg:pt-10">
      {!done ? (
        <>
          {/* Progression */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-500',
                  i < step ? 'bg-gold' : 'bg-white/10',
                )}
              />
            ))}
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-kicker text-gold">
            Étape {step} / {TOTAL}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -26 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mt-6 flex-1"
            >
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-light">Quel univers ?</h1>
                  <div className="mt-6 grid grid-cols-2 gap-2.5">
                    {UNIVERSES.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUnivers(u.id)}
                        aria-pressed={univers === u.id}
                        className={cn(
                          'flex flex-col items-start gap-5 rounded-card p-4 text-left transition-all',
                          univers === u.id ? 'bg-gold/15 ring-1 ring-gold' : 'bg-card',
                          !u.live && 'opacity-45',
                        )}
                      >
                        <u.icon size={18} className={univers === u.id ? 'text-gold' : 'text-mist'} />
                        <span className="text-sm text-white">{u.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-light">Nommez-la.</h1>
                  <input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Notre Jour J"
                    maxLength={60}
                    className="input mt-6"
                    autoFocus
                  />
                  <label className="mt-4 block">
                    <span className="mb-2 block text-xs text-mist">Date de l’événement</span>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input [color-scheme:dark]"
                    />
                  </label>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h1 className="text-2xl font-light">Combien d’invités ?</h1>
                  <input
                    type="range"
                    min={2}
                    max={500}
                    value={invites}
                    onChange={(e) => setInvites(Number(e.target.value))}
                    className="mt-8 w-full accent-gold"
                    aria-label="Nombre d'invités"
                  />
                  <p className="mt-3 text-center text-4xl font-light text-gold">{invites}</p>
                  <p className="mt-2 text-center text-xs text-mist">
                    ≈ {Math.round(invites * 0.7)} clips attendus
                  </p>
                  <div className="card mt-6 p-4 text-xs leading-relaxed text-mist">
                    Chaque invité scannera le QR de la capsule pour filmer 10 secondes. Aucune
                    app à installer pour eux.
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h1 className="text-2xl font-light">Votre QR est né.</h1>
                  <p className="mt-2 text-sm text-mist">
                    Imprimez-le sur les faire-part, les menus, les tables.
                  </p>
                  <div className="mt-7 flex justify-center">
                    <QRBadge code={code} size={140} />
                  </div>
                  <dl className="card mt-7 space-y-2 p-5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-mist">Capsule</dt>
                      <dd className="text-white">{nom.trim() || 'Notre Jour J'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-mist">Univers</dt>
                      <dd className="capitalize text-white">{univers.replace('-', ' ')}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-mist">Événement</dt>
                      <dd className="text-white">
                        {new Date(date + 'T12:00').toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-mist">Invités</dt>
                      <dd className="text-white">{invites}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="btn-ghost px-4 py-2.5 text-[13px]"
            >
              <ArrowLeft size={14} />
              Retour
            </button>
            {step < TOTAL ? (
              <button
                type="button"
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                className="btn-gold px-6 py-3 text-[13px]"
              >
                Continuer
                <ArrowRight size={14} />
              </button>
            ) : (
              <button type="button" onClick={() => setDone(true)} className="btn-gold px-6 py-3 text-[13px]">
                <Check size={14} />
                Créer
              </button>
            )}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-1 flex-col items-center justify-center text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
            <PartyPopper size={24} strokeWidth={1.5} />
          </span>
          <h1 className="mt-6 text-3xl font-light">C’est parti.</h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">
            « {nom.trim() || 'Notre Jour J'} » collecte déjà. Partagez le QR — le temps fait le reste.
          </p>
          <div className="mt-8 w-full space-y-3">
            <Link href={`/app/qr/${code}`} className="btn-gold w-full">
              Partager le QR
            </Link>
            <Link href="/app/capsule/cap_jourj" className="btn-outline w-full">
              Ouvrir la capsule
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
