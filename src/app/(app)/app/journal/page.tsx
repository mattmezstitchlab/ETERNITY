import type { Metadata } from 'next';
import { Journal } from '@/components/app/Journal';

export const metadata: Metadata = { title: 'Journal' };

export default function JournalPage() {
  return <Journal />;
}
