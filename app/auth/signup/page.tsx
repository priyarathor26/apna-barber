import type { Metadata } from 'next';
import SignupPage from './signup-client';

export const metadata: Metadata = {
  title: 'Sign Up | Apna Barber',
  description: 'Create an Apna Barber account to book barber appointments — we find the earliest available slot for you automatically.',
};

export default function Page() {
  return <SignupPage />;
}
