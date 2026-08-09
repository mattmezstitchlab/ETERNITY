import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/server/auth';
import { addPaymentDb } from '@/lib/server/db';

export const runtime = 'nodejs';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = currentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { amount?: number };
  const item = addPaymentDb(params.id, Math.abs(Math.round(Number(body.amount) || 0)));
  if (!item) return NextResponse.json({ error: 'Poste introuvable.' }, { status: 404 });
  return NextResponse.json({ item });
}
