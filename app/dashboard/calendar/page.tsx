'use client';

import { useMemo, useState } from 'react';
import { Footprints, Scissors } from 'lucide-react';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { useAppointments, useWalkIns } from '@/lib/store/use-store-data';
import { formatTime, formatDateLabel } from '@/lib/availability/availability-engine';
import { cn } from '@/lib/utils';

const business = { id: CURRENT_BUSINESS_ID };
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Walk-ins only store a start time + duration, not an end time. `formatTime`
// expects a raw "HH:MM" value and is applied once at render time (see
// eventsForDate below), so this must return a raw "HH:MM" string too — not
// an already-formatted "5:30 PM" label, which would double-format into
// garbage like "5:NaN PM".
function addMinutes(time: string, durationMinutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + durationMinutes;
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
}

export default function CalendarPage() {
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = useAppointments((a) => a.businessId === business.id);
  const walkIns = useWalkIns(business.id);

  // Only CONFIRMED appointments belong on the calendar — cancelled, rejected,
  // and expired requests must never show up as if they were booked.
  const confirmedAppointments = useMemo(
    () => appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED'),
    [appointments]
  );

  const eventsForDate = (date: Date) => {
    const key = dateKey(date);
    return [
      ...confirmedAppointments
        .filter((a) => a.date === key)
        .map((a) => ({
          type: 'appointment' as const,
          time: a.startTime,
          endTime: a.endTime,
          title: a.customerName,
          subtitle: a.services.map((s) => s.serviceName).join(' + '),
          staff: a.staffName,
        })),
      ...walkIns
        .filter((w) => w.date === key)
        .map((w) => ({
          type: 'walkin' as const,
          time: w.startTime,
          endTime: addMinutes(w.startTime, w.durationMinutes),
          title: w.customerName,
          subtitle: w.serviceName,
          staff: w.staffName,
        })),
    ].sort((a, b) => a.time.localeCompare(b.time));
  };

  const allEvents = eventsForDate(selectedDate);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(selectedDate);
    const day = d.getDay();
    d.setDate(d.getDate() - day + i);
    return d;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Calendar</h1>
          <p className="text-muted-foreground">Confirmed appointments and walk-ins only.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-surface p-1">
            <button
              onClick={() => setView('day')}
              className={cn('px-3 py-1.5 text-sm font-medium rounded-md transition-colors', view === 'day' ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={cn('px-3 py-1.5 text-sm font-medium rounded-md transition-colors', view === 'week' ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {view === 'day' ? (
        <div>
          {/* Date selector */}
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
            <div className="flex gap-2">
              {Array.from({ length: 14 }, (_, i) => {
                const d = new Date();
                d.setHours(0, 0, 0, 0);
                d.setDate(d.getDate() + i);
                const isSelected = d.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(d)}
                    className={cn(
                      'flex flex-col items-center justify-center shrink-0 w-16 h-20 rounded-card border transition-all',
                      isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className="text-xs">{dayLabels[d.getDay()]}</span>
                    <span className="text-xl font-bold mt-1">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events */}
          <div className="rounded-card border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground mb-4">
              {formatDateLabel(selectedDate.toISOString())}
            </h2>
            <div className="space-y-3">
              {allEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No confirmed appointments scheduled.</p>
              ) : (
                allEvents.map((event, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start gap-4 rounded-lg border p-4',
                      event.type === 'walkin' ? 'border-info/20 bg-info/5' : 'border-border bg-surface'
                    )}
                  >
                    <div className="text-center shrink-0">
                      <p className="text-sm font-semibold text-foreground">{formatTime(event.time)}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(event.endTime)}</p>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {event.type === 'walkin' ? (
                          <Footprints className="h-4 w-4 text-info" />
                        ) : (
                          <Scissors className="h-4 w-4 text-primary" />
                        )}
                        <p className="font-medium text-foreground text-sm">{event.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.subtitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">with {event.staff}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Week view */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((d, i) => {
              const isSelected = d.toDateString() === selectedDate.toDateString();
              const count = eventsForDate(d).length;
              return (
                <button
                  key={i}
                  onClick={() => { setSelectedDate(d); setView('day'); }}
                  className={cn(
                    'flex flex-col items-center justify-center h-16 rounded-card border transition-all relative',
                    isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="text-xs">{dayLabels[d.getDay()]}</span>
                  <span className="text-lg font-bold mt-0.5">{d.getDate()}</span>
                  {count > 0 && <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
          <div className="rounded-card border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground mb-4">Week Overview</h2>
            <div className="space-y-2">
              {weekDays.flatMap((d) => eventsForDate(d)).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No confirmed appointments this week.</p>
              ) : (
                weekDays.flatMap((d) => eventsForDate(d).map((event) => ({ ...event, dayLabel: dayLabels[d.getDay()] }))).slice(0, 8).map((event, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      {event.type === 'walkin' ? <Footprints className="h-4 w-4 text-info" /> : <Scissors className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.subtitle} · {event.staff}</p>
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0">{event.dayLabel} · {formatTime(event.time)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
