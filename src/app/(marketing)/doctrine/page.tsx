import type { Metadata } from 'next';
import { Clock, Database, EyeOff, HeartHandshake, Infinity as InfinityIcon, Lock, QrCode, Sparkles, Type } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { PlusButton, QRBadge, SectionHeading } from '@/components/ui-kit';
import { InfinityMark } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Doctrine — Philosophie & Design System',
  description:
    'La doctrine ETERNITY : pourquoi nous scellons des instants plutôt que des fichiers, et le design system qui l’incarne.',
};

const PROMESSES = [
  {
    icon: Lock,
    num: 'I',
    title: 'Le scellement est sacré',
    text: 'Une capsule scellée ne peut plus être modifiée. Ni par vous, ni par nous, ni par personne. L’irréversibilité n’est pas une contrainte : c’est ce qui donne du poids à l’instant.',
  },
  {
    icon: Clock,
    num: 'II',
    title: 'Le temps est la seule monnaie',
    text: 'Dix secondes par clip. Pas onze. La contrainte force l’essentiel — ce que vous choisiriez de garder si vous ne pouviez rien garder d’autre.',
  },
  {
    icon: Database,
    num: 'III',
    title: 'Vos données vous appartiennent',
    text: 'Export complet, formats ouverts, zéro monétisation publicitaire. ETERNITY vit de ses abonnements, pas de vos souvenirs.',
  },
  {
    icon: EyeOff,
    num: 'IV',
    title: 'La discrétion est une esthétique',
    text: 'Pas de fil infini, pas de compteur d’ego, pas de notifications anxiogènes. L’outil disparaît pour que l’instant reste.',
  },
  {
    icon: HeartHandshake,
    num: 'V',
    title: 'L’éternité ne tient qu’à plusieurs',
    text: 'Les capsules scellées sont dupliquées sur des supports indépendants. Si Aime disparaît, vos instants, eux, restent.',
  },
];

const COLORS = [
  { name: 'Gold', hex: '#C9A96E', usage: 'Primaire — CTA, accents, kickers' },
  { name: 'Background', hex: '#0A0A0A', usage: 'Fond global' },
  { name: 'Card', hex: '#141414', usage: 'Surfaces principales' },
  { name: 'Secondary', hex: '#1E1E1E', usage: 'Surfaces enchâssées' },
  { name: 'Text', hex: '#FFFFFF', usage: 'Texte principal' },
  { name: 'Muted', hex: '#8E8E93', usage: 'Texte secondaire, captions' },
];

export default function DoctrinePage() {
  return (
    <main>
      {/* MANIFESTE */}
      <section className="relative overflow-hidden pb-20 pt-14 md:pb-28 md:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-gold/10 blur-[130px]"
        />
        <div className="container-site relative text-center">
          <RevealGroup>
            <RevealItem>
              <InfinityMark className="mx-auto h-6" />
            </RevealItem>
            <RevealItem>
              <p className="kicker mt-8">La doctrine</p>
            </RevealItem>
            <RevealItem>
              <h1 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-light leading-[1.07] md:text-6xl">
                Nous ne stockons pas des fichiers.
                <span className="text-gold-gradient"> Nous scellons des instants.</span>
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="mx-auto mt-7 max-w-2xl leading-relaxed text-mist">
                ETERNITY est né d’un constat simple : nos souvenirs sont devenus des océans de
                fichiers que personne ne rouvre jamais. Nous avons choisi l’inverse — peu de
                matière, beaucoup de sens, et un geste qui engage : le scellement.
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* LES 6 PROMESSES */}
      <section id="promesses" className="container-site scroll-mt-24 pb-24 md:pb-32">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROMESSES.map((p) => (
            <Reveal key={p.num}>
              <article className="card group h-full p-8">
                <div className="flex items-center justify-between">
                  <p.icon size={20} strokeWidth={1.5} className="text-gold" />
                  <span className="font-serif text-2xl font-light italic text-white/10 transition-colors group-hover:text-gold/30">
                    {p.num}
                  </span>
                </div>
                <h2 className="mt-8 text-xl font-light">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">{p.text}</p>
              </article>
            </Reveal>
          ))}
          <Reveal>
            <article className="rainbow-ring-soft h-full rounded-card">
              <div className="card flex h-full flex-col items-center justify-center p-8 text-center">
                <Sparkles size={20} className="text-gold" />
                <p className="mt-6 text-balance text-xl font-light leading-snug">
                  « Une capsule ne se supprime pas.
                  <br />
                  Elle se transmet. »
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* DESIGN SYSTEM */}
      <section id="design-system" className="scroll-mt-24 border-t border-white/5 bg-card/30 py-24 md:py-32">
        <div className="container-site">
          <SectionHeading
            kicker="Design System"
            title="Un langage visuel à la hauteur du serment"
            sub="Sombre parce que la nuit fait briller l’or. Une seule typographie, Inter, parce que la modestie typographique laisse parler les souvenirs."
            align="left"
            className="max-w-3xl"
          />

          {/* Couleurs */}
          <Reveal className="mt-16">
            <h3 className="flex items-center gap-3 text-sm font-medium uppercase tracking-kicker text-gold">
              Couleurs
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {COLORS.map((c) => (
                <div key={c.hex} className="card overflow-hidden !rounded-card">
                  <div className="h-20" style={{ backgroundColor: c.hex }} />
                  <div className="p-4">
                    <p className="text-sm text-white">{c.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-mist">{c.hex}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-mist/80">{c.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Typographie */}
          <Reveal className="mt-16">
            <h3 className="flex items-center gap-3 text-sm font-medium uppercase tracking-kicker text-gold">
              <Type size={14} />
              Typographie — Inter uniquement
            </h3>
            <div className="card mt-6 divide-y divide-white/5">
              {[
                { label: 'Hero — Regular 64–80', cls: 'text-5xl md:text-7xl font-light', sample: 'Scellés pour l’éternité.' },
                { label: 'Title — Regular/Light 40–48', cls: 'text-4xl md:text-5xl font-light', sample: 'Huit univers, une capsule' },
                { label: 'H3 — Regular 32', cls: 'text-[32px] font-normal', sample: 'Le rituel du jour J' },
                { label: 'Body — Regular 16–18', cls: 'text-base md:text-lg font-normal text-white/85', sample: 'Chaque invité devient caméraman, dix secondes à la fois.' },
                { label: 'Caption — Regular 14 gris', cls: 'text-sm font-normal text-mist', sample: '89 invités ont reçu le QR ce matin.' },
                { label: 'Kicker — Medium 12 caps gold', cls: 'kicker', sample: 'Lancement · Univers Mariage' },
              ].map((t) => (
                <div key={t.label} className="grid items-center gap-3 p-6 md:grid-cols-[220px_1fr]">
                  <p className="text-xs text-mist/70">{t.label}</p>
                  <p className={t.cls}>{t.sample}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Composants */}
          <Reveal className="mt-16">
            <h3 className="text-sm font-medium uppercase tracking-kicker text-gold">Composants</h3>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="card p-7">
                <p className="text-xs text-mist/70">Boutons — pill, gold fill ou outline</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button type="button" className="btn-gold">CTA principal</button>
                  <button type="button" className="btn-outline">Secondaire</button>
                  <button type="button" className="btn-ghost px-4">Tertiaire</button>
                </div>
                <p className="mt-6 text-xs text-mist/70">Chips & badges</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="chip">Témoin</span>
                  <span className="chip text-gold">Prestataire</span>
                  <span className="chip font-mono tracking-[1.5px] text-gold/90">
                    <QrCode size={12} /> AIME-742-PLM
                  </span>
                </div>
              </div>
              <div className="card p-7">
                <p className="text-xs text-mist/70">Bouton « + » — cercle 64 px, stroke rainbow angular 7 stops</p>
                <div className="mt-6 flex items-center gap-6">
                  <PlusButton size={64} />
                  <PlusButton size={48} />
                  <p className="max-w-[200px] text-xs leading-relaxed text-mist">
                    Le seul élément multicolore du système : l’arc-en-ciel de tous les possibles,
                    en rotation perpétuelle.
                  </p>
                </div>
              </div>
              <div className="card p-7">
                <p className="text-xs text-mist/70">QR code — fond blanc arrondi, format AIME-XXX-XXX</p>
                <div className="mt-6">
                  <QRBadge code="AIME-742-PLM" size={110} />
                </div>
              </div>
              <div className="card p-7">
                <p className="text-xs text-mist/70">Cards — #141414, radius 16px, aucune bordure</p>
                <div className="mt-5 rounded-card bg-raise p-5">
                  <p className="text-sm text-white/85">Surface enchâssée #1E1E1E</p>
                  <p className="mt-1 text-xs text-mist">
                    La hiérarchie se fait par la lumière, jamais par les lignes.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Motion */}
          <Reveal className="mt-16">
            <h3 className="text-sm font-medium uppercase tracking-kicker text-gold">Motion</h3>
            <div className="card mt-6 p-7">
              <p className="max-w-2xl text-sm leading-relaxed text-mist">
                Les animations se contentent d’apparaître et de respirer : fondu-monté de 28 px en
                700 ms, courbe douce (0.22, 1, 0.36, 1), jamais de rebond. Le seul mouvement
                perpétuel autorisé est la rotation du gradient rainbow — un clin d’œil au temps
                qui passe.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
