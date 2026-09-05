'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, MapPin, Clock, Calendar, User, Scissors,
  CreditCard, Check, X, AlertCircle, Hourglass,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { StatusBadge } from '@/components/common/status-badge';
import { useAppointment } from '@/lib/store/use-store-data';
import { cancelAppointment } from '@/services/booking-service';
import { formatTime, formatDateLabel } from '@/lib/availability/availability-engine';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { BookingTimelineEvent } from '@/types';

const timelineIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  REQUESTED: Hourglass,
  SUGGESTED: AlertCircle,
  CONFIRMED: Check,
  COMPLETED: Check,
  CANCELLED: X,
  REJECTED: X,
  EXPIRED: X,
  NO_SHOW: X,
  PENDING: Hourglass,
};

const timelineLabels: Record<string, string> = {
  REQUESTED: 'Requested',
  SUGGESTED: 'Suggested',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  NO_SHOW: 'No Show',
  PENDING: 'Pending',
};

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const appointment = useAppointment(id);
  const [cancelOpen, setCancelOpen] = useState(false);
  if (!appointment) notFound();

  const serviceNames = appointment.services.map((s) => s.serviceName).join(' + ');
  const canCancel = ['PENDING', 'CONFIRMED'].includes(appointment.status);
  const canReschedule = appointment.status === 'CONFIRMED';

  const handleCancel = () => {
    const result = cancelAppointment(appointment.id);
    setCancelOpen(false);
    if (result.ok) {
      toast.success('Appointment cancelled.');
    } else {
      toast.error('This appointment can no longer be cancelled.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen pb-24 md:pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/bookings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Bookings
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-surface-elevated shrink-0">
                <Image src={appointment.businessImageUrl} alt={appointment.businessName} fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">{appointment.businessName}</h1>
                <p className="text-sm text-muted-foreground">{serviceNames}</p>
              </div>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <section className="rounded-card border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Appointment details</h2>
                <div className="space-y-3">
                  <DetailRow icon={Calendar} label="Date" value={formatDateLabel(appointment.date)} />
                  <DetailRow icon={Clock} label="Time" value={`${formatTime(appointment.startTime)} – ${formatTime(appointment.endTime)}`} />
                  <DetailRow icon={User} label="Barber" value={appointment.staffName} />
                  <DetailRow icon={Scissors} label="Services" value={serviceNames} />
                  <DetailRow icon={Clock} label="Duration" value={`${appointment.totalDurationMinutes} min`} />
                  <DetailRow icon={CreditCard} label="Payment" value="Pay at Shop" />
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-foreground">₹{appointment.totalPrice}</span>
                </div>
              </section>

              {/* Services breakdown */}
              <section className="rounded-card border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Services</h2>
                <div className="space-y-3">
                  {appointment.services.map((s) => (
                    <div key={s.serviceId} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground">{s.serviceName}</p>
                        <p className="text-xs text-muted-foreground">{s.durationMinutes} min</p>
                      </div>
                      <span className="font-medium text-foreground">₹{s.price}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Timeline */}
              <section className="rounded-card border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Timeline</h2>
                <div className="space-y-4">
                  {appointment.timeline.map((event: BookingTimelineEvent, i: number) => {
                    const Icon = timelineIcons[event.status] || Hourglass;
                    const isLast = i === appointment.timeline.length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          {!isLast && <div className="w-px h-8 bg-border mt-1" />}
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-medium text-foreground">{timelineLabels[event.status] || event.status}</p>
                          {event.note && <p className="text-xs text-muted-foreground mt-0.5">{event.note}</p>}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(event.timestamp).toLocaleString('en-US', {
                              month: 'short', day: 'numeric',
                              hour: 'numeric', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-[88px] space-y-4">
                <div className="rounded-card border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Actions</h3>
                  <div className="space-y-2">
                    {canCancel && (
                      <Button
                        variant="secondary"
                        className="w-full h-11 text-destructive hover:text-destructive"
                        onClick={() => setCancelOpen(true)}
                      >
                        Cancel Appointment
                      </Button>
                    )}
                    {canReschedule && (
                      <Button variant="secondary" className="w-full h-11" asChild>
                        <Link href={`/booking?shop=${appointment.businessId}`}>Book a New Time</Link>
                      </Button>
                    )}
                    {!canCancel && !canReschedule && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No actions available for this booking.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-card border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3 text-sm">Booking ID</h3>
                  <p className="text-xs text-muted-foreground font-mono">{appointment.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="bg-surface-elevated border-border-strong">
          <DialogHeader>
            <DialogTitle>Cancel this appointment?</DialogTitle>
            <DialogDescription>
              This will free up the slot for other customers. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>Keep Appointment</Button>
            <Button variant="destructive" onClick={handleCancel}>Cancel Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </div>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
