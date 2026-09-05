// import Link from 'next/link';
// import { Scissors } from 'lucide-react';
// import { siteConfig } from '@/config/site';

// export function Footer() {
//   return (
//     <footer className="border-t border-border bg-surface">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           <div className="col-span-2 md:col-span-1">
//             <Link href="/" className="flex items-center gap-2 mb-4">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
//                 <Scissors className="h-4 w-4 text-background" />
//               </div>
//               <span className="font-display text-lg font-bold tracking-tight text-foreground">
//                 APNA BARBER
//               </span>
//             </Link>
//             <p className="text-sm text-muted-foreground max-w-xs">
//               {siteConfig.tagline}
//             </p>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold text-foreground mb-3">Platform</h4>
//             <ul className="space-y-2">
//               <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore</Link></li>
//               <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
//               <li><Link href="/for-businesses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Businesses</Link></li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold text-foreground mb-3">Account</h4>
//             <ul className="space-y-2">
//               <li><Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
//               <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
//               <li><Link href="/bookings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Bookings</Link></li>
//               <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link></li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold text-foreground mb-3">Business</h4>
//             <ul className="space-y-2">
//               <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
//               <li><Link href="/for-businesses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Businesses</Link></li>
//             </ul>
//           </div>
//         </div>

//         <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
//           <p className="text-xs text-muted-foreground">
//             © {new Date().getFullYear()} Apna Barber. All rights reserved.
//           </p>
//           <p className="text-xs text-muted-foreground">
//             Demo platform — data shown is mock data.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }




import Link from 'next/link';
import { Scissors } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
                <Scissors className="h-4 w-4 text-background" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                {siteConfig.name.toUpperCase()}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/for-businesses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Businesses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
              <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
              <li><Link href="/bookings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Bookings</Link></li>
              <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Business</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/for-businesses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Businesses</Link></li>
            </ul>
          </div>

          {(siteConfig.phone || siteConfig.email || siteConfig.city) && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
              <ul className="space-y-2">
                {siteConfig.phone && (
                  <li className="text-sm text-muted-foreground">
                    {siteConfig.phone}
                  </li>
                )}
                {siteConfig.email && (
                  <li className="text-sm text-muted-foreground">
                    {siteConfig.email}
                  </li>
                )}
                {(siteConfig.city || siteConfig.state) && (
                  <li className="text-sm text-muted-foreground">
                    {siteConfig.city}
                    {siteConfig.city && siteConfig.state ? ', ' : ''}
                    {siteConfig.state}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Demo platform — data shown is mock data.
          </p>
        </div>
      </div>
    </footer>
  );
}