import type { Metadata } from 'next';
import { QRHub } from '@/components/app/QRHub';

export const metadata: Metadata = { title: 'QR' };

export default function QRPage() {
  return <QRHub />;
}
