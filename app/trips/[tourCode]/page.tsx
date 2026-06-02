import { notFound } from 'next/navigation';
import { isListingOnlyTourCode } from '@/lib/constants';
import { loadTripByCode } from '@/lib/trips';
import SiteHeader from '@/components/SiteHeader';
import TripDetailView from '@/components/TripDetailView';

type Props = { params: { tourCode: string } };

export default async function TripPage({ params }: Props) {
  const code = params.tourCode.toUpperCase();
  if (isListingOnlyTourCode(code)) notFound();

  const trip = await loadTripByCode(params.tourCode);
  if (!trip) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        <SiteHeader />
      </div>
      <div className="pt-14">
        <TripDetailView trip={trip} />
      </div>
    </div>
  );
}
