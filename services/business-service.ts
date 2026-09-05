/**
 * Business profile service — owns staff, service menu, and shop-settings
 * mutations. UI components (staff/services/settings pages) call these
 * functions instead of touching the store or mock-data directly.
 *
 * Historical appointments are never affected by edits here: Appointment
 * records store a services/staff *snapshot* (serviceName/duration/price,
 * staffName) at booking time rather than a live reference, so disabling or
 * removing a staff member or service never rewrites past bookings.
 */
import { dataStore } from '@/lib/store/data-store';
import type { Business, Service, Staff } from '@/types';

export function getBusiness(id: string): Business | undefined {
  return dataStore.getBusinessById(id);
}

function hasFutureBookings(businessId: string, predicate: (a: import('@/types').Appointment) => boolean): boolean {
  return dataStore
    .getAppointments()
    .some((a) => a.businessId === businessId && ['PENDING', 'CONFIRMED'].includes(a.status) && predicate(a));
}

// ---- Services ----

export function addService(businessId: string, input: Omit<Service, 'id' | 'active'>): Service {
  const service: Service = { id: dataStore.nextId('svc'), active: true, ...input };
  dataStore.updateBusiness(businessId, (b) => ({ ...b, services: [...b.services, service] }));
  return service;
}

export function updateService(businessId: string, serviceId: string, updates: Partial<Omit<Service, 'id'>>): boolean {
  return dataStore.updateBusiness(businessId, (b) => ({
    ...b,
    services: b.services.map((s) => (s.id === serviceId ? { ...s, ...updates } : s)),
  }));
}

export function setServiceActive(businessId: string, serviceId: string, active: boolean): boolean {
  return updateService(businessId, serviceId, { active });
}

export type RemoveServiceResult = { ok: true } | { ok: false; reason: 'has_pending_bookings' };

export function removeService(businessId: string, serviceId: string): RemoveServiceResult {
  // Never hard-delete a service that a live request/appointment still
  // references — deactivate instead so it stops being bookable but existing
  // requests keep their (already-snapshotted) service info intact.
  if (hasFutureBookings(businessId, (a) => a.services.some((s) => s.serviceId === serviceId))) {
    setServiceActive(businessId, serviceId, false);
    return { ok: false, reason: 'has_pending_bookings' };
  }
  dataStore.updateBusiness(businessId, (b) => ({ ...b, services: b.services.filter((s) => s.id !== serviceId) }));
  return { ok: true };
}

// ---- Staff ----

export function addStaff(businessId: string, input: Omit<Staff, 'id' | 'status'>): Staff {
  const staff: Staff = { id: dataStore.nextId('staff'), status: 'active', ...input };
  dataStore.updateBusiness(businessId, (b) => ({ ...b, staff: [...b.staff, staff] }));
  return staff;
}

export function updateStaff(businessId: string, staffId: string, updates: Partial<Omit<Staff, 'id'>>): boolean {
  return dataStore.updateBusiness(businessId, (b) => ({
    ...b,
    staff: b.staff.map((s) => (s.id === staffId ? { ...s, ...updates } : s)),
  }));
}

export function setStaffStatus(businessId: string, staffId: string, status: 'active' | 'disabled'): boolean {
  return updateStaff(businessId, staffId, { status });
}

export type RemoveStaffResult = { ok: true } | { ok: false; reason: 'has_pending_bookings' };

export function removeStaff(businessId: string, staffId: string): RemoveStaffResult {
  // Same rule as services: don't let a delete silently orphan a pending or
  // confirmed appointment. Disable instead — the availability engine already
  // excludes non-active staff, and past/ongoing bookings keep their
  // snapshotted staffName regardless.
  if (hasFutureBookings(businessId, (a) => a.staffId === staffId)) {
    setStaffStatus(businessId, staffId, 'disabled');
    return { ok: false, reason: 'has_pending_bookings' };
  }
  dataStore.updateBusiness(businessId, (b) => ({ ...b, staff: b.staff.filter((s) => s.id !== staffId) }));
  return { ok: true };
}

// ---- Shop settings ----

export function updateShopProfile(
  businessId: string,
  updates: Partial<Pick<Business, 'name' | 'address' | 'description'>>
): boolean {
  return dataStore.updateBusiness(businessId, (b) => ({ ...b, ...updates }));
}

export function updateShopHours(businessId: string, dayOfWeek: number, updates: Partial<Business['hours'][number]>): boolean {
  return dataStore.updateBusiness(businessId, (b) => ({
    ...b,
    hours: b.hours.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, ...updates } : h)),
  }));
}
