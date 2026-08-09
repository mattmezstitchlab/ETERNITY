import { NextResponse } from 'next/server';
import { likeClip } from '@/lib/server/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { id?: string };
  if (!body.id) return NextResponse.json({ error: 'id manquant.' }, { status: 400 });
  const likes = likeClip(body.id);
  return NextResponse.json({ likes });
}
