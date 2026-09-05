import type {
  Business,
  Service,
  Staff,
  ShopHours,
  StaffSchedule,
  SuggestedAppointment,
  Appointment,
  WalkIn,
  BusyBlock,
  DayOfWeek,
} from '@/types';

export interface AvailabilityInput {
  business: Business;
  services: Service[];
  preferredDate: Date;
  existingAppointments: Appointment[];
  walkIns: WalkIn[];
  busyBlocks: BusyBlock[];
  slotIntervalMinutes?: number;
}

export interface FreeSlot {
  start: number; // minutes from midnight
  end: number;
  staffId: string;
  staffName: string;
}

const SLOT_INTERVAL = 15;

function dayOfWeek(date: Date): DayOfWeek {
  return date.getDay() as DayOfWeek;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function dateKey(date: Date): string {
  // Use local calendar date, not UTC — toISOString() shifts the date near
  // midnight for any timezone west of UTC, which silently mis-keys bookings.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getShopHoursForDate(business: Business, date: Date): ShopHours | undefined {
  const dow = dayOfWeek(date);
  const hours = business.hours.find((h) => h.dayOfWeek === dow);
  if (!hours || !hours.isOpen) return undefined;

  const closure = business.closures.find((c) => c.date === dateKey(date));
  if (closure) return undefined;

  return hours;
}

function getStaffScheduleForDate(staff: Staff, date: Date): StaffSchedule | undefined {
  const dow = dayOfWeek(date);
  const schedule = staff.schedule.find((s) => s.dayOfWeek === dow);
  if (!schedule || !schedule.isWorking) return undefined;

  const onLeave = staff.timeOff.some((t) => {
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    return date >= start && date <= end;
  });
  if (onLeave) return undefined;

  return schedule;
}

function getOccupiedIntervals(
  staffId: string,
  date: Date,
  appointments: Appointment[],
  walkIns: WalkIn[],
  busyBlocks: BusyBlock[]
): { start: number; end: number }[] {
  const dKey = dateKey(date);
  const occupied: { start: number; end: number }[] = [];

  for (const appt of appointments) {
    if (appt.staffId !== staffId) continue;
    if (dateKey(new Date(appt.date)) !== dKey) continue;
    if (appt.status === 'CANCELLED' || appt.status === 'REJECTED' || appt.status === 'EXPIRED') continue;
    occupied.push({ start: timeToMinutes(appt.startTime), end: timeToMinutes(appt.endTime) });
  }

  for (const wi of walkIns) {
    if (wi.staffId !== staffId) continue;
    if (wi.date !== dKey) continue;
    const start = timeToMinutes(wi.startTime);
    occupied.push({ start, end: start + wi.durationMinutes });
  }

  for (const bb of busyBlocks) {
    if (bb.staffId !== staffId) continue;
    if (bb.date !== dKey) continue;
    occupied.push({ start: timeToMinutes(bb.startTime), end: timeToMinutes(bb.endTime) });
  }

  return occupied.sort((a, b) => a.start - b.start);
}

function intersectIntervals(
  a: { start: number; end: number }[],
  b: { start: number; end: number }[]
): { start: number; end: number }[] {
  const result: { start: number; end: number }[] = [];
  for (const x of a) {
    for (const y of b) {
      const start = Math.max(x.start, y.start);
      const end = Math.min(x.end, y.end);
      if (end > start) result.push({ start, end });
    }
  }
  return result;
}

function findFreeWindowsForStaff(
  staff: Staff,
  date: Date,
  totalDuration: number,
  occupied: { start: number; end: number }[],
  shopHours: ShopHours
): { start: number; end: number }[] {
  const schedule = getStaffScheduleForDate(staff, date);
  if (!schedule) return [];

  const freeWindows: { start: number; end: number }[] = [];

  const staffIntervals = schedule.intervals.map((i) => ({
    start: timeToMinutes(i.start),
    end: timeToMinutes(i.end),
  }));
  const shopIntervals = shopHours.intervals.map((i) => ({
    start: timeToMinutes(i.start),
    end: timeToMinutes(i.end),
  }));
  // A staff member can only work when BOTH they and the shop are open — this
  // correctly handles multiple intervals per day (e.g. a lunch closure) and
  // never collapses everything onto the first shop interval.
  const effectiveIntervals = intersectIntervals(staffIntervals, shopIntervals);

  for (const interval of effectiveIntervals) {
    const windowStart = interval.start;
    const windowEnd = interval.end;

    // Remove breaks from this window
    const breakRanges = schedule.breaks
      .filter((b) => {
        const bs = timeToMinutes(b.start);
        const be = timeToMinutes(b.end);
        return be > windowStart && bs < windowEnd;
      })
      .map((b) => ({
        start: Math.max(timeToMinutes(b.start), windowStart),
        end: Math.min(timeToMinutes(b.end), windowEnd),
      }));

    const allBlocked = [...occupied, ...breakRanges]
      .filter((r) => r.end > windowStart && r.start < windowEnd)
      .map((r) => ({
        start: Math.max(r.start, windowStart),
        end: Math.min(r.end, windowEnd),
      }))
      .sort((a, b) => a.start - b.start);

    let cursor = windowStart;
    for (const block of allBlocked) {
      if (block.start - cursor >= totalDuration) {
        freeWindows.push({ start: cursor, end: block.start });
      }
      cursor = Math.max(cursor, block.end);
    }
    if (windowEnd - cursor >= totalDuration) {
      freeWindows.push({ start: cursor, end: windowEnd });
    }
  }

  return freeWindows;
}

export function findEarliestAppointment(input: AvailabilityInput): SuggestedAppointment | null {
  const {
    business,
    services,
    preferredDate,
    existingAppointments,
    walkIns,
    busyBlocks,
    slotIntervalMinutes = SLOT_INTERVAL,
  } = input;

  const totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0);
  if (totalDuration === 0) return null;

  const shopHours = getShopHoursForDate(business, preferredDate);
  if (!shopHours) return null;

  const serviceIds = new Set(services.map((s) => s.id));
  // A staff member must be able to perform EVERY selected service, not merely
  // one of them — otherwise we'd suggest a barber who can't do the full combo.
  const eligibleStaff = business.staff.filter(
    (s) => s.status === 'active' && Array.from(serviceIds).every((id) => s.serviceIds.includes(id))
  );
  if (eligibleStaff.length === 0) return null;

  // Find earliest slot across all eligible staff
  let earliest: { start: number; staffId: string; staffName: string } | null = null;

  for (const staff of eligibleStaff) {
    const occupied = getOccupiedIntervals(
      staff.id,
      preferredDate,
      existingAppointments,
      walkIns,
      busyBlocks
    );
    const freeWindows = findFreeWindowsForStaff(staff, preferredDate, totalDuration, occupied, shopHours);

    for (const window of freeWindows) {
      // Align to slot interval. window.start already accounts for shop
      // hours (all intervals) and staff schedule, so no extra floor is needed.
      let slotStart = window.start;
      const remainder = slotStart % slotIntervalMinutes;
      if (remainder !== 0) {
        slotStart += slotIntervalMinutes - remainder;
      }

      while (slotStart + totalDuration <= window.end) {
        if (!earliest || slotStart < earliest.start) {
          earliest = { start: slotStart, staffId: staff.id, staffName: staff.name };
        }
        break; // We only need the first valid slot per window
      }
    }
  }

  if (!earliest) return null;

  return {
    date: dateKey(preferredDate),
    startTime: minutesToTime(earliest.start),
    endTime: minutesToTime(earliest.start + totalDuration),
    staffId: earliest.staffId,
    staffName: earliest.staffName,
    totalDurationMinutes: totalDuration,
  };
}

/**
 * Returns multiple valid appointment candidates (not just the earliest one),
 * spread across every eligible staff member. Used by the owner/manager
 * "override" UI, which must only ever offer real, availability-service-backed
 * options — never hardcoded slots. Reuses the same occupied/free-window
 * logic as findEarliestAppointment so results are always consistent with it.
 */
export function findAvailableSlots(
  input: AvailabilityInput,
  limit = 8
): SuggestedAppointment[] {
  const {
    business,
    services,
    preferredDate,
    existingAppointments,
    walkIns,
    busyBlocks,
    slotIntervalMinutes = SLOT_INTERVAL,
  } = input;

  const totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0);
  if (totalDuration === 0) return [];

  const shopHours = getShopHoursForDate(business, preferredDate);
  if (!shopHours) return [];

  const serviceIds = new Set(services.map((s) => s.id));
  const eligibleStaff = business.staff.filter(
    (s) => s.status === 'active' && Array.from(serviceIds).every((id) => s.serviceIds.includes(id))
  );

  const slots: SuggestedAppointment[] = [];

  for (const staff of eligibleStaff) {
    const occupied = getOccupiedIntervals(
      staff.id,
      preferredDate,
      existingAppointments,
      walkIns,
      busyBlocks
    );
    const freeWindows = findFreeWindowsForStaff(staff, preferredDate, totalDuration, occupied, shopHours);

    for (const window of freeWindows) {
      let slotStart = window.start;
      const remainder = slotStart % slotIntervalMinutes;
      if (remainder !== 0) {
        slotStart += slotIntervalMinutes - remainder;
      }

      // Offer every aligned slot inside this free window, not just the first,
      // so the owner/manager has real alternatives to choose from.
      while (slotStart + totalDuration <= window.end) {
        slots.push({
          date: dateKey(preferredDate),
          startTime: minutesToTime(slotStart),
          endTime: minutesToTime(slotStart + totalDuration),
          staffId: staff.id,
          staffName: staff.name,
          totalDurationMinutes: totalDuration,
        });
        slotStart += slotIntervalMinutes;
      }
    }
  }

  slots.sort((a, b) =>
    a.startTime === b.startTime
      ? a.staffName.localeCompare(b.staffName)
      : a.startTime.localeCompare(b.startTime)
  );

  return slots.slice(0, limit);
}

/**
 * Validates one EXACT staff/date/start/end slot — not "is this still the
 * earliest slot". A later slot opening up elsewhere (e.g. 17:00 with Amit)
 * must never invalidate an earlier, still-free slot (e.g. 17:30 with Rahul).
 *
 * `input.existingAppointments` is expected to already exclude the
 * appointment being accepted/overridden (the service layer does this via
 * `excludeAppointmentId`), so any remaining CONFIRMED/COMPLETED booking that
 * overlaps the interval is a genuine collision.
 */
export function revalidateSlot(
  input: AvailabilityInput,
  suggested: SuggestedAppointment
): boolean {
  const {
    business,
    services,
    preferredDate,
    existingAppointments,
    walkIns,
    busyBlocks,
    slotIntervalMinutes = SLOT_INTERVAL,
  } = input;

  // 1 & 14. The exact supplied interval must be well-formed and match the
  // selected services' combined duration.
  const totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0);
  if (totalDuration === 0) return false;
  if (suggested.totalDurationMinutes !== totalDuration) return false;

  const slotStart = timeToMinutes(suggested.startTime);
  const slotEnd = timeToMinutes(suggested.endTime);
  if (slotEnd - slotStart !== totalDuration) return false;
  if (slotEnd <= slotStart) return false;

  // 15. Slot must sit on a valid interval boundary, same as slots the engine
  // itself would ever generate.
  if (slotStart % slotIntervalMinutes !== 0) return false;

  // The supplied date must match the date the slot claims to be for.
  if (suggested.date !== dateKey(preferredDate)) return false;

  // 4 & 9. Shop must be open (and not closed) on this date.
  const shopHours = getShopHoursForDate(business, preferredDate);
  if (!shopHours) return false;

  // 5. Shop hours must fully contain the interval (across any of the day's
  // intervals, e.g. split morning/evening hours).
  const shopIntervals = shopHours.intervals.map((i) => ({
    start: timeToMinutes(i.start),
    end: timeToMinutes(i.end),
  }));
  const shopCovers = shopIntervals.some((i) => i.start <= slotStart && slotEnd <= i.end);
  if (!shopCovers) return false;

  // 3. Staff must exist, be active, and support every selected service.
  const staff = business.staff.find((s) => s.id === suggested.staffId);
  if (!staff) return false;
  if (staff.status !== 'active') return false;
  const serviceIds = new Set(services.map((s) => s.id));
  if (!Array.from(serviceIds).every((id) => staff.serviceIds.includes(id))) return false;

  // 6, 7 & 9 (staff side). Staff schedule (already excludes time-off days)
  // must fully contain the interval, and no break may intersect it.
  const schedule = getStaffScheduleForDate(staff, preferredDate);
  if (!schedule) return false;

  const staffIntervals = schedule.intervals.map((i) => ({
    start: timeToMinutes(i.start),
    end: timeToMinutes(i.end),
  }));
  const staffCovers = staffIntervals.some((i) => i.start <= slotStart && slotEnd <= i.end);
  if (!staffCovers) return false;

  const breakConflict = schedule.breaks.some((b) => {
    const bs = timeToMinutes(b.start);
    const be = timeToMinutes(b.end);
    return be > slotStart && bs < slotEnd;
  });
  if (breakConflict) return false;

  // 10, 11, 12, 13 & 16. Existing CONFIRMED/COMPLETED bookings, walk-ins and
  // busy blocks that overlap this exact interval block it. PENDING/REJECTED/
  // CANCELLED/EXPIRED records are already excluded by getOccupiedIntervals.
  // The appointment being accepted/overridden is expected to already be
  // filtered out of `existingAppointments` by the caller (service layer).
  const occupied = getOccupiedIntervals(staff.id, preferredDate, existingAppointments, walkIns, busyBlocks);
  const collision = occupied.some((o) => o.end > slotStart && o.start < slotEnd);
  if (collision) return false;

  return true;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
