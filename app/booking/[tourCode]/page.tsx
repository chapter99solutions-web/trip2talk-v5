import { notFound } from 'next/navigation';
import { loadTripByCode } from '@/lib/trips';
import SiteHeader from '@/components/SiteHeader';
import BookingConfirmationClient from '@/components/BookingConfirmationClient';

type Props = {
  params: { tourCode: string };
  searchParams: { ref?: string; seats?: string };
};

export default async function BookingPage({ params, searchParams }: Props) {
  const trip = await loadTripByCode(params.tourCode);
  if (!trip) notFound();
  const ref = searchParams.ref?.trim();
  if (!ref) notFound();

  const seats = Math.max(1, Number(searchParams.seats) || 1);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <SiteHeader />
      <BookingConfirmationClient trip={trip} bookingRef={ref} seats={seats} />
    </div>
  );
}
