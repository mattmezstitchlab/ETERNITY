'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Capsules', href: '/creation-capsule' },
  { label: 'Registre', href: '/registre' },
  { label: 'Compte', href: '/espace-compte' },
  { label: 'Mini-site', href: '/mini-site' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'Doctrine', href: '/doctrine' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'glass py-3 shadow-[0_1px_0_rgba(255,255,255,0.05)]' : 'bg-transparent py-5',
        )}
      >
        <div className="container-site flex items-center justify-between">
          <Link href="/" aria-label="ETERNITY — accueil" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[13px] font-normal tracking-wide transition-colors',
                  pathname.startsWith(item.href) ? 'text-gold' : 'text-mist hover:text-white',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/inscription?mode=login" className="btn-ghost px-4 py-2 text-[13px]">
              Connexion
            </Link>
            <Link href="/inscription" className="btn-gold px-6 py-2.5 text-[13px]">
              Commencer
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-white lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/95 px-6 pb-10 pt-24 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'block border-b border-white/5 py-4 text-2xl font-light',
                      pathname.startsWith(item.href) ? 'text-gold' : 'text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <Link href="/inscription" className="btn-gold w-full">
                Commencer
              </Link>
              <Link href="/inscription?mode=login" className="btn-outline w-full">
                Connexion
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[68px]" aria-hidden />
    </>
  );
}
