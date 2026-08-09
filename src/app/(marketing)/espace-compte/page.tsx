import type { Metadata } from 'next';
import { Dashboard } from '@/components/dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Espace compte — Dashboard universel',
  description:
    'Budget, agenda, tâches, prestataires et capsule : tout l’administratif de votre événement dans un seul espace.',
};

export default function EspaceComptePage() {
  return (
    <main className="container-site py-12 md:py-16">
      <Dashboard />
    </main>
  );
}
