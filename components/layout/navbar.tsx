'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-navbar h-[72px] border-b transition-all duration-200',
          scrolled
            ? 'glass border-border-strong'
            : 'border-transparent bg-transparent'
        )}
      >
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
              <Scissors className="h-4 w-4 text-background" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              APNA BARBER
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-brand-gradient text-background hover:opacity-90">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>

          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-foreground"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-mobileNav bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-mobileNav h-full w-full max-w-sm bg-surface-elevated border-l border-border md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-[72px] px-4 border-b border-border">
                <span className="font-display text-lg font-bold text-foreground">Menu</span>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-1">
                  {siteConfig.nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                        pathname === item.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-surface-hover'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <Button variant="secondary" asChild className="w-full h-12">
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full h-12 bg-brand-gradient text-background">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
