'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, QrCode, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Avatar } from '@/components/ui-kit';
import { SEED_REGISTRE } from '@/lib/data';
import { UNIVERSES } from '@/lib/universes';
import { cn } from '@/lib/utils';

export function RegistreExplorer() {
  const [query, setQuery] = useState('');
  const [universe, setUniverse] = useState<string>('tous');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEED_REGISTRE.filter((p) => {
      const matchUniverse = universe === 'tous' || p.universes.includes(universe as never);
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.qr_code.toLowerCase().includes(q);
      return matchUniverse && matchQuery;
    });
  }, [query, universe]);

  return (
    <div className="mt-14">
      {/* Recherche + filtres */}
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <div className="relative">
          <Search size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-mist" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un nom, un rôle, une ville, un code AIME…"
            className="input pl-12"
            aria-label="Rechercher dans le registre"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {[{ id: 'tous', name: 'Tous' }, ...UNIVERSES].map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setUniverse(u.id)}
              className={cn(
                'shrink-0 rounded-full px-5 py-2 text-[13px] transition-all',
                universe === u.id
                  ? 'bg-gold text-black'
                  : 'bg-card text-mist hover:text-white',
              )}
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grille */}
      <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.article
              layout
              key={p.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="card group p-6"
            >
              <div className="flex items-start justify-between">
                <Avatar src={p.avatar} name={p.name} size={56} />
                <span className="chip font-mono tracking-[1.5px] text-gold/90">
                  <QrCode size={12} />
                  {p.qr_code}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-light text-white">{p.name}</h2>
              <p className="mt-0.5 text-[13px] text-gold/90">{p.role}</p>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-mist">{p.bio}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-mist">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={12} />
                  {p.city}
                </span>
                <span>
                  {p.capsules_count} capsule{p.capsules_count > 1 ? 's' : ''} · {p.joined}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.universes.map((u) => {
                  const config = UNIVERSES.find((x) => x.id === u);
                  return (
                    <Link
                      key={u}
                      href={config?.href ?? '#'}
                      className="chip transition-colors hover:text-gold"
                    >
                      {config?.name}
                    </Link>
                  );
                })}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-mist">
          Aucune identité ne correspond à cette recherche.
        </p>
      )}

      <div className="mt-20 rounded-card bg-card p-10 text-center">
        <p className="kicker">Votre place est ici</p>
        <h2 className="mt-3 text-3xl font-light">Rejoignez le registre</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
          Un profil public, un QR AIME personnel, et vos capsules exposées au monde — si vous le
          décidez.
        </p>
        <Link href="/inscription" className="btn-gold mt-7">
          Créer mon identité
        </Link>
      </div>
    </div>
  );
}
