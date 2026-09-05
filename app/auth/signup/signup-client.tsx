'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scissors, ArrowLeft, User, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SignupPage() {
  const [role, setRole] = useState<'customer' | 'business'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info('This is a demo. Authentication is not yet connected.');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
            <Scissors className="h-4 w-4 text-background" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">APNA BARBER</span>
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Create your account</h1>
        <p className="text-sm text-muted-foreground mb-6">Join Apna Barber in seconds.</p>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-card border p-4 transition-all',
              role === 'customer'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border bg-surface text-muted-foreground hover:text-foreground'
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('business')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-card border p-4 transition-all',
              role === 'business'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border bg-surface text-muted-foreground hover:text-foreground'
            )}
          >
            <Store className="h-5 w-5" />
            <span className="text-sm font-medium">Business</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{role === 'business' ? 'Shop name' : 'Full name'}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'business' ? 'Your Barber Shop' : 'John Doe'}
              required
              className="h-12 bg-surface border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-12 bg-surface border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-12 bg-surface border-border"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand-gradient text-background hover:opacity-90"
          >
            {loading ? 'Creating account...' : 'Get Started'}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary-hover font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
