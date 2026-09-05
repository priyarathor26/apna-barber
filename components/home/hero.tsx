'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';
import { Search, Calendar, Clock, Check, User } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[72px]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="absolute inset-0 bg-grid opacity-30" style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={staggerItem}>
            <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface-elevated px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Now accepting bookings
            </span>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="font-display text-hero font-bold text-foreground mb-6 text-balance"
          >
            Your personal care,
            <br />
            <span className="text-gradient">your way.</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
          >
            Find the right barber, choose your services and preferred date — we&apos;ll find the earliest available appointment for you.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href="/explore"
              className="inline-flex items-center justify-center h-12 px-6 rounded-btn bg-brand-gradient text-background font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="h-4 w-4 mr-2" />
              Find a Barber
            </a>
            <a
              href="/how-it-works"
              className="inline-flex items-center justify-center h-12 px-6 rounded-btn border border-border-strong bg-transparent text-foreground font-semibold text-sm transition-all hover:bg-surface-hover hover:border-border active:scale-[0.98]"
            >
              How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Floating appointment demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mt-16 md:mt-20"
        >
          <AppointmentDemo />
        </motion.div>
      </div>
    </section>
  );
}

function AppointmentDemo() {
  const steps = [
    {
      icon: Calendar,
      label: 'Choose your date',
      detail: 'Mon, Sep 4',
    },
    {
      icon: Search,
      label: 'We find the earliest slot',
      detail: 'Finding your appointment...',
    },
    {
      icon: Check,
      label: 'Shop confirms',
      detail: 'Today · 5:30 PM with Amit',
    },
  ];

  return (
    <div className="relative max-w-2xl">
      <div className="rounded-modal border border-border bg-surface-elevated/80 backdrop-blur-xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
              <span className="text-xs font-bold text-background">AB</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Suggested appointment</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            Awaiting confirmation
          </span>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface border border-border">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{step.label}</p>
                  <p className="text-sm font-medium text-foreground">{step.detail}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute left-[33px] mt-[40px] h-[20px] w-px bg-border" style={{ position: 'relative' }} />
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Haircut + Beard · 50 min</span>
          </div>
          <span className="text-sm font-semibold text-foreground">₹500</span>
        </div>
      </div>
    </div>
  );
}
