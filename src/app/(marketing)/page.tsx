import { ArrowRight, ChevronDown, Lock, QrCode, Scan, Users, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { PlusButton, SectionHeading } from '@/components/ui-kit';
import { InfinityMark } from '@/components/Logo';
import { UNIVERSES } from '@/lib/universes';
import { Countdown } from '@/components/ui-kit';
import { WEDDING_DATE_ISO } from '@/lib/utils';

export default function HomePage() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[92dvh] items-end overflow-hidden pb-16 md:items-center md:pb-0">
        <Image
          src="/images/hero-mariage.jpg"
          alt="Dîner de mariage au château, à la tombée de la nuit"
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

        <div className="container-site relative">
          <div className="grid items-end gap-14 lg:grid-cols-[1.25fr_0.75fr]">
            <RevealGroup>
              <RevealItem>
                <p className="kicker flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  Lancement · Univers Mariage
                </p>
              </RevealItem>
              <RevealItem>
                <h1 className="mt-6 max-w-3xl text-balance text-[44px] font-light leading-[1.04] md:text-6xl lg:text-[72px]">
                  Vos instants.
                  <br />
                  <span className="text-gold-gradient">Scellés pour l’éternité.</span>
                </h1>
              </RevealItem>
              <RevealItem>
                <p className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                  ETERNITY est votre OS administratif personnel, déguisé en capsules temporelles.
                  Un QR aux invités, dix secondes chacun, un film qui vivra pour toujours.
                </p>
              </RevealItem>
              <RevealItem>
                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Link href="/inscription" className="btn-gold">
                    Commencer gratuitement
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/mariage" className="btn-outline">
                    Découvrir le mariage
                  </Link>
                </div>
              </RevealItem>
            </RevealGroup>

            <Reveal delay={0.25} className="hidden justify-end lg:flex">
              <div className="flex flex-col items-center gap-5">
                <PlusButton href="/inscription" size={64} />
                <p className="max-w-[170px] text-center text-xs leading-relaxed text-mist">
                  Le bouton de tous vos souvenirs futurs
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.4} className="mt-16 hidden justify-center md:flex">
            <ChevronDown size={20} className="animate-float text-mist" />
          </Reveal>
        </div>
      </section>

      {/* ============ BANDEAU CHIFFRES ============ */}
      <section className="border-y border-white/5 bg-card/40">
        <div className="container-site grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
          {[
            { value: '8', label: 'univers de vie' },
            { value: '10 s', label: 'par clip, pas une de plus' },
            { value: 'AIME', label: 'format de QR universel' },
            { value: '∞', label: 'durée de conservation' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-light text-gold md:text-4xl">{s.value}</p>
              <p className="mt-1.5 text-[13px] text-mist">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 8 UNIVERS ============ */}
      <section id="univers" className="container-site scroll-mt-24 py-24 md:py-32">
        <SectionHeading
          kicker="Une seule app"
          title="Huit univers. Une seule capsule d’identité."
          sub="Mariage aujourd’hui. Naissance, anniversaire, diplôme, amitié, in memoriam, chantier et odyssée demain — le même OS, la même élégance."
        />
        <RevealGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {UNIVERSES.map((u) => (
            <RevealItem key={u.id}>
              <Link
                href={u.href}
                className="group relative block overflow-hidden rounded-card bg-card p-6 transition-transform duration-500 hover:-translate-y-1.5"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${u.accent} opacity-60`} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-raise text-gold transition-colors group-hover:bg-gold group-hover:text-black">
                      <u.icon size={19} strokeWidth={1.6} />
                    </span>
                    <span
                      className={`chip ${u.live ? 'bg-gold/15 text-gold' : ''}`}
                    >
                      {u.live ? '● Live' : 'Bientôt'}
                    </span>
                  </div>
                  <h3 className="mt-14 text-2xl font-light text-white">{u.name}</h3>
                  <p className="mt-1.5 text-sm text-mist">{u.tagline}</p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ COMMENT ÇA MARCHE ============ */}
      <section className="border-y border-white/5 bg-card/30 py-24 md:py-32">
        <div className="container-site">
          <SectionHeading
            kicker="Le rituel"
            title="Trois gestes. Puis le temps fait le reste."
            align="left"
            className="max-w-3xl"
          />
          <RevealGroup className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Users,
                step: '01',
                title: 'Créez le dossier',
                text: 'Mariage, naissance, chantier… le dossier adapte rôles, budget et agenda. Tout l’administratif de l’événement, enfin élégant.',
              },
              {
                icon: QrCode,
                step: '02',
                title: 'Partagez le QR',
                text: 'Un code AIME-XXX-XXX par événement. Chaque invité scanne et filme dix secondes — sans installer quoi que ce soit.',
              },
              {
                icon: Lock,
                step: '03',
                title: 'Scellez la capsule',
                text: 'Irréversible et horodaté. L’IA monte le film documentaire, qui vit pour toujours sur le mini-site de l’événement.',
              },
            ].map((s) => (
              <RevealItem key={s.step}>
                <div className="card group h-full p-8">
                  <div className="flex items-center justify-between">
                    <s.icon size={22} strokeWidth={1.5} className="text-gold" />
                    <span className="text-5xl font-light text-white/8 transition-colors group-hover:text-gold/25">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mt-10 text-2xl font-light">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{s.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ============ USE CASE : SOPHIE & LUCAS ============ */}
      <section className="container-site py-24 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-card">
              <Image
                src="/images/minisite-cover.jpg"
                alt="Sophie et Lucas sous les guirlandes du château"
                width={1376}
                height={768}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="kicker">Dossier actif</p>
                  <p className="mt-2 text-2xl font-light">Sophie & Lucas</p>
                  <p className="text-sm text-mist">15 juin 2027 · 89 invités</p>
                </div>
                <span className="chip bg-black/50 font-mono tracking-[2px] text-gold backdrop-blur">
                  AIME-742-PLM
                </span>
              </div>
            </div>
          </Reveal>
          <RevealGroup>
            <RevealItem>
              <p className="kicker">Le premier mariage ETERNITY</p>
              <h2 className="mt-4 text-balance text-4xl font-light leading-[1.08] md:text-5xl">
                Leur capsule se remplit déjà. Le jour J est compté.
              </h2>
              <p className="mt-5 leading-relaxed text-mist">
                Budget, agenda, tâches, prestataires : Sophie pilote tout depuis son dossier. Les
                89 invités ont reçu le QR — 61 l’ont déjà scanné. À la fin de la soirée, un seul
                geste scellera la capsule. Pour toujours.
              </p>
            </RevealItem>
            <RevealItem>
              <Countdown targetIso={WEDDING_DATE_ISO} compact />
            </RevealItem>
            <RevealItem>
              <div className="flex flex-wrap gap-4">
                <Link href="/mariage" className="btn-gold">
                  Suivre leur mariage
                  <ArrowRight size={16} />
                </Link>
                <Link href="/app/qr/AIME-742-PLM" className="btn-outline">
                  <Scan size={16} />
                  Voir le QR
                </Link>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* ============ DOCTRINE TEASER ============ */}
      <section className="relative overflow-hidden border-y border-white/5 py-28 md:py-36">
        <div className="grain absolute inset-0" />
        <div className="container-site relative text-center">
          <Reveal>
            <InfinityMark className="mx-auto h-6 opacity-80" />
            <blockquote className="mx-auto mt-10 max-w-3xl text-balance text-3xl font-light leading-snug md:text-5xl">
              « Nous ne stockons pas des fichiers.
              <span className="text-gold-gradient"> Nous scellons des instants. »</span>
            </blockquote>
            <Link href="/doctrine" className="btn-outline mt-12">
              Lire la doctrine
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="container-site py-24 text-center md:py-32">
        <Reveal>
          <p className="kicker">Prêt à commencer ?</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-light leading-[1.08] md:text-6xl">
            Votre première capsule vous attend.
          </h2>
          <div className="mt-12 flex flex-col items-center gap-8">
            <PlusButton href="/inscription" size={64} />
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/inscription" className="btn-gold">
                Créer mon compte
              </Link>
              <Link href="/creation-capsule" className="btn-outline">
                <Video size={16} />
                Parcourir les 8 étapes
              </Link>
            </div>
            <p className="text-xs text-mist">Gratuit pour découvrir · Sans carte bancaire</p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
