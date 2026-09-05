import type { Metadata } from 'next';
import ExplorePage from './explore-client';

export const metadata: Metadata = {
  title: 'Explore Barber Shops Near You | Apna Barber',
  description: 'Browse and filter barber shops near you by service, price, and rating. Pick a shop, choose your services and date — we find the earliest available appointment.',
};

export default function Page() {
  return <ExplorePage />;
}
