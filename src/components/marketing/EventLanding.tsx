import { ArrowLeft, ArrowRight, Bell, Lock, QrCode, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import type { Universe } from '@/lib/universes';

export function EventLanding({ universe }: { universe: Universe }) {
  const Icon = universe.icon;
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-10 md:pb-28 md:pt-16">
        <div aria-hidden className="absolute inset-0">
          <Image
            src={universe.image}
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink" />
        </div>
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-b ${universe.accent} blur-[120px]`}
        />
        <div className="container-site relative">
          <RevealGroup className="mx-auto max-w-3xl text-center">
            <RevealItem>
              <Link
                href="/#univers"
                className="inline-flex items-center gap-2 text-xs text-mist transition-colors hover:text-gold"
              >
                <ArrowLeft size={13} />
                Tous les univers
              </Link>
            </RevealItem>
            <RevealItem>
              <div className="mt-8 flex justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/45 text-gold backdrop-blur ring-1 ring-white/10">
                  <Icon size={30} strokeWidth={1.4} />
                </span>
              </div>
            </RevealItem>
            <RevealItem>
              <p className="kicker mt-8">Univers ETERNITY · Bientôt</p>
              <h1 className="mt-5 text-balance text-5xl font-light leading-[1.05] md:text-7xl">
                {universe.name}
              </h1>
              <p className="mt-4 text-xl font-light text-gold md:text-2xl">{universe.tagline}</p>
            </RevealItem>
            <RevealItem>
              <p className="mx-auto mt-7 max-w-xl leading-relaxed text-mist">
                {universe.description}
              </p>
            </RevealItem>
            <RevealItem>
              <WaitlistForm universeName={universe.name} />
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* SCÉNARIO */}
      <section className="border-y border-white/5 bg-card/30 py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="kicker">Scénario type</p>
            <h2 className="mt-4 text-balance text-4xl font-light leading-[1.08]">
              {universe.scenario.title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-mist">
              Le même OS que le mariage : un dossier qui s’adapte, un QR à partager, des clips de
              dix secondes, un scellement irréversible. Seul le décor change.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                { icon: QrCode, text: 'Format QR universel AIME-XXX-XXX' },
                { icon: Lock, text: 'Scellement horodaté, irréversible' },
                { icon: Sparkles, text: 'Montage IA automatique du film' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-gold">
                    <f.icon size={15} strokeWidth={1.6} />
                  </span>
                  {f.text}
                </div>
              ))}
            </div>
          </Reveal>
          <RevealGroup className="relative">
            <div aria-hidden className="absolute bottom-2 left-[21px] top-2 w-px bg-white/10" />
            {universe.scenario.steps.map((step, i) => (
              <RevealItem key={step} className="relative flex gap-5 pb-8 last:pb-0">
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-sm font-light text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="card w-full p-5 text-sm leading-relaxed text-white/85">{step}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="container-site py-20 text-center md:py-28">
        <Reveal>
          <p className="kicker">Le mariage, lui, est déjà live</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-light leading-[1.1] md:text-5xl">
            L’univers {universe.name.toLowerCase()} arrive. Le mariage vous attend déjà.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/mariage" className="btn-gold">
              Découvrir le mariage
              <ArrowRight size={16} />
            </Link>
            <Link href="/doctrine" className="btn-outline">
              Comprendre la doctrine
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

function WaitlistForm({ universeName }: { universeName: string }) {
  return (
    <form
      className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
      action={`mailto:liste@aime.fr?subject=Liste%20d%27attente%20${encodeURIComponent(universeName)}`}
    >
      <input
        type="email"
        required
        placeholder="votre@email.fr"
        className="input flex-1"
        aria-label="Votre email pour la liste d'attente"
      />
      <button type="submit" className="btn-outline shrink-0">
        <Bell size={15} />
        Être notifié
      </button>
    </form>
  );
}
