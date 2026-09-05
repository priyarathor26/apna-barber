'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Clock, Calendar, MapPin, User,
  Loader2, Info, Scissors, CreditCard,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { ServiceCard } from '@/components/booking/service-card';
import { useBusinesses, useBusiness } from '@/lib/store/use-store-data';
import { formatTime, formatDateLabel } from '@/lib/availability/availability-engine';
import { requestAppointment } from '@/services/booking-service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Service, SuggestedAppointment } from '@/types';

const steps = ['Shop', 'Services', 'Date', 'Request'];

function BookingFlow() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shop');
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searching, setSearching] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestedAppointment | null>(null);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string | null>(null);
  const [noSlot, setNoSlot] = useState(false);

  const business = useBusiness(shopId ?? '');

  useEffect(() => {
    if (!shopId) setStep(0);
  }, [shopId]);

  const selectedServiceObjects: Service[] = useMemo(() => {
    if (!business) return [];
    return business.services.filter((s) => selectedServices.includes(s.id));
  }, [business, selectedServices]);

  const totalDuration = selectedServiceObjects.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalPrice = selectedServiceObjects.reduce((sum, s) => sum + s.price, 0);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleRequest = () => {
    if (!business || !selectedDate || selectedServiceObjects.length === 0) return;
    setSearching(true);
    setSuggestion(null);
    setNoSlot(false);

    setTimeout(() => {
      // This both computes the earliest feasible appointment AND persists it
      // as a PENDING request, so it immediately shows up for the shop in the
      // dashboard and for the customer in "My Bookings" — one shared source
      // of truth instead of a local-only preview.
      const { appointment, suggestion: result } = requestAppointment(business, selectedServiceObjects, selectedDate);
      if (result && appointment) {
        setSuggestion(result);
        setCreatedAppointmentId(appointment.id);
      } else {
        setNoSlot(true);
      }
      setSearching(false);
    }, 1800);
  };

  // Step 0: Shop selection
  if (step === 0) {
    return (
      <ShopSelection
        onSelect={(id) => {
          window.history.replaceState(null, '', `/booking?shop=${id}`);
          setStep(1);
        }}
      />
    );
  }

  if (!business) {
    return (
      <ShopSelection
        onSelect={(id) => {
          window.history.replaceState(null, '', `/booking?shop=${id}`);
          setStep(1);
        }}
      />
    );
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress */}
        <BookingProgress currentStep={step} />

        {/* Back link */}
        {step > 0 && !suggestion && (
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Services */}
          {step === 1 && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-surface-elevated shrink-0">
                  <Image src={business.imageUrl} alt={business.name} fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{business.name}</h2>
                  <p className="text-sm text-muted-foreground">{business.area}, {business.city}</p>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground mb-1">Choose your services</h3>
              <p className="text-sm text-muted-foreground mb-6">Select one or more. We&apos;ll calculate the total duration.</p>

              <div className="space-y-3 mb-6">
                {business.services.filter((s) => s.active).map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    selected={selectedServices.includes(service.id)}
                    onSelect={() => toggleService(service.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Date */}
          {step === 2 && (
            <motion.div
              key="date"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-1">Choose your preferred date</h3>
              <p className="text-sm text-muted-foreground mb-6">We&apos;ll find the earliest available appointment on or after this date.</p>

              <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
            </motion.div>
          )}

          {/* Step 3: Request */}
          {step === 3 && !suggestion && !noSlot && (
            <motion.div
              key="request"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-1">Review and request</h3>
              <p className="text-sm text-muted-foreground mb-6">Check your details before submitting.</p>

              <div className="rounded-card border border-border bg-card p-5 space-y-4 mb-6">
                <SummaryRow icon={MapPin} label="Shop" value={business.name} />
                <SummaryRow icon={Scissors} label="Services" value={selectedServiceObjects.map((s) => s.name).join(' + ')} />
                <SummaryRow icon={Clock} label="Total duration" value={`${totalDuration} min`} />
                <SummaryRow icon={Calendar} label="Preferred date" value={selectedDate ? formatDateLabel(selectedDate.toISOString()) : '—'} />
                <SummaryRow icon={CreditCard} label="Payment" value="Pay at Shop" />
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-foreground">₹{totalPrice}</span>
                </div>
              </div>

              {searching && (
                <div className="rounded-card border border-primary/20 bg-primary/5 p-6 text-center mb-6">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
                  <p className="font-medium text-foreground">Finding your earliest available appointment...</p>
                  <p className="text-sm text-muted-foreground mt-1">This may take a moment.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Suggested appointment */}
          {suggestion && (
            <motion.div
              key="suggestion"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <SuggestedAppointmentView
                suggestion={suggestion}
                businessName={business.name}
                serviceNames={selectedServiceObjects.map((s) => s.name).join(' + ')}
                totalPrice={totalPrice}
                totalDuration={totalDuration}
                appointmentId={createdAppointmentId}
              />
            </motion.div>
          )}

          {/* No slot available */}
          {noSlot && !searching && (
            <motion.div
              key="noslot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-card border border-border bg-card p-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 mx-auto mb-4">
                <Calendar className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-1">No availability found</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                We couldn&apos;t find an available slot for your selected date. Try a different date.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setNoSlot(false);
                  setStep(2);
                }}
                className="h-11"
              >
                Choose another date
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky bottom action */}
      {!suggestion && !noSlot && (
        <div className="fixed bottom-0 inset-x-0 z-navbar border-t border-border glass-strong safe-bottom">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div>
              {selectedServiceObjects.length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground">
                    {selectedServiceObjects.length} {selectedServiceObjects.length === 1 ? 'service' : 'services'} · {totalDuration} min
                  </p>
                  <p className="font-semibold text-foreground">₹{totalPrice}</p>
                </>
              )}
            </div>
            {step === 1 && (
              <Button
                disabled={selectedServices.length === 0}
                onClick={() => setStep(2)}
                className="h-12 px-6 bg-brand-gradient text-background hover:opacity-90"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {step === 2 && (
              <Button
                disabled={!selectedDate}
                onClick={() => setStep(3)}
                className="h-12 px-6 bg-brand-gradient text-background hover:opacity-90"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {step === 3 && (
              <Button
                disabled={searching}
                onClick={handleRequest}
                className="h-12 px-6 bg-brand-gradient text-background hover:opacity-90"
              >
                {searching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finding...
                  </>
                ) : (
                  'Request Appointment'
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ShopSelection({ onSelect }: { onSelect: (id: string) => void }) {
  const allBusinesses = useBusinesses();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
      <BookingProgress currentStep={0} />
      <h3 className="font-display text-xl font-bold text-foreground mb-1">Choose a shop</h3>
      <p className="text-sm text-muted-foreground mb-6">Select a barber shop to start your booking.</p>
      <div className="space-y-3">
        {allBusinesses.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            className="w-full flex items-center gap-4 rounded-card border border-border bg-card p-4 text-left transition-all hover:border-border-strong hover:bg-surface-hover hover:-translate-y-0.5"
          >
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-surface-elevated shrink-0">
              <Image src={b.imageUrl} alt={b.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm">{b.name}</h4>
              <p className="text-xs text-muted-foreground">{b.area}, {b.city}</p>
              <p className="text-xs text-muted-foreground mt-1">From ₹{b.startingPrice}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

function BookingProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all',
                  i < currentStep
                    ? 'bg-primary border-primary text-background'
                    : i === currentStep
                    ? 'border-primary text-primary'
                    : 'border-border text-muted-foreground'
                )}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn('text-[10px] mt-1 hidden sm:block', i === currentStep ? 'text-primary font-medium' : 'text-muted-foreground')}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-2 rounded-full transition-colors', i < currentStep ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DateSelector({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}) {
  const dates = useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 min-w-min">
        {dates.map((date) => {
          const isSelected =
            selectedDate &&
            date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={cn(
                'flex flex-col items-center justify-center shrink-0 w-16 h-20 rounded-card border transition-all',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground'
              )}
            >
              <span className="text-xs font-medium">{dayLabels[date.getDay()]}</span>
              <span className="text-xl font-bold mt-1">{date.getDate()}</span>
              <span className="text-xs">{monthLabels[date.getMonth()]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </div>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function SuggestedAppointmentView({
  suggestion,
  businessName,
  serviceNames,
  totalPrice,
  totalDuration,
  appointmentId,
}: {
  suggestion: SuggestedAppointment;
  businessName: string;
  serviceNames: string;
  totalPrice: number;
  totalDuration: number;
  appointmentId: string | null;
}) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 border border-success/20 mx-auto mb-4">
          <Check className="h-7 w-7 text-success" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Suggested appointment</h2>
        <p className="text-sm text-muted-foreground">We found the earliest available slot for you.</p>
      </div>

      <div className="rounded-modal border border-border bg-surface-elevated p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-muted-foreground">{formatDateLabel(suggestion.date)}</p>
            <p className="font-display text-3xl font-bold text-foreground">{formatTime(suggestion.startTime)}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            Awaiting shop confirmation
          </span>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Barber</p>
              <p className="font-medium text-foreground">{suggestion.staffName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Services</p>
              <p className="font-medium text-foreground">{serviceNames}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium text-foreground">{totalDuration} min · {formatTime(suggestion.startTime)} – {formatTime(suggestion.endTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Shop</p>
              <p className="font-medium text-foreground">{businessName}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            Pay at Shop
          </div>
          <span className="font-display text-xl font-bold text-foreground">₹{totalPrice}</span>
        </div>
      </div>

      <div className="rounded-card border border-info/20 bg-info/5 p-4 flex items-start gap-3 mb-6">
        <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          The shop needs to confirm this appointment before it is final. You&apos;ll receive a notification once confirmed.
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild className="flex-1 h-12 bg-brand-gradient text-background hover:opacity-90">
          <Link href={appointmentId ? `/bookings/${appointmentId}` : '/bookings'}>View My Bookings</Link>
        </Button>
        <Button variant="secondary" asChild className="h-12 px-6">
          <Link href="/explore">Book Another</Link>
        </Button>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen pb-32">
        <Suspense fallback={<div className="pt-[72px] flex items-center justify-center h-96"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>}>
          <BookingFlow />
        </Suspense>
      </main>
      <MobileBottomNav />
    </>
  );
}
