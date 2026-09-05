'use client';

import { motion } from 'framer-motion';
import { Calendar, Footprints, Users, Scissors, Clock, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  { icon: Calendar, title: 'Manage bookings', description: 'Accept, override, or reject appointment requests with one click. The system revalidates availability before every confirmation.' },
  { icon: Footprints, title: 'Handle walk-ins', description: 'Add walk-in appointments that automatically block availability. No more conflicts between online bookings and walk-ins.' },
  { icon: Users, title: 'Manage staff', description: 'Set individual schedules, breaks, and time off for each barber. The availability engine respects every constraint.' },
  { icon: Scissors, title: 'Control services', description: 'Create, edit, and manage your service menu. Historical bookings preserve service snapshots for your records.' },
  { icon: Clock, title: 'Shop hours', description: 'Support multiple working intervals per day, different hours per weekday, and planned closures.' },
  { icon: ShieldCheck, title: 'No double bookings', description: 'Transactional revalidation prevents double bookings, even with simultaneous requests or last-minute schedule changes.' },
];

const benefits = [
  'Accept or override suggested appointments',
  'Choose another valid barber or time when overriding',
  'View operational calendar with day and week views',
  'Add manual busy blocks',
  'Track pending, confirmed, walk-in, and completed appointments',
  'Reduce booking conflicts automatically',
];

export default function ForBusinessesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen pb-24 md:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="absolute inset-0 bg-grid opacity-20" style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)' }} />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center rounded-pill border border-border bg-surface-elevated px-3 py-1 text-xs font-medium text-primary mb-6"
            >
              For Businesses
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-h1 font-bold text-foreground mb-4 text-balance"
            >
              Run your shop <span className="text-gradient">smarter.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-8"
            >
              Manage bookings, walk-ins, staff, and services — all from one dashboard. Reduce conflicts and never double-book again.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button asChild size="lg" className="bg-brand-gradient text-background hover:opacity-90">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/dashboard">View Dashboard Demo</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={staggerItem}
                    className="rounded-card border border-border bg-card p-6 transition-colors hover:border-border-strong hover:bg-surface-hover"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24 bg-surface/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-h2 font-bold text-foreground mb-2">Everything you need to run your shop</h2>
              <p className="text-muted-foreground">Powerful tools, simple interface.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 rounded-card border border-border bg-card p-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10">
                    <Check className="h-3.5 w-3.5 text-success" />
                  </div>
                  <p className="text-sm text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-modal border border-border bg-surface-elevated p-8 md:p-12 text-center">
              <div className="absolute inset-0 bg-radial-fade opacity-50" />
              <div className="relative">
                <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
                <h2 className="font-display text-h2 font-bold text-foreground mb-3">Start managing your shop today</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Join Apna Barber and streamline your booking operations.
                </p>
                <Button asChild size="lg" className="bg-brand-gradient text-background hover:opacity-90">
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
