'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { BusinessCard, BusinessCardSkeleton } from '@/components/business/business-card';
import { EmptyState } from '@/components/common/empty-state';
import { useBusinesses } from '@/lib/store/use-store-data';
import { cn } from '@/lib/utils';
import { staggerContainer } from '@/lib/animations';

const filterChips = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open Now' },
  { id: 'near', label: 'Near Me' },
  { id: 'price', label: 'Lowest Price' },
];

const serviceFilters = ['Haircut', 'Beard', 'Styling', 'Color', 'Skincare', 'Hair Spa'];

function ExplorePage() {
  const businesses = useBusinesses();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    let result = [...businesses];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.area.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeFilter === 'open') result = result.filter((b) => b.openStatus === 'open');
    if (activeFilter === 'near') result = result.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    if (activeFilter === 'price') result = result.sort((a, b) => a.startingPrice - b.startingPrice);

    if (selectedServices.length > 0) {
      result = result.filter((b) =>
        selectedServices.every((s) => b.tags.some((t) => t.toLowerCase().includes(s.toLowerCase())))
      );
    }

    return result;
  }, [businesses, search, activeFilter, selectedServices]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setActiveFilter('all');
    setSelectedServices([]);
  };

  const hasFilters = search || activeFilter !== 'all' || selectedServices.length > 0;

  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen pb-24 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-h2 font-bold text-foreground mb-2">
              Find your next barber.
            </h1>
            <p className="text-muted-foreground">Search by name, area, or service.</p>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shops, areas, or services..."
              className="w-full h-12 pl-11 pr-4 rounded-btn border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={cn(
                  'shrink-0 inline-flex items-center gap-1.5 rounded-pill border px-4 py-2 text-sm font-medium transition-colors',
                  activeFilter === chip.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border-strong'
                )}
              >
                {chip.id === 'open' && <Clock className="h-3.5 w-3.5" />}
                {chip.id === 'near' && <MapPin className="h-3.5 w-3.5" />}
                {chip.label}
              </button>
            ))}
            <div className="h-8 w-px bg-border shrink-0 mx-1" />
            {serviceFilters.map((service) => (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={cn(
                  'shrink-0 inline-flex items-center rounded-pill border px-3 py-2 text-sm transition-colors',
                  selectedServices.includes(service)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-muted-foreground hover:text-foreground'
                )}
              >
                {service}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'shop' : 'shops'} found
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No shops found"
              description="Try changing your search or filters."
              action={
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center h-10 px-5 rounded-btn border border-border-strong text-foreground text-sm font-medium hover:bg-surface-hover"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {filtered.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default ExplorePage;
