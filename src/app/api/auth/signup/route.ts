import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, getFullState } from '@/lib/server/db';
import { attachSessionCookie } from '@/lib/server/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const password = body.password ?? '';

  if (name.length < 2) return NextResponse.json({ error: 'Votre nom est trop court.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: 'Mot de passe : 6 caractères minimum.' }, { status: 400 });
  if (getUserByEmail(email))
    return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });

  const user = createUser(name, email, password);
  const state = getFullState(user.id);
  const res = NextResponse.json({ user, state }, { status: 201 });
  return attachSessionCookie(res, user.id);
}
