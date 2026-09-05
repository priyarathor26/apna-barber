/**
 * Availability service — the only place UI code should ask "when can this
 * appointment happen". Wraps the pure availability-engine functions with the
 * live data currently held in the store (existing appointments, walk-ins,
 * busy blocks). UI components never call the engine or read mock data
 * directly, so swapping this for real server-side availability later only
 * touches this file.
 */
import {
  findEarliestAppointment,
  findAvailableSlots,
  revalidateSlot,
} from '@/lib/availability/availability-engine';
import { dataStore } from '@/lib/store/data-store';
import type { Business, Service, SuggestedAppointment } from '@/types';

export function getEarliestSuggestion(
  business: Business,
  services: Service[],
  date: Date
): SuggestedAppointment | null {
  return findEarliestAppointment({
    business,
    services,
    preferredDate: date,
    existingAppointments: dataStore.getAppointments(),
    walkIns: dataStore.getWalkIns(),
    busyBlocks: dataStore.getBusyBlocks(),
  });
}

/**
 * Real, availability-backed alternatives for the owner/manager "override"
 * flow. `excludeAppointmentId` should always be passed as the request being
 * overridden, so the request's own current slot doesn't block itself out.
 */
export function getOverrideOptions(
  business: Business,
  services: Service[],
  date: Date,
  opts?: { excludeAppointmentId?: string; limit?: number }
): SuggestedAppointment[] {
  const existingAppointments = dataStore
    .getAppointments()
    .filter((a) => a.id !== opts?.excludeAppointmentId);

  return findAvailableSlots(
    {
      business,
      services,
      preferredDate: date,
      existingAppointments,
      walkIns: dataStore.getWalkIns(),
      busyBlocks: dataStore.getBusyBlocks(),
    },
    opts?.limit ?? 8
  );
}

/**
 * Re-checks that a previously suggested/overridden slot is still free right
 * before confirmation. Must be called on every Accept and every Override —
 * this is what prevents a stale suggestion from being confirmed as a fake
 * success after a walk-in or another booking has taken the slot.
 */
export function revalidate(
  business: Business,
  services: Service[],
  date: Date,
  suggested: SuggestedAppointment,
  excludeAppointmentId?: string
): boolean {
  const existingAppointments = dataStore
    .getAppointments()
    .filter((a) => a.id !== excludeAppointmentId);

  return revalidateSlot(
    {
      business,
      services,
      preferredDate: date,
      existingAppointments,
      walkIns: dataStore.getWalkIns(),
      busyBlocks: dataStore.getBusyBlocks(),
    },
    suggested
  );
}
