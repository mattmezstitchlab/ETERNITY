import { NextResponse } from 'next/server';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { addClip, getCapsuleByCode, getFullState, listClipsByCapsuleCode, UPLOADS_DIR } from '@/lib/server/db';
import { currentUser } from '@/lib/server/auth';
import { uid } from '@/lib/utils';

export const runtime = 'nodejs';

const MAX_BYTES = 40 * 1024 * 1024; // 40 Mo — large pour 10 s de mobile
const MIME_EXT: Record<string, string> = {
  'video/webm': 'webm',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/x-m4v': 'mp4',
  'video/3gpp': '3gp',
};

/** GET /api/clips?code=AIME-742-PLM — liste publique des clips d'une capsule */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code') ?? '';
  if (!getCapsuleByCode(code)) {
    return NextResponse.json({ error: 'Capsule inconnue.' }, { status: 404 });
  }
  return NextResponse.json({ clips: listClipsByCapsuleCode(code) });
}

/**
 * POST /api/clips — upload d'un clip (multipart)
 * champs : file (vidéo), caption, authorName, duration, code? (capsule invité)
 * Si connecté sans code → capsule de l'utilisateur.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Multipart invalide.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Fichier vidéo manquant.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Vidéo trop lourde (40 Mo max).' }, { status: 413 });
  }

  const code = String(form.get('code') ?? '');
  const user = currentUser();

  let capsule = code ? getCapsuleByCode(code) : null;
  if (!capsule && user) {
    const state = getFullState(user.id);
    capsule = state?.capsule ?? null;
  }
  if (!capsule) {
    return NextResponse.json({ error: 'Capsule introuvable pour ce code.' }, { status: 404 });
  }
  if (capsule.status === 'sealed') {
    return NextResponse.json({ error: 'Capsule scellée — plus aucun clip ne peut être ajouté.' }, { status: 410 });
  }

  const mime = file.type && MIME_EXT[file.type] ? file.type : 'video/webm';
  const ext = MIME_EXT[mime] ?? 'webm';
  const key = `${uid('vid')}.${ext}`;
  mkdirSync(UPLOADS_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(path.join(UPLOADS_DIR, key), buffer);

  const clip = addClip({
    capsuleId: capsule.id,
    authorName: String(form.get('authorName') || user?.name || 'Un invité').slice(0, 40),
    authorAvatar: user?.avatar ?? null,
    videoUrl: `/api/media/${key}`,
    caption: String(form.get('caption') ?? '').slice(0, 140),
    duration: Math.min(15, Math.max(1, parseInt(String(form.get('duration') ?? '10'), 10) || 10)),
  });

  return NextResponse.json({ clip }, { status: 201 });
}
