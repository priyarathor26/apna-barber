import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Hero } from '@/components/home/hero';
import { ProductUSP } from '@/components/home/product-usp';
import { NearbyShops } from '@/components/home/nearby-shops';
import { PopularServices } from '@/components/home/popular-services';
import { HowItWorks } from '@/components/home/how-it-works';
import { ForBusinessesCTA } from '@/components/home/for-businesses-cta';
import { WhyApnaBarber } from '@/components/home/why-apna-barber';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductUSP />
        <NearbyShops />
        <PopularServices />
        <HowItWorks />
        <WhyApnaBarber />
        <ForBusinessesCTA />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
