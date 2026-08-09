/**
 * ETERNITY — Modèle de données
 * Miroir 1:1 du schéma Supabase (voir spec) :
 * users, folders, capsules, clips, contacts, messages,
 * budget_items, agenda_events, tasks.
 * La couche d'accès actuelle (store.tsx) est locale et
 * swappable par Supabase sans changer les types.
 */

export type UniverseId =
  | 'mariage'
  | 'naissance'
  | 'anniversaire'
  | 'diplome'
  | 'amitie'
  | 'in-memoriam'
  | 'chantier'
  | 'odyssee';

export type Role = 'marie' | 'temoin' | 'invite' | 'prestataire' | 'famille';
export type CapsuleStatus = 'collecting' | 'sealed';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  qr_code: string; // format AIME-XXX-XXX
  bio: string;
  universes: UniverseId[];
  created_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  type: UniverseId;
  name: string;
  metadata: {
    date?: string; // ISO — jour de l'événement
    lieu?: string;
    guests?: number;
    currency?: string;
    [key: string]: unknown;
  };
  created_at: string;
}

export interface Capsule {
  id: string;
  folder_id: string;
  name: string;
  code: string; // AIME-XXX-XXX — partagé aux invités
  status: CapsuleStatus;
  sealed_at: string | null;
  opens_at?: string | null;
  created_at: string;
}

export interface Clip {
  id: string;
  capsule_id: string;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  video_url: string | null; // null => asset image (thumbnail-only seed)
  poster: string | null;
  caption: string;
  duration: number; // secondes, max 10
  likes: number;
  created_at: string;
  local?: boolean; // capturé sur cet appareil (IndexedDB)
}

export interface Contact {
  id: string;
  user_id: string;
  folder_id: string | null;
  role: Role;
  name: string;
  detail: string; // ex. "Traiteur — Maison Lefèvre"
  avatar: string | null;
  scanned?: boolean; // a scanné le QR le jour J
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export interface BudgetItem {
  id: string;
  folder_id: string;
  category: string;
  vendor?: string;
  amount: number; // total prévu €
  paid: number; // déjà réglé €
}

export interface AgendaEvent {
  id: string;
  folder_id: string;
  title: string;
  date: string; // ISO
  type: 'jalon' | 'rdv' | 'jour-j';
  done: boolean;
}

export interface Task {
  id: string;
  folder_id: string;
  title: string;
  done: boolean;
  assigned_to: string; // nom libre ("Sophie", "Lucas", "Marie")
}

export interface PublicProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string | null;
  qr_code: string;
  universes: UniverseId[];
  capsules_count: number;
  city: string;
  joined: string;
}
