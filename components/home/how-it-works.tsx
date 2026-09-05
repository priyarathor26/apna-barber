'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

const steps = [
  { number: '01', title: 'Choose a shop', description: 'Browse barbers near you and pick the one that fits.' },
  { number: '02', title: 'Choose your services', description: 'Select one or more services. We calculate the total duration.' },
  { number: '03', title: 'Choose your date', description: 'Pick a preferred date. No time-slot selection needed.' },
  { number: '04', title: 'We find your earliest appointment', description: 'Our engine finds the earliest feasible slot with an available barber.' },
  { number: '05', title: 'The shop confirms it', description: 'The shop reviews and confirms your appointment. You get notified.' },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-h2 font-bold text-foreground mb-2">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Five simple steps. You never pick a time — we find the earliest one for you.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              className="relative rounded-card border border-border bg-card p-5"
            >
              <span className="font-display text-3xl font-bold text-primary/20 mb-3 block">
                {step.number}
              </span>
              <h3 className="font-semibold text-foreground text-sm mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
