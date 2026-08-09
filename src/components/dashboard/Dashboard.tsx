'use client';

import {
  Bell,
  Calendar,
  Check,
  ExternalLink,
  Eye,
  FolderPlus,
  Lock,
  MessageCircle,
  Plus,
  QrCode,
  Settings,
  Users,
  Video,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, Countdown, ProgressBar } from '@/components/ui-kit';
import { GUESTS_SCANNED, GUESTS_TOTAL, ROLE_LABEL } from '@/lib/data';
import { useEternity } from '@/lib/store';
import { cn, formatEUR, formatDateFr, formatShortDateFr } from '@/lib/utils';

export function Dashboard() {
  const { user, folder, capsule, clips, contacts, budget, agenda, tasks } = useEternity();
  const totalBudget = budget.reduce((s, b) => s + b.amount, 0);
  const totalPaid = budget.reduce((s, b) => s + b.paid, 0);
  const openTasks = tasks.filter((t) => !t.done).length;

  return (
    <div>
      {/* En-tête compte */}
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar src={user.avatar} name={user.name} size={64} />
          <div>
            <p className="kicker">Espace compte</p>
            <h1 className="mt-1.5 text-2xl font-light md:text-3xl">
              Bonjour {user.name.split(' ')[0]} <span className="text-gold">·</span>
            </h1>
            <p className="mt-1 text-sm text-mist">
              Membre depuis {formatDateFr(user.created_at, { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/profil-public" className="btn-outline px-5 py-2.5 text-[13px]">
            <Eye size={14} />
            Profil public
          </Link>
          <button type="button" className="btn-outline px-5 py-2.5 text-[13px]">
            <Settings size={14} />
            Réglages
          </button>
        </div>
      </header>

      {/* Dossiers */}
      <section className="mt-10 flex flex-wrap gap-3">
        <div className="rainbow-ring-soft rounded-card">
          <div className="flex items-center gap-3 rounded-card bg-card px-5 py-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-gold opacity-50" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-gold" />
            </span>
            <span className="text-sm font-medium">{folder.name}</span>
            <span className="chip hidden sm:inline-flex">{folder.metadata.guests} invités</span>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-card border border-dashed border-white/15 px-5 py-4 text-sm text-mist transition-colors hover:border-gold/50 hover:text-gold"
        >
          <FolderPlus size={16} />
          Créer un dossier
        </button>
      </section>

      {/* Bandeau Jour J */}
      <section className="card mt-6 overflow-hidden">
        <div className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <p className="kicker">Compte à rebours</p>
            <h2 className="mt-3 text-2xl font-light md:text-3xl">
              Jour J — {formatDateFr(folder.metadata.date as string)}
            </h2>
            <p className="mt-2 text-sm text-mist">{folder.metadata.lieu}</p>
            <div className="mt-6">
              <Countdown targetIso={folder.metadata.date as string} compact />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 md:border-l md:border-white/8 md:pl-9">
            <div className="text-center">
              <p className="text-4xl font-light text-gold">
                {GUESTS_SCANNED}
                <span className="text-lg text-mist">/{GUESTS_TOTAL}</span>
              </p>
              <p className="mt-1 text-xs text-mist">invités ont scanné le QR</p>
            </div>
            <ProgressBar value={GUESTS_SCANNED} max={GUESTS_TOTAL} className="w-40" />
            <Link href="/app/qr/AIME-742-PLM" className="btn-gold px-5 py-2.5 text-[13px]">
              <QrCode size={14} />
              Partager le QR
            </Link>
          </div>
        </div>
      </section>

      {/* Grille modules */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <BudgetModule />
        <CapsuleModule clipsCount={clips.length} capsuleStatus={capsule.status} sealedAt={capsule.sealed_at} />
        <AgendaModule />
        <TasksModule openCount={openTasks} />
        <ContactsModule />
        <MessagingModule />
      </div>
    </div>
  );
}

/* ---------------- Budget ---------------- */
function BudgetModule() {
  const { budget, addBudgetItem, addPayment } = useEternity();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const total = budget.reduce((s, b) => s + b.amount, 0);
  const paid = budget.reduce((s, b) => s + b.paid, 0);

  return (
    <Module
      icon={Wallet}
      title="Budget"
      aside={<span className="text-sm text-gold">{formatEUR(total)}</span>}
    >
      <div className="mb-5">
        <div className="flex justify-between text-xs text-mist">
          <span>Versé : {formatEUR(paid)}</span>
          <span>{Math.round((paid / total) * 100)}%</span>
        </div>
        <ProgressBar value={paid} max={total} className="mt-2" />
      </div>
      <ul className="space-y-3.5">
        {budget.map((b) => {
          const complete = b.paid >= b.amount;
          return (
            <li key={b.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => addPayment(b.id, Math.round(b.amount * 0.25))}
                title="Ajouter un versement de 25 %"
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors',
                  complete ? 'bg-gold text-black' : 'bg-raise text-mist hover:text-gold',
                )}
              >
                {complete ? <Check size={13} strokeWidth={3} /> : <Plus size={13} />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="truncate text-white/85">{b.category}</span>
                  <span className="shrink-0 tabular-nums text-mist">
                    {formatEUR(b.paid)} <span className="text-mist/50">/ {formatEUR(b.amount)}</span>
                  </span>
                </div>
                <ProgressBar value={b.paid} max={b.amount} className="mt-1.5 h-1" />
              </div>
            </li>
          );
        })}
      </ul>
      {open ? (
        <form
          className="mt-5 grid gap-2.5 rounded-card bg-raise p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const value = parseInt(amount.replace(/\D/g, ''), 10);
            if (category.trim() && value > 0) {
              addBudgetItem({ category: category.trim(), amount: value, paid: 0 });
              setCategory('');
              setAmount('');
              setOpen(false);
            }
          }}
        >
          <input
            className="input bg-ink py-2.5"
            placeholder="Poste (ex. Vin d’honneur)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2.5">
            <input
              className="input bg-ink py-2.5"
              placeholder="Montant €"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button type="submit" className="btn-gold px-5 py-2 text-[13px]">
              Ajouter
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex items-center gap-2 text-[13px] text-mist transition-colors hover:text-gold"
        >
          <Plus size={14} />
          Ajouter un poste
        </button>
      )}
    </Module>
  );
}

/* ---------------- Capsule ---------------- */
function CapsuleModule({
  clipsCount,
  capsuleStatus,
  sealedAt,
}: {
  clipsCount: number;
  capsuleStatus: string;
  sealedAt: string | null;
}) {
  const { capsule, sealCapsule } = useEternity();
  const [confirming, setConfirming] = useState(false);
  const sealed = capsuleStatus === 'sealed';

  return (
    <Module
      icon={Video}
      title="Capsule « Notre Jour J »"
      aside={
        <span className={cn('chip', sealed ? 'bg-gold/15 text-gold' : 'text-mist')}>
          {sealed ? 'Scellée' : 'En collecte'}
        </span>
      }
    >
      <div className="flex items-center gap-5">
        <div className="rainbow-ring-soft rounded-card p-0.5">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-card bg-card">
            <span className="text-2xl font-light text-gold">{clipsCount}</span>
            <span className="text-[10px] uppercase tracking-[2px] text-mist">clips</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 text-sm leading-relaxed text-mist">
          {sealed ? (
            <p>
              Capsule scellée le {formatDateFr(sealedAt as string, { hour: '2-digit', minute: '2-digit' })}.
              Aucune modification possible. Le film vivra pour toujours sur le mini-site.
            </p>
          ) : (
            <p>
              La capsule collecte les clips des invités. Après le mariage, scellez-la : geste
              irréversible, horodaté — le début de l’éternité.
            </p>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/app/capsule/cap_jourj" className="btn-outline px-5 py-2.5 text-[13px]">
          <Video size={14} />
          Voir les clips
        </Link>
        <Link href="/mini-site" className="btn-outline px-5 py-2.5 text-[13px]">
          <ExternalLink size={14} />
          Mini-site
        </Link>
        {!sealed &&
          (confirming ? (
            <div className="flex w-full items-center gap-3 rounded-card bg-raise p-3">
              <p className="flex-1 text-xs leading-relaxed text-white/80">
                Sceller est <strong className="text-gold">irréversible</strong>. Confirmer ?
              </p>
              <button
                type="button"
                onClick={() => {
                  sealCapsule();
                  setConfirming(false);
                }}
                className="btn-gold px-4 py-2 text-xs"
              >
                <Lock size={13} />
                Sceller
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="btn-ghost px-3 py-2 text-xs"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="btn-gold px-5 py-2.5 text-[13px]"
            >
              <Lock size={14} />
              Sceller la capsule
            </button>
          ))}
      </div>
    </Module>
  );
}

/* ---------------- Agenda ---------------- */
function AgendaModule() {
  const { agenda } = useEternity();
  const sorted = [...agenda].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  return (
    <Module icon={Calendar} title="Agenda" aside={<span className="chip">J-365 → Jour J</span>}>
      <ol className="relative space-y-4">
        <div aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-white/8" />
        {sorted.map((e) => (
          <li key={e.id} className="relative flex items-start gap-4 pl-0.5">
            <span
              className={cn(
                'relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                e.type === 'jour-j' ? 'bg-gold shadow-[0_0_12px_rgba(201,169,110,0.8)]' : e.done ? 'bg-gold/60' : 'bg-raise ring-1 ring-white/15',
              )}
            />
            <div className="flex-1">
              <p className={cn('text-sm', e.done ? 'text-mist line-through' : 'text-white/85')}>
                {e.title}
              </p>
              <p className="mt-0.5 text-xs text-mist/70">
                {formatShortDateFr(e.date)} · {e.type === 'jour-j' ? 'Jour J' : e.type === 'rdv' ? 'Rendez-vous' : 'Jalon'}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Module>
  );
}

/* ---------------- Tâches ---------------- */
function TasksModule({ openCount }: { openCount: number }) {
  const { tasks, toggleTask, addTask } = useEternity();
  const [title, setTitle] = useState('');
  return (
    <Module
      icon={Check}
      title="Tâches"
      aside={<span className="chip">{openCount} en cours</span>}
    >
      <ul className="space-y-3">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleTask(t.id)}
              aria-pressed={t.done}
              aria-label={t.done ? `Rouvrir « ${t.title} »` : `Terminer « ${t.title} »`}
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all',
                t.done ? 'bg-gold text-black' : 'bg-raise ring-1 ring-white/15 hover:ring-gold/60',
              )}
            >
              {t.done && <Check size={13} strokeWidth={3} />}
            </button>
            <span className={cn('flex-1 text-sm', t.done ? 'text-mist line-through' : 'text-white/85')}>
              {t.title}
            </span>
            <span className="chip shrink-0">{t.assigned_to}</span>
          </li>
        ))}
      </ul>
      <form
        className="mt-5 flex gap-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) {
            addTask(title.trim(), 'Sophie');
            setTitle('');
          }
        }}
      >
        <input
          className="input py-2.5"
          placeholder="Nouvelle tâche…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="btn-outline shrink-0 px-4 py-2 text-[13px]" aria-label="Ajouter la tâche">
          <Plus size={14} />
        </button>
      </form>
    </Module>
  );
}

/* ---------------- Contacts ---------------- */
function ContactsModule() {
  const { contacts } = useEternity();
  return (
    <Module
      icon={Users}
      title="Équipe & prestataires"
      aside={<span className="chip">{contacts.length}</span>}
    >
      <ul className="space-y-3.5">
        {contacts.map((c) => (
          <li key={c.id} className="flex items-center gap-3.5">
            <Avatar src={c.avatar} name={c.name} size={38} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/90">{c.name}</p>
              <p className="truncate text-xs text-mist">{c.detail}</p>
            </div>
            <span className={cn('chip shrink-0', c.role === 'prestataire' && 'text-gold/90')}>
              {ROLE_LABEL[c.role]}
            </span>
          </li>
        ))}
      </ul>
    </Module>
  );
}

/* ---------------- Messagerie ---------------- */
function MessagingModule() {
  const { messages, contacts } = useEternity();
  const recent = [...messages].slice(-3).reverse();
  const nameOf = (id: string) =>
    id === 'usr_sophie' ? 'Vous' : contacts.find((c) => c.id === id)?.name ?? id;
  return (
    <Module
      icon={MessageCircle}
      title="Messagerie"
      aside={
        <Link href="/app/messagerie" className="chip transition-colors hover:text-gold">
          Ouvrir
        </Link>
      }
    >
      <ul className="space-y-3.5">
        {recent.map((m) => (
          <li key={m.id} className="rounded-card bg-raise p-4">
            <p className="text-xs font-medium text-gold/90">{nameOf(m.sender_id)}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/80">{m.content}</p>
          </li>
        ))}
      </ul>
      <Link
        href="/app/messagerie"
        className="mt-5 inline-flex items-center gap-2 text-[13px] text-mist transition-colors hover:text-gold"
      >
        <Bell size={13} />
        Réponses instantanées des prestataires
      </Link>
    </Module>
  );
}

/* ---------------- Module de base ---------------- */
function Module({
  icon: Icon,
  title,
  aside,
  children,
}: {
  icon: React.ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6 md:p-7">
      <header className="mb-6 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-3 text-base font-medium text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-raise text-gold">
            <Icon size={16} strokeWidth={1.6} />
          </span>
          {title}
        </h3>
        {aside}
      </header>
      {children}
    </section>
  );
}
