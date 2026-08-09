import { ArrowRight, ChevronDown, Lock, Scan, Video } from 'lucide-react';
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
                  Un QR aux invités, dix secondes chacun, un film collectif scellé à minuit.
                  Sans app pour eux, sans montage pour vous — un rituel qui n’existait pas encore.
                </p>
              </RevealItem>
              <RevealItem>
                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Link href="/inscription" className="btn-gold">
                    Créer ma capsule
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/c/AIME-742-PLM" className="btn-outline">
                    Vivre la démo invité
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
          kicker="Une seule boucle"
          title="On commence par le mariage."
          sub="QR, dix secondes, scellement : la boucle est universelle. Les sept autres univers s’ouvriront au fil des capsules scellées."
        />
        <RevealGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {UNIVERSES.map((u) => (
            <RevealItem key={u.id}>
              <Link
                href={u.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-card transition-transform duration-500 hover:-translate-y-1.5"
              >
                {/* Visuel cinématique */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.image}
                  alt={`Univers ${u.name}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-75 transition-all duration-700 group-hover:scale-[1.06] group-hover:opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/25 transition-opacity duration-500 group-hover:via-black/20" />
                <div className={`absolute inset-0 bg-gradient-to-b ${u.accent} opacity-40 mix-blend-soft-light`} aria-hidden />

                <div className="relative flex h-full flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-gold backdrop-blur transition-colors duration-300 group-hover:bg-gold group-hover:text-black">
                      <u.icon size={19} strokeWidth={1.6} />
                    </span>
                    <span
                      className={`chip backdrop-blur ${u.live ? 'bg-gold/85 text-black' : 'bg-black/45 text-white/80'}`}
                    >
                      {u.live ? '● Live' : 'Bientôt'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                      {u.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-white/70">{u.tagline}</p>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ LA BOUCLE — DÉMO NARRATIVE ============ */}
      <section id="boucle" className="border-y border-white/5 bg-card/30 py-24 md:py-32">
        <div className="container-site">
          <SectionHeading
            kicker="La boucle"
            title="Le rituel que personne d’autre n’ose."
            sub="Pas d’app. Pas de compte. Pas de montage. Vos invités filment, vous scellez — l’histoire reste."
            align="left"
            className="max-w-3xl"
          />
          <RevealGroup className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                step: '01',
                caption: 'L’invité scanne le QR',
                detail: 'Posé sur la table, le menu, le faire-part. Il ouvre une page, c’est tout.',
                mock: (
                  <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
                    <div className="rounded-2xl bg-white p-3.5 shadow-[0_0_40px_-10px_rgba(201,169,110,0.6)]">
                      <div className="grid h-24 w-24 grid-cols-6 gap-[3px]">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <span key={i} className={`rounded-[1px] ${(i * 7 + 3) % 5 < 2 ? 'bg-ink' : 'bg-white'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-center text-xs text-white/80">
                      Sophie & Lucas
                      <br />
                      <span className="font-mono text-[10px] tracking-[2px] text-gold">AIME-742-PLM</span>
                    </p>
                    <span className="chip">89 invités</span>
                  </div>
                ),
              },
              {
                step: '02',
                caption: 'Il filme 10 secondes',
                detail: 'Ni plus, ni moins. La contrainte qui rend chaque clip précieux — et le film montable seul.',
                mock: (
                  <div className="relative flex h-full flex-col items-center justify-center bg-gradient-to-b from-raise/60 to-black px-6">
                    <div aria-hidden className="absolute inset-4 rounded-2xl border border-white/15" />
                    <span className="chip bg-black/60 text-white/85 backdrop-blur">
                      « Racontez votre meilleur souvenir avec eux. »
                    </span>
                    <div className="relative mt-8 flex h-20 w-20 items-center justify-center">
                      <svg viewBox="0 0 88 88" className="absolute inset-0 -rotate-90">
                        <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                        <circle
                          cx="44"
                          cy="44"
                          r="36"
                          fill="none"
                          stroke="#C9A96E"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 36}
                          strokeDashoffset={2 * Math.PI * 36 * 0.3}
                        />
                      </svg>
                      <span className="h-4 w-4 rounded-sm bg-gold" />
                    </div>
                    <p className="mt-4 text-sm tabular-nums text-white/80">3s restantes</p>
                  </div>
                ),
              },
              {
                step: '03',
                caption: 'Vous scellez à minuit',
                detail: 'Irréversible, horodaté. Le film collectif vit pour toujours sur le mini-site.',
                mock: (
                  <div className="flex h-full flex-col items-center justify-center gap-5 px-6">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <Lock size={24} strokeWidth={1.4} />
                    </span>
                    <div className="text-center">
                      <p className="text-sm font-light text-white">Scellée le 16.06.2027 · 00:12</p>
                      <p className="mt-1.5 text-[10px] uppercase tracking-[2px] text-mist">Irréversible · Horodatée</p>
                    </div>
                    <div className="w-full max-w-[180px] rounded-card bg-raise p-3 text-center">
                      <p className="text-xl font-light text-gold">62</p>
                      <p className="text-[9px] uppercase tracking-[2px] text-mist">clips gravés à jamais</p>
                    </div>
                  </div>
                ),
              },
            ].map((s) => (
              <RevealItem key={s.step}>
                <div className="card group h-full overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden border-b border-white/5 bg-ink/60">
                    {s.mock}
                    <span className="absolute right-5 top-4 text-4xl font-light text-white/8 transition-colors group-hover:text-gold/25">
                      {s.step}
                    </span>
                  </div>
                  <div className="p-7">
                    <h3 className="text-2xl font-light">{s.caption}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-mist">{s.detail}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10 text-center">
            <Link href="/c/AIME-742-PLM" className="btn-outline">
              <Video size={16} />
              Vivre l’expérience invité — démo
            </Link>
          </Reveal>
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
                Créer ma capsule
              </Link>
              <Link href="/c/AIME-742-PLM" className="btn-outline">
                <Video size={16} />
                Tester côté invité
              </Link>
            </div>
            <p className="text-xs text-mist">Gratuit pour collecter · On ne paie que pour sceller</p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
