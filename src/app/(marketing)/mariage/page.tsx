import type { Metadata } from 'next';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clapperboard,
  Euro,
  Lock,
  MessageCircle,
  QrCode,
  ScanLine,
  Users,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { Avatar, Countdown, ProgressBar, SectionHeading } from '@/components/ui-kit';
import { QRBadge } from '@/components/ui-kit';
import { GUESTS_SCANNED, GUESTS_TOTAL, ROLE_LABEL } from '@/lib/data';
import { WEDDING_DATE_ISO } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Mariage — Le premier univers ETERNITY',
  description:
    '89 invités, un QR, dix secondes chacun. Le film de votre mariage monté automatiquement, scellé pour toujours.',
};

const GUEST_FLOW = [
  {
    icon: ScanLine,
    title: 'L’invité scanne',
    text: 'Le QR posé sur chaque table ouvre la capsule — pas d’app à installer, pas de compte à créer.',
  },
  {
    icon: Video,
    title: 'Il filme 10 secondes',
    text: 'Ni plus, ni moins. La contrainte qui rend chaque clip précieux et le film rythmé.',
  },
  {
    icon: Clapperboard,
    title: 'L’IA monte le film',
    text: 'Chapitrage automatique, voix, rires, musique ambiante : le documentaire de la journée naît seul.',
  },
];

export default function MariagePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden pb-24 pt-10 md:pb-32 md:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px]"
        />
        <div className="container-site relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <RevealGroup>
            <RevealItem>
              <p className="kicker">Univers n°1 · Live</p>
            </RevealItem>
            <RevealItem>
              <h1 className="mt-6 text-balance text-5xl font-light leading-[1.04] md:text-7xl">
                Le mariage,
                <br />
                <span className="text-gold-gradient">enfin immortel.</span>
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">
                Un seul QR pour vos 89 invités. Dix secondes de film chacun. Une capsule scellée à
                la fin de la nuit — et un documentaire qui vivra aussi longtemps que votre amour.
              </p>
            </RevealItem>
            <RevealItem>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/inscription" className="btn-gold">
                  Créer mon mariage
                  <ArrowRight size={16} />
                </Link>
                <Link href="/mini-site" className="btn-outline">
                  Voir un mini-site réel
                </Link>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  { v: '89', l: 'invités reliés' },
                  { v: '10 s', l: 'par clip' },
                  { v: '∞', l: 'de conservation' },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-2xl font-light text-gold">{s.v}</p>
                    <p className="mt-1 text-xs text-mist">{s.l}</p>
                  </div>
                ))}
              </div>
            </RevealItem>
          </RevealGroup>

          <Reveal delay={0.15}>
            <div className="relative mx-auto max-w-sm">
              <div className="rainbow-ring-soft absolute -inset-3 rounded-[32px]" aria-hidden />
              <div className="card relative overflow-hidden p-8 text-center">
                <Image
                  src="/images/minisite-cover.jpg"
                  alt="Sophie et Lucas"
                  width={688}
                  height={384}
                  className="h-40 w-full rounded-card object-cover"
                />
                <p className="kicker mt-7">Capsule en collecte</p>
                <p className="mt-2 text-3xl font-light">Sophie & Lucas</p>
                <p className="mt-1 text-sm text-mist">15 juin 2027 · Château des Bruyères</p>
                <div className="mt-7 flex justify-center">
                  <QRBadge code="AIME-742-PLM" size={128} />
                </div>
                <div className="mt-7">
                  <div className="flex items-center justify-between text-xs text-mist">
                    <span>
                      {GUESTS_SCANNED}/{GUESTS_TOTAL} invités ont scanné
                    </span>
                    <span className="text-gold">{Math.round((GUESTS_SCANNED / GUESTS_TOTAL) * 100)}%</span>
                  </div>
                  <ProgressBar value={GUESTS_SCANNED} max={GUESTS_TOTAL} className="mt-2.5" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FLUX INVITÉ */}
      <section className="border-y border-white/5 bg-card/30 py-24 md:py-32">
        <div className="container-site">
          <SectionHeading
            kicker="Le jour J"
            title="Vos invités deviennent les caméramans"
            sub="Aucune app à télécharger. Aucune friction. Juste un geste connu de tous : scanner un QR."
          />
          <RevealGroup className="mt-16 grid gap-4 md:grid-cols-3">
            {GUEST_FLOW.map((s, i) => (
              <RevealItem key={s.title}>
                <div className="card relative h-full p-8">
                  <span className="absolute right-7 top-7 text-4xl font-light text-white/8">
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-raise text-gold">
                    <s.icon size={20} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-8 text-2xl font-light">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{s.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* DASHBOARD MARIAGE */}
      <section className="container-site py-24 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <RevealGroup>
            <RevealItem>
              <p className="kicker">L’OS derrière la féerie</p>
              <h2 className="mt-4 text-balance text-4xl font-light leading-[1.08] md:text-5xl">
                Budget, rôles, agenda : l’administratif du oui.
              </h2>
              <p className="mt-5 leading-relaxed text-mist">
                Le dossier mariage adapte tout automatiquement — rôles (mariés, témoins, invités,
                prestataires), budget par poste, compte à rebours J-365. Vous vivez l’événement,
                ETERNITY tient le carnet.
              </p>
            </RevealItem>
            <RevealItem>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Euro, text: 'Budget par poste — traiteur, DJ, photo, fleurs, acomptes suivis' },
                  { icon: Users, text: `Rôles clairs — ${Object.values(ROLE_LABEL).join(', ').toLowerCase()}` },
                  { icon: CalendarCheck, text: 'Agenda J-365 → Jour J, jalons et rendez-vous' },
                  { icon: MessageCircle, text: 'Messagerie prestataires intégrée au dossier' },
                ].map((f) => (
                  <li key={f.text} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-gold">
                      <f.icon size={16} strokeWidth={1.6} />
                    </span>
                    <p className="pt-1.5 text-sm leading-relaxed text-white/80">{f.text}</p>
                  </li>
                ))}
              </ul>
            </RevealItem>
            <RevealItem>
              <Link href="/espace-compte" className="btn-outline mt-8">
                Explorer le dashboard démo
                <ArrowRight size={16} />
              </Link>
            </RevealItem>
          </RevealGroup>

          <Reveal delay={0.15}>
            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">Budget mariage</p>
                <span className="chip text-gold">34 060 € prévus</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { c: 'Lieu de réception', a: 6900, p: 6900 },
                  { c: 'Traiteur', a: 8450, p: 3000 },
                  { c: 'Photo & capsule', a: 2400, p: 800 },
                  { c: 'DJ & sono', a: 1250, p: 1250 },
                  { c: 'Robe & costume', a: 2600, p: 900 },
                ].map((b) => (
                  <div key={b.c}>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">{b.c}</span>
                      <span className="text-mist">
                        {b.p.toLocaleString('fr-FR')} / {b.a.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <ProgressBar value={b.p} max={b.a} className="mt-1.5" />
                  </div>
                ))}
              </div>
              <div className="mt-7 border-t border-white/5 pt-5">
                <Countdown targetIso={WEDDING_DATE_ISO} compact />
                <p className="mt-3 text-center text-xs text-mist">avant le 15 juin 2027</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SCELLEMENT */}
      <section className="relative overflow-hidden border-y border-white/5 py-24 md:py-32">
        <Image
          src="/images/hero-mariage.jpg"
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" />
        <div className="container-site relative text-center">
          <Reveal>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Lock size={24} strokeWidth={1.5} />
            </span>
            <h2 className="mx-auto mt-8 max-w-2xl text-balance text-4xl font-light leading-[1.1] md:text-5xl">
              À minuit, on scelle. Irréversible. Horodaté.{' '}
              <span className="text-gold-gradient">Éternel.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-white/70">
              Le scellement est un acte. Plus personne — pas même vous — ne pourra modifier la
              capsule. Comme graver une date dans le marbre, en mieux : c’est gravé dans le temps.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/creation-capsule" className="btn-gold">
                Créer ma capsule
              </Link>
              <Link href="/tarifs" className="btn-outline">
                Voir les tarifs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TÉMOIGNAGES RÔLES */}
      <section className="container-site py-24 md:py-32">
        <SectionHeading
          kicker="Ils préparent déjà leur rôle"
          title="Mariés, témoins, prestataires : chacun sa place"
        />
        <RevealGroup className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
          {[
            {
              avatar: '/images/avatars/marie.jpg',
              name: 'Marie Lambert',
              role: 'Témoin',
              quote:
                'Je vois mes tâches, je discute avec Sophie, et le jour J je filmerai les coulisses que personne ne voit jamais.',
            },
            {
              avatar: '/images/avatars/ines.jpg',
              name: 'Inès Rodier',
              role: 'Photographe — Studio Brume',
              quote:
                'Mes repérages lumière sont déjà dans la capsule. Mes clients auront un film vivant en plus de mes photos.',
            },
            {
              avatar: '/images/avatars/alex.jpg',
              name: 'Alex Vasseur',
              role: 'DJ — Waves Events',
              quote:
                'La playlist du dîner est validée dans la messagerie du dossier. Zéro mail perdu, zéro stress.',
            },
            {
              avatar: '/images/avatars/hugo.jpg',
              name: 'Hugo Petit',
              role: 'Témoin',
              quote:
                'Mon discours est dans les tâches. Les cierges magiques testés. Le QR est dans ma poche pour les 89.',
            },
          ].map((t) => (
            <RevealItem key={t.name}>
              <figure className="card h-full p-7">
                <blockquote className="text-sm leading-relaxed text-white/85">« {t.quote} »</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar src={t.avatar} name={t.name} size={40} />
                  <span>
                    <span className="block text-sm font-medium">{t.name}</span>
                    <span className="block text-xs text-mist">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-16 text-center">
          <Link href="/inscription" className="btn-gold">
            Commencer mon dossier mariage
            <ArrowRight size={16} />
          </Link>
          <p className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 text-xs text-mist">
            <Check size={14} className="text-gold" /> Gratuit jusqu’au premier scellement
          </p>
        </Reveal>
      </section>
    </main>
  );
}
