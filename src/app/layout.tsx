import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { EternityProvider } from '@/lib/store';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import './globals.css';

// Inter variable (self-hosted — latin + latin-ext) — 300→600 via font-weight CSS
const inter = localFont({
  src: [
    { path: '../fonts/inter-latin-wght-normal.woff2', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eternity.video'),
  title: {
    default: 'ETERNITY by Aime — Vos instants, scellés pour toujours',
    template: '%s · ETERNITY by Aime',
  },
  description:
    'ETERNITY est l’OS administratif personnel universel déguisé en app de capsules temporelles. Premier univers : le mariage. Un QR, dix secondes par invité, un film pour toujours.',
  applicationName: 'ETERNITY by Aime',
  appleWebApp: {
    capable: true,
    title: 'ETERNITY',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
  openGraph: {
    siteName: 'ETERNITY by Aime',
    type: 'website',
    locale: 'fr_FR',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-dvh bg-ink font-sans text-white">
        <EternityProvider>{children}</EternityProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
