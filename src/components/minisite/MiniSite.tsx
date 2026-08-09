'use client';

import {
  CalendarHeart,
  Car,
  Heart,
  Lock,
  MapPin,
  Play,
  ScanLine,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { Avatar, Countdown, QRBadge } from '@/components/ui-kit';
import { useEternity } from '@/lib/store';
import { formatDateFr, timeAgoFr } from '@/lib/utils';

export function MiniSite() {
  const { folder, capsule, clips } = useEternity();
  const [shared, setShared] = useState(false);
  const sealed = capsule.status === 'sealed';

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mariage de Sophie & Lucas', url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* annulé par l’utilisateur */
    }
  };

  return (
    <>
      <Header />
      <main>
        {/* COUVERTURE */}
        <section className="relative flex min-h-[86dvh] items-end overflow-hidden">
          <Image
            src="/images/minisite-cover.jpg"
            alt="Sophie et Lucas sous les guirlandes"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
          <div className="container-site relative pb-16">
            <RevealGroup>
              <RevealItem>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="kicker">Mini-site officiel</p>
                  <div className="flex gap-2.5">
                    <button type="button" onClick={share} className="btn-outline px-5 py-2.5 text-xs backdrop-blur">
                      <Share2 size={13} />
                      {shared ? 'Lien copié !' : 'Partager'}
                    </button>
                  </div>
                </div>
              </RevealItem>
              <RevealItem>
                <h1 className="mt-8 text-balance text-6xl font-light leading-[0.98] md:text-[96px]">
                  Sophie
                  <span className="text-gold-gradient"> & </span>
                  Lucas
                </h1>
                <p className="mt-5 text-lg font-light text-white/85 md:text-xl">
                  {formatDateFr(folder.metadata.date as string)} · {folder.metadata.lieu}
                </p>
              </RevealItem>
              <RevealItem>
                <div className="mt-10 max-w-xl">
                  <Countdown targetIso={folder.metadata.date as string} compact />
                </div>
              </RevealItem>
            </RevealGroup>
          </div>
        </section>

        {/* PROGRAMME */}
        <section className="container-site py-20 md:py-28">
          <Reveal>
            <p className="kicker text-center">Le programme du jour J</p>
            <h2 className="mt-4 text-center text-4xl font-light md:text-5xl">15 juin 2027</h2>
          </Reveal>
          <RevealGroup className="relative mx-auto mt-14 max-w-xl">
            <div aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-gold/20" />
            {[
              ['15h00', 'Cérémonie laïque', 'Sous l’arche fleurie, cour d’honneur du château.'],
              ['16h30', 'Cocktail', 'Vin d’honneur dans les jardins, jazz manouche en direct.'],
              ['19h00', 'Dîner', 'Menu dégustation de la Maison Lefèvre, grande tablée.'],
              ['22h00', 'Ouverture de bal', 'La chanson. Vous savez laquelle.'],
              ['23h30', 'Scellement de la capsule', 'Gestes irréversibles seulement quand on est heureux.'],
              ['00h00', 'Cierges magiques', 'La sortie sous les étoiles — filmée par les 89.'],
            ].map(([time, title, text], i) => (
              <RevealItem key={time} className="relative flex gap-6 pb-8 last:pb-0">
                <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-[11px] font-medium text-gold">
                  {i + 1}
                </span>
                <div className="card w-full p-5">
                  <p className="text-sm font-medium text-gold">{time}</p>
                  <p className="mt-1 text-lg font-light text-white">{title}</p>
                  <p className="mt-1 text-sm text-mist">{text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* CAPSULE */}
        <section className="border-y border-white/5 bg-card/30 py-20 md:py-28">
          <div className="container-site">
            <div className="mx-auto max-w-2xl text-center">
              <p className="kicker">La capsule « {capsule.name} »</p>
              <h2 className="mt-4 text-balance text-4xl font-light md:text-5xl">
                {sealed ? 'Scellée pour toujours.' : 'Elle se remplit sous vos yeux.'}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                {sealed
                  ? `Capsule scellée le ${formatDateFr(capsule.sealed_at as string, { hour: '2-digit', minute: '2-digit' })} — horodatée, irréversible.`
                  : 'Dix secondes par invité. Le film du mariage se construit clip après clip.'}
              </p>
            </div>

            <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible">
              {clips.slice(0, 6).map((c) => (
                <Reveal key={c.id}>
                  <article className="group relative w-[220px] shrink-0 snap-center overflow-hidden rounded-card bg-raise lg:w-auto">
                    <div className="relative aspect-[9/16]">
                      {c.poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.poster}
                          alt={c.caption}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-transform group-hover:scale-110">
                        <Play size={17} className="ml-0.5" />
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                        {c.duration}s
                      </span>
                      <div className="absolute inset-x-3 bottom-3">
                        <div className="flex items-center gap-2">
                          <Avatar src={c.author_avatar} name={c.author_name} size={24} />
                          <p className="text-xs font-medium text-white">{c.author_name}</p>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-xs text-white/75">{c.caption}</p>
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-white/50">
                          <Heart size={9} /> {c.likes} · {timeAgoFr(c.created_at)}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-5 text-center">
              <QRBadge code={capsule.code} size={120} />
              <Link href={`/app/qr/${capsule.code}`} className="btn-gold">
                <ScanLine size={16} />
                Invité ? Scannez et filmez 10 s
              </Link>
            </div>
          </div>
        </section>

        {/* INFOS PRATIQUES */}
        <section className="container-site grid gap-4 py-20 md:grid-cols-3 md:py-28">
          {[
            {
              icon: MapPin,
              title: 'Château des Bruyères',
              text: 'Route de la Vallée, 78470 Saint-Rémy-lès-Chevreuse. Parking sur place.',
            },
            {
              icon: Car,
              title: 'Navette',
              text: 'Départs gare RER B toutes les 30 min de 14h à 16h. Retour jusqu’à 4h du matin.',
            },
            {
              icon: CalendarHeart,
              title: 'RSVP avant le 15 mai',
              text: 'Confirmez votre présence directement en scannant le QR de la capsule.',
            },
          ].map((i) => (
            <Reveal key={i.title}>
              <div className="card h-full p-7">
                <i.icon size={20} strokeWidth={1.5} className="text-gold" />
                <h3 className="mt-5 text-lg font-light">{i.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{i.text}</p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* SCELLEMENT BANDEAU */}
        <section className="pb-24 text-center">
          <Reveal>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/12 text-gold">
              <Lock size={20} strokeWidth={1.5} />
            </span>
            <p className="mx-auto mt-6 max-w-md text-balance text-2xl font-light leading-snug">
              Ce mini-site vivra <span className="text-gold-gradient">aussi longtemps que la capsule.</span>
            </p>
            <p className="mt-3 text-xs uppercase tracking-kicker text-mist">Propulsé par ETERNITY by Aime</p>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
