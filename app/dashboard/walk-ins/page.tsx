'use client';

import { useState } from 'react';
import { Footprints, Plus, Clock, User, X } from 'lucide-react';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { useWalkIns, useBusiness } from '@/lib/store/use-store-data';
import { addWalkIn, removeWalkIn } from '@/services/walkin-service';
import { formatTime } from '@/lib/availability/availability-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const business = { id: CURRENT_BUSINESS_ID };

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export default function WalkInsPage() {
  const liveBusiness = useBusiness(CURRENT_BUSINESS_ID);
  const walkIns = useWalkIns(business.id);
  const [addOpen, setAddOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [startTime, setStartTime] = useState('');

  const todaysWalkIns = walkIns.filter((w) => w.date === todayKey());

  if (!liveBusiness) return null;

  const openAdd = () => {
    setCustomerName('');
    setServiceId(liveBusiness.services[0]?.id ?? '');
    setStaffId(liveBusiness.staff[0]?.id ?? '');
    setStartTime('');
    setAddOpen(true);
  };

  const handleAdd = () => {
    const service = liveBusiness.services.find((s) => s.id === serviceId);
    const staff = liveBusiness.staff.find((s) => s.id === staffId);
    if (!service || !staff || !startTime) return;

    addWalkIn({
      businessId: business.id,
      customerName: customerName.trim() || 'Walk-in customer',
      serviceId: service.id,
      serviceName: service.name,
      staffId: staff.id,
      staffName: staff.name,
      date: todayKey(),
      startTime,
      durationMinutes: service.durationMinutes,
    });

    setAddOpen(false);
    setCustomerName('');
    setStartTime('');
    toast.success('Walk-in added. This slot is now blocked for online bookings.');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Walk-ins</h1>
          <p className="text-muted-foreground">Add walk-in customers and busy blocks. These automatically block availability.</p>
        </div>
        <Button onClick={openAdd} className="bg-brand-gradient text-background hover:opacity-90">
          <Plus className="h-4 w-4 mr-1" /> Add Walk-in
        </Button>
      </div>

      <div className="space-y-3">
        {todaysWalkIns.length === 0 ? (
          <div className="rounded-card border border-border bg-card p-8 text-center">
            <Footprints className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No walk-ins recorded today.</p>
          </div>
        ) : (
          todaysWalkIns.map((wi) => (
            <div key={wi.id} className="rounded-card border border-border bg-card p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 shrink-0">
                <Footprints className="h-5 w-5 text-info" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{wi.customerName}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(wi.startTime)} · {wi.durationMinutes} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {wi.staffName}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{wi.serviceName}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => { removeWalkIn(wi.id); toast.success('Walk-in removed.'); }}
                aria-label="Remove walk-in"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Add Walk-in Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-surface-elevated border-border-strong">
          <DialogHeader>
            <DialogTitle>Add Walk-in</DialogTitle>
            <DialogDescription>This will block the time period from automated booking.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="walkin-name">Customer Name</Label>
              <Input id="walkin-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Walk-in customer" className="bg-surface border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walkin-service">Service</Label>
              <select
                id="walkin-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full h-12 rounded-btn border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {liveBusiness.services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} · {s.durationMinutes} min · ₹{s.price}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="walkin-staff">Barber</Label>
              <select
                id="walkin-staff"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full h-12 rounded-btn border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {liveBusiness.staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="walkin-time">Start Time</Label>
              <Input id="walkin-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-surface border-border" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!startTime} className="bg-brand-gradient text-background hover:opacity-90">Add Walk-in</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
