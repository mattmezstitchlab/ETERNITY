import type { Metadata } from 'next';
import { MiniSite } from '@/components/minisite/MiniSite';

export const metadata: Metadata = {
  title: 'Mini-site — Mariage de Sophie & Lucas',
  description:
    'Le mini-site public du mariage de Sophie & Lucas : programme, lieu, capsule de clips et livre d’or. Scellé pour toujours.',
};

export default function MiniSitePage() {
  return <MiniSite />;
}
