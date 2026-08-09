import type { Metadata } from 'next';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { SectionHeading } from '@/components/ui-kit';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tarifs — Une capsule, trois façons de l’habiter',
  description:
    'Gratuit pour découvrir, 149 € par événement pour tout débloquer, 12 €/mois pour l’éternité multi-univers.',
};

const PLANS = [
  {
    name: 'Découverte',
    price: 'Gratuit',
    sub: 'pour toujours',
    desc: 'Pour sentir la magie d’une première capsule.',
    features: [
      '1 capsule active',
      '20 clips de 10 s',
      'QR personnel AIME',
      'Mini-site privé',
      'Profil dans le registre',
    ],
    cta: 'Commencer gratuitement',
    href: '/inscription',
    highlight: false,
  },
  {
    name: 'Événement',
    price: '149 €',
    sub: 'par événement',
    desc: 'Le mariage complet, du dossier au scellement.',
    features: [
      'Capsules illimitées',
      'Invités illimités (clips 10 s)',
      'Dossier complet : budget, agenda, tâches, rôles',
      'Montage IA du film documentaire',
      'Mini-site public personnalisé',
      'Messagerie prestataires',
      'Scellement horodaté inclus',
    ],
    cta: 'Créer mon événement',
    href: '/inscription',
    highlight: true,
  },
  {
    name: 'Éternité',
    price: '12 €',
    sub: '/mois',
    desc: 'Tous les univers, toute une vie de capsules.',
    features: [
      'Tous les univers (naissance, odyssée…)',
      'Capsules programmées (ouverture future)',
      'Stockage renforcé, double horodatage',
      'Famille : 5 comptes invités',
      'Support prioritaire humain',
    ],
    cta: 'Devenir membre',
    href: '/inscription',
    highlight: false,
  },
];

const FAQ = [
  {
    q: 'Le scellement est-il vraiment irréversible ?',
    a: 'Oui. C’est le principe fondateur d’ETERNITY : une capsule scellée est horodatée et ne peut plus être modifiée — par personne, jamais. Nous conservons une prévisualisation avant scellement pour que ce geste soit toujours assumé.',
  },
  {
    q: 'Mes vidéos m’appartiennent-elles ?',
    a: 'Intégralement. Vous pouvez exporter l’ensemble de vos clips et du film final à tout moment, dans des formats ouverts. Aucune exploitation publicitaire de vos données — notre doctrine l’interdit.',
  },
  {
    q: 'Que se passe-t-il si ETERNITY disparaît ?',
    a: 'Les capsules scellées sont dupliquées sur un stockage dédié long terme et chaque détenteur reçoit les exports complets. L’éternité ne doit pas dépendre d’une seule entreprise — c’est écrit dans la doctrine.',
  },
  {
    q: 'Puis-je tester avant le mariage ?',
    a: 'Absolument : le plan Découverte est gratuit et permet une capsule réelle avec 20 clips. Beaucoup de couples y répètent leur Jour J avec les témoins.',
  },
];

export default function TarifsPage() {
  return (
    <main className="container-site py-14 md:py-20">
      <SectionHeading
        kicker="Tarifs"
        title="Le temps est gratuit. L’éternité, presque."
        sub="Commencez sans carte bancaire. Payez quand l’événement devient réel — jamais pour vos souvenirs déjà scellés."
      />

      <RevealGroup className="mt-16 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <RevealItem key={p.name}>
            <article
              className={cn(
                'relative flex h-full flex-col rounded-card p-8',
                p.highlight ? 'bg-gold/[0.07] ring-1 ring-gold/50' : 'bg-card',
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1.5 text-[11px] font-medium text-black">
                  Le plus choisi — Mariages
                </span>
              )}
              <h2 className="text-lg font-medium text-white">{p.name}</h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-light text-white">{p.price}</span>
                <span className="text-sm text-mist">{p.sub}</span>
              </div>
              <p className="mt-3 text-sm text-mist">{p.desc}</p>
              <ul className="mt-7 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/85">
                    <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={cn('mt-8 w-full', p.highlight ? 'btn-gold' : 'btn-outline')}
              >
                {p.cta}
                {p.highlight && <Sparkles size={15} />}
              </Link>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mx-auto mt-24 max-w-3xl">
        <SectionHeading kicker="Questions" title="Ce qu’on nous demande avant de sceller" />
        <div className="mt-12 space-y-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="group card p-6 open:bg-raise/60">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-normal text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ArrowRight size={16} className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-mist">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
