import { NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { Readable } from 'node:stream';
import path from 'node:path';
import { UPLOADS_DIR } from '@/lib/server/db';

export const runtime = 'nodejs';

const MIME: Record<string, string> = {
  webm: 'video/webm',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  '3gp': 'video/3gpp',
};

/** GET /api/media/<fichier> — streaming vidéo avec support Range (requis par iOS) */
export async function GET(request: Request, { params }: { params: { key: string } }) {
  // Sécurité : clé = nom de fichier uniquement (anti path traversal)
  const key = path.basename(params.key);
  const filePath = path.join(UPLOADS_DIR, key);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'Média introuvable.' }, { status: 404 });
  }

  const ext = key.split('.').pop() ?? 'webm';
  const contentType = MIME[ext] ?? 'application/octet-stream';
  const size = statSync(filePath).size;
  const range = request.headers.get('range');

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    let start = match?.[1] ? parseInt(match[1], 10) : 0;
    let end = match?.[2] ? parseInt(match[2], 10) : size - 1;
    if (Number.isNaN(start)) start = 0;
    if (Number.isNaN(end) || end >= size) end = size - 1;
    if (start > end) {
      return new NextResponse(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    }
    const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;
    return new NextResponse(stream, {
      status: 206,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(end - start + 1),
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  }

  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(size),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
