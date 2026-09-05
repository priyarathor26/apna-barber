'use client';

import { motion } from 'framer-motion';
import { Scissors, Clock, IndianRupee } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';

const services = [
  { name: 'Haircut', duration: '30 min', price: '₹300+', icon: Scissors },
  { name: 'Beard Trim', duration: '20 min', price: '₹200+', icon: Scissors },
  { name: 'Styling', duration: '30 min', price: '₹250+', icon: Scissors },
  { name: 'Hair Color', duration: '45 min', price: '₹800+', icon: Scissors },
  { name: 'Facial', duration: '40 min', price: '₹600+', icon: Scissors },
  { name: 'Hair Spa', duration: '35 min', price: '₹500+', icon: Scissors },
];

export function PopularServices() {
  return (
    <section className="py-16 md:py-24 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-display text-h2 font-bold text-foreground mb-2">
            Popular services
          </h2>
          <p className="text-muted-foreground">Book any combination — we calculate the total duration.</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                variants={staggerItem}
                className="rounded-card border border-border bg-card p-4 text-center transition-all hover:border-border-strong hover:bg-surface-hover hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground text-sm mb-1">{service.name}</h3>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  {service.duration}
                </div>
                <p className="text-xs font-medium text-foreground">{service.price}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
