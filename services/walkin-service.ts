/**
 * Walk-in / manual busy-block service. Walk-ins are written straight into
 * the store so they immediately participate in availability calculations
 * for every subsequent request (see availability-engine's occupied-interval
 * logic), matching the PRD requirement that walk-ins block online booking.
 */
import { dataStore } from '@/lib/store/data-store';
import type { WalkIn } from '@/types';

export function addWalkIn(input: Omit<WalkIn, 'id'>): WalkIn {
  const walkIn: WalkIn = { id: dataStore.nextId('w'), ...input };
  dataStore.addWalkIn(walkIn);
  return walkIn;
}

export function removeWalkIn(id: string) {
  dataStore.removeWalkIn(id);
}
