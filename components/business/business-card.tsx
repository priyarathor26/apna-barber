'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Business } from '@/types';
import { cn } from '@/lib/utils';
import { staggerItem } from '@/lib/animations';

export function BusinessCard({ business }: { business: Business }) {
  return (
    <motion.div variants={staggerItem}>
      <Link href={`/business/${business.id}`} className="group block">
        <div className="overflow-hidden rounded-card border border-border bg-card transition-all duration-200 hover:border-border-strong hover:bg-surface-hover group-hover:-translate-y-0.5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-card bg-surface-elevated">
            <Image
              src={business.imageUrl}
              alt={business.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium border backdrop-blur-md',
                  business.openStatus === 'open'
                    ? 'bg-success/15 text-success border-success/30'
                    : 'bg-background/70 text-muted-foreground border-border'
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', business.openStatus === 'open' ? 'bg-success' : 'bg-muted-foreground')} />
                {business.openStatus === 'open' ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-foreground text-base mb-1 line-clamp-1">
              {business.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{business.area}, {business.city}</span>
              {business.distanceKm != null && (
                <span className="text-muted-foreground/70">· {business.distanceKm} km</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {business.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-pill bg-surface-elevated border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Scissors className="h-3.5 w-3.5" />
                <span>{business.services.length} services</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">From </span>
                <span className="font-semibold text-foreground">₹{business.startingPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-card">
      <div className="aspect-[16/10] bg-surface-elevated animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 bg-surface-elevated rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-surface-elevated rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-surface-elevated rounded-pill animate-pulse" />
          <div className="h-5 w-16 bg-surface-elevated rounded-pill animate-pulse" />
        </div>
        <div className="h-4 w-full bg-surface-elevated rounded animate-pulse" />
      </div>
    </div>
  );
}
