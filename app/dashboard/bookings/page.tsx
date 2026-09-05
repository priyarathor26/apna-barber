'use client';

import { useMemo, useState } from 'react';
import {
  Check, X, Clock, User, Calendar, AlertCircle, ChevronRight, Loader2,
} from 'lucide-react';
import { useAppointments, useBusiness } from '@/lib/store/use-store-data';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { getOverrideOptions } from '@/services/availability-service';
import { acceptRequest, overrideRequest, rejectRequest, requestAgeLabel } from '@/services/booking-service';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { formatTime, formatDateLabel } from '@/lib/availability/availability-engine';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import type { Appointment, SuggestedAppointment } from '@/types';

// Single-shop dashboard for this phase — matches the rest of the dashboard,
// which is scoped to the owner/manager's own business.

export default function DashboardBookingsPage() {
  const business = useBusiness(CURRENT_BUSINESS_ID);
  const [acceptModal, setAcceptModal] = useState<Appointment | null>(null);
  const [overrideModal, setOverrideModal] = useState<Appointment | null>(null);
  const [rejectModal, setRejectModal] = useState<Appointment | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);
  const [overrideOptions, setOverrideOptions] = useState<SuggestedAppointment[]>([]);
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [overrideSelected, setOverrideSelected] = useState<SuggestedAppointment | null>(null);

  const businessAppointments = useAppointments((a) => a.businessId === CURRENT_BUSINESS_ID);
  const pending = useMemo(
    () =>
      businessAppointments
        .filter((a) => a.status === 'PENDING')
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [businessAppointments]
  );
  const allAppointments = useMemo(
    () => [...businessAppointments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [businessAppointments]
  );

  if (!business) return null;

  const openOverride = (req: Appointment) => {
    setOverrideModal(req);
    setOverrideSelected(null);
    setOverrideLoading(true);
    // Options come from the real availability service — never hardcoded —
    // and exclude this request's own current slot so it doesn't block itself.
    setTimeout(() => {
      const options = getOverrideOptions(
        business,
        req.services.map((s) => ({ id: s.serviceId, name: s.serviceName, description: '', durationMinutes: s.durationMinutes, price: s.price, active: true })),
        new Date(`${req.date}T00:00:00`),
        { excludeAppointmentId: req.id, limit: 8 }
      );
      setOverrideOptions(options);
      setOverrideLoading(false);
    }, 500);
  };

  const handleAccept = () => {
    if (!acceptModal) return;
    setConfirming(true);
    setSlotTaken(false);
    setTimeout(() => {
      const result = acceptRequest(business, acceptModal.id);
      setConfirming(false);
      if (result.ok) {
        toast.success('Appointment confirmed successfully.');
        setAcceptModal(null);
      } else {
        setSlotTaken(true);
      }
    }, 900);
  };

  const handleConfirmOverride = () => {
    if (!overrideModal || !overrideSelected) return;
    const result = overrideRequest(business, overrideModal.id, overrideSelected);
    if (result.ok) {
      toast.success('Appointment updated and confirmed.');
      setOverrideModal(null);
    } else if (result.reason === 'unavailable') {
      toast.error('That slot was just taken. Refreshing available options...');
      openOverride(overrideModal);
    } else {
      toast.error('This request can no longer be changed.');
      setOverrideModal(null);
    }
  };

  const handleReject = () => {
    if (!rejectModal) return;
    rejectRequest(rejectModal.id, rejectReason);
    toast.success('Request rejected.');
    setRejectModal(null);
    setRejectReason('');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Bookings</h1>
        <p className="text-muted-foreground">Manage all appointment requests and confirmed bookings.</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pending.length === 0 ? (
            <EmptyState
              icon={Check}
              title="No pending requests"
              description="New booking requests will appear here as customers submit them."
            />
          ) : (
            pending.map((req) => {
              const serviceNames = req.services.map((s) => s.serviceName).join(' + ');
              return (
                <div key={req.id} className="rounded-card border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-pill border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                        NEW REQUEST · {requestAgeLabel(req.createdAt)}
                      </span>
                      <h3 className="font-semibold text-foreground">{req.customerName}</h3>
                      <p className="text-sm text-muted-foreground">{serviceNames} · {req.totalDurationMinutes} min · ₹{req.totalPrice}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateLabel(req.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(req.startTime)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {req.staffName}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" onClick={() => { setSlotTaken(false); setAcceptModal(req); }} className="bg-brand-gradient text-background hover:opacity-90">
                      <Check className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => openOverride(req)}>
                      Change Appointment
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { setRejectReason(''); setRejectModal(req); }}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {allAppointments.length === 0 ? (
            <EmptyState icon={Calendar} title="No bookings yet" description="Bookings will show up here once customers start requesting appointments." />
          ) : (
            allAppointments.map((appt) => {
              const serviceNames = appt.services.map((s) => s.serviceName).join(' + ');
              return (
                <div key={appt.id} className="rounded-card border border-border bg-card p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm">{appt.customerName}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{serviceNames}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{formatDateLabel(appt.date)} · {formatTime(appt.startTime)}</span>
                      <span>{appt.staffName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={appt.status} />
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Accept Modal */}
      <Dialog open={!!acceptModal} onOpenChange={(open) => { if (!open) { setAcceptModal(null); setSlotTaken(false); } }}>
        <DialogContent className="bg-surface-elevated border-border-strong">
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>Review the details before confirming.</DialogDescription>
          </DialogHeader>

          {acceptModal && !slotTaken && (
            <div className="space-y-3 py-2">
              <Row label="Customer" value={acceptModal.customerName} />
              <Row label="Services" value={acceptModal.services.map((s) => s.serviceName).join(' + ')} />
              <Row label="Date" value={formatDateLabel(acceptModal.date)} />
              <Row label="Time" value={`${formatTime(acceptModal.startTime)} – ${formatTime(acceptModal.endTime)}`} />
              <Row label="Barber" value={acceptModal.staffName} />
              <Row label="Duration" value={`${acceptModal.totalDurationMinutes} min`} />
              <Row label="Total" value={`₹${acceptModal.totalPrice}`} />
            </div>
          )}

          {slotTaken && (
            <div className="rounded-card border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm">The suggested appointment is no longer available.</p>
                <p className="text-xs text-muted-foreground mt-1">This slot may have been booked by another request or a walk-in was added.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            {slotTaken ? (
              <>
                <Button variant="secondary" onClick={() => { const req = acceptModal; setAcceptModal(null); setSlotTaken(false); if (req) openOverride(req); }}>
                  Choose Another Slot
                </Button>
                <Button variant="secondary" onClick={() => { setAcceptModal(null); setSlotTaken(false); }}>Close</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setAcceptModal(null)}>Cancel</Button>
                <Button onClick={handleAccept} disabled={confirming} className="bg-brand-gradient text-background hover:opacity-90">
                  {confirming ? (<><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Revalidating...</>) : 'Confirm Appointment'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Override Modal */}
      <Dialog open={!!overrideModal} onOpenChange={(open) => { if (!open) setOverrideModal(null); }}>
        <DialogContent className="bg-surface-elevated border-border-strong max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Appointment</DialogTitle>
            <DialogDescription>Choose another available barber or time. This is for shop staff only.</DialogDescription>
          </DialogHeader>

          {overrideModal && (
            <div className="space-y-2 py-2 max-h-[50vh] overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-2">Available barbers and times for {formatDateLabel(overrideModal.date)}:</p>

              {overrideLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Checking live availability...
                </div>
              ) : overrideOptions.length === 0 ? (
                <div className="rounded-card border border-border bg-surface p-4 text-center text-sm text-muted-foreground">
                  No other valid barber/time combinations are available on this date.
                </div>
              ) : (
                overrideOptions.map((slot, i) => {
                  const selected = overrideSelected?.staffId === slot.staffId && overrideSelected?.startTime === slot.startTime;
                  return (
                    <button
                      key={i}
                      onClick={() => setOverrideSelected(slot)}
                      className={`w-full flex items-center justify-between rounded-lg border p-3 transition-colors text-left ${
                        selected ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{slot.staffName}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</p>
                        </div>
                      </div>
                      {selected ? <Check className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                    </button>
                  );
                })
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOverrideModal(null)}>Cancel</Button>
            <Button onClick={handleConfirmOverride} disabled={!overrideSelected} className="bg-brand-gradient text-background hover:opacity-90">
              Confirm New Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={!!rejectModal} onOpenChange={(open) => { if (!open) setRejectModal(null); }}>
        <DialogContent className="bg-surface-elevated border-border-strong">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Optionally let the customer know why. This is shared with them.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Fully booked for the day, please try another date"
              className="bg-surface border-border"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
