/**
 * Mock notification service. Creates in-memory Notification records for
 * booking lifecycle events. In production this is where a call to a real
 * notification/push/SMS backend would go — the call sites in booking-service
 * don't need to change.
 */
import { dataStore } from '@/lib/store/data-store';
import type { Notification } from '@/types';

export function notify(input: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification {
  const notification: Notification = {
    id: dataStore.nextId('n'),
    read: false,
    createdAt: new Date().toISOString(),
    ...input,
  };
  dataStore.addNotification(notification);
  return notification;
}
