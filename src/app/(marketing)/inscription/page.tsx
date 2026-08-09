import type { Metadata } from 'next';
import { Onboarding } from '@/components/onboarding/Onboarding';

export const metadata: Metadata = {
  title: 'Inscription — Créer son identité',
  description:
    'Créez votre compte ETERNITY : identité, univers, QR personnel AIME. Une minute, et votre première capsule vous attend.',
};

export default function InscriptionPage({
  searchParams,
}: {
  searchParams: { mode?: string };
}) {
  return (
    <main className="container-site py-14 md:py-20">
      <Onboarding initialMode={searchParams.mode === 'login' ? 'login' : 'signup'} />
    </main>
  );
}
