'use client';

import { useEffect, useRef, useState } from 'react';
import { idbGet, isIdbAvailable } from '@/lib/idb';
import type { Clip } from '@/lib/types';

/**
 * Affiche le média d'un clip :
 * - vidéo serveur (video_url = /api/media/…) : lecture directe
 * - clip local (capturé hors-ligne) : blob vidéo depuis IndexedDB
 * - clip seed : poster image + overlay play
 */
export function LocalClipMedia({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const serverUrl = clip.video_url?.startsWith('/api/') ? clip.video_url : null;

  useEffect(() => {
    if (serverUrl || !clip.local || !clip.video_url || !isIdbAvailable()) return;
    let revoked: string | null = null;
    idbGet(clip.video_url)
      .then((blob) => {
        if (blob) {
          revoked = URL.createObjectURL(blob);
          setObjectUrl(revoked);
        }
      })
      .catch(() => undefined);
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [serverUrl, clip.local, clip.video_url]);

  if (serverUrl) {
    return (
      <video
        src={serverUrl}
        className="h-full w-full object-cover"
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  if (clip.poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={clip.poster} alt={clip.caption} className="h-full w-full object-cover" loading="lazy" />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-raise">
      <span className="text-xs text-mist">Clip synchronisé depuis l’appareil</span>
    </div>
  );
}
