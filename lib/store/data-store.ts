/**
 * In-memory mock "backend" for the current frontend phase.
 *
 * This is the single source of truth for anything that changes at runtime
 * (booking requests, walk-ins, busy blocks, notifications). Every page reads
 * through the `services/` layer (see /services), which reads/writes through
 * this store, instead of importing static arrays from `data/mock-data`
 * directly. That is what keeps dashboard counters, the request list, the
 * booking detail page, the customer's "My Bookings" page and the calendar in
 * sync with each other.
 *
 * When the real backend (Spring Boot + PostgreSQL) exists, this file is the
 * one place that gets swapped for real HTTP calls — the `services/` function
 * signatures are designed to stay the same.
 */
import {
  appointments as seedAppointments,
  dashboardPendingRequests as seedPendingRequests,
  walkIns as seedWalkIns,
  busyBlocks as seedBusyBlocks,
  businesses as seedBusinesses,
} from '@/data/mock-data';
import { siteConfig } from '@/config/site';
import type { Appointment, WalkIn, BusyBlock, Notification, BookingStatus, Business } from '@/types';

type Listener = () => void;

function normalizeSeedAppointments(): Appointment[] {
  // Merge the two seed sources (the old mock data kept "dashboard pending
  // requests" as a separate array from "appointments" — that duplication is
  // exactly the kind of isolated local state the product spec forbids, so we
  // merge them into one list here).
  const merged: Appointment[] = [...seedAppointments];
  for (const req of seedPendingRequests) {
    if (!merged.some((a) => a.id === req.id)) merged.push(req);
  }

  // The seed data's PENDING requests were authored with fixed timestamps.
  // Re-anchor them to "a few minutes ago" relative to real now so the demo
  // consistently shows live, not-yet-expired pending requests, while still
  // exercising the real 2-hour expiry rule going forward.
  let offset = 6;
  return merged.map((a) => {
    if (a.status !== 'PENDING') return a;
    const createdAt = new Date(Date.now() - offset * 60 * 1000).toISOString();
    offset += 11;
    return {
      ...a,
      createdAt,
      timeline: a.timeline.map((t) =>
        t.status === 'REQUESTED' || t.status === 'SUGGESTED' ? { ...t, timestamp: createdAt } : t
      ),
    };
  });
}

class DataStore {
  private appointments: Appointment[] = normalizeSeedAppointments();
  private walkIns: WalkIn[] = [...seedWalkIns];
  private busyBlocks: BusyBlock[] = [...seedBusyBlocks];
  private notifications: Notification[] = [];
  // Deep-cloned so mutations here never touch the static seed module — the
  // store is the only mutable copy. Staff/service edits made in the
  // dashboard flow through here and are picked up immediately by the
  // availability engine and by the customer-facing shop/service pages.
  private businesses: Business[] = seedBusinesses.map((b) => structuredClone(b));
  private listeners = new Set<Listener>();
  private counter = 1000;

  nextId(prefix: string): string {
    this.counter += 1;
    return `${prefix}_${this.counter}`;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit() {
    this.listeners.forEach((l) => l());
  }

  /** Flips PENDING requests older than the configured expiry window to EXPIRED. */
  private applyExpiry() {
    const expiryMs = siteConfig.pendingExpiryMinutes * 60 * 1000;
    const now = Date.now();
    let changed = false;
    const next = this.appointments.map((a) => {
      if (a.status === 'PENDING' && now - new Date(a.createdAt).getTime() > expiryMs) {
        changed = true;
        const timestamp = new Date().toISOString();
        return {
          ...a,
          status: 'EXPIRED' as BookingStatus,
          timeline: [
            ...a.timeline,
            { status: 'EXPIRED' as const, timestamp, note: 'Request expired after 2 hours without a shop response.' },
          ],
        };
      }
      return a;
    });
    if (changed) {
      this.appointments = next;
      this.emit();
    }
  }

  // ---- Appointments ----
  getAppointments(): Appointment[] {
    this.applyExpiry();
    return this.appointments;
  }

  getAppointmentById(id: string): Appointment | undefined {
    this.applyExpiry();
    return this.appointments.find((a) => a.id === id);
  }

  addAppointment(appt: Appointment) {
    this.appointments = [appt, ...this.appointments];
    this.emit();
  }

  updateAppointment(id: string, updater: (a: Appointment) => Appointment) {
    let touched = false;
    this.appointments = this.appointments.map((a) => {
      if (a.id !== id) return a;
      touched = true;
      return updater(a);
    });
    if (touched) this.emit();
    return touched;
  }

  // ---- Walk-ins ----
  getWalkIns(): WalkIn[] {
    return this.walkIns;
  }

  addWalkIn(walkIn: WalkIn) {
    this.walkIns = [walkIn, ...this.walkIns];
    this.emit();
  }

  removeWalkIn(id: string) {
    this.walkIns = this.walkIns.filter((w) => w.id !== id);
    this.emit();
  }

  // ---- Busy blocks ----
  getBusyBlocks(): BusyBlock[] {
    return this.busyBlocks;
  }

  addBusyBlock(block: BusyBlock) {
    this.busyBlocks = [block, ...this.busyBlocks];
    this.emit();
  }

  // ---- Notifications ----
  getNotifications(): Notification[] {
    return this.notifications;
  }

  addNotification(n: Notification) {
    this.notifications = [n, ...this.notifications];
    this.emit();
  }

  // ---- Businesses (shop profile, services, staff, hours) ----
  getBusinesses(): Business[] {
    return this.businesses;
  }

  getBusinessById(id: string): Business | undefined {
    return this.businesses.find((b) => b.id === id);
  }

  updateBusiness(id: string, updater: (b: Business) => Business) {
    let touched = false;
    this.businesses = this.businesses.map((b) => {
      if (b.id !== id) return b;
      touched = true;
      return updater(b);
    });
    if (touched) this.emit();
    return touched;
  }
}

// Singleton — module-scoped so every import shares the same in-memory state
// for the lifetime of the browser tab (this is a mock backend, not persistence).
export const dataStore = new DataStore();
