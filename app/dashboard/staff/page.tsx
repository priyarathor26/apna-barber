'use client';

import { useState } from 'react';
import { Users, Scissors, Clock, Plus, Pencil } from 'lucide-react';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { useBusiness } from '@/lib/store/use-store-data';
import { addStaff, updateStaff, setStaffStatus, removeStaff } from '@/services/business-service';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/common/empty-state';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Staff } from '@/types';

export default function StaffPage() {
  const business = useBusiness(CURRENT_BUSINESS_ID);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [name, setName] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  if (!business) return null;

  const openAdd = () => { setEditing(null); setName(''); setSelectedServiceIds([]); setAddOpen(true); };
  const openEdit = (staff: Staff) => { setEditing(staff); setName(staff.name); setSelectedServiceIds(staff.serviceIds); setAddOpen(true); };

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleSave = () => {
    if (!name.trim() || selectedServiceIds.length === 0) return;
    if (editing) {
      updateStaff(business.id, editing.id, { name: name.trim(), serviceIds: selectedServiceIds });
      toast.success('Staff member updated.');
    } else {
      addStaff(business.id, {
        name: name.trim(),
        role: 'barber',
        serviceIds: selectedServiceIds,
        schedule: business.hours.map((h) => ({
          dayOfWeek: h.dayOfWeek,
          isWorking: h.isOpen,
          intervals: h.intervals,
          breaks: [],
        })),
        timeOff: [],
      });
      toast.success('Staff member added.');
    }
    setAddOpen(false);
  };

  const handleToggleStatus = (staff: Staff) => {
    setStaffStatus(business.id, staff.id, staff.status === 'active' ? 'disabled' : 'active');
    toast.success(staff.status === 'active' ? `${staff.name} disabled — no longer bookable.` : `${staff.name} re-enabled.`);
  };

  const handleRemove = (staff: Staff) => {
    const result = removeStaff(business.id, staff.id);
    if (result.ok) {
      toast.success(`${staff.name} removed.`);
    } else {
      toast.error(`${staff.name} has pending or confirmed bookings, so they were disabled instead of removed.`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Staff</h1>
          <p className="text-muted-foreground">Manage your barbers, their schedules, and availability.</p>
        </div>
        <Button onClick={openAdd} className="bg-brand-gradient text-background hover:opacity-90">
          <Plus className="h-4 w-4 mr-1" /> Add Staff
        </Button>
      </div>

      {business.staff.length === 0 ? (
        <EmptyState icon={Users} title="No staff yet" description="Add a barber to start accepting bookings." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {business.staff.map((staff) => (
            <div key={staff.id} className="rounded-card border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="bg-surface-elevated text-primary font-semibold">
                      {staff.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{staff.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{staff.role}</p>
                  </div>
                </div>
                <span className={cn(
                  'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium border',
                  staff.status === 'active'
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-muted text-muted-foreground border-border'
                )}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', staff.status === 'active' ? 'bg-success' : 'bg-muted-foreground')} />
                  {staff.status === 'active' ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Scissors className="h-4 w-4" />
                  <span>{staff.serviceIds.length} services assigned</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{staff.schedule.filter((s) => s.isWorking).length} working days</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(staff)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleToggleStatus(staff)}>
                  {staff.status === 'active' ? 'Disable' : 'Enable'}
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemove(staff)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-surface-elevated border-border-strong">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update name and which services they can perform.' : 'New staff inherit your shop\'s working hours by default.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="staff-name">Name</Label>
              <Input id="staff-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-surface border-border" />
            </div>
            <div className="space-y-2">
              <Label>Services they can perform</Label>
              <div className="flex flex-wrap gap-2">
                {business.services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={cn(
                      'rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors',
                      selectedServiceIds.includes(s.id)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-surface text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!name.trim() || selectedServiceIds.length === 0} className="bg-brand-gradient text-background hover:opacity-90">
              {editing ? 'Save Changes' : 'Add Staff Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
