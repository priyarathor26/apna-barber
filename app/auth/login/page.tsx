import type { Metadata } from 'next';
import LoginPage from './login-client';

export const metadata: Metadata = {
  title: 'Log In | Apna Barber',
  description: 'Log in to Apna Barber to manage your bookings and favorite shops.',
};

export default function Page() {
  return <LoginPage />;
}
