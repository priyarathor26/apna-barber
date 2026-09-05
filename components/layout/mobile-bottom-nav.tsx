'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, CalendarClock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/bookings', label: 'Bookings', icon: CalendarClock },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on dashboard and auth pages
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-mobileNav md:hidden border-t border-border glass-strong safe-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[64px] min-h-[44px] transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
