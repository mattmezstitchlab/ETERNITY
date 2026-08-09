import type { Metadata } from 'next';
import { CapsuleView } from '@/components/app/CapsuleView';

export const metadata: Metadata = { title: 'Capsule' };

export default function CapsulePage() {
  return <CapsuleView />;
}
