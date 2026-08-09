import { NextResponse } from 'next/server';
import { getPublicCapsule } from '@/lib/server/db';

export const runtime = 'nodejs';

/** GET /api/capsule/<code> — infos publiques pour la page invitée /c/:code */
export async function GET(_request: Request, { params }: { params: { code: string } }) {
  return NextResponse.json(getPublicCapsule(decodeURIComponent(params.code).toUpperCase()));
}
