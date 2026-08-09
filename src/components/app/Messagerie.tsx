'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, SendHorizonal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '@/components/ui-kit';
import { useEternity } from '@/lib/store';
import { cn, timeAgoFr } from '@/lib/utils';

const REPLIES: Record<string, string[]> = {
  ct_marie: [
    'Parfait, je note ça dans le dossier ✅',
    'Haha, exactement ce que je me disais !',
    'On en parle à la prochaine visio des témoins ?',
  ],
  ct_ines: [
    'Bien reçu ! Je vous envoie le sélecteur photos demain.',
    'Oui, 19h pile pour la lumière dorée. C’est confirmé.',
    'J’ajoute ce spot à la liste des lieux de séance 📸',
  ],
  ct_alex: [
    'Ça marche, je cale ça dans le set 🎧',
    'Noté ! Prévoyez juste les 30 premières secondes en instrumental ?',
    'Top. Je vous fais écouter une version dimanche.',
  ],
  default: ['Bien reçu, merci !', 'Parfait, c’est noté 👍', 'On en reparle très vite !'],
};

export function Messagerie() {
  const { messages, contacts, sendMessage } = useEternity();
  const [activeId, setActiveId] = useState<string | null>(null);

  const threads = useMemo(() => {
    const byContact = new Map<string, typeof messages>();
    for (const m of messages) {
      const other = m.sender_id === 'usr_sophie' ? m.receiver_id : m.sender_id;
      byContact.set(other, [...(byContact.get(other) ?? []), m]);
    }
    return contacts
      .filter((c) => byContact.has(c.id) || ['ct_marie', 'ct_ines', 'ct_alex'].includes(c.id))
      .map((c) => ({
        contact: c,
        messages: (byContact.get(c.id) ?? []).sort(
          (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
        ),
      }));
  }, [messages, contacts]);

  const active = threads.find((t) => t.contact.id === activeId) ?? null;

  return (
    <div className="mx-auto flex h-[calc(100dvh-80px)] max-w-md flex-col lg:h-dvh lg:max-w-5xl lg:flex-row lg:gap-6 lg:px-6 lg:py-10">
      {/* Liste des conversations */}
      <aside
        className={cn(
          'flex-1 overflow-y-auto px-5 pt-6 lg:max-w-xs lg:flex-none lg:px-0 lg:pt-0',
          active && 'hidden lg:block',
        )}
      >
        <p className="kicker">Messagerie</p>
        <h1 className="mt-2 text-3xl font-light">Discussions</h1>
        <ul className="mt-6 space-y-2.5">
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            return (
              <li key={t.contact.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(t.contact.id)}
                  className={cn(
                    'card flex w-full items-center gap-3.5 p-4 text-left transition-colors hover:bg-raise',
                    activeId === t.contact.id && 'ring-1 ring-gold/50',
                  )}
                >
                  <span className="relative">
                    <Avatar src={t.contact.avatar} name={t.contact.name} size={46} />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-gold" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-medium text-white">{t.contact.name}</span>
                      {last && (
                        <span className="shrink-0 text-[10px] text-mist/60">{timeAgoFr(last.created_at)}</span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-mist">
                      {last ? (last.sender_id === 'usr_sophie' ? `Vous : ${last.content}` : last.content) : 'Démarrer la conversation'}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Conversation */}
      {active ? (
        <Conversation
          key={active.contact.id}
          thread={active}
          onBack={() => setActiveId(null)}
          onSend={(content) => sendMessage(active.contact.id, content)}
        />
      ) : (
        <div className="hidden flex-1 items-center justify-center rounded-card bg-card lg:flex">
          <p className="text-sm text-mist">Choisissez une conversation</p>
        </div>
      )}
    </div>
  );
}

function Conversation({
  thread,
  onBack,
  onSend,
}: {
  thread: { contact: (ReturnType<typeof useEternity>['contacts'])[number]; messages: ReturnType<typeof useEternity>['messages'] };
  onBack: () => void;
  onSend: (content: string) => void;
}) {
  const { contacts, receiveMessage } = useEternity();
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contact = contacts.find((c) => c.id === thread.contact.id) ?? thread.contact;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages.length, typing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    onSend(content);
    setDraft('');
    // Réponse simulée (Supabase Realtime en prod)
    setTyping(true);
    const pool = REPLIES[contact.id] ?? REPLIES.default;
    const reply = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => {
      setTyping(false);
      receiveMessage(contact.id, reply);
    }, 1400 + Math.random() * 900);
  };

  return (
    <section className="flex flex-1 flex-col lg:rounded-card lg:bg-card">
      {/* En-tête */}
      <header className="glass flex items-center gap-3 px-5 py-4 lg:rounded-t-card lg:bg-raise/60">
        <button type="button" onClick={onBack} aria-label="Retour aux conversations" className="text-mist hover:text-white lg:hidden">
          <ArrowLeft size={20} />
        </button>
        <Avatar src={contact.avatar} name={contact.name} size={38} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{contact.name}</p>
          <p className="truncate text-[11px] text-mist">{contact.detail}</p>
        </div>
        <span className="chip text-gold">{typing ? 'écrit…' : 'en ligne'}</span>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-6">
        <AnimatePresence initial={false}>
          {thread.messages.map((m) => {
            const mine = m.sender_id === 'usr_sophie';
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={cn('flex', mine ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[78%] rounded-3xl py-3 text-sm leading-relaxed',
                    mine
                      ? 'rounded-br-md bg-gold text-black'
                      : 'rounded-bl-md bg-raise text-white/90',
                  )}
                  style={{ paddingLeft: 18, paddingRight: 18 }}
                >
                  <p>{m.content}</p>
                  <p className={cn('mt-1 text-right text-[9px]', mine ? 'text-black/50' : 'text-mist/50')}>
                    {timeAgoFr(m.created_at)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-3xl rounded-bl-md bg-raise px-5 py-3.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mist"
                  style={{ animationDelay: `${i * 0.22}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Saisie */}
      <form onSubmit={submit} className="glass flex items-center gap-3 border-t border-white/5 px-5 py-4 lg:rounded-b-card">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Écrire à ${contact.name.split(' ')[0]}…`}
          className="input flex-1"
          aria-label="Votre message"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Envoyer"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-black transition-all hover:bg-gold-light active:scale-95 disabled:opacity-40"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </section>
  );
}

