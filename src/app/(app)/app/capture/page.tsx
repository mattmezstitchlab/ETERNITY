import type { Metadata } from 'next';
import { Capture } from '@/components/app/Capture';

export const metadata: Metadata = { title: 'Capturer' };

export default function CapturePage() {
  return <Capture />;
}
