'use client';

import { useState } from 'react';
import { Plus, Scissors, Clock, MoreVertical, Pencil } from 'lucide-react';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { useBusiness } from '@/lib/store/use-store-data';
import { addService, updateService, setServiceActive, removeService } from '@/services/business-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/common/empty-state';
import { toast } from 'sonner';
import type { Service } from '@/types';

export default function ServicesPage() {
  const business = useBusiness(CURRENT_BUSINESS_ID);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  if (!business) return null;

  const openAdd = () => {
    setEditing(null); setName(''); setDescription(''); setDuration(''); setPrice('');
    setAddOpen(true);
  };
  const openEdit = (service: Service) => {
    setEditing(service);
    setName(service.name); setDescription(service.description);
    setDuration(String(service.durationMinutes)); setPrice(String(service.price));
    setAddOpen(true);
  };

  const handleSave = () => {
    const durationNum = Number(duration);
    const priceNum = Number(price);
    if (!name.trim() || !durationNum || !priceNum) return;

    if (editing) {
      // Changing duration here immediately changes how much time this
      // service occupies in every future availability calculation — no
      // separate propagation step needed since the availability service
      // reads the live business object from the store.
      updateService(business.id, editing.id, {
        name: name.trim(),
        description: description.trim(),
        durationMinutes: durationNum,
        price: priceNum,
      });
      toast.success('Service updated.');
    } else {
      addService(business.id, {
        name: name.trim(),
        description: description.trim(),
        durationMinutes: durationNum,
        price: priceNum,
      });
      toast.success('Service created.');
    }
    setAddOpen(false);
  };

  const handleToggleActive = (service: Service) => {
    setServiceActive(business.id, service.id, !service.active);
    toast.success(service.active ? `${service.name} is now hidden from booking.` : `${service.name} is now bookable again.`);
  };

  const handleRemove = (service: Service) => {
    const result = removeService(business.id, service.id);
    if (result.ok) {
      toast.success(`${service.name} removed.`);
    } else {
      toast.error(`${service.name} has pending or confirmed bookings, so it was deactivated instead of removed.`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Services</h1>
          <p className="text-muted-foreground">Create, edit, and manage your service menu.</p>
        </div>
        <Button onClick={openAdd} className="bg-brand-gradient text-background hover:opacity-90">
          <Plus className="h-4 w-4 mr-1" /> Add Service
        </Button>
      </div>

      {business.services.length === 0 ? (
        <EmptyState icon={Scissors} title="No services yet" description="Add a service to start accepting bookings." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {business.services.map((service) => (
            <div key={service.id} className="rounded-card border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Scissors className="h-5 w-5 text-primary" />
                </div>
                <button
                  onClick={() => openEdit(service)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                  aria-label={`Edit ${service.name}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{service.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {service.durationMinutes} min
                  </span>
                  <span className="font-semibold text-foreground">₹{service.price}</span>
                </div>
                <button
                  onClick={() => handleToggleActive(service)}
                  className={`inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-medium ${service.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}
                >
                  {service.active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(service)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemove(service)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-surface-elevated border-border-strong">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
            <DialogDescription>{editing ? 'Update details for this service.' : 'Create a new service for your shop.'}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="service-name">Name</Label>
              <Input id="service-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Haircut" className="bg-surface border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-desc">Description</Label>
              <Textarea id="service-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Precision cut tailored to your style" className="bg-surface border-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="service-duration">Duration (minutes)</Label>
                <Input id="service-duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30" className="bg-surface border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-price">Price (₹)</Label>
                <Input id="service-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="300" className="bg-surface border-border" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!name.trim() || !duration || !price} className="bg-brand-gradient text-background hover:opacity-90">
              {editing ? 'Save Changes' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
