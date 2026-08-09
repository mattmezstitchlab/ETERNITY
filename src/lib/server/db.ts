import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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
} from '@/lib/data';
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
} from '@/lib/types';
import { generateAimeCode, uid } from '@/lib/utils';

/**
 * SQLite embarquée (node:sqlite, Node ≥ 22) — zéro dépendance native tiers.
 * Miroir 1:1 des tables de la spec Supabase. Remplaçable par Supabase en prod
 * en réécrivant uniquement ce fichier.
 */

export const DATA_DIR = process.env.ETERNITY_DATA_DIR || path.join(process.cwd(), 'data');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

declare global {
  // eslint-disable-next-line no-var
  var __eternityDb: DatabaseSync | undefined;
}

function init(): DatabaseSync {
  mkdirSync(UPLOADS_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, 'eternity.db'));
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      avatar TEXT, qr_code TEXT UNIQUE, bio TEXT DEFAULT '', password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, user_id TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, type TEXT NOT NULL,
      name TEXT NOT NULL, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS capsules (
      id TEXT PRIMARY KEY, folder_id TEXT NOT NULL, name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL, status TEXT NOT NULL DEFAULT 'collecting',
      consigne TEXT DEFAULT '', sealed_at TEXT, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS clips (
      id TEXT PRIMARY KEY, capsule_id TEXT NOT NULL, author_name TEXT NOT NULL,
      author_avatar TEXT, video_url TEXT, poster TEXT, caption TEXT DEFAULT '',
      duration INTEGER DEFAULT 10, likes INTEGER DEFAULT 0, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL, folder_id TEXT,
      role TEXT NOT NULL, name TEXT NOT NULL, detail TEXT DEFAULT '', avatar TEXT
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, sender_id TEXT NOT NULL, receiver_id TEXT NOT NULL,
      content TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS budget_items (
      id TEXT PRIMARY KEY, folder_id TEXT NOT NULL, category TEXT NOT NULL,
      vendor TEXT, amount INTEGER NOT NULL DEFAULT 0, paid INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS agenda_events (
      id TEXT PRIMARY KEY, folder_id TEXT NOT NULL, title TEXT NOT NULL,
      date TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'jalon', done INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY, folder_id TEXT NOT NULL, title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0, assigned_to TEXT DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_clips_capsule ON clips(capsule_id);
    CREATE INDEX IF NOT EXISTS idx_messages_pair ON messages(sender_id, receiver_id);
  `);
  return db;
}

export function db(): DatabaseSync {
  if (!global.__eternityDb) {
    global.__eternityDb = init();
    seedDemo(global.__eternityDb);
  }
  return global.__eternityDb;
}

/* ---------------- Seed du compte démo ---------------- */
const DEMO_PASSWORD = 'eternity742';

function seedDemo(d: DatabaseSync) {
  const exists = d.prepare('SELECT id FROM users WHERE id = ?').get(SEED_USER.id);
  if (exists) return;

  const now = new Date().toISOString();
  d.prepare(
    'INSERT INTO users (id, email, name, avatar, qr_code, bio, password_hash, created_at) VALUES (?,?,?,?,?,?,?,?)',
  ).run(
    SEED_USER.id,
    SEED_USER.email,
    SEED_USER.name,
    SEED_USER.avatar,
    SEED_USER.qr_code,
    SEED_USER.bio,
    hashPassword(DEMO_PASSWORD),
    now,
  );
  d.prepare('INSERT INTO folders (id, user_id, type, name, metadata, created_at) VALUES (?,?,?,?,?,?)').run(
    SEED_FOLDER.id,
    SEED_FOLDER.user_id,
    SEED_FOLDER.type,
    SEED_FOLDER.name,
    JSON.stringify(SEED_FOLDER.metadata),
    SEED_FOLDER.created_at,
  );
  d.prepare(
    'INSERT INTO capsules (id, folder_id, name, code, status, consigne, sealed_at, created_at) VALUES (?,?,?,?,?,?,?,?)',
  ).run(
    SEED_CAPSULE.id,
    SEED_CAPSULE.folder_id,
    SEED_CAPSULE.name,
    SEED_CAPSULE.code,
    'collecting',
    'Racontez votre meilleur souvenir avec nous.',
    null,
    now,
  );
  const insContact = d.prepare(
    'INSERT INTO contacts (id, user_id, folder_id, role, name, detail, avatar) VALUES (?,?,?,?,?,?,?)',
  );
  for (const c of SEED_CONTACTS) insContact.run(c.id, c.user_id, c.folder_id, c.role, c.name, c.detail, c.avatar);
  const insBudget = d.prepare(
    'INSERT INTO budget_items (id, folder_id, category, vendor, amount, paid) VALUES (?,?,?,?,?,?)',
  );
  for (const b of SEED_BUDGET) insBudget.run(b.id, b.folder_id, b.category, b.vendor ?? null, b.amount, b.paid);
  const insAgenda = d.prepare(
    'INSERT INTO agenda_events (id, folder_id, title, date, type, done) VALUES (?,?,?,?,?,?)',
  );
  for (const a of SEED_AGENDA) insAgenda.run(a.id, a.folder_id, a.title, a.date, a.type, a.done ? 1 : 0);
  const insTask = d.prepare('INSERT INTO tasks (id, folder_id, title, done, assigned_to) VALUES (?,?,?,?,?)');
  for (const t of SEED_TASKS) insTask.run(t.id, t.folder_id, t.title, t.done ? 1 : 0, t.assigned_to);
  const insMsg = d.prepare(
    'INSERT INTO messages (id, sender_id, receiver_id, content, created_at) VALUES (?,?,?,?,?)',
  );
  for (const m of SEED_MESSAGES) insMsg.run(m.id, m.sender_id, m.receiver_id, m.content, m.created_at);
  const insClip = d.prepare(
    'INSERT INTO clips (id, capsule_id, author_name, author_avatar, video_url, poster, caption, duration, likes, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
  );
  for (const c of SEED_CLIPS)
    insClip.run(c.id, c.capsule_id, c.author_name, c.author_avatar, null, c.poster, c.caption, c.duration, c.likes, c.created_at);
}

/* ---------------- Mots de passe (scrypt natif) ---------------- */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64);
  const ref = Buffer.from(hash, 'hex');
  return test.length === ref.length && crypto.timingSafeEqual(test, ref);
}

/* ---------------- Sessions ---------------- */
export function createSession(userId: string): { token: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000);
  db()
    .prepare('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?,?,?,?)')
    .run(hashed, userId, new Date().toISOString(), expiresAt.toISOString());
  return { token, expiresAt };
}

export function getUserBySession(token: string | undefined): User | null {
  if (!token) return null;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const row = db()
    .prepare('SELECT user_id, expires_at FROM sessions WHERE token = ?')
    .get(hashed) as { user_id: string; expires_at: string } | undefined;
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db().prepare('DELETE FROM sessions WHERE token = ?').run(hashed);
    return null;
  }
  return getUser(row.user_id);
}

export function deleteSession(token: string | undefined) {
  if (!token) return;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  db().prepare('DELETE FROM sessions WHERE token = ?').run(hashed);
}

/* ---------------- Row mappers ---------------- */
interface Row {
  [key: string]: string | number | null;
}

function mapUser(r: Row): User {
  return {
    id: String(r.id),
    email: String(r.email),
    name: String(r.name),
    avatar: r.avatar ? String(r.avatar) : null,
    qr_code: String(r.qr_code),
    bio: String(r.bio ?? ''),
    universes: ['mariage'],
    created_at: String(r.created_at),
  };
}

function mapFolder(r: Row): Folder {
  return {
    id: String(r.id),
    user_id: String(r.user_id),
    type: String(r.type) as Folder['type'],
    name: String(r.name),
    metadata: JSON.parse(String(r.metadata ?? '{}')),
    created_at: String(r.created_at),
  };
}

function mapCapsule(r: Row): Capsule & { consigne: string } {
  return {
    id: String(r.id),
    folder_id: String(r.folder_id),
    name: String(r.name),
    code: String(r.code),
    status: String(r.status) as Capsule['status'],
    consigne: String(r.consigne ?? ''),
    sealed_at: r.sealed_at ? String(r.sealed_at) : null,
    created_at: String(r.created_at),
  };
}

function mapClip(r: Row): Clip {
  return {
    id: String(r.id),
    capsule_id: String(r.capsule_id),
    user_id: String(r.user_id ?? 'guest'),
    author_name: String(r.author_name),
    author_avatar: r.author_avatar ? String(r.author_avatar) : null,
    video_url: r.video_url ? String(r.video_url) : null,
    poster: r.poster ? String(r.poster) : null,
    caption: String(r.caption ?? ''),
    duration: Number(r.duration ?? 10),
    likes: Number(r.likes ?? 0),
    created_at: String(r.created_at),
  };
}

/* ---------------- Users ---------------- */
export function getUser(id: string): User | null {
  const r = db().prepare('SELECT * FROM users WHERE id = ?').get(id) as Row | undefined;
  return r ? mapUser(r) : null;
}

export function getUserByEmail(email: string): (User & { password_hash: string }) | null {
  const r = db().prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as Row | undefined;
  return r ? { ...mapUser(r), password_hash: String(r.password_hash) } : null;
}

export function createUser(name: string, email: string, password: string): User {
  const id = uid('usr');
  const user: User = {
    id,
    email: email.toLowerCase(),
    name,
    avatar: null,
    qr_code: generateAimeCode(),
    bio: '',
    universes: ['mariage'],
    created_at: new Date().toISOString(),
  };
  db()
    .prepare(
      'INSERT INTO users (id, email, name, avatar, qr_code, bio, password_hash, created_at) VALUES (?,?,?,?,?,?,?,?)',
    )
    .run(user.id, user.email, user.name, null, user.qr_code, user.bio, hashPassword(password), user.created_at);
  bootstrapUserWedding(user);
  return user;
}

/** Dossier mariage + capsule + gabarits budget/agenda/tâches pour un nouveau compte */
function bootstrapUserWedding(user: User) {
  const firstName = user.name.split(' ')[0] || user.name;
  const eventDate = new Date(Date.now() + 310 * 24 * 3600 * 1000);
  const folder: Folder = {
    id: uid('fld'),
    user_id: user.id,
    type: 'mariage',
    name: `Mariage de ${firstName}`,
    metadata: { date: eventDate.toISOString(), lieu: '', guests: 0, currency: 'EUR' },
    created_at: new Date().toISOString(),
  };
  db()
    .prepare('INSERT INTO folders (id, user_id, type, name, metadata, created_at) VALUES (?,?,?,?,?,?)')
    .run(folder.id, folder.user_id, folder.type, folder.name, JSON.stringify(folder.metadata), folder.created_at);

  const capsule: Capsule = {
    id: uid('cap'),
    folder_id: folder.id,
    name: 'Notre Jour J',
    code: generateAimeCode(),
    status: 'collecting',
    sealed_at: null,
    created_at: new Date().toISOString(),
  };
  db()
    .prepare(
      'INSERT INTO capsules (id, folder_id, name, code, status, consigne, sealed_at, created_at) VALUES (?,?,?,?,?,?,?,?)',
    )
    .run(capsule.id, capsule.folder_id, capsule.name, capsule.code, 'collecting', 'Racontez votre meilleur souvenir avec nous.', null, capsule.created_at);

  const budget: Array<[string, number]> = [
    ['Lieu de réception', 6000],
    ['Traiteur', 8000],
    ['Photo & capsule', 2000],
    ['Musique / DJ', 1200],
  ];
  const insB = db().prepare('INSERT INTO budget_items (id, folder_id, category, vendor, amount, paid) VALUES (?,?,?,?,?,0)');
  for (const [cat, amount] of budget) insB.run(uid('bg'), folder.id, cat, null, amount);

  const agenda: Array<[string, number, AgendaEvent['type']]> = [
    ['Réserver le lieu', 30, 'jalon'],
    ['Envoyer les faire-part', Math.round(310 * 0.45), 'jalon'],
    ['Confirmer les invités (RSVP)', Math.round(310 * 0.85), 'jalon'],
    ['Jour J', 310, 'jour-j'],
  ];
  const insA = db().prepare('INSERT INTO agenda_events (id, folder_id, title, date, type, done) VALUES (?,?,?,?,?,0)');
  for (const [title, offsetDays, type] of agenda)
    insA.run(uid('ag'), folder.id, title, new Date(Date.now() + offsetDays * 24 * 3600 * 1000).toISOString(), type);

  const tasks = ['Choisir la tonalité du film', 'Imprimer le QR pour les tables', 'Prévenir les témoins'];
  const insT = db().prepare('INSERT INTO tasks (id, folder_id, title, done, assigned_to) VALUES (?,?,?,0,?)');
  for (const t of tasks) insT.run(uid('tk'), folder.id, t, firstName);
}

/* ---------------- State complet d'un utilisateur ---------------- */
export interface FullState {
  user: User;
  folder: Folder;
  capsule: Capsule & { consigne: string };
  clips: Clip[];
  contacts: Contact[];
  budget: BudgetItem[];
  agenda: AgendaEvent[];
  tasks: Task[];
  messages: Message[];
}

export function getFullState(userId: string): FullState | null {
  const user = getUser(userId);
  if (!user) return null;
  const fr = db().prepare('SELECT * FROM folders WHERE user_id = ? ORDER BY created_at LIMIT 1').get(userId) as Row | undefined;
  if (!fr) return null;
  const folder = mapFolder(fr);
  const cr = db().prepare('SELECT * FROM capsules WHERE folder_id = ? ORDER BY created_at LIMIT 1').get(folder.id) as Row | undefined;
  if (!cr) return null;
  const capsule = mapCapsule(cr);

  const clips = (db().prepare('SELECT * FROM clips WHERE capsule_id = ? ORDER BY created_at DESC').all(capsule.id) as Row[]).map(mapClip);
  const contacts = (db().prepare('SELECT * FROM contacts WHERE user_id = ?').all(userId) as Row[]).map((r) => ({
    id: String(r.id),
    user_id: String(r.user_id),
    folder_id: r.folder_id ? String(r.folder_id) : null,
    role: String(r.role) as Contact['role'],
    name: String(r.name),
    detail: String(r.detail ?? ''),
    avatar: r.avatar ? String(r.avatar) : null,
  }));
  const budget = (db().prepare('SELECT * FROM budget_items WHERE folder_id = ?').all(folder.id) as Row[]).map((r) => ({
    id: String(r.id),
    folder_id: String(r.folder_id),
    category: String(r.category),
    vendor: r.vendor ? String(r.vendor) : undefined,
    amount: Number(r.amount),
    paid: Number(r.paid),
  }));
  const agenda = (db().prepare('SELECT * FROM agenda_events WHERE folder_id = ? ORDER BY date').all(folder.id) as Row[]).map((r) => ({
    id: String(r.id),
    folder_id: String(r.folder_id),
    title: String(r.title),
    date: String(r.date),
    type: String(r.type) as AgendaEvent['type'],
    done: Number(r.done) === 1,
  }));
  const tasks = (db().prepare('SELECT * FROM tasks WHERE folder_id = ?').all(folder.id) as Row[]).map((r) => ({
    id: String(r.id),
    folder_id: String(r.folder_id),
    title: String(r.title),
    done: Number(r.done) === 1,
    assigned_to: String(r.assigned_to ?? ''),
  }));
  const messages = (
    db()
      .prepare('SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at')
      .all(userId, userId) as Row[]
  ).map((r) => ({
    id: String(r.id),
    sender_id: String(r.sender_id),
    receiver_id: String(r.receiver_id),
    content: String(r.content),
    created_at: String(r.created_at),
  }));

  return { user, folder, capsule, clips, contacts, budget, agenda, tasks, messages };
}

/* ---------------- Capsule publique (page invitée) ---------------- */
export interface PublicCapsuleInfo {
  found: boolean;
  code: string;
  couple: string;
  dateIso: string | null;
  lieu: string | null;
  capsuleName: string;
  consigne: string;
  clipsCount: number;
  sealed: boolean;
}

export function getPublicCapsule(code: string): PublicCapsuleInfo {
  const r = db().prepare('SELECT * FROM capsules WHERE code = ?').get(code) as Row | undefined;
  if (!r) {
    return { found: false, code, couple: '', dateIso: null, lieu: null, capsuleName: '', consigne: '', clipsCount: 0, sealed: false };
  }
  const capsule = mapCapsule(r);
  const fr = db().prepare('SELECT * FROM folders WHERE id = ?').get(capsule.folder_id) as Row | undefined;
  const folder = fr ? mapFolder(fr) : null;
  const count = db().prepare('SELECT COUNT(*) AS n FROM clips WHERE capsule_id = ?').get(capsule.id) as { n: number };
  return {
    found: true,
    code: capsule.code,
    couple: folder ? folder.name.replace(/^Mariage de\s*/i, '') || folder.name : 'Événement ETERNITY',
    dateIso: (folder?.metadata.date as string) ?? null,
    lieu: (folder?.metadata.lieu as string) || null,
    capsuleName: capsule.name,
    consigne: capsule.consigne || 'Dix secondes pour dire l’essentiel.',
    clipsCount: Number(count.n),
    sealed: capsule.status === 'sealed',
  };
}

export function getCapsuleByCode(code: string): (Capsule & { consigne: string }) | null {
  const r = db().prepare('SELECT * FROM capsules WHERE code = ?').get(code) as Row | undefined;
  return r ? mapCapsule(r) : null;
}

/* ---------------- Mutations ---------------- */
export function addClip(input: {
  capsuleId: string;
  authorName: string;
  authorAvatar?: string | null;
  videoUrl: string | null;
  caption: string;
  duration: number;
}): Clip {
  const clip: Clip = {
    id: uid('cl'),
    capsule_id: input.capsuleId,
    user_id: 'guest',
    author_name: input.authorName,
    author_avatar: input.authorAvatar ?? null,
    video_url: input.videoUrl,
    poster: null,
    caption: input.caption,
    duration: input.duration,
    likes: 0,
    created_at: new Date().toISOString(),
  };
  db()
    .prepare(
      'INSERT INTO clips (id, capsule_id, author_name, author_avatar, video_url, poster, caption, duration, likes, created_at) VALUES (?,?,?,?,?,NULL,?,?,0,?)',
    )
    .run(clip.id, clip.capsule_id, clip.author_name, clip.author_avatar, clip.video_url, clip.caption, clip.duration, clip.created_at);
  return clip;
}

export function likeClip(id: string): number {
  db().prepare('UPDATE clips SET likes = likes + 1 WHERE id = ?').run(id);
  const r = db().prepare('SELECT likes FROM clips WHERE id = ?').get(id) as { likes: number } | undefined;
  return r?.likes ?? 0;
}

export function listClipsByCapsuleCode(code: string): Clip[] {
  const capsule = getCapsuleByCode(code);
  if (!capsule) return [];
  return (db().prepare('SELECT * FROM clips WHERE capsule_id = ? ORDER BY created_at DESC').all(capsule.id) as Row[]).map(mapClip);
}

export function sealCapsule(id: string): string | null {
  const sealedAt = new Date().toISOString();
  db().prepare("UPDATE capsules SET status = 'sealed', sealed_at = ? WHERE id = ? AND status != 'sealed'").run(sealedAt, id);
  const r = db().prepare('SELECT sealed_at FROM capsules WHERE id = ?').get(id) as { sealed_at: string | null } | undefined;
  return r?.sealed_at ?? null;
}

export function addTaskDb(folderId: string, title: string, assignedTo: string): Task {
  const task: Task = { id: uid('tk'), folder_id: folderId, title, done: false, assigned_to: assignedTo };
  db().prepare('INSERT INTO tasks (id, folder_id, title, done, assigned_to) VALUES (?,?,?,0,?)').run(task.id, folderId, title, assignedTo);
  return task;
}

export function toggleTaskDb(id: string): boolean {
  db().prepare('UPDATE tasks SET done = 1 - done WHERE id = ?').run(id);
  const r = db().prepare('SELECT done FROM tasks WHERE id = ?').get(id) as { done: number } | undefined;
  return r ? Number(r.done) === 1 : false;
}

export function addBudgetItemDb(folderId: string, category: string, amount: number): BudgetItem {
  const item: BudgetItem = { id: uid('bg'), folder_id: folderId, category, amount, paid: 0 };
  db().prepare('INSERT INTO budget_items (id, folder_id, category, vendor, amount, paid) VALUES (?,?,?,NULL,?,0)').run(item.id, folderId, category, amount);
  return item;
}

export function addPaymentDb(id: string, amount: number): BudgetItem | null {
  db().prepare('UPDATE budget_items SET paid = MIN(amount, paid + ?) WHERE id = ?').run(Math.abs(amount), id);
  const r = db().prepare('SELECT * FROM budget_items WHERE id = ?').get(id) as Row | undefined;
  return r
    ? { id: String(r.id), folder_id: String(r.folder_id), category: String(r.category), vendor: r.vendor ? String(r.vendor) : undefined, amount: Number(r.amount), paid: Number(r.paid) }
    : null;
}

export function addMessageDb(senderId: string, receiverId: string, content: string): Message {
  const msg: Message = { id: uid('ms'), sender_id: senderId, receiver_id: receiverId, content, created_at: new Date().toISOString() };
  db().prepare('INSERT INTO messages (id, sender_id, receiver_id, content, created_at) VALUES (?,?,?,?,?)').run(msg.id, senderId, receiverId, content, msg.created_at);
  return msg;
}
