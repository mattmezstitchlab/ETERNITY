'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Clapperboard,
  Globe,
  Hourglass,
  Lock,
  Megaphone,
  Palette,
  QrCode,
  Type,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { QRBadge } from '@/components/ui-kit';
import { UNIVERSES } from '@/lib/universes';
import { cn, generateAimeCode } from '@/lib/utils';

const STEPS = [
  { id: 'univers', label: 'Univers', icon: Palette },
  { id: 'nom', label: 'Nom', icon: Type },
  { id: 'temporalite', label: 'Temporalité', icon: CalendarClock },
  { id: 'invites', label: 'QR & invités', icon: QrCode },
  { id: 'consignes', label: 'Consignes', icon: Megaphone },
  { id: 'montage', label: 'Montage IA', icon: Clapperboard },
  { id: 'minisite', label: 'Mini-site', icon: Globe },
  { id: 'scellement', label: 'Scellement', icon: Lock },
] as const;

export function CapsuleWizard() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const code = useMemo(() => generateAimeCode(), []);

  // État du formulaire
  const [univers, setUnivers] = useState('mariage');
  const [nom, setNom] = useState('Notre Jour J');
  const [ouverture, setOuverture] = useState<'immediat' | 'date'>('immediat');
  const [inviteCount, setInviteCount] = useState(89);
  const [consigne, setConsigne] = useState('Racontez votre meilleur souvenir avec nous.');
  const [tonalite, setTonalite] = useState('documentaire');
  const [visibilite, setVisibilite] = useState<'prive' | 'lien' | 'public'>('lien');
  const [engagement, setEngagement] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="mx-auto max-w-3xl">
      <header className="text-center">
        <p className="kicker">Parcours capsule</p>
        <h1 className="mt-4 text-balance text-4xl font-light leading-[1.08] md:text-5xl">
          Huit étapes vers l’éternité.
        </h1>
      </header>

      {/* Stepper */}
      <ol className="no-scrollbar mt-10 flex gap-1.5 overflow-x-auto pb-2 md:justify-center">
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={cn(
                'flex w-16 flex-col items-center gap-2 rounded-card px-2 py-3 transition-all md:w-20',
                i === step ? 'bg-card' : 'opacity-45 hover:opacity-80',
                i < step && 'cursor-pointer opacity-70 hover:opacity-100',
              )}
              aria-current={i === step ? 'step' : undefined}
            >
              <s.icon size={15} strokeWidth={1.6} className={i <= step ? 'text-gold' : 'text-mist'} />
              <span className="text-[9px] uppercase tracking-[1.5px] text-mist">{s.label}</span>
              <span className={cn('h-0.5 w-full rounded-full', i <= step ? 'bg-gold' : 'bg-white/10')} />
            </button>
          </li>
        ))}
      </ol>

      <div className="card mt-6 min-h-[430px] p-7 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            {!done && (
              <>
                <p className="text-xs uppercase tracking-kicker text-gold">
                  Étape {step + 1} / {STEPS.length}
                </p>

                {/* 1 — UNIVERS */}
                {step === 0 && (
                  <Step title="À quel univers appartient cette capsule ?">
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {UNIVERSES.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setUnivers(u.id)}
                          aria-pressed={univers === u.id}
                          className={cn(
                            'flex flex-col items-center gap-3 rounded-card p-4 transition-all',
                            univers === u.id ? 'bg-gold/15 ring-1 ring-gold' : 'bg-raise hover:bg-raise/70',
                            !u.live && 'opacity-50',
                          )}
                        >
                          <u.icon size={18} className={univers === u.id ? 'text-gold' : 'text-mist'} />
                          <span className="text-xs text-white">{u.name}</span>
                        </button>
                      ))}
                    </div>
                    <Hint>
                      Le dossier « mariage » adaptera les rôles (mariés, témoins, invités,
                      prestataires), le budget et l’agenda automatiquement.
                    </Hint>
                  </Step>
                )}

                {/* 2 — NOM */}
                {step === 1 && (
                  <Step title="Donnez-lui un nom qui traverse le temps.">
                    <input
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="input text-lg"
                      placeholder="Notre Jour J"
                      maxLength={60}
                    />
                    <div className="flex flex-wrap gap-2">
                      {['Notre Jour J', 'La capsule de Sophie & Lucas', '15.06.2027'].map((s) => (
                        <button key={s} type="button" onClick={() => setNom(s)} className="chip transition-colors hover:text-gold">
                          {s}
                        </button>
                      ))}
                    </div>
                    <Hint>Ce nom restera gravé après le scellement. Choisissez-le comme une dédicace.</Hint>
                  </Step>
                )}

                {/* 3 — TEMPORALITÉ */}
                {step === 2 && (
                  <Step title="Quand la capsule s’ouvrira-t-elle ?">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ChoiceCard
                        active={ouverture === 'immediat'}
                        onClick={() => setOuverture('immediat')}
                        title="Dès le scellement"
                        text="Le film est visible immédiatement sur le mini-site — parfait pour un mariage."
                      />
                      <ChoiceCard
                        active={ouverture === 'date'}
                        onClick={() => setOuverture('date')}
                        title="À une date future"
                        text="Capsule temporelle : ouverture programmée dans 1, 10 ou 18 ans."
                      />
                    </div>
                    <Hint>
                      Une capsule peut être scellée le soir même… et ne se révéler qu’au 10ᵉ
                      anniversaire.
                    </Hint>
                  </Step>
                )}

                {/* 4 — QR & INVITÉS */}
                {step === 3 && (
                  <Step title="Votre QR est né. Combien le scanneront ?">
                    <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
                      <QRBadge code={code} size={120} />
                      <div>
                        <label className="text-sm text-white/80" htmlFor="invites">
                          Nombre d’invités estimé
                        </label>
                        <input
                          id="invites"
                          type="range"
                          min={2}
                          max={500}
                          value={inviteCount}
                          onChange={(e) => setInviteCount(Number(e.target.value))}
                          className="mt-3 w-full accent-gold"
                        />
                        <p className="mt-2 text-3xl font-light text-gold">{inviteCount}</p>
                        <p className="mt-1 text-xs text-mist">
                          ≈ {Math.round(inviteCount * 0.7)} clips attendus (taux de participation moyen : 70 %)
                        </p>
                      </div>
                    </div>
                    <Hint>Le QR s’imprime sur les menus, les faire-part, les tables — partout.</Hint>
                  </Step>
                )}

                {/* 5 — CONSIGNES */}
                {step === 4 && (
                  <Step title="Que direz-vous à vos invités ?">
                    <textarea
                      value={consigne}
                      onChange={(e) => setConsigne(e.target.value)}
                      rows={3}
                      maxLength={140}
                      className="input resize-none text-base leading-relaxed"
                    />
                    <p className="text-right text-xs text-mist/60">{consigne.length}/140</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Racontez votre meilleur souvenir avec nous.',
                        'Un conseil pour les mariés, en 10 secondes.',
                        'Dansez, chantez, déclarez votre flamme !',
                      ].map((s) => (
                        <button key={s} type="button" onClick={() => setConsigne(s)} className="chip transition-colors hover:text-gold">
                          {s}
                        </button>
                      ))}
                    </div>
                    <Hint>La consigne s’affiche juste avant l’enregistrement, après le scan du QR.</Hint>
                  </Step>
                )}

                {/* 6 — MONTAGE IA */}
                {step === 5 && (
                  <Step title="Quelle tonalité pour le film ?">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { id: 'documentaire', t: 'Documentaire', d: 'Chronologique, voix et rires au premier plan.' },
                        { id: 'poetique', t: 'Poétique', d: 'Ralentis, respiration, musique ambiante.' },
                        { id: 'celebration', t: 'Célébration', d: 'Rythmé, coupé sur la musique, énergie maximale.' },
                      ].map((o) => (
                        <ChoiceCard
                          key={o.id}
                          active={tonalite === o.id}
                          onClick={() => setTonalite(o.id)}
                          title={o.t}
                          text={o.d}
                        />
                      ))}
                    </div>
                    <Hint>Le montage IA est inclus — aucune compétence en vidéo requise, pour personne.</Hint>
                  </Step>
                )}

                {/* 7 — MINI-SITE */}
                {step === 6 && (
                  <Step title="Qui pourra voir le mini-site ?">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <ChoiceCard
                        active={visibilite === 'prive'}
                        onClick={() => setVisibilite('prive')}
                        title="Privé"
                        text="Vous seuls. La capsule dort à l’abri des regards."
                      />
                      <ChoiceCard
                        active={visibilite === 'lien'}
                        onClick={() => setVisibilite('lien')}
                        title="Lien secret"
                        text="Visible par quiconque possède le lien ou le QR."
                      />
                      <ChoiceCard
                        active={visibilite === 'public'}
                        onClick={() => setVisibilite('public')}
                        title="Public"
                        text="Référencé dans le Registre communautaire."
                      />
                    </div>
                    <Hint>Vous pourrez changer la visibilité à tout moment avant le scellement.</Hint>
                  </Step>
                )}

                {/* 8 — SCELLEMENT */}
                {step === 7 && (
                  <Step title="Récapitulatif — prêt à exister.">
                    <dl className="grid gap-2.5 sm:grid-cols-2">
                      {[
                        ['Capsule', nom || 'Notre Jour J'],
                        ['Univers', UNIVERSES.find((u) => u.id === univers)?.name ?? 'Mariage'],
                        ['QR', code],
                        ['Invités', `${inviteCount} estimés`],
                        ['Ouverture', ouverture === 'immediat' ? 'Dès le scellement' : 'Date programmée'],
                        ['Tonalité IA', tonalite],
                        ['Visibilité', visibilite === 'lien' ? 'Lien secret' : visibilite === 'public' ? 'Publique' : 'Privée'],
                        ['Durée clip', '10 secondes'],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-card bg-raise px-4 py-3">
                          <dt className="text-[10px] uppercase tracking-[2px] text-mist/70">{k}</dt>
                          <dd className="mt-1 truncate text-sm capitalize text-white">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-card bg-raise p-4">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={engagement}
                        onClick={() => setEngagement((v) => !v)}
                        className={cn(
                          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all',
                          engagement ? 'bg-gold text-black' : 'bg-ink ring-1 ring-white/20',
                        )}
                      >
                        {engagement && <Check size={13} strokeWidth={3} />}
                      </button>
                      <span className="text-sm leading-relaxed text-white/85">
                        Je comprends que le <strong className="text-gold">scellement est irréversible</strong> :
                        horodaté, définitif, éternel.
                      </span>
                    </label>
                  </Step>
                )}
              </>
            )}

            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Hourglass size={24} strokeWidth={1.5} />
                </span>
                <h2 className="mt-6 text-3xl font-light">« {nom || 'Notre Jour J'} » existe.</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
                  La capsule est créée et collecte déjà. Partagez le QR — le temps fera le reste.
                </p>
                <div className="mt-8 flex justify-center">
                  <QRBadge code={code} size={140} />
                </div>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Link href="/espace-compte" className="btn-gold">
                    Voir dans mon espace
                  </Link>
                  <Link href={`/app/qr/${code}`} className="btn-outline">
                    Partager le QR
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {!done && (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="btn-ghost px-5 py-2.5 text-[13px]"
          >
            <ArrowLeft size={14} />
            Retour
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-gold">
              Continuer
              <ArrowRight size={15} />
            </button>
          ) : (
            <button type="button" disabled={!engagement} onClick={() => setDone(true)} className="btn-gold">
              <Lock size={15} />
              Créer la capsule
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-7 mt-2 text-2xl font-light leading-snug md:text-3xl">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-card bg-raise/60 p-4 text-xs leading-relaxed text-mist">
      {children}
    </p>
  );
}

function ChoiceCard({
  active,
  onClick,
  title,
  text,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-card p-5 text-left transition-all',
        active ? 'bg-gold/15 ring-1 ring-gold' : 'bg-raise hover:bg-raise/70',
      )}
    >
      <span className={cn('block text-sm font-medium', active ? 'text-gold' : 'text-white')}>{title}</span>
      <span className="mt-1.5 block text-xs leading-relaxed text-mist">{text}</span>
    </button>
  );
}
