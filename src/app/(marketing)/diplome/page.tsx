import type { Metadata } from 'next';
import { EventLanding } from '@/components/marketing/EventLanding';
import { getUniverse } from '@/lib/universes';

const universe = getUniverse('diplome');

export const metadata: Metadata = {
  title: `${universe.name} — ${universe.tagline}`,
  description: universe.description,
};

export default function Page() {
  return <EventLanding universe={universe} />;
}
