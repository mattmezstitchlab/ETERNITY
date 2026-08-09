'use client';

import { useEffect, useRef, useState } from 'react';
import { idbGet, isIdbAvailable } from '@/lib/idb';
import type { Clip } from '@/lib/types';

/**
 * Affiche le média d'un clip :
 * - clip local (capturé) : blob vidéo depuis IndexedDB
 * - clip seed : poster image + overlay play
 */
export function LocalClipMedia({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!clip.local || !clip.video_url || !isIdbAvailable()) return;
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
  }, [clip.local, clip.video_url]);

  if (clip.local && objectUrl) {
    return (
      <video
        ref={videoRef}
        src={objectUrl}
        className="h-full w-full object-cover"
        controls
        playsInline
        preload="metadata"
        muted={false}
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
