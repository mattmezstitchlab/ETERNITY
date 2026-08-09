import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSession, deleteSession, getUserBySession } from './db';
import type { User } from '@/lib/types';

export const SESSION_COOKIE = 'eternity_session';

/** Pose le cookie de session (httpOnly, 30 j) après login/signup */
export function attachSessionCookie(response: NextResponse, userId: string): NextResponse {
  const { token, expiresAt } = createSession(userId);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
  return response;
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  const store = cookies();
  deleteSession(store.get(SESSION_COOKIE)?.value);
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}

/** Utilisateur courant d'après le cookie — null sinon */
export function currentUser(): User | null {
  const store = cookies();
  return getUserBySession(store.get(SESSION_COOKIE)?.value);
}
