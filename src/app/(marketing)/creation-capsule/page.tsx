import type { Metadata } from 'next';
import { CapsuleWizard } from '@/components/capsule/CapsuleWizard';

export const metadata: Metadata = {
  title: 'Création de capsule — 8 étapes',
  description:
    'Le parcours capsule en 8 étapes : univers, nom, date, QR, consignes, montage IA, mini-site et scellement.',
};

export default function CreationCapsulePage() {
  return (
    <main className="container-site py-14 md:py-20">
      <CapsuleWizard />
    </main>
  );
}
