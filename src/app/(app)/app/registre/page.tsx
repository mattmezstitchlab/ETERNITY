import type { Metadata } from 'next';
import { RegistreMobile } from '@/components/app/RegistreMobile';

export const metadata: Metadata = { title: 'Registre' };

export default function AppRegistrePage() {
  return <RegistreMobile />;
}
