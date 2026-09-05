// export const siteConfig = {
//   name: 'Apna Barber',
//   tagline: 'Your personal care, your way.',
//   description:
//     'Find the right barber, choose your services and preferred date — we find the earliest available appointment for you.',
//   url: 'https://apnabarber.app',
//   nav: [
//     { label: 'Explore', href: '/explore' },
//     { label: 'How It Works', href: '/how-it-works' },
//     { label: 'For Businesses', href: '/for-businesses' },
//   ],
//   dashboardNav: [
//     { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
//     { label: 'Bookings', href: '/dashboard/bookings', icon: 'CalendarClock' },
//     { label: 'Calendar', href: '/dashboard/calendar', icon: 'Calendar' },
//     { label: 'Walk-ins', href: '/dashboard/walk-ins', icon: 'Footprints' },
//     { label: 'Staff', href: '/dashboard/staff', icon: 'Users' },
//     { label: 'Services', href: '/dashboard/services', icon: 'Scissors' },
//     { label: 'Customers', href: '/dashboard/customers', icon: 'UserCircle' },
//     { label: 'Reviews', href: '/dashboard/reviews', icon: 'Star' },
//     { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
//   ],
//   pendingExpiryMinutes: 120,
//   slotIntervalMinutes: 15,
// };

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Apna Barber",
  tagline: "Your personal care, your way.",
  description:
    "Find the right barber, choose your services and preferred date — we find the earliest available appointment for you.",
  url: "https://apnabarber.app",

  nav: [
    { label: "Explore", href: "/explore" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "For Businesses", href: "/for-businesses" },
  ],

  dashboardNav: [
    { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Bookings", href: "/dashboard/bookings", icon: "CalendarClock" },
    { label: "Calendar", href: "/dashboard/calendar", icon: "Calendar" },
    { label: "Walk-ins", href: "/dashboard/walk-ins", icon: "Footprints" },
    { label: "Staff", href: "/dashboard/staff", icon: "Users" },
    { label: "Services", href: "/dashboard/services", icon: "Scissors" },
    { label: "Customers", href: "/dashboard/customers", icon: "UserCircle" },
    { label: "Reviews", href: "/dashboard/reviews", icon: "Star" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],

  pendingExpiryMinutes: 120,
  slotIntervalMinutes: 15,
};
