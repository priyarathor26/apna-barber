'use client';

import { useState } from 'react';
import { CalendarClock, Search } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { BookingCard, BookingCardSkeleton } from '@/components/booking/booking-card';
import { EmptyState } from '@/components/common/empty-state';
import { useAppointments } from '@/lib/store/use-store-data';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CURRENT_CUSTOMER_ID = 'c1';

export default function BookingsPage() {
  const [loading] = useState(false);
  const myAppointments = useAppointments((a) => a.customerId === CURRENT_CUSTOMER_ID);

  const upcoming = myAppointments
    .filter((a) => ['PENDING', 'CONFIRMED'].includes(a.status))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const past = myAppointments
    .filter((a) => !['PENDING', 'CONFIRMED'].includes(a.status))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen pb-24 md:pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-h2 font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground mb-6">Track your appointments and their status.</p>

          <Tabs defaultValue="upcoming">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
              <TabsTrigger value="past" className="flex-1">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <BookingCardSkeleton key={i} />
                  ))}
                </div>
              ) : upcoming.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No upcoming bookings"
                  description="You don't have any upcoming appointments. Find a barber and book one."
                  action={
                    <Button asChild className="bg-brand-gradient text-background hover:opacity-90">
                      <Link href="/explore">Find a Barber</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {upcoming.map((appt) => (
                    <BookingCard key={appt.id} appointment={appt} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {past.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No past bookings"
                  description="Your booking history will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {past.map((appt) => (
                    <BookingCard key={appt.id} appointment={appt} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
