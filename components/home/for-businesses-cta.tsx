'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Scissors, Users, Calendar, Footprints } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';

const features = [
  { icon: Calendar, title: 'Manage bookings', description: 'Accept, override, or reject appointment requests in one click.' },
  { icon: Footprints, title: 'Handle walk-ins', description: 'Add walk-in appointments that automatically block availability.' },
  { icon: Users, title: 'Manage staff', description: 'Set schedules, breaks, and time off for each barber.' },
  { icon: Scissors, title: 'Control services', description: 'Create, edit, and manage your service menu and pricing.' },
];

export function ForBusinessesCTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-modal border border-border bg-surface-elevated p-8 md:p-12">
          <div className="absolute inset-0 bg-radial-fade opacity-50" />
          <div className="relative">
            <div className="max-w-2xl mb-10">
              <span className="inline-flex items-center rounded-pill border border-border bg-surface px-3 py-1 text-xs font-medium text-primary mb-4">
                For Businesses
              </span>
              <h2 className="font-display text-h2 font-bold text-foreground mb-3">
                Run your shop smarter.
              </h2>
              <p className="text-muted-foreground text-lg">
                Manage bookings, walk-ins, staff, and services — all from one dashboard. Reduce conflicts and never double-book again.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={staggerItem}
                    className="rounded-card border border-border bg-card p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <Link
              href="/for-businesses"
              className="inline-flex items-center justify-center h-12 px-6 rounded-btn bg-brand-gradient text-background font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
