'use client';

import { type BookingStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<BookingStatus, { label: string; className: string; dotClass: string }> = {
  PENDING: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20', dotClass: 'bg-warning' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-success/10 text-success border-success/20', dotClass: 'bg-success' },
  REJECTED: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20', dotClass: 'bg-destructive' },
  EXPIRED: { label: 'Expired', className: 'bg-muted text-muted-foreground border-border', dotClass: 'bg-muted-foreground' },
  CANCELLED: { label: 'Cancelled', className: 'bg-muted text-muted-foreground border-border', dotClass: 'bg-muted-foreground' },
  COMPLETED: { label: 'Completed', className: 'bg-info/10 text-info border-info/20', dotClass: 'bg-info' },
  NO_SHOW: { label: 'No Show', className: 'bg-destructive/10 text-destructive border-destructive/20', dotClass: 'bg-destructive' },
};

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}
