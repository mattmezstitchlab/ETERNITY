import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/server/auth';
import { addBudgetItemDb, getFullState } from '@/lib/server/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = currentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const state = getFullState(user.id);
  if (!state) return NextResponse.json({ error: 'Aucun dossier.' }, { status: 404 });
  const body = (await request.json().catch(() => ({}))) as { category?: string; amount?: number };
  const category = (body.category ?? '').trim();
  const amount = Math.abs(Math.round(Number(body.amount) || 0));
  if (!category || amount <= 0) return NextResponse.json({ error: 'Poste ou montant invalide.' }, { status: 400 });
  const item = addBudgetItemDb(state.folder.id, category, amount);
  return NextResponse.json({ item }, { status: 201 });
}
