import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/server/auth';
import { getFullState, sealCapsule } from '@/lib/server/db';

export const runtime = 'nodejs';

/** POST /api/capsule/seal — scellement irréversible (propriétaire uniquement) */
export async function POST() {
  const user = currentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const state = getFullState(user.id);
  if (!state) return NextResponse.json({ error: 'Aucune capsule.' }, { status: 404 });
  const sealedAt = sealCapsule(state.capsule.id);
  return NextResponse.json({ sealed: true, sealed_at: sealedAt });
}
