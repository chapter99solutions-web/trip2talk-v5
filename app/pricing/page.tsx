import Link from 'next/link';
import { sortTripsForDisplay } from '@/lib/seed-trips';
import { tripDisplayTitle } from '@/lib/trip-display';
import { loadTrips } from '@/lib/trips';
import StaticPage from '@/components/StaticPage';

export default async function PricingPage() {
  const trips = sortTripsForDisplay(await loadTrips());
  return (
    <StaticPage titleEn="Pricing" titleTh="ราคา">
      <p>All prices in AUD per person. Deposit plans available on longer trips.</p>
      <ul className="space-y-3 not-prose">
        {trips.map((trip) => (
          <li key={trip.tour_code} className="flex justify-between border-b border-slate-100 py-2">
            <Link href={`/trips/${trip.tour_code}`} className="text-navy hover:underline font-medium">
              {tripDisplayTitle(trip, 'EN')}
            </Link>
            <span className="text-teal-dark font-semibold">${trip.price}</span>
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}
