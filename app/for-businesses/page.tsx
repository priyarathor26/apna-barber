import type { Metadata } from 'next';
import ForBusinessesPage from './for-businesses-client';

export const metadata: Metadata = {
  title: 'For Barber Shops & Salons | Apna Barber',
  description: 'List your barber shop on Apna Barber. Manage bookings, walk-ins, staff, and your schedule from one dashboard — accept, override, or reject requests with real-time availability.',
};

export default function Page() {
  return <ForBusinessesPage />;
}
