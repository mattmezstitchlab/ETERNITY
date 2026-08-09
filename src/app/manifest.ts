import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ETERNITY by Aime',
    short_name: 'ETERNITY',
    description:
      'Capsules temporelles et OS administratif personnel. Premier univers : le mariage.',
    id: '/',
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#0A0A0A',
    background_color: '#0A0A0A',
    lang: 'fr',
    categories: ['lifestyle', 'photo', 'video'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcuts: [
      {
        name: 'Capturer un instant',
        url: '/app/capture',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Scanner un QR',
        url: '/app/qr/AIME-742-PLM',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
