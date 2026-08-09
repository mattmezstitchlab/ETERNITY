import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/server/auth';
import { toggleTaskDb } from '@/lib/server/db';

export const runtime = 'nodejs';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = currentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const done = toggleTaskDb(params.id);
  return NextResponse.json({ done });
}
