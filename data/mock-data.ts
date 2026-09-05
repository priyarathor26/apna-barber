import type {
  Business,
  Service,
  Staff,
  ShopHours,
  StaffSchedule,
  Appointment,
  Review,
  WalkIn,
  BusyBlock,
} from '@/types';

const servicesData: Record<string, Service[]> = {
  default: [
    { id: 's1', name: 'Haircut', description: 'Precision cut tailored to your style', durationMinutes: 30, price: 300, active: true, category: 'Hair' },
    { id: 's2', name: 'Beard Trim', description: 'Shape and trim your beard', durationMinutes: 20, price: 200, active: true, category: 'Beard' },
    { id: 's3', name: 'Styling', description: 'Wash and style finish', durationMinutes: 30, price: 250, active: true, category: 'Styling' },
    { id: 's4', name: 'Head Shave', description: 'Clean razor head shave', durationMinutes: 25, price: 350, active: true, category: 'Hair' },
    { id: 's5', name: 'Hair Color', description: 'Full color treatment', durationMinutes: 45, price: 800, active: true, category: 'Color' },
    { id: 's6', name: 'Kids Haircut', description: 'Haircut for children under 12', durationMinutes: 20, price: 150, active: true, category: 'Hair' },
    { id: 's7', name: 'Facial', description: 'Refreshing facial treatment', durationMinutes: 40, price: 600, active: true, category: 'Skincare' },
    { id: 's8', name: 'Hair Spa', description: 'Deep conditioning hair spa', durationMinutes: 35, price: 500, active: true, category: 'Hair' },
  ],
};

function makeStaffSchedule(): StaffSchedule[] {
  const days: StaffSchedule[] = [];
  for (let d = 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6; d <= 6; d++) {
    const isWeekend = d === 0 || d === 6;
    days.push({
      dayOfWeek: d,
      isWorking: !isWeekend,
      intervals: isWeekend
        ? [{ start: '10:00', end: '18:00' }]
        : [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '20:00' }],
      breaks: [{ start: '13:00', end: '14:00' }],
    });
  }
  return days;
}

function makeShopHours() {
  const hours: ShopHours[] = [];
  for (let d = 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6; d <= 6; d++) {
    const isWeekend = d === 0 || d === 6;
    hours.push({
      dayOfWeek: d,
      isOpen: true,
      intervals: isWeekend
        ? [{ start: '10:00', end: '18:00' }]
        : [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '20:00' }],
    });
  }
  return hours;
}

function makeStaff(prefix: string, names: string[], serviceIds: string[]): Staff[] {
  return names.map((name, i) => ({
    id: `${prefix}-st${i + 1}`,
    name,
    role: i === 0 ? 'manager' : 'barber',
    serviceIds,
    schedule: makeStaffSchedule(),
    timeOff: [],
    status: 'active' as const,
  }));
}

export const businesses: Business[] = [
  {
    id: 'b1',
    name: "The Gentleman's Cut",
    description: 'A premium grooming studio offering precision haircuts, beard styling, and relaxing treatments in a modern, comfortable setting.',
    address: '12 MG Road, Indiranagar',
    area: 'Indiranagar',
    city: 'Bengaluru',
    imageUrl: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: servicesData.default.slice(0, 6),
    staff: makeStaff('b1', ['Amit Kumar', 'Rajesh Sharma', 'Vikram Singh'], ['s1', 's2', 's3', 's4', 's6', 's8']),
    hours: makeShopHours(),
    startingPrice: 200,
    openStatus: 'open',
    distanceKm: 1.2,
    tags: ['Haircut', 'Beard', 'Styling'],
    closures: [],
  },
  {
    id: 'b2',
    name: 'Sharp & Clean',
    description: 'Modern barbershop specializing in clean fades, classic cuts, and beard sculpting. Walk-ins welcome.',
    address: '45 100 Feet Road, Koramangala',
    area: 'Koramangala',
    city: 'Bengaluru',
    imageUrl: 'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: servicesData.default.slice(0, 5),
    staff: makeStaff('b2', ['Suresh Patel', 'Deepak Verma'], ['s1', 's2', 's3', 's4', 's5']),
    hours: makeShopHours(),
    startingPrice: 250,
    openStatus: 'open',
    distanceKm: 2.8,
    tags: ['Fades', 'Beard', 'Color'],
    closures: [],
  },
  {
    id: 'b3',
    name: 'Urban Barber Lounge',
    description: 'A luxury grooming lounge offering haircuts, beard trims, facials, and hair spa treatments with a relaxed atmosphere.',
    address: '78 Brigade Road, Ashok Nagar',
    area: 'Ashok Nagar',
    city: 'Bengaluru',
    imageUrl: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: servicesData.default,
    staff: makeStaff('b3', ['Arjun Reddy', 'Manoj Gupta', 'Karan Mehta', 'Sanjay Yadav'], ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']),
    hours: makeShopHours(),
    startingPrice: 300,
    openStatus: 'open',
    distanceKm: 4.5,
    tags: ['Luxury', 'Facial', 'Hair Spa'],
    closures: [],
  },
  {
    id: 'b4',
    name: 'Classic Cuts & Co.',
    description: 'Traditional barbershop with a modern twist. Expert barbers, classic cuts, and friendly service.',
    address: '23 Commercial Street, Tasker Town',
    area: 'Tasker Town',
    city: 'Bengaluru',
    imageUrl: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: servicesData.default.slice(0, 4),
    staff: makeStaff('b4', ['Ramesh Iyer', 'Gopal Nair'], ['s1', 's2', 's3', 's4']),
    hours: makeShopHours(),
    startingPrice: 150,
    openStatus: 'closed',
    distanceKm: 6.0,
    tags: ['Classic', 'Budget'],
    closures: [],
  },
  {
    id: 'b5',
    name: 'The Grooming Studio',
    description: 'Boutique grooming studio for the modern man. Personalized service in a private, relaxed environment.',
    address: '56 Lavelle Road, Ashok Nagar',
    area: 'Ashok Nagar',
    city: 'Bengaluru',
    imageUrl: 'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: servicesData.default.slice(2, 8),
    staff: makeStaff('b5', ['Imran Khan', 'Faisal Ahmed'], ['s3', 's4', 's5', 's6', 's7', 's8']),
    hours: makeShopHours(),
    startingPrice: 350,
    openStatus: 'open',
    distanceKm: 3.3,
    tags: ['Boutique', 'Skincare', 'Color'],
    closures: [],
  },
  {
    id: 'b6',
    name: 'Fade Master Barber',
    description: 'Specialists in skin fades, buzz cuts, and beard styling. Quick, clean, and consistent.',
    address: '90 HSR Layout, Sector 2',
    area: 'HSR Layout',
    city: 'Bengaluru',
    imageUrl: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200',
    galleryImages: [
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    services: servicesData.default.slice(0, 4),
    staff: makeStaff('b6', ['Naveen Thomas', 'Prakash Raj'], ['s1', 's2', 's3', 's4']),
    hours: makeShopHours(),
    startingPrice: 200,
    openStatus: 'open',
    distanceKm: 5.2,
    tags: ['Fades', 'Buzz Cut'],
    closures: [],
  },
];

export const reviews: Review[] = [
  { id: 'r1', businessId: 'b1', customerName: 'Aditya', rating: 5, comment: 'Best haircut I have had in years. Amit really knows his craft.', date: '2026-08-20' },
  { id: 'r2', businessId: 'b1', customerName: 'Rahul', rating: 4, comment: 'Great service and clean environment. Will visit again.', date: '2026-08-15' },
  { id: 'r3', businessId: 'b2', customerName: 'Sneha', rating: 5, comment: 'Suresh gave me the perfect fade. Highly recommend.', date: '2026-08-18' },
];

export const appointments: Appointment[] = [
  {
    id: 'a1',
    businessId: 'b1',
    businessName: "The Gentleman's Cut",
    businessImageUrl: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=400',
    customerId: 'c1',
    customerName: 'You',
    services: [
      { serviceId: 's1', serviceName: 'Haircut', durationMinutes: 30, price: 300 },
      { serviceId: 's2', serviceName: 'Beard Trim', durationMinutes: 20, price: 200 },
    ],
    totalDurationMinutes: 50,
    totalPrice: 500,
    date: '2026-09-04',
    startTime: '17:30',
    endTime: '18:20',
    staffId: 'b1-st1',
    staffName: 'Amit Kumar',
    status: 'PENDING',
    paymentMethod: 'PAY_AT_SHOP',
    createdAt: '2026-09-03T15:30:00Z',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-09-03T15:30:00Z', note: 'Appointment requested' },
      { status: 'SUGGESTED', timestamp: '2026-09-03T15:30:05Z', note: 'Earliest appointment found' },
    ],
  },
  {
    id: 'a2',
    businessId: 'b3',
    businessName: 'Urban Barber Lounge',
    businessImageUrl: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    customerId: 'c1',
    customerName: 'You',
    services: [
      { serviceId: 's1', serviceName: 'Haircut', durationMinutes: 30, price: 300 },
    ],
    totalDurationMinutes: 30,
    totalPrice: 300,
    date: '2026-08-28',
    startTime: '15:00',
    endTime: '15:30',
    staffId: 'b3-st1',
    staffName: 'Arjun Reddy',
    status: 'COMPLETED',
    paymentMethod: 'PAY_AT_SHOP',
    createdAt: '2026-08-27T10:00:00Z',
    confirmedAt: '2026-08-27T11:00:00Z',
    completedAt: '2026-08-28T15:30:00Z',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-08-27T10:00:00Z', note: 'Appointment requested' },
      { status: 'SUGGESTED', timestamp: '2026-08-27T10:00:05Z', note: 'Earliest appointment found' },
      { status: 'CONFIRMED', timestamp: '2026-08-27T11:00:00Z', note: 'Shop confirmed appointment' },
      { status: 'COMPLETED', timestamp: '2026-08-28T15:30:00Z', note: 'Appointment completed' },
    ],
  },
  {
    id: 'a3',
    businessId: 'b2',
    businessName: 'Sharp & Clean',
    businessImageUrl: 'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=400',
    customerId: 'c1',
    customerName: 'You',
    services: [
      { serviceId: 's1', serviceName: 'Haircut', durationMinutes: 30, price: 250 },
      { serviceId: 's3', serviceName: 'Styling', durationMinutes: 30, price: 250 },
    ],
    totalDurationMinutes: 60,
    totalPrice: 500,
    date: '2026-08-15',
    startTime: '16:00',
    endTime: '17:00',
    staffId: 'b2-st1',
    staffName: 'Suresh Patel',
    status: 'CANCELLED',
    paymentMethod: 'PAY_AT_SHOP',
    createdAt: '2026-08-14T12:00:00Z',
    confirmedAt: '2026-08-14T13:00:00Z',
    cancelledAt: '2026-08-14T18:00:00Z',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-08-14T12:00:00Z', note: 'Appointment requested' },
      { status: 'SUGGESTED', timestamp: '2026-08-14T12:00:05Z', note: 'Earliest appointment found' },
      { status: 'CONFIRMED', timestamp: '2026-08-14T13:00:00Z', note: 'Shop confirmed appointment' },
      { status: 'CANCELLED', timestamp: '2026-08-14T18:00:00Z', note: 'Cancelled by customer' },
    ],
  },
];

export const walkIns: WalkIn[] = [
  {
    id: 'w1',
    businessId: 'b1',
    customerName: 'Walk-in customer',
    serviceId: 's1',
    serviceName: 'Haircut',
    staffId: 'b1-st2',
    staffName: 'Rajesh Sharma',
    date: '2026-09-03',
    startTime: '16:00',
    durationMinutes: 30,
  },
];

export const busyBlocks: BusyBlock[] = [];

export const dashboardPendingRequests: Appointment[] = [
  {
    id: 'dr1',
    businessId: 'b1',
    businessName: "The Gentleman's Cut",
    businessImageUrl: '',
    customerId: 'c2',
    customerName: 'Aditya Menon',
    services: [
      { serviceId: 's1', serviceName: 'Haircut', durationMinutes: 30, price: 300 },
      { serviceId: 's2', serviceName: 'Beard Trim', durationMinutes: 20, price: 200 },
    ],
    totalDurationMinutes: 50,
    totalPrice: 500,
    date: '2026-09-03',
    startTime: '17:30',
    endTime: '18:20',
    staffId: 'b1-st1',
    staffName: 'Amit Kumar',
    status: 'PENDING',
    paymentMethod: 'PAY_AT_SHOP',
    createdAt: '2026-09-03T15:30:00Z',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-09-03T15:30:00Z' },
      { status: 'SUGGESTED', timestamp: '2026-09-03T15:30:05Z' },
    ],
  },
  {
    id: 'dr2',
    businessId: 'b1',
    businessName: "The Gentleman's Cut",
    businessImageUrl: '',
    customerId: 'c3',
    customerName: 'Priya Sharma',
    services: [
      { serviceId: 's3', serviceName: 'Styling', durationMinutes: 30, price: 250 },
    ],
    totalDurationMinutes: 30,
    totalPrice: 250,
    date: '2026-09-04',
    startTime: '10:00',
    endTime: '10:30',
    staffId: 'b1-st3',
    staffName: 'Vikram Singh',
    status: 'PENDING',
    paymentMethod: 'PAY_AT_SHOP',
    createdAt: '2026-09-03T14:00:00Z',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-09-03T14:00:00Z' },
      { status: 'SUGGESTED', timestamp: '2026-09-03T14:00:05Z' },
    ],
  },
  {
    id: 'dr3',
    businessId: 'b1',
    businessName: "The Gentleman's Cut",
    businessImageUrl: '',
    customerId: 'c4',
    customerName: 'Karthik Rao',
    services: [
      { serviceId: 's1', serviceName: 'Haircut', durationMinutes: 30, price: 300 },
      { serviceId: 's2', serviceName: 'Beard Trim', durationMinutes: 20, price: 200 },
      { serviceId: 's3', serviceName: 'Styling', durationMinutes: 30, price: 250 },
    ],
    totalDurationMinutes: 80,
    totalPrice: 750,
    date: '2026-09-04',
    startTime: '14:00',
    endTime: '15:20',
    staffId: 'b1-st1',
    staffName: 'Amit Kumar',
    status: 'PENDING',
    paymentMethod: 'PAY_AT_SHOP',
    createdAt: '2026-09-03T16:00:00Z',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-09-03T16:00:00Z' },
      { status: 'SUGGESTED', timestamp: '2026-09-03T16:00:05Z' },
    ],
  },
];

export function getBusinessById(id: string): Business | undefined {
  return businesses.find((b) => b.id === id);
}

export function getReviewsByBusinessId(id: string): Review[] {
  return reviews.filter((r) => r.businessId === id);
}
