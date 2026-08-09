'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { QrCode, ScanLine, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Avatar } from '@/components/ui-kit';
import { SEED_REGISTRE } from '@/lib/data';
import { UNIVERSES } from '@/lib/universes';
import { cn } from '@/lib/utils';

export function RegistreMobile() {
  const [query, setQuery] = useState('');
  const [universe, setUniverse] = useState<string>('tous');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEED_REGISTRE.filter((p) => {
      const okU = universe === 'tous' || p.universes.includes(universe as never);
      const okQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.qr_code.toLowerCase().includes(q);
      return okU && okQ;
    });
  }, [query, universe]);

  return (
    <div className="mx-auto max-w-md px-5 pb-10 pt-6 lg:max-w-3xl lg:px-0 lg:pt-10">
      <header className="flex items-start justify-between">
        <div>
          <p className="kicker">Annuaire</p>
          <h1 className="mt-2 text-3xl font-light">Registre</h1>
        </div>
        <Link
          href="/app/qr/AIME-742-PLM"
          className="flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-medium text-black"
        >
          <ScanLine size={14} />
          Scanner
        </Link>
      </header>

      <div className="relative mt-6">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 text-mist" style={{ left: 18 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom, rôle, code AIME…"
          className="input pl-12"
          aria-label="Rechercher dans le registre"
        />
      </div>

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
        {[{ id: 'tous', name: 'Tous' }, ...UNIVERSES].map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => setUniverse(u.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-xs transition-colors',
              universe === u.id ? 'bg-gold text-black' : 'bg-card text-mist',
            )}
          >
            {u.name}
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-6 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.li
              layout
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="card p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar src={p.avatar} name={p.name} size={68} className="shadow-[0_0_0_3px_rgba(201,169,110,0.18)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-white">{p.name}</p>
                  <p className="truncate text-xs text-gold/90">{p.role}</p>
                  <p className="mt-0.5 truncate text-[11px] text-mist/70">{p.city} · {p.joined}</p>
                </div>
                <Link
                  href={`/app/qr/${p.qr_code}`}
                  aria-label={`Voir le QR de ${p.name}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-raise text-gold transition-colors hover:bg-gold hover:text-black"
                >
                  <QrCode size={17} />
                </Link>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {filtered.length === 0 && (
        <p className="mt-14 text-center text-sm text-mist">Aucune identité trouvée.</p>
      )}
    </div>
  );
}
