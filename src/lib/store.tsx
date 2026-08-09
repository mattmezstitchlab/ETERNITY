'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  SEED_AGENDA,
  SEED_BUDGET,
  SEED_CAPSULE,
  SEED_CLIPS,
  SEED_CONTACTS,
  SEED_FOLDER,
  SEED_MESSAGES,
  SEED_TASKS,
  SEED_USER,
} from './data';
import { idbPut, isIdbAvailable } from './idb';
import type {
  AgendaEvent,
  BudgetItem,
  Capsule,
  Clip,
  Contact,
  Folder,
  Message,
  Task,
  User,
} from './types';
import { generateAimeCode, uid } from './utils';

/**
 * Store ETERNITY — deux modes :
 * - VISITEUR : seed démo (Sophie & Lucas) + clips serveur de la capsule démo
 *   mergés (les uploads invités apparaissent sur tous les appareils).
 * - CONNECTÉ : état servi par l'API (SQLite), optimisme local + sync.
 */

interface EternityState {
  hydrated: boolean;
  authed: boolean;
  user: User;
  folder: Folder;
  capsule: Capsule;
  clips: Clip[];
  contacts: Contact[];
  budget: BudgetItem[];
  agenda: AgendaEvent[];
  tasks: Task[];
  messages: Message[];
  signedUp: boolean;
}

export interface EternityStore extends EternityState {
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;
  addBudgetItem: (item: Omit<BudgetItem, 'id' | 'folder_id'>) => void;
  addPayment: (id: string, amount: number) => void;
  toggleTask: (id: string) => void;
  addTask: (title: string, assigned_to: string) => void;
  sendMessage: (receiverId: string, content: string) => void;
  receiveMessage: (fromContactId: string, content: string) => void;
  addClip: (clip: Omit<Clip, 'id' | 'capsule_id' | 'created_at' | 'likes'>) => void;
  uploadClip: (file: Blob, meta: { caption: string; authorName?: string; code?: string; duration: number }) => Promise<boolean>;
  likeClip: (id: string) => void;
  sealCapsule: () => void;
  markContactScanned: (id: string) => void;
  resetDemo: () => void;
}

const SEED_STATE: EternityState = {
  hydrated: false,
  authed: false,
  user: SEED_USER,
  folder: SEED_FOLDER,
  capsule: SEED_CAPSULE,
  clips: SEED_CLIPS,
  contacts: SEED_CONTACTS,
  budget: SEED_BUDGET,
  agenda: SEED_AGENDA,
  tasks: SEED_TASKS,
  messages: SEED_MESSAGES,
  signedUp: false,
};

interface ServerState {
  user: User;
  folder: Folder;
  capsule: Capsule;
  clips: Clip[];
  contacts: Contact[];
  budget: BudgetItem[];
  agenda: AgendaEvent[];
  tasks: Task[];
  messages: Message[];
}

/** Merge : le serveur gagne sur les ids communs, les inconnus arrivent en tête */
function mergeClips(base: Clip[], server: Clip[]): Clip[] {
  const byId = new Map(base.map((c) => [c.id, c]));
  const news: Clip[] = [];
  for (const c of server) {
    if (byId.has(c.id)) byId.set(c.id, c);
    else news.push(c);
  }
  return [...news, ...Array.from(byId.values())].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

const EternityContext = createContext<EternityStore | null>(null);

export function EternityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EternityState>(SEED_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  const applyServerState = useCallback((s: ServerState) => {
    setState((prev) => ({
      ...prev,
      authed: true,
      hydrated: true,
      signedUp: true,
      user: s.user,
      folder: s.folder,
      capsule: s.capsule,
      contacts: s.contacts,
      budget: s.budget,
      agenda: s.agenda,
      tasks: s.tasks,
      messages: s.messages,
      clips: mergeClips(
        s.clips,
        // conserve les clips locaux en attente d'upload
        prev.clips.filter((c) => c.local && !s.clips.some((sc) => sc.id === c.id)),
      ),
    }));
  }, []);

  /* ---------- Hydratation + session ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = (await res.json()) as { user: User | null; state?: ServerState };
        if (!cancelled && data.user && data.state) {
          applyServerState(data.state);
          return;
        }
      } catch {
        /* API indisponible → mode visiteur */
      }
      // Mode visiteur : clips serveur de la capsule démo + seed local
      try {
        const res = await fetch(`/api/clips?code=${SEED_CAPSULE.code}`, { cache: 'no-store' });
        if (res.ok) {
          const { clips } = (await res.json()) as { clips: Clip[] };
          if (!cancelled) {
            setState((prev) => ({ ...prev, hydrated: true, clips: mergeClips(SEED_CLIPS, clips) }));
            return;
          }
        }
      } catch {
        /* offline */
      }
      if (!cancelled) setState((prev) => ({ ...prev, hydrated: true }));
    })();
    return () => {
      cancelled = true;
    };
  }, [applyServerState]);

  /* ---------- Polling des clips (temps quasi-réel) ---------- */
  useEffect(() => {
    if (!state.hydrated) return;
    const poll = async () => {
      if (document.visibilityState !== 'visible') return;
      const code = stateRef.current.capsule.code;
      try {
        const res = await fetch(`/api/clips?code=${encodeURIComponent(code)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const { clips } = (await res.json()) as { clips: Clip[] };
        setState((prev) => ({ ...prev, clips: mergeClips(prev.clips, clips) }));
      } catch {
        /* offline */
      }
    };
    const t = setInterval(poll, 6000);
    return () => clearInterval(t);
  }, [state.hydrated]);

  /* ---------- Auth ---------- */
  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<string | null> => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) return data.error ?? 'Inscription impossible.';
        if (data.state) applyServerState(data.state);
        return null;
      } catch {
        return 'Serveur injoignable — réessayez.';
      }
    },
    [applyServerState],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) return data.error ?? 'Connexion impossible.';
        if (data.state) applyServerState(data.state);
        return null;
      } catch {
        return 'Serveur injoignable — réessayez.';
      }
    },
    [applyServerState],
  );

  const signOut = useCallback(() => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setState((prev) => ({
      ...SEED_STATE,
      hydrated: true,
      clips: prev.clips.filter((c) => c.local),
    }));
  }, []);

  /* ---------- Upload vidéo réel (fallback IndexedDB si échec) ---------- */
  const uploadClip = useCallback(
    async (
      file: Blob,
      meta: { caption: string; authorName?: string; code?: string; duration: number },
    ): Promise<boolean> => {
      const form = new FormData();
      form.append('file', file, 'clip.webm');
      form.append('caption', meta.caption);
      form.append('duration', String(meta.duration));
      if (meta.authorName) form.append('authorName', meta.authorName);
      if (meta.code) form.append('code', meta.code);
      if (!meta.code && !stateRef.current.authed) form.append('code', stateRef.current.capsule.code);
      try {
        const res = await fetch('/api/clips', { method: 'POST', body: form });
        if (!res.ok) throw new Error(String(res.status));
        const { clip } = (await res.json()) as { clip: Clip };
        setState((prev) => ({ ...prev, clips: mergeClips(prev.clips, [clip]) }));
        return true;
      } catch {
        // Fallback hors-ligne : blob dans IndexedDB, clip local
        const key = `clip-${uid('blob')}`;
        if (isIdbAvailable()) {
          try {
            await idbPut(key, file);
          } catch {
            /* noop */
          }
        }
        setState((prev) => ({
          ...prev,
          clips: [
            {
              id: uid('cl'),
              capsule_id: prev.capsule.id,
              user_id: prev.user.id,
              author_name: meta.authorName || prev.user.name.split(' ')[0],
              author_avatar: prev.user.avatar,
              video_url: key,
              poster: null,
              caption: meta.caption,
              duration: meta.duration,
              likes: 0,
              created_at: new Date().toISOString(),
              local: true,
            },
            ...prev.clips,
          ],
        }));
        return false;
      }
    },
    [],
  );

  /* ---------- Mutations mixtes (optimisme + API si connecté) ---------- */
  const addBudgetItem = useCallback((item: Omit<BudgetItem, 'id' | 'folder_id'>) => {
    const tempId = uid('bg');
    setState((s) => ({ ...s, budget: [...s.budget, { ...item, id: tempId, folder_id: s.folder.id }] }));
    if (stateRef.current.authed) {
      fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.item) {
            setState((s) => ({ ...s, budget: s.budget.map((b) => (b.id === tempId ? d.item : b)) }));
          }
        })
        .catch(() => undefined);
    }
  }, []);

  const addPayment = useCallback((id: string, amount: number) => {
    setState((s) => ({
      ...s,
      budget: s.budget.map((b) => (b.id === id ? { ...b, paid: Math.min(b.amount, b.paid + Math.abs(amount)) } : b)),
    }));
    if (stateRef.current.authed) {
      fetch(`/api/budget/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.abs(amount) }),
      }).catch(() => undefined);
    }
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
    if (stateRef.current.authed) {
      fetch(`/api/tasks/${id}/toggle`, { method: 'POST' }).catch(() => undefined);
    }
  }, []);

  const addTask = useCallback((title: string, assigned_to: string) => {
    const tempId = uid('tk');
    setState((s) => ({
      ...s,
      tasks: [{ id: tempId, folder_id: s.folder.id, title, done: false, assigned_to }, ...s.tasks],
    }));
    if (stateRef.current.authed) {
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, assigned_to }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.task) setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === tempId ? d.task : t)) }));
        })
        .catch(() => undefined);
    }
  }, []);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    const message: Message = {
      id: uid('ms'),
      sender_id: stateRef.current.user.id,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, messages: [...s.messages, message] }));
    if (stateRef.current.authed) {
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content }),
      }).catch(() => undefined);
    }
  }, []);

  const receiveMessage = useCallback((fromContactId: string, content: string) => {
    const message: Message = {
      id: uid('ms'),
      sender_id: fromContactId,
      receiver_id: stateRef.current.user.id,
      content,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, messages: [...s.messages, message] }));
  }, []);

  const addClip = useCallback((clip: Omit<Clip, 'id' | 'capsule_id' | 'created_at' | 'likes'>) => {
    setState((s) => ({
      ...s,
      clips: [
        { ...clip, id: uid('cl'), capsule_id: s.capsule.id, likes: 0, created_at: new Date().toISOString() },
        ...s.clips,
      ],
    }));
  }, []);

  const likeClip = useCallback((id: string) => {
    setState((s) => ({ ...s, clips: s.clips.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)) }));
    fetch('/api/clips/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => undefined);
  }, []);

  const sealCapsule = useCallback(() => {
    const now = new Date().toISOString();
    setState((s) => (s.capsule.status === 'sealed' ? s : { ...s, capsule: { ...s.capsule, status: 'sealed', sealed_at: now } }));
    if (stateRef.current.authed) {
      fetch('/api/capsule/seal', { method: 'POST' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.sealed_at) {
            setState((s) => ({ ...s, capsule: { ...s.capsule, status: 'sealed', sealed_at: d.sealed_at } }));
          }
        })
        .catch(() => undefined);
    }
  }, []);

  const markContactScanned = useCallback((id: string) => {
    setState((s) => ({ ...s, contacts: s.contacts.map((c) => (c.id === id ? { ...c, scanned: true } : c)) }));
  }, []);

  const resetDemo = useCallback(() => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setState({ ...SEED_STATE, hydrated: true });
  }, []);

  const value = useMemo<EternityStore>(
    () => ({
      ...state,
      signUp,
      login,
      signOut,
      addBudgetItem,
      addPayment,
      toggleTask,
      addTask,
      sendMessage,
      receiveMessage,
      addClip,
      uploadClip,
      likeClip,
      sealCapsule,
      markContactScanned,
      resetDemo,
    }),
    [
      state,
      signUp,
      login,
      signOut,
      addBudgetItem,
      addPayment,
      toggleTask,
      addTask,
      sendMessage,
      receiveMessage,
      addClip,
      uploadClip,
      likeClip,
      sealCapsule,
      markContactScanned,
      resetDemo,
    ],
  );

  return <EternityContext.Provider value={value}>{children}</EternityContext.Provider>;
}

export function useEternity(): EternityStore {
  const ctx = useContext(EternityContext);
  if (!ctx) throw new Error('useEternity doit être utilisé dans <EternityProvider>');
  return ctx;
}

// expose pour le wizard (création d'un nouveau code local, cohérent avec le format serveur)
export { generateAimeCode };
