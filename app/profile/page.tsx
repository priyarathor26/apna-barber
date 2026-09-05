'use client';

import { User, Heart, CalendarClock, Bell, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const sections = [
  { icon: User, label: 'Personal Information', href: '/profile' },
  { icon: Heart, label: 'Favorite Shops', href: '/profile' },
  { icon: CalendarClock, label: 'Booking History', href: '/bookings' },
  { icon: Bell, label: 'Notification Preferences', href: '/profile' },
  { icon: Settings, label: 'Account Settings', href: '/profile' },
];

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen pb-24 md:pb-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-h2 font-bold text-foreground mb-6">Profile</h1>

          {/* Profile header */}
          <div className="rounded-card border border-border bg-card p-6 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarFallback className="bg-surface-elevated text-primary text-xl font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground text-lg">John Doe</h2>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                <p className="text-xs text-muted-foreground mt-1">+91 98765 43210</p>
              </div>
              <Button variant="secondary" size="sm">Edit</Button>
            </div>
          </div>

          {/* Sections */}
          <div className="rounded-card border border-border bg-card overflow-hidden">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.label}
                  href={section.href}
                  className={`flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors ${
                    i < sections.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-foreground">{section.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="mt-6">
            <Button variant="secondary" className="w-full h-12 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
