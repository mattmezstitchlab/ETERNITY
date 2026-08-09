import type { Metadata } from 'next';
import { Compte } from '@/components/app/Compte';

export const metadata: Metadata = { title: 'Compte' };

export default function AppComptePage() {
  return <Compte />;
}
