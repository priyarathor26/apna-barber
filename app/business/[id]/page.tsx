import type { Metadata } from 'next';
import { getBusiness } from '@/services/business-service';
import BusinessDetailPage from './business-detail-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const business = getBusiness(id);

  if (!business) {
    return { title: 'Shop Not Found | Apna Barber' };
  }

  const title = `${business.name} — ${business.area}, ${business.city} | Apna Barber`;
  const description = `Book an appointment at ${business.name} in ${business.area}, ${business.city}. Choose your services and date — we find the earliest available appointment.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <BusinessDetailPage params={params} />;
}
