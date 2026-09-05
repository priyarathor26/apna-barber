'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useBusinesses } from '@/lib/store/use-store-data';
import { BusinessCard } from '@/components/business/business-card';

export function NearbyShops() {
  const businesses = useBusinesses();
  const shops = businesses.slice(0, 6);
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-h2 font-bold text-foreground mb-2">
              Explore nearby shops
            </h2>
            <p className="text-muted-foreground">Discover barbers around you, ready to book.</p>
          </div>
          <Link
            href="/explore"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {shops.map((shop) => (
            <BusinessCard key={shop.id} business={shop} />
          ))}
        </motion.div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center w-full h-12 rounded-btn border border-border-strong text-foreground font-medium text-sm"
          >
            View all shops
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
