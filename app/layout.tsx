import './globals.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/manrope';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: 'Apna Barber — Your personal care, your way',
  description:
    'Find the right barber, choose your services and preferred date — we find the earliest available appointment for you.',
  keywords: ['barber', 'grooming', 'appointment', 'haircut', 'beard', 'booking'],
  authors: [{ name: 'Apna Barber' }],
  openGraph: {
    title: 'Apna Barber — Your personal care, your way',
    description:
      'Find the right barber, choose your services and preferred date — we find the earliest available appointment for you.',
    type: 'website',
    siteName: 'Apna Barber',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apna Barber — Your personal care, your way',
    description:
      'Find the right barber, choose your services and preferred date — we find the earliest available appointment for you.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
