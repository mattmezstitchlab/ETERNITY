'use client';

import { BookOpenText, Home, MessagesSquare, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo, Wordmark } from '@/components/Logo';
import { PlusButton } from '@/components/ui-kit';
import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Souvenirs', icon: Home, href: '/app' },
  { label: 'Journal', icon: BookOpenText, href: '/app/journal' },
  { label: 'Capture', icon: null, href: '/app/capture' },
  { label: 'Registre', icon: Users, href: '/app/registre' },
  { label: 'Compte', icon: User, href: '/app/compte' },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCapture = pathname === '/app/capture';

  return (
    <div className="min-h-dvh bg-ink">
      {/* Rail latéral — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col items-center justify-between border-r border-white/5 py-6 lg:flex xl:w-60 xl:items-stretch xl:px-5">
        <Link href="/app" aria-label="ETERNITY — accueil app" className="flex items-center justify-center xl:justify-start">
          <span className="xl:hidden">
            <Logo />
          </span>
          <span className="hidden xl:block">
            <Wordmark />
          </span>
        </Link>

        <nav className="flex flex-col items-center gap-2 xl:items-stretch" aria-label="Navigation app">
          {TABS.map((t) => {
            const active = t.href === '/app' ? pathname === '/app' : pathname.startsWith(t.href);
            if (t.icon === null) {
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="mb-1 mt-3 flex justify-center xl:justify-start"
                  aria-label="Capturer un instant"
                >
                  <PlusButton size={44} />
                  <span className="sr-only">Capture</span>
                </Link>
              );
            }
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-4 rounded-full p-3 transition-colors xl:px-5',
                  active ? 'text-gold' : 'text-mist hover:text-white',
                )}
              >
                <Icon size={21} strokeWidth={active ? 2 : 1.6} />
                <span className={cn('hidden text-sm xl:block', active && 'font-medium')}>{t.label}</span>
              </Link>
            );
          })}
          <Link
            href="/app/messagerie"
            className={cn(
              'flex items-center gap-4 rounded-full p-3 transition-colors xl:px-5',
              pathname.startsWith('/app/messagerie') ? 'text-gold' : 'text-mist hover:text-white',
            )}
          >
            <MessagesSquare size={21} strokeWidth={1.6} />
            <span className="hidden text-sm xl:block">Messagerie</span>
          </Link>
        </nav>

        <Link href="/" className="text-center text-[10px] leading-relaxed text-mist/60 xl:text-left">
          eternity.video
          <span className="hidden xl:block">by Aime</span>
        </Link>
      </aside>

      {/* Contenu */}
      <div className="pb-20 lg:pb-0 lg:pl-16 xl:pl-60">{children}</div>

      {/* Tab bar — mobile (layout type TikTok/Instagram) */}
      <nav
        aria-label="Navigation principale mobile"
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 lg:hidden',
          isCapture ? 'bg-black/60 backdrop-blur-none' : 'glass border-t border-white/5',
        )}
      >
        <div className="safe-bottom grid grid-cols-5 items-end px-2 pb-1.5 pt-1.5">
          {TABS.map((t) => {
            const active = t.href === '/app' ? pathname === '/app' : pathname.startsWith(t.href);
            if (t.icon === null) {
              return (
                <Link key={t.href} href={t.href} aria-label="Capturer un instant" className="-mt-5 flex justify-center">
                  <PlusButton size={52} />
                </Link>
              );
            }
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-1.5 transition-colors',
                  active ? 'text-gold' : 'text-mist',
                )}
              >
                <Icon size={22} strokeWidth={active ? 2 : 1.5} />
                <span className="text-[9px] tracking-wide">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
