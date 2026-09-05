'use client';

import { motion } from 'framer-motion';
import { Calendar, Zap, ShieldCheck, Clock } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';

const usps = [
  {
    icon: Zap,
    title: 'Earliest available slot',
    description: 'No time-slot hunting. Tell us your date, we find the earliest opening.',
  },
  {
    icon: ShieldCheck,
    title: 'No double bookings',
    description: 'Every appointment is revalidated before confirmation — guaranteed.',
  },
  {
    icon: Calendar,
    title: 'Simple 4-step flow',
    description: 'Shop, services, date, request. That\'s all you need to do.',
  },
  {
    icon: Clock,
    title: 'Real-time updates',
    description: 'Track your request from pending to confirmed in real time.',
  },
];

export function ProductUSP() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {usps.map((usp) => {
            const Icon = usp.icon;
            return (
              <motion.div
                key={usp.title}
                variants={staggerItem}
                className="rounded-card border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-surface-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1.5">{usp.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{usp.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
