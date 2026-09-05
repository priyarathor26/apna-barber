/**
 * Booking service — owns the full lifecycle of a booking request:
 * request -> (accept | override | reject | expire). This is the boundary the
 * PRD's "service layer" rule calls for: UI components call these functions,
 * never the store or the availability engine directly, and never edit an
 * appointment's status by hand.
 */
import { dataStore } from '@/lib/store/data-store';
import { getEarliestSuggestion, revalidate } from './availability-service';
import { notify } from './notification-service';
import type { Appointment, Business, Service, SuggestedAppointment } from '@/types';

export type BookingActionResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'not_pending' | 'expired' | 'unavailable' };

function servicesFromSnapshot(appt: Appointment): Service[] {
  return appt.services.map((s) => ({
    id: s.serviceId,
    name: s.serviceName,
    description: '',
    durationMinutes: s.durationMinutes,
    price: s.price,
    active: true,
  }));
}

function dateFromKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Customer-facing entry point. Computes the earliest feasible appointment
 * and persists it as a PENDING request. The customer never supplies a time
 * or staff member — those come entirely from the availability engine.
 */
export function requestAppointment(
  business: Business,
  services: Service[],
  preferredDate: Date,
  customer: { id: string; name: string } = { id: 'c1', name: 'You' }
): { appointment: Appointment | null; suggestion: SuggestedAppointment | null } {
  const suggestion = getEarliestSuggestion(business, services, preferredDate);
  if (!suggestion) return { appointment: null, suggestion: null };

  const now = new Date().toISOString();
  const appointment: Appointment = {
    id: dataStore.nextId('req'),
    businessId: business.id,
    businessName: business.name,
    businessImageUrl: business.imageUrl,
    customerId: customer.id,
    customerName: customer.name,
    services: services.map((s) => ({
      serviceId: s.id,
      serviceName: s.name,
      durationMinutes: s.durationMinutes,
      price: s.price,
    })),
    totalDurationMinutes: suggestion.totalDurationMinutes,
    totalPrice: services.reduce((sum, s) => sum + s.price, 0),
    date: suggestion.date,
    startTime: suggestion.startTime,
    endTime: suggestion.endTime,
    staffId: suggestion.staffId,
    staffName: suggestion.staffName,
    status: 'PENDING',
    paymentMethod: 'PAY_AT_SHOP',
    createdAt: now,
    timeline: [
      { status: 'REQUESTED', timestamp: now, note: 'Appointment requested' },
      { status: 'SUGGESTED', timestamp: now, note: `Earliest slot found with ${suggestion.staffName}` },
    ],
  };

  dataStore.addAppointment(appointment);
  notify({
    type: 'booking_request',
    title: 'New booking request',
    message: `${customer.name} requested ${appointment.services.map((s) => s.serviceName).join(' + ')} at ${business.name}.`,
    link: '/dashboard/bookings',
  });

  return { appointment, suggestion };
}

/**
 * Owner/manager accepts the system-suggested slot as-is. Always revalidates
 * against live availability first — if the slot was taken in the meantime
 * (another booking, a walk-in, a busy block), this does NOT fake a
 * confirmation; it reports 'unavailable' so the UI can offer override.
 */
export function acceptRequest(business: Business, appointmentId: string): BookingActionResult {
  const appt = dataStore.getAppointmentById(appointmentId);
  if (!appt) return { ok: false, reason: 'not_found' };
  if (appt.status === 'EXPIRED') return { ok: false, reason: 'expired' };
  if (appt.status !== 'PENDING') return { ok: false, reason: 'not_pending' };

  const suggested: SuggestedAppointment = {
    date: appt.date,
    startTime: appt.startTime,
    endTime: appt.endTime,
    staffId: appt.staffId,
    staffName: appt.staffName,
    totalDurationMinutes: appt.totalDurationMinutes,
  };

  const stillValid = revalidate(
    business,
    servicesFromSnapshot(appt),
    dateFromKey(appt.date),
    suggested,
    appt.id
  );
  if (!stillValid) return { ok: false, reason: 'unavailable' };

  const now = new Date().toISOString();
  dataStore.updateAppointment(appointmentId, (a) => ({
    ...a,
    status: 'CONFIRMED',
    confirmedAt: now,
    timeline: [...a.timeline, { status: 'CONFIRMED', timestamp: now, note: 'Shop confirmed the suggested appointment' }],
  }));

  notify({
    type: 'appointment_accepted',
    title: 'Appointment confirmed',
    message: `Your appointment at ${appt.businessName} is confirmed for ${appt.date} at ${appt.startTime}.`,
    link: `/bookings/${appointmentId}`,
  });

  return { ok: true };
}

/**
 * Owner/manager confirms an alternative slot (a different valid staff/time
 * combination sourced from getOverrideOptions — never hand-typed). Also
 * revalidates before writing, since the option list may have gone stale
 * between fetch and confirm.
 */
export function overrideRequest(
  business: Business,
  appointmentId: string,
  slot: SuggestedAppointment
): BookingActionResult {
  const appt = dataStore.getAppointmentById(appointmentId);
  if (!appt) return { ok: false, reason: 'not_found' };
  if (appt.status === 'EXPIRED') return { ok: false, reason: 'expired' };
  if (appt.status !== 'PENDING') return { ok: false, reason: 'not_pending' };

  const stillValid = revalidate(
    business,
    servicesFromSnapshot(appt),
    dateFromKey(slot.date),
    slot,
    appt.id
  );
  if (!stillValid) return { ok: false, reason: 'unavailable' };

  const now = new Date().toISOString();
  dataStore.updateAppointment(appointmentId, (a) => ({
    ...a,
    status: 'CONFIRMED',
    confirmedAt: now,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    staffId: slot.staffId,
    staffName: slot.staffName,
    timeline: [
      ...a.timeline,
      {
        status: 'CONFIRMED',
        timestamp: now,
        note: `Shop moved the appointment to ${slot.staffName} at ${slot.startTime}`,
      },
    ],
  }));

  notify({
    type: 'appointment_rescheduled',
    title: 'Appointment updated',
    message: `Your appointment at ${appt.businessName} was moved to ${slot.date} at ${slot.startTime} with ${slot.staffName}.`,
    link: `/bookings/${appointmentId}`,
  });

  return { ok: true };
}

export function rejectRequest(appointmentId: string, reason?: string): BookingActionResult {
  const appt = dataStore.getAppointmentById(appointmentId);
  if (!appt) return { ok: false, reason: 'not_found' };
  if (appt.status === 'EXPIRED') return { ok: false, reason: 'expired' };
  if (appt.status !== 'PENDING') return { ok: false, reason: 'not_pending' };

  const now = new Date().toISOString();
  dataStore.updateAppointment(appointmentId, (a) => ({
    ...a,
    status: 'REJECTED',
    timeline: [
      ...a.timeline,
      { status: 'REJECTED', timestamp: now, note: reason?.trim() ? reason.trim() : 'Rejected by shop' },
    ],
  }));

  notify({
    type: 'appointment_rejected',
    title: 'Appointment request declined',
    message: `${appt.businessName} couldn't accommodate your request${reason?.trim() ? `: ${reason.trim()}` : '.'}`,
    link: `/bookings/${appointmentId}`,
  });

  return { ok: true };
}

export function cancelAppointment(appointmentId: string): BookingActionResult {
  const appt = dataStore.getAppointmentById(appointmentId);
  if (!appt) return { ok: false, reason: 'not_found' };
  if (!['PENDING', 'CONFIRMED'].includes(appt.status)) return { ok: false, reason: 'not_pending' };

  const now = new Date().toISOString();
  dataStore.updateAppointment(appointmentId, (a) => ({
    ...a,
    status: 'CANCELLED',
    cancelledAt: now,
    timeline: [...a.timeline, { status: 'CANCELLED', timestamp: now, note: 'Cancelled by customer' }],
  }));

  notify({
    type: 'appointment_cancelled',
    title: 'Appointment cancelled',
    message: `Your appointment at ${appt.businessName} has been cancelled.`,
    link: `/bookings/${appointmentId}`,
  });

  return { ok: true };
}

export function requestAgeLabel(createdAt: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
}
