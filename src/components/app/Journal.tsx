'use client';

import { Calendar, Camera, Check, Milestone, Video } from 'lucide-react';
import { useEternity } from '@/lib/store';
import { Avatar } from '@/components/ui-kit';
import { Reveal } from '@/components/motion';
import { cn, formatDateFr, formatShortDateFr } from '@/lib/utils';

interface JournalEntry {
  id: string;
  date: string;
  kind: 'clip' | 'jalon' | 'jour-j';
  title: string;
  detail?: string;
  author?: string;
  authorAvatar?: string | null;
  done?: boolean;
}

export function Journal() {
  const { clips, agenda, folder } = useEternity();

  const entries: JournalEntry[] = [
    ...agenda.map((e) => ({
      id: e.id,
      date: e.date,
      kind: e.type === 'jour-j' ? ('jour-j' as const) : ('jalon' as const),
      title: e.title,
      detail: e.type === 'rdv' ? 'Rendez-vous' : e.type === 'jour-j' ? 'Le grand jour' : 'Jalon',
      done: e.done,
    })),
    ...clips.map((c) => ({
      id: c.id,
      date: c.created_at,
      kind: 'clip' as const,
      title: c.caption,
      author: c.author_name,
      authorAvatar: c.author_avatar,
      detail: `Clip · ${c.duration}s`,
    })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  // Regroupement par mois
  const groups = entries.reduce<Record<string, JournalEntry[]>>((acc, e) => {
    const key = formatDateFr(e.date, { month: 'long', year: 'numeric' });
    (acc[key] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-md px-5 pb-10 pt-6 lg:max-w-2xl lg:px-0 lg:pt-10">
      <header>
        <p className="kicker">Timeline</p>
        <h1 className="mt-2 text-3xl font-light">Journal</h1>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          {folder.name} — chaque jalon, chaque clip, dans l’ordre du temps.
        </p>
      </header>

      {Object.entries(groups).map(([month, items]) => (
        <section key={month} className="mt-10">
          <h2 className="sticky top-16 z-10 -mx-1 bg-ink/90 px-1 py-2 text-xs font-medium uppercase tracking-kicker text-gold backdrop-blur lg:top-4">
            {month}
          </h2>
          <ol className="relative mt-3 space-y-4">
            <div aria-hidden className="absolute bottom-3 left-[15px] top-3 w-px bg-white/8" />
            {items.map((e) => (
              <li key={e.id} className="relative flex gap-4 pl-0">
                <span
                  className={cn(
                    'z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    e.kind === 'jour-j'
                      ? 'bg-gold text-black shadow-[0_0_18px_rgba(201,169,110,0.6)]'
                      : e.kind === 'clip'
                        ? 'bg-card text-gold'
                        : 'bg-card text-mist',
                  )}
                >
                  {e.kind === 'clip' ? (
                    <Video size={14} strokeWidth={1.6} />
                  ) : e.kind === 'jour-j' ? (
                    <Calendar size={14} strokeWidth={1.8} />
                  ) : (
                    <Milestone size={14} strokeWidth={1.6} />
                  )}
                </span>
                <Reveal className="min-w-0 flex-1">
                  <article
                    className={cn(
                      'rounded-card p-4',
                      e.kind === 'jour-j' ? 'bg-gold/10 ring-1 ring-gold/40' : 'bg-card',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className={cn('text-sm leading-snug', e.done ? 'text-mist line-through' : 'text-white/90')}>
                        {e.title}
                      </p>
                      <span className="shrink-0 text-[10px] uppercase tracking-[1.5px] text-mist/60">
                        {formatShortDateFr(e.date)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-mist/80">
                      {e.author ? (
                        <>
                          <Avatar src={e.authorAvatar ?? null} name={e.author} size={18} />
                          <span>{e.author}</span>
                          <span className="text-mist/40">·</span>
                        </>
                      ) : e.done ? (
                        <Check size={12} className="text-gold" />
                      ) : e.kind !== 'jour-j' ? (
                        <Camera size={12} />
                      ) : null}
                      <span>{e.detail}</span>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="mt-12 text-center text-xs text-mist/60">
        Le journal se remplit tout seul. Vous n’avez qu’à vivre.
      </p>
    </div>
  );
}
