'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { useBusiness } from '@/lib/store/use-store-data';
import { updateShopProfile, updateShopHours } from '@/services/business-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SettingsPage() {
  const business = useBusiness(CURRENT_BUSINESS_ID);
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (business && !dirty) {
      setShopName(business.name);
      setShopAddress(business.address);
      setShopDescription(business.description);
    }
    // Only re-sync from the store when the user hasn't started editing, so
    // we don't clobber in-progress input on unrelated store updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  if (!business) return null;

  const handleSave = () => {
    updateShopProfile(business.id, {
      name: shopName.trim(),
      address: shopAddress.trim(),
      description: shopDescription.trim(),
    });
    setDirty(false);
    toast.success('Settings saved successfully.');
  };

  const toggleDay = (dayOfWeek: number, isOpen: boolean) => {
    updateShopHours(business.id, dayOfWeek, { isOpen });
    toast.success(isOpen ? `${dayLabels[dayOfWeek]} marked open.` : `${dayLabels[dayOfWeek]} marked closed — no bookings will be offered.`);
  };

  const addInterval = (dayOfWeek: number, currentIntervals: { start: string; end: string }[]) => {
    updateShopHours(business.id, dayOfWeek, { intervals: [...currentIntervals, { start: '09:00', end: '18:00' }] });
  };

  const removeInterval = (dayOfWeek: number, currentIntervals: { start: string; end: string }[], index: number) => {
    updateShopHours(business.id, dayOfWeek, { intervals: currentIntervals.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your shop profile and working hours.</p>
      </div>

      <div className="space-y-6">
        {/* Shop Profile */}
        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Shop Profile</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shop-name">Shop Name</Label>
              <Input id="shop-name" value={shopName} onChange={(e) => { setShopName(e.target.value); setDirty(true); }} className="bg-surface border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop-address">Address</Label>
              <Input id="shop-address" value={shopAddress} onChange={(e) => { setShopAddress(e.target.value); setDirty(true); }} className="bg-surface border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop-desc">Description</Label>
              <textarea
                id="shop-desc"
                value={shopDescription}
                onChange={(e) => { setShopDescription(e.target.value); setDirty(true); }}
                rows={3}
                className="w-full rounded-btn border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Working Hours */}
        <section className="rounded-card border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Working Hours</h2>
            <span className="text-xs text-muted-foreground">Changes apply immediately to availability</span>
          </div>
          <div className="space-y-3">
            {business.hours.map((h) => (
              <div key={h.dayOfWeek} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                <div className="w-24 shrink-0">
                  <span className="text-sm font-medium text-foreground">{dayLabels[h.dayOfWeek]}</span>
                </div>
                <div className="flex-1">
                  {h.isOpen ? (
                    <div className="flex flex-wrap gap-2">
                      {h.intervals.map((interval, j) => (
                        <span key={j} className="inline-flex items-center gap-1.5 rounded-pill bg-surface-elevated border border-border px-3 py-1 text-xs text-foreground">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {interval.start} – {interval.end}
                          {h.intervals.length > 1 && (
                            <button
                              onClick={() => removeInterval(h.dayOfWeek, h.intervals, j)}
                              aria-label={`Remove ${interval.start}–${interval.end} interval on ${dayLabels[h.dayOfWeek]}`}
                              className="ml-0.5 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      ))}
                      <button
                        onClick={() => addInterval(h.dayOfWeek, h.intervals)}
                        className="inline-flex items-center gap-1 rounded-pill border border-dashed border-border-strong px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Add interval
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  )}
                </div>
                <button
                  onClick={() => toggleDay(h.dayOfWeek, !h.isOpen)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
                    h.isOpen ? 'bg-primary' : 'bg-border'
                  )}
                  role="switch"
                  aria-checked={h.isOpen}
                  aria-label={`Toggle ${dayLabels[h.dayOfWeek]} open`}
                >
                  <span className={cn('inline-block h-4 w-4 transform rounded-full bg-background transition-transform', h.isOpen ? 'translate-x-6' : 'translate-x-1')} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!dirty} className="bg-brand-gradient text-background hover:opacity-90">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
