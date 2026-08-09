import type { Metadata } from 'next';
import { PublicProfileView } from '@/components/profile/PublicProfileView';

export const metadata: Metadata = {
  title: 'Profil public — Identité & QR',
  description:
    'Votre identité publique ETERNITY : avatar, bio, univers et QR personnel AIME-XXX-XXX à partager.',
};

export default function ProfilPublicPage() {
  return (
    <main className="container-site py-14 md:py-20">
      <PublicProfileView />
    </main>
  );
}
