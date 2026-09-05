'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';
import type { Appointment } from '@/types';
import { StatusBadge } from '@/components/common/status-badge';
import { formatTime, formatDateLabel } from '@/lib/availability/availability-engine';
import { Button } from '@/components/ui/button';

export function BookingCard({ appointment }: { appointment: Appointment }) {
  const serviceNames = appointment.services.map((s) => s.serviceName).join(' + ');

  return (
    <div className="rounded-card border border-border bg-card overflow-hidden transition-colors hover:border-border-strong">
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-img bg-surface-elevate">
          <Image
            src={appointment.businessImageUrl}
            alt={appointment.businessName}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm line-clamp-1">
              {appointment.businessName}
            </h3>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{serviceNames}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDateLabel(appointment.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(appointment.startTime)}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              {appointment.staffName}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <span className="text-sm font-semibold text-foreground">₹{appointment.totalPrice}</span>
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary-hover">
          <Link href={`/bookings/${appointment.id}`}>
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="rounded-card border border-border bg-card p-4">
      <div className="flex gap-4">
        <div className="h-20 w-20 bg-surface-elevated rounded-img animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-surface-elevated rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-surface-elevated rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-surface-elevated rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
