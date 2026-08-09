import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/server/auth';
import { addTaskDb, getFullState } from '@/lib/server/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = currentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const state = getFullState(user.id);
  if (!state) return NextResponse.json({ error: 'Aucun dossier.' }, { status: 404 });
  const body = (await request.json().catch(() => ({}))) as { title?: string; assigned_to?: string };
  const title = (body.title ?? '').trim();
  if (!title) return NextResponse.json({ error: 'Titre manquant.' }, { status: 400 });
  const task = addTaskDb(state.folder.id, title, body.assigned_to || user.name.split(' ')[0]);
  return NextResponse.json({ task }, { status: 201 });
}
