import type { Metadata } from 'next';
import HowItWorksPage from './how-it-works-client';

export const metadata: Metadata = {
  title: 'How It Works | Apna Barber',
  description: 'Choose your shop, services and date — Apna Barber automatically finds and requests the earliest available appointment. No time picker, no guesswork.',
};

export default function Page() {
  return <HowItWorksPage />;
}
