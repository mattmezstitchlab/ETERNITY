import type { Metadata } from 'next';
import { Feed } from '@/components/app/Feed';

export const metadata: Metadata = { title: 'Souvenirs' };

export default function AppHomePage() {
  return <Feed />;
}
