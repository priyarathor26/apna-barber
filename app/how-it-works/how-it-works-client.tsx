'use client';

import { motion } from 'framer-motion';
import { Calendar, Scissors, Clock, Zap, Check, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const steps = [
  { icon: Search, number: '01', title: 'Choose a shop', description: 'Browse barbers near you. Read about their services, barbers, and working hours. Pick the one that fits your style.' },
  { icon: Scissors, number: '02', title: 'Choose your services', description: 'Select one or more services — haircut, beard trim, styling, or anything else. We automatically calculate the combined duration.' },
  { icon: Calendar, number: '03', title: 'Choose your date', description: 'Pick a preferred date from the calendar. You never have to select a specific time slot — that\'s our job.' },
  { icon: Zap, number: '04', title: 'We find your earliest appointment', description: 'Our availability engine checks shop hours, staff schedules, breaks, existing bookings, and walk-ins to find the earliest feasible slot with an available barber.' },
  { icon: Check, number: '05', title: 'The shop confirms it', description: 'The shop reviews the suggested appointment. They can accept it as-is, choose a different barber or time, or reject it. You get notified at every step.' },
];

function Search({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.3-4.3" /></svg>;
}

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen pb-24 md:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-h1 font-bold text-foreground mb-4 text-balance"
            >
              How <span className="text-gradient">Apna Barber</span> works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto"
            >
              Five simple steps. You never pick a time — we find the earliest available appointment for you.
            </motion.p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="space-y-6"
            >
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    variants={staggerItem}
                    className="flex gap-6 rounded-card border border-border bg-card p-6"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px h-full bg-border mt-4 min-h-[40px]" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <span className="font-display text-sm font-bold text-primary/40 mb-1 block">
                        STEP {step.number}
                      </span>
                      <h2 className="font-display text-xl font-bold text-foreground mb-2">{step.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-modal border border-border bg-surface-elevated p-8 md:p-12 text-center">
              <div className="absolute inset-0 bg-radial-fade opacity-50" />
              <div className="relative">
                <h2 className="font-display text-h2 font-bold text-foreground mb-3">Ready to book?</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Find a barber near you and get the earliest appointment automatically.
                </p>
                <Button asChild size="lg" className="bg-brand-gradient text-background hover:opacity-90">
                  <Link href="/explore">
                    Find a Barber
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
