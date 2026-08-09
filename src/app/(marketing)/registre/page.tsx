import type { Metadata } from 'next';
import { RegistreExplorer } from '@/components/marketing/RegistreExplorer';

export const metadata: Metadata = {
  title: 'Registre — L’annuaire communautaire',
  description:
    'Mariés, témoins, prestataires, navigateurs et familles : le registre public des identités ETERNITY, un QR à la fois.',
};

export default function RegistrePage() {
  return (
    <main className="container-site py-14 md:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="kicker">Annuaire communautaire</p>
        <h1 className="mt-4 text-balance text-4xl font-light leading-[1.08] md:text-6xl">
          Le Registre
        </h1>
        <p className="mt-5 leading-relaxed text-mist">
          Chaque compte ETERNITY possède une identité publique et un QR. Scannez, découvrez,
          connectez — c’est ici que les capsules se croisent.
        </p>
      </header>
      <RegistreExplorer />
    </main>
  );
}
