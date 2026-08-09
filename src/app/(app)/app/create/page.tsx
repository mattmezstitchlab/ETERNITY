import type { Metadata } from 'next';
import { CreateFlow } from '@/components/app/CreateFlow';

export const metadata: Metadata = { title: 'Nouvelle capsule' };

export default function CreatePage() {
  return <CreateFlow />;
}
