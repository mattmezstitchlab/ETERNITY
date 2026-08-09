import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/server/auth';
import { getFullState } from '@/lib/server/db';

export const runtime = 'nodejs';

export async function GET() {
  const user = currentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  const state = getFullState(user.id);
  return NextResponse.json({ user, state });
}
