'use client';

import { Copy, Eye, Pencil, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, QRBadge } from '@/components/ui-kit';
import { UNIVERSES } from '@/lib/universes';
import { useEternity } from '@/lib/store';
import { formatDateFr } from '@/lib/utils';

export function PublicProfileView() {
  const { user, folder, capsule, clips } = useEternity();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(user.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard indisponible */
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <p className="kicker">Identité publique</p>
        <span className="chip text-gold">
          <Eye size={12} />
          Visible dans le registre
        </span>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-gold/25 via-gold/8 to-transparent" />
        <div className="px-7 pb-8 md:px-10">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-5">
            <Avatar src={user.avatar} name={user.name} size={88} className="ring-4 ring-card" />
            <div className="flex gap-2.5 pb-1.5">
              <button type="button" onClick={copyCode} className="btn-outline px-5 py-2.5 text-xs">
                <Copy size={13} />
                {copied ? 'Copié !' : 'Copier le code'}
              </button>
              <Link href="/app/qr/AIME-742-PLM" className="btn-gold px-5 py-2.5 text-xs">
                <Share2 size={13} />
                Partager
              </Link>
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-light md:text-4xl">{user.name}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">{user.bio}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {user.universes.map((u) => {
              const config = UNIVERSES.find((x) => x.id === u);
              const Icon = config?.icon;
              return (
                <Link key={u} href={config?.href ?? '#'} className="chip transition-colors hover:text-gold">
                  {Icon && <Icon size={12} />}
                  {config?.name}
                </Link>
              );
            })}
            <span className="chip">Membre depuis {formatDateFr(user.created_at, { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto]">
        {/* Capsule publique */}
        <div className="card p-7">
          <p className="text-xs uppercase tracking-kicker text-mist/70">Capsule publique</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="rainbow-ring-soft rounded-card p-0.5">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-card bg-card">
                <span className="text-xl font-light text-gold">{clips.length}</span>
                <span className="text-[9px] uppercase tracking-[2px] text-mist">clips</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-light">{capsule.name}</p>
              <p className="text-sm text-mist">{folder.name}</p>
              <Link
                href="/mini-site"
                className="mt-1 inline-block text-xs text-gold underline-offset-4 hover:underline"
              >
                Voir le mini-site →
              </Link>
            </div>
          </div>
          <div className="mt-6 border-t border-white/5 pt-5 text-xs leading-relaxed text-mist">
            Les capsules scellées apparaissent ici avec leur date de scellement horodatée —
            preuve publique et permanente.
          </div>
        </div>

        {/* QR */}
        <div className="card flex flex-col items-center justify-center p-7">
          <QRBadge code={user.qr_code} size={132} />
          <p className="mt-4 max-w-[180px] text-center text-xs leading-relaxed text-mist">
            Scanné par vos invités pour rejoindre vos capsules
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-card bg-raise p-5">
        <p className="text-sm text-mist">
          Envie de changer de photo ou de bio ?
        </p>
        <Link href="/app/compte" className="btn-outline px-5 py-2.5 text-xs">
          <Pencil size={13} />
          Modifier
        </Link>
      </div>
    </div>
  );
}
