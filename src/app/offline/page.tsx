import type { Metadata } from 'next';
import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = { title: 'Pas de connexion' };

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-ink px-6 text-center">
      <Logo />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card">
        <WifiOff className="text-gold" size={26} strokeWidth={1.5} />
      </div>
      <div>
        <h1 className="text-3xl font-light">Pas de connexion</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">
          Vos capsules vous attendent. Vérifiez votre connexion — les clips capturés hors-ligne
          seront synchronisés automatiquement au prochain signal.
        </p>
      </div>
      <Link href="/" className="btn-outline">
        Réessayer
      </Link>
    </main>
  );
}
