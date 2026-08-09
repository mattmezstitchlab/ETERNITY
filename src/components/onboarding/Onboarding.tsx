'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Chrome, Eye, EyeOff, Mail, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { QRBadge } from '@/components/ui-kit';
import { UNIVERSES } from '@/lib/universes';
import { useEternity } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { UniverseId } from '@/lib/types';

type Mode = 'login' | 'signup';

export function Onboarding({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  return (
    <div className="mx-auto max-w-md">
      {/* Onglets */}
      <div className="mx-auto grid max-w-xs grid-cols-2 rounded-full bg-card p-1">
        {(
          [
            { id: 'signup', label: 'Créer un compte' },
            { id: 'login', label: 'Connexion' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id)}
            className={cn(
              'rounded-full py-2.5 text-[13px] transition-all',
              mode === t.id ? 'bg-gold text-black' : 'text-mist hover:text-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          {mode === 'signup' ? <SignupFlow /> : <LoginForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SocialRow() {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 text-xs text-mist/60">
        <span className="hairline flex-1" />
        ou continuer avec
        <span className="hairline flex-1" />
      </div>
      <button type="button" className="btn-outline mt-5 w-full">
        <Chrome size={16} />
        Google
      </button>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const { login } = useEternity();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await login(email, password);
    setLoading(false);
    if (err) setError(err);
    else router.push('/espace-compte');
  };

  return (
    <div className="card p-7 md:p-8">
      <h1 className="text-2xl font-light">Ravi de vous revoir</h1>
      <p className="mt-2 text-sm text-mist">Vos capsules vous ont attendu sagement.</p>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-xs text-mist">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="sophie@aime.fr"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs text-mist">Mot de passe</span>
          <span className="relative block">
            <input
              type={show ? 'text' : 'password'}
              required
              placeholder="••••••••••"
              className="input pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mist hover:text-white"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </label>
        {error && <p className="rounded-card bg-red-500/10 p-3 text-xs text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold w-full">
          <Mail size={15} />
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setEmail('sophie.marchand@aime.fr');
          setPassword('eternity742');
          setError(null);
        }}
        className="mt-5 w-full rounded-card bg-raise p-3.5 text-left transition-colors hover:ring-1 hover:ring-gold/40"
      >
        <span className="flex items-center justify-between text-xs">
          <span className="text-mist">
            <span className="text-gold">Compte démo</span> — mariage Sophie & Lucas déjà rempli
          </span>
          <span className="font-mono text-[10px] text-mist/70">remplir</span>
        </span>
        <span className="mt-1 block font-mono text-[10px] text-mist/60">
          sophie.marchand@aime.fr · eternity742
        </span>
      </button>

      <SocialRow />
    </div>
  );
}

function SignupFlow() {
  const router = useRouter();
  const { signUp, user } = useEternity();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universe, setUniverse] = useState<UniverseId>('mariage');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const steps = ['Identité', 'Univers', 'QR'];

  return (
    <div>
      {/* Progression */}
      <ol className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors',
                i <= step ? 'bg-gold text-black' : 'bg-card text-mist',
              )}
            >
              {i + 1}
            </span>
            <span className={cn('hidden text-xs sm:block', i <= step ? 'text-white' : 'text-mist/60')}>
              {s}
            </span>
            {i < steps.length - 1 && <span className="h-px w-6 bg-white/10" />}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <form
              className="card p-7 md:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) setStep(1);
              }}
            >
              <h1 className="text-2xl font-light">Votre identité</h1>
              <p className="mt-2 text-sm text-mist">
                C’est elle que verront vos invités quand ils scanneront le QR.
              </p>
              <div className="mt-7 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs text-mist">Nom complet</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Sophie Marchand"
                    className="input"
                    autoFocus
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs text-mist">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="sophie@aime.fr"
                    className="input"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs text-mist">Mot de passe (6 caractères min.)</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••••"
                    className="input"
                  />
                </label>
                <button type="submit" className="btn-gold w-full">
                  Continuer
                  <ArrowRight size={15} />
                </button>
              </div>
              <SocialRow />
            </form>
          )}

          {step === 1 && (
            <div className="card p-7 md:p-8">
              <h1 className="text-2xl font-light">Votre premier univers</h1>
              <p className="mt-2 text-sm text-mist">
                Le dossier adaptera rôles, budget et agenda. Modifiable à tout moment.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-2.5">
                {UNIVERSES.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUniverse(u.id)}
                    aria-pressed={universe === u.id}
                    className={cn(
                      'flex flex-col items-start gap-6 rounded-card p-4 text-left transition-all',
                      universe === u.id
                        ? 'bg-gold/15 ring-1 ring-gold'
                        : 'bg-raise hover:bg-raise/70',
                    )}
                  >
                    <u.icon size={18} strokeWidth={1.6} className={universe === u.id ? 'text-gold' : 'text-mist'} />
                    <span>
                      <span className="block text-sm text-white">{u.name}</span>
                      {u.live ? (
                        <span className="mt-0.5 block text-[10px] uppercase tracking-[2px] text-gold">Live</span>
                      ) : (
                        <span className="mt-0.5 block text-[10px] uppercase tracking-[2px] text-mist/60">Bientôt</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              {error && <p className="mt-4 rounded-card bg-red-500/10 p-3 text-xs text-red-400">{error}</p>}
              <button
                type="button"
                disabled={loading}
                className="btn-gold mt-6 w-full"
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  const err = await signUp(name, email, password);
                  setLoading(false);
                  if (err) setError(err);
                  else setStep(2);
                }}
              >
                {loading ? 'Création du compte…' : 'Générer mon QR'}
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-7 text-center md:p-8">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                <PartyPopper size={20} />
              </span>
              <h1 className="mt-5 text-2xl font-light">
                Bienvenue, {user.name.split(' ')[0]}.
              </h1>
              <p className="mt-2 text-sm text-mist">
                Votre identité ETERNITY est créée. Voici votre QR personnel — gardez-le précieusement.
              </p>
              <div className="mt-7 flex justify-center">
                <QRBadge code={user.qr_code} size={150} />
              </div>
              <div className="mt-8 grid gap-3">
                <button type="button" onClick={() => router.push('/espace-compte')} className="btn-gold w-full">
                  Accéder à mon espace
                </button>
                <Link href="/creation-capsule" className="btn-outline w-full">
                  Créer ma première capsule
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
