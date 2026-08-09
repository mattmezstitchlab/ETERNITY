import type { Metadata } from 'next';
import { Messagerie } from '@/components/app/Messagerie';

export const metadata: Metadata = { title: 'Messagerie' };

export default function MessageriePage() {
  return <Messagerie />;
}
