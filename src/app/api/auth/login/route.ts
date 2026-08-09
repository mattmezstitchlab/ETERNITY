import { NextResponse } from 'next/server';
import { getUserByEmail, getFullState, verifyPassword } from '@/lib/server/db';
import { attachSessionCookie } from '@/lib/server/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const found = getUserByEmail(email);
  if (!found || !verifyPassword(body.password ?? '', found.password_hash)) {
    return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 });
  }

  const { password_hash: _ph, ...user } = found;
  const state = getFullState(user.id);
  const res = NextResponse.json({ user, state });
  return attachSessionCookie(res, user.id);
}
