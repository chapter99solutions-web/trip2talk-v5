import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { sortTripsForDisplay } from '@/lib/seed-trips';
import { loadTrips } from '@/lib/trips';
import { tripDisplayTitle } from '@/lib/trip-display';

export default async function CalendarPage() {
  const trips = sortTripsForDisplay(await loadTrips());
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <h1 className="font-serif text-3xl text-navy mb-6">Trip calendar</h1>
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li key={trip.tour_code} className="rounded-xl border border-slate-200 p-4 flex justify-between gap-4">
              <div>
                <Link href={`/trips/${trip.tour_code}`} className="font-semibold text-navy hover:underline">
                  {tripDisplayTitle(trip, 'EN')}
                </Link>
                <p className="text-sm text-slate-500 mt-1">
                  {trip.tour_code} · {trip.duration}
                </p>
              </div>
              <p className="text-sm font-medium text-amber-700 shrink-0">
                {trip.date ?? 'เร็วๆ นี้'}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
