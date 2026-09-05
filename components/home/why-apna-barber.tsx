'use client';

import { motion } from 'framer-motion';
import { Calendar, Zap, ShieldCheck, Smartphone, Bell, Heart } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';

const reasons = [
  { icon: Zap, title: 'Instant scheduling', description: 'No back-and-forth. Get the earliest appointment automatically.' },
  { icon: ShieldCheck, title: 'Booking guarantee', description: 'Transactional revalidation prevents double bookings every time.' },
  { icon: Smartphone, title: 'Mobile-first', description: 'Designed for your phone. Book in under a minute, on the go.' },
  { icon: Bell, title: 'Real-time updates', description: 'Know exactly when your appointment is confirmed or needs attention.' },
  { icon: Heart, title: 'Save favorites', description: 'Bookmark your preferred shops for quick rebooking.' },
  { icon: Calendar, title: 'Booking history', description: 'Track all your appointments with full timelines.' },
];

export function WhyApnaBarber() {
  return (
    <section className="py-16 md:py-24 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-h2 font-bold text-foreground mb-2">
            Why Apna Barber
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Built for speed, trust, and simplicity. The booking experience reimagined.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                variants={staggerItem}
                className="flex gap-4 rounded-card border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-surface-hover"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
