'use client';

import { UserCircle, Calendar, Scissors } from 'lucide-react';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { useAppointments } from '@/lib/store/use-store-data';
import { EmptyState } from '@/components/common/empty-state';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDateLabel } from '@/lib/availability/availability-engine';

const business = { id: CURRENT_BUSINESS_ID };

export default function CustomersPage() {
  const appointments = useAppointments((a) => a.businessId === business.id && a.status !== 'REJECTED' && a.status !== 'EXPIRED');

  // Extract unique customers from appointments
  const customerMap = new Map<string, { name: string; visits: number; lastVisit: string; totalSpent: number }>();
  appointments.forEach((a) => {
    const existing = customerMap.get(a.customerName);
    if (existing) {
      existing.visits += 1;
      existing.totalSpent += a.totalPrice;
      // Appointments aren't guaranteed to arrive in date order, so compare
      // explicitly rather than trusting first-seen — otherwise "Last visit"
      // can silently show a stale date.
      if (a.date > existing.lastVisit) existing.lastVisit = a.date;
    } else {
      customerMap.set(a.customerName, {
        name: a.customerName,
        visits: 1,
        lastVisit: a.date,
        totalSpent: a.totalPrice,
      });
    }
  });

  const customers = Array.from(customerMap.values());

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Customers</h1>
        <p className="text-muted-foreground">View your customer history and booking patterns.</p>
      </div>

      {customers.length === 0 ? (
        <EmptyState
          icon={UserCircle}
          title="No customers yet"
          description="Customers will appear here once they book an appointment with you."
        />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div key={customer.name} className="rounded-card border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 border border-border">
                <AvatarFallback className="bg-surface-elevated text-primary font-semibold">
                  {customer.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">{customer.name}</h3>
                <p className="text-xs text-muted-foreground">{customer.visits} {customer.visits === 1 ? 'visit' : 'visits'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Last visit
                </span>
                <span className="text-foreground">{formatDateLabel(customer.lastVisit)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <Scissors className="h-3.5 w-3.5" /> Total spent
                </span>
                <span className="font-medium text-foreground">₹{customer.totalSpent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
