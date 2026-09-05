export type UserRole = 'customer' | 'owner' | 'manager' | 'barber' | 'admin';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export type PaymentMethod = 'PAY_AT_SHOP';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  category?: string;
}

export interface ServiceSnapshot {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface WorkingInterval {
  start: string; // "09:00"
  end: string;   // "13:00"
}

export interface ShopHours {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  intervals: WorkingInterval[];
}

export interface Break {
  start: string;
  end: string;
}

export interface StaffSchedule {
  dayOfWeek: DayOfWeek;
  isWorking: boolean;
  intervals: WorkingInterval[];
  breaks: Break[];
}

export interface TimeOff {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'barber' | 'manager' | 'owner';
  avatarUrl?: string;
  serviceIds: string[];
  schedule: StaffSchedule[];
  timeOff: TimeOff[];
  status: 'active' | 'disabled';
}

export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  area: string;
  city: string;
  imageUrl: string;
  galleryImages: string[];
  services: Service[];
  staff: Staff[];
  hours: ShopHours[];
  startingPrice: number;
  openStatus: 'open' | 'closed';
  distanceKm?: number;
  tags: string[];
  closures: { date: string; reason?: string }[];
}

export interface AppointmentService {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
}

export interface Appointment {
  id: string;
  businessId: string;
  businessName: string;
  businessImageUrl: string;
  customerId: string;
  customerName: string;
  services: AppointmentService[];
  totalDurationMinutes: number;
  totalPrice: number;
  date: string; // ISO date
  startTime: string; // "17:30"
  endTime: string;   // "18:20"
  staffId: string;
  staffName: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  timeline: BookingTimelineEvent[];
}

export interface BookingTimelineEvent {
  status: BookingStatus | 'REQUESTED' | 'SUGGESTED';
  timestamp: string;
  note?: string;
}

export interface SuggestedAppointment {
  date: string;
  startTime: string;
  endTime: string;
  staffId: string;
  staffName: string;
  totalDurationMinutes: number;
}

export interface WalkIn {
  id: string;
  businessId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  startTime: string;
  durationMinutes: number;
}

export interface BusyBlock {
  id: string;
  businessId: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface Review {
  id: string;
  businessId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FavoriteShop {
  businessId: string;
  addedAt: string;
}

export interface Notification {
  id: string;
  type: 'booking_request' | 'appointment_accepted' | 'appointment_rejected' | 'appointment_expired' | 'appointment_cancelled' | 'appointment_rescheduled' | 'appointment_reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actorName: string;
  timestamp: string;
  details?: string;
}
