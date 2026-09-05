'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Hourglass, Check, Footprints, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { useAppointments, useWalkIns, useBusiness } from '@/lib/store/use-store-data';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { formatTime, formatDateLabel } from '@/lib/availability/availability-engine';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const business = { id: CURRENT_BUSINESS_ID };

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export default function DashboardOverviewPage() {
  const liveBusiness = useBusiness(CURRENT_BUSINESS_ID);
  const appointments = useAppointments((a) => a.businessId === business.id);
  const walkIns = useWalkIns(business.id);

  const today = todayKey();

  const stats = useMemo(() => {
    const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;
    const confirmedToday = appointments.filter((a) => a.status === 'CONFIRMED' && a.date === today).length;
    const walkInsToday = walkIns.filter((w) => w.date === today).length;
    const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
    return [
      { label: 'Pending Requests', value: pendingCount, icon: Hourglass, color: 'text-warning', bg: 'bg-warning/10', href: '/dashboard/bookings' },
      { label: 'Confirmed Today', value: confirmedToday, icon: Check, color: 'text-success', bg: 'bg-success/10', href: '/dashboard/calendar' },
      { label: "Today's Walk-ins", value: walkInsToday, icon: Footprints, color: 'text-info', bg: 'bg-info/10', href: '/dashboard/walk-ins' },
      { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10', href: '/dashboard/bookings' },
    ];
  }, [appointments, walkIns, today]);

  const pendingPreview = useMemo(
    () =>
      appointments
        .filter((a) => a.status === 'PENDING')
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(0, 3),
    [appointments]
  );

  if (!liveBusiness) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Overview</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening at {liveBusiness.name} today.</p>
      </div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItem}>
              <Link
                href={stat.href}
                className="block rounded-card border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-surface-hover"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} mb-3`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pending requests */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-lg">Incoming Requests</h2>
        <Link href="/dashboard/bookings" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {pendingPreview.length === 0 ? (
        <EmptyState
          icon={Check}
          title="No pending requests right now"
          description="You're all caught up. New requests will appear here as customers submit them."
        />
      ) : (
        <div className="space-y-4">
          {pendingPreview.map((req) => {
            const serviceNames = req.services.map((s) => s.serviceName).join(' + ');
            return (
              <div key={req.id} className="rounded-card border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-pill border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning mb-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                      NEW REQUEST
                    </span>
                    <h3 className="font-semibold text-foreground">{req.customerName}</h3>
                    <p className="text-sm text-muted-foreground">{serviceNames} · {req.totalDurationMinutes} min</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{formatDateLabel(req.date)} · {formatTime(req.startTime)}</span>
                  <span>with {req.staffName}</span>
                </div>
                <Button asChild size="sm" className="bg-brand-gradient text-background hover:opacity-90">
                  <Link href="/dashboard/bookings">Review Request</Link>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
