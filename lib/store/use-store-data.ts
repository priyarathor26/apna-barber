'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { dataStore } from './data-store';
import type { Appointment, WalkIn, BusyBlock, Notification } from '@/types';

/**
 * React bindings for the mock data store. Using useSyncExternalStore means
 * every page that calls these hooks automatically re-renders when a booking
 * request is accepted, overridden, rejected, or expires — that is what keeps
 * the dashboard, calendar, and customer "My Bookings" pages consistent with
 * each other without prop drilling or manual refetching.
 */
export function useAppointments(filter?: (a: Appointment) => boolean): Appointment[] {
  const getSnapshot = useCallback(() => dataStore.getAppointments(), []);
  const all = useSyncExternalStore(dataStore.subscribe, getSnapshot, getSnapshot);
  return filter ? all.filter(filter) : all;
}

export function useAppointment(id: string | undefined): Appointment | undefined {
  const appointments = useAppointments();
  return id ? appointments.find((a) => a.id === id) : undefined;
}

export function useWalkIns(businessId?: string): WalkIn[] {
  const getSnapshot = useCallback(() => dataStore.getWalkIns(), []);
  const all = useSyncExternalStore(dataStore.subscribe, getSnapshot, getSnapshot);
  return businessId ? all.filter((w) => w.businessId === businessId) : all;
}

export function useBusyBlocks(businessId?: string): BusyBlock[] {
  const getSnapshot = useCallback(() => dataStore.getBusyBlocks(), []);
  const all = useSyncExternalStore(dataStore.subscribe, getSnapshot, getSnapshot);
  return businessId ? all.filter((b) => b.businessId === businessId) : all;
}

export function useNotifications(): Notification[] {
  const getSnapshot = useCallback(() => dataStore.getNotifications(), []);
  return useSyncExternalStore(dataStore.subscribe, getSnapshot, getSnapshot);
}

export function useBusinesses() {
  const getSnapshot = useCallback(() => dataStore.getBusinesses(), []);
  return useSyncExternalStore(dataStore.subscribe, getSnapshot, getSnapshot);
}

export function useBusiness(id: string) {
  const all = useBusinesses();
  return all.find((b) => b.id === id);
}
