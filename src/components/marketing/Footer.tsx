import { Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import { InfinityMark, Wordmark } from '@/components/Logo';

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: 'Produit',
    links: [
      { label: 'La boucle', href: '/#boucle' },
      { label: 'Créer ma capsule', href: '/inscription' },
      { label: 'Page invité — démo', href: '/c/AIME-742-PLM' },
      { label: 'Mini-site démo', href: '/mini-site' },
      { label: 'Tarifs', href: '/tarifs' },
    ],
  },
  {
    title: 'Univers',
    links: [
      { label: 'Mariage', href: '/mariage' },
      { label: 'Naissance', href: '/naissance' },
      { label: 'Anniversaire', href: '/anniversaire' },
      { label: 'In Memoriam', href: '/in-memoriam' },
      { label: 'Odyssée', href: '/odyssee' },
    ],
  },
  {
    title: 'Phase 2',
    links: [
      { label: 'Espace compte', href: '/espace-compte' },
      { label: 'Registre public', href: '/registre' },
      { label: 'Profil public', href: '/profil-public' },
      { label: 'Parcours capsule', href: '/creation-capsule' },
      { label: 'Doctrine', href: '/doctrine' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink">
      <div className="container-site flex min-h-[380px] flex-col justify-between gap-12 py-14">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <InfinityMark />
              <Wordmark />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-mist">
              L’OS administratif personnel universel,
              <br />
              déguisé en capsules temporelles.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-mist transition-colors hover:text-gold"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3" aria-label="Plan du site">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-medium uppercase tracking-kicker text-gold">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="text-sm text-mist transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-mist/70 md:flex-row md:items-center">
          <p>© 2026 ETERNITY by Aime — Tous droits réservés</p>
          <div className="flex gap-6">
            <Link href="/doctrine" className="transition-colors hover:text-white">
              Mentions légales
            </Link>
            <Link href="/doctrine" className="transition-colors hover:text-white">
              Confidentialité
            </Link>
            <Link href="/doctrine" className="transition-colors hover:text-white">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
