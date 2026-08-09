import type { Metadata, Viewport } from 'next';
import { GuestExperience } from '@/components/guest/GuestExperience';

export const metadata: Metadata = {
  title: 'Rejoignez la capsule — 10 secondes, pour toujours',
  description:
    'Un QR, dix secondes de vous, un film pour toujours. Pas d’app à installer, pas de compte : juste vous.',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function GuestCapsulePage({ params }: { params: { code: string } }) {
  return <GuestExperience code={decodeURIComponent(params.code)} />;
}
