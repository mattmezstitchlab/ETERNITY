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
  SEED_REGISTRE,
  SEED_TASKS,
  SEED_USER,
} from './data';
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

interface EternityState {
  hydrated: boolean;
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
  signUp: (name: string, email: string) => void;
  signOut: () => void;
  addBudgetItem: (item: Omit<BudgetItem, 'id' | 'folder_id'>) => void;
  addPayment: (id: string, amount: number) => void;
  toggleTask: (id: string) => void;
  addTask: (title: string, assigned_to: string) => void;
  sendMessage: (receiverId: string, content: string) => void;
  receiveMessage: (fromContactId: string, content: string) => void;
  addClip: (clip: Omit<Clip, 'id' | 'capsule_id' | 'created_at' | 'likes'>) => void;
  likeClip: (id: string) => void;
  sealCapsule: () => void;
  markContactScanned: (id: string) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = 'eternity-store-v1';

const SEED_STATE: EternityState = {
  hydrated: false,
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

const EternityContext = createContext<EternityStore | null>(null);

type Persisted = Omit<EternityState, 'hydrated'>;

export function EternityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EternityState>(SEED_STATE);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydratation depuis localStorage (après montage — évite tout mismatch SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const persisted = JSON.parse(raw) as Persisted;
        setState({ ...persisted, hydrated: true });
        return;
      }
    } catch {
      /* stockage indisponible — on garde le seed */
    }
    setState((s) => ({ ...s, hydrated: true }));
  }, []);

  // Persistance debouncée
  useEffect(() => {
    if (!state.hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const { hydrated: _h, ...persisted } = state;
        // Les clips locaux référencent des blobs IndexedDB : on persiste la
        // métadonnée uniquement (video_url = null côté storage local)
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...persisted,
            clips: persisted.clips.map((c) => (c.local ? { ...c, video_url: null } : c)),
          }),
        );
      } catch {
        /* quota / mode privé */
      }
    }, 350);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  const signUp = useCallback((name: string, email: string) => {
    setState((s) => ({
      ...s,
      signedUp: true,
      user: {
        ...s.user,
        name: name.trim() || s.user.name,
        email: email.trim() || s.user.email,
        qr_code: generateAimeCode(),
        created_at: new Date().toISOString(),
      },
    }));
  }, []);

  const signOut = useCallback(() => {
    setState((s) => ({ ...s, signedUp: false }));
  }, []);

  const addBudgetItem = useCallback((item: Omit<BudgetItem, 'id' | 'folder_id'>) => {
    setState((s) => ({
      ...s,
      budget: [...s.budget, { ...item, id: uid('bg'), folder_id: s.folder.id }],
    }));
  }, []);

  const addPayment = useCallback((id: string, amount: number) => {
    setState((s) => ({
      ...s,
      budget: s.budget.map((b) =>
        b.id === id ? { ...b, paid: Math.min(b.amount, b.paid + Math.abs(amount)) } : b,
      ),
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }, []);

  const addTask = useCallback((title: string, assigned_to: string) => {
    setState((s) => ({
      ...s,
      tasks: [
        { id: uid('tk'), folder_id: s.folder.id, title, done: false, assigned_to },
        ...s.tasks,
      ],
    }));
  }, []);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    const message: Message = {
      id: uid('ms'),
      sender_id: 'usr_sophie',
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, messages: [...s.messages, message] }));
  }, []);

  const receiveMessage = useCallback((fromContactId: string, content: string) => {
    const message: Message = {
      id: uid('ms'),
      sender_id: fromContactId,
      receiver_id: 'usr_sophie',
      content,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, messages: [...s.messages, message] }));
  }, []);

  const addClip = useCallback(
    (clip: Omit<Clip, 'id' | 'capsule_id' | 'created_at' | 'likes'>) => {
      setState((s) => ({
        ...s,
        clips: [
          {
            ...clip,
            id: uid('cl'),
            capsule_id: s.capsule.id,
            likes: 0,
            created_at: new Date().toISOString(),
          },
          ...s.clips,
        ],
      }));
    },
    [],
  );

  const likeClip = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      clips: s.clips.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)),
    }));
  }, []);

  const sealCapsule = useCallback(() => {
    setState((s) =>
      s.capsule.status === 'sealed'
        ? s
        : { ...s, capsule: { ...s.capsule, status: 'sealed', sealed_at: new Date().toISOString() } },
    );
  }, []);

  const markContactScanned = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      contacts: s.contacts.map((c) => (c.id === id ? { ...c, scanned: true } : c)),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setState({ ...SEED_STATE, hydrated: true });
  }, []);

  const value = useMemo<EternityStore>(
    () => ({
      ...state,
      signUp,
      signOut,
      addBudgetItem,
      addPayment,
      toggleTask,
      addTask,
      sendMessage,
      receiveMessage,
      addClip,
      likeClip,
      sealCapsule,
      markContactScanned,
      resetDemo,
    }),
    [
      state,
      signUp,
      signOut,
      addBudgetItem,
      addPayment,
      toggleTask,
      addTask,
      sendMessage,
      receiveMessage,
      addClip,
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
