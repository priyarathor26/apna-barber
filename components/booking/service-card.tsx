'use client';

import { Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Service } from '@/types';
import { cn } from '@/lib/utils';

export function ServiceCard({
  service,
  selected,
  onSelect,
}: {
  service: Service;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'w-full text-left rounded-card border p-4 transition-colors',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-border-strong hover:bg-surface-hover'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm mb-1">{service.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{service.description}</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {service.durationMinutes} min
            </span>
            <span className="text-sm font-semibold text-foreground">₹{service.price}</span>
          </div>
        </div>
        <div
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all',
            selected
              ? 'bg-primary border-primary text-background'
              : 'border-border text-transparent'
          )}
        >
          <Check className="h-3.5 w-3.5" />
        </div>
      </div>
    </motion.button>
  );
}
