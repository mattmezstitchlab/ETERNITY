import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/server/auth';
import { addMessageDb } from '@/lib/server/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = currentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { receiverId?: string; content?: string };
  const content = (body.content ?? '').trim();
  const receiverId = (body.receiverId ?? '').trim();
  if (!content || !receiverId) return NextResponse.json({ error: 'Message incomplet.' }, { status: 400 });
  const message = addMessageDb(user.id, receiverId, content.slice(0, 2000));
  return NextResponse.json({ message }, { status: 201 });
}
