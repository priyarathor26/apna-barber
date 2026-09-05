'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Scissors, ArrowLeft, Star, Users } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { useBusiness } from '@/lib/store/use-store-data';
import { getReviewsByBusinessId } from '@/services/review-service';
import { formatTime } from '@/lib/availability/availability-engine';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const business = useBusiness(id);
  if (!business) notFound();
  const reviews = getReviewsByBusinessId(id);
  const activeServices = business.services.filter((s) => s.active);

  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen pb-24 md:pb-0">
        {/* Back link */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </div>

        {/* Hero image */}
        <div className="relative h-[240px] sm:h-[320px] md:h-[400px] overflow-hidden bg-surface-elevated">
          <Image
            src={business.imageUrl}
            alt={business.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative">
          {/* Business header */}
          <div className="rounded-card border border-border bg-card p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium border ${
                    business.openStatus === 'open'
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${business.openStatus === 'open' ? 'bg-success' : 'bg-muted-foreground'}`} />
                    {business.openStatus === 'open' ? 'Open Now' : 'Closed'}
                  </span>
                  {business.distanceKm != null && (
                    <span className="text-sm text-muted-foreground">{business.distanceKm} km away</span>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {business.name}
                </h1>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{business.address}, {business.city}</span>
                </div>
              </div>
              <div className="hidden md:block">
                <Button asChild size="lg" className="bg-brand-gradient text-background hover:opacity-90">
                  <Link href={`/booking?shop=${business.id}`}>Book Now</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <section className="rounded-card border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground text-lg mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{business.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {business.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-pill bg-surface-elevated border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              {/* Services */}
              <section className="rounded-card border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground text-lg mb-4">Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeServices.map((service) => (
                    <div key={service.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface p-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm mb-1">{service.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{service.description}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {service.durationMinutes} min
                        </div>
                      </div>
                      <span className="font-semibold text-foreground text-sm shrink-0">₹{service.price}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Barbers */}
              <section className="rounded-card border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground text-lg mb-4">Barbers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.staff.map((staff) => (
                    <div key={staff.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarFallback className="bg-surface-elevated text-primary font-semibold">
                          {staff.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm">{staff.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{staff.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Scissors className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{staff.serviceIds.length} services</span>
                        </div>
                      </div>
                      <span className={`h-2 w-2 rounded-full ${staff.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews */}
              <section className="rounded-card border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground text-lg mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews yet for this shop.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground text-sm">{review.customerName}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < review.rating ? 'text-warning fill-warning' : 'text-border'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-[88px] space-y-4">
                <div className="rounded-card border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Book an appointment</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Starting price</span>
                      <span className="font-semibold text-foreground">₹{business.startingPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Services</span>
                      <span className="font-semibold text-foreground">{activeServices.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Barbers</span>
                      <span className="font-semibold text-foreground">{business.staff.length}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full h-12 bg-brand-gradient text-background hover:opacity-90">
                    <Link href={`/booking?shop=${business.id}`}>Book Now</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Choose services and date — we find the earliest slot.
                  </p>
                </div>

                {/* Hours */}
                <div className="rounded-card border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Working Hours
                  </h3>
                  <div className="space-y-2">
                    {business.hours.map((h) => (
                      <div key={h.dayOfWeek} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][h.dayOfWeek]}
                        </span>
                        <span className="text-foreground text-right">
                          {h.isOpen
                            ? h.intervals.map((i) => `${formatTime(i.start)} – ${formatTime(i.end)}`).join(', ')
                            : 'Closed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-navbar md:hidden border-t border-border glass-strong safe-bottom">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-semibold text-foreground">₹{business.startingPrice}</p>
          </div>
          <Button asChild className="h-12 px-8 bg-brand-gradient text-background hover:opacity-90">
            <Link href={`/booking?shop=${business.id}`}>Book Now</Link>
          </Button>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
}
