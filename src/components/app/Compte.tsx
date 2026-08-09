'use client';

import {
  Bell,
  ChevronRight,
  Download,
  Eye,
  Globe,
  LogOut,
  MessageCircle,
  QrCode,
  RotateCcw,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, Countdown, ProgressBar } from '@/components/ui-kit';
import { GUESTS_SCANNED, GUESTS_TOTAL } from '@/lib/data';
import { useEternity } from '@/lib/store';
import { formatEUR, formatDateFr } from '@/lib/utils';

export function Compte() {
  const { user, folder, capsule, clips, budget, tasks, signOut, resetDemo } = useEternity();
  const totalBudget = budget.reduce((s, b) => s + b.amount, 0);
  const totalPaid = budget.reduce((s, b) => s + b.paid, 0);
  const openTasks = tasks.filter((t) => !t.done).length;

  return (
    <div className="mx-auto max-w-md px-5 pb-10 pt-6 lg:max-w-3xl lg:px-0 lg:pt-10">
      {/* Profil */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} name={user.name} size={58} />
          <div>
            <h1 className="text-xl font-light">{user.name}</h1>
            <p className="text-xs text-mist">{user.email}</p>
            <p className="mt-1 font-mono text-[11px] tracking-[2px] text-gold">{user.qr_code}</p>
          </div>
        </div>
        <Link
          href={`/app/qr/${user.qr_code}`}
          aria-label="Mon QR"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-gold"
        >
          <QrCode size={18} />
        </Link>
      </header>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { v: String(clips.length), l: 'clips' },
          { v: `${GUESTS_SCANNED}`, l: 'invités actifs' },
          { v: String(openTasks), l: 'tâches' },
        ].map((s) => (
          <div key={s.l} className="card p-4 text-center">
            <p className="text-2xl font-light text-gold">{s.v}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[2px] text-mist">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Countdown */}
      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-kicker text-mist/70">{folder.name}</p>
          <span className={capsule.status === 'sealed' ? 'chip text-gold' : 'chip'}>
            {capsule.status === 'sealed' ? 'Scellée' : 'En collecte'}
          </span>
        </div>
        <div className="mt-4">
          <Countdown targetIso={folder.metadata.date as string} compact />
        </div>
        <p className="mt-3 text-center text-[11px] text-mist">
          avant le {formatDateFr(folder.metadata.date as string)}
        </p>
      </div>

      {/* Budget résumé */}
      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between text-sm">
          <p className="text-white/85">Budget</p>
          <p className="text-mist">
            <span className="text-gold">{formatEUR(totalPaid)}</span> / {formatEUR(totalBudget)}
          </p>
        </div>
        <ProgressBar value={totalPaid} max={totalBudget} className="mt-3" />
      </div>

      {/* Réglages */}
      <nav className="card mt-4 divide-y divide-white/5" aria-label="Réglages du compte">
        {[
          { icon: Eye, label: 'Profil public', href: '/profil-public', detail: 'Visible dans le registre' },
          { icon: Globe, label: 'Mini-site', href: '/mini-site', detail: 'En ligne · Lien secret' },
          { icon: MessageCircle, label: 'Messagerie', href: '/app/messagerie', detail: '3 conversations' },
          { icon: Bell, label: 'Notifications', href: '#', detail: 'Clips & RSVP' },
          { icon: ShieldCheck, label: 'Confidentialité', href: '/doctrine', detail: 'Promesse III' },
          { icon: Download, label: 'Exporter mes données', href: '#', detail: 'JSON + MP4' },
          { icon: Settings, label: 'Préférences', href: '/espace-compte', detail: 'Dashboard web' },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-raise/50">
            <item.icon size={17} strokeWidth={1.6} className="text-gold" />
            <span className="flex-1">
              <span className="block text-sm text-white">{item.label}</span>
              <span className="block text-[11px] text-mist">{item.detail}</span>
            </span>
            <ChevronRight size={16} className="text-mist/50" />
          </Link>
        ))}
      </nav>

      <div className="mt-6 space-y-3">
        <button type="button" onClick={signOut} className="btn-outline w-full">
          <LogOut size={15} />
          Se déconnecter
        </button>
        <button
          type="button"
          onClick={resetDemo}
          className="mx-auto flex items-center gap-2 text-xs text-mist/60 transition-colors hover:text-gold"
        >
          <RotateCcw size={12} />
          Réinitialiser la démo
        </button>
      </div>

      <p className="mt-8 text-center text-[10px] tracking-[2px] text-mist/40">
        ETERNITY by Aime · v1.0 mariage
      </p>
    </div>
  );
}
