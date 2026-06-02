'use client';

import type { TripRow } from '@/lib/supabase';
import { FLAGSHIP_TOUR_CODE } from '@/lib/constants';
import { isTripComingSoon } from '@/lib/trip-categories';
import TripCard from './TripCard';

type Props = {
  trips: TripRow[];
  animationKey: string;
};

export default function TripsGrid({ trips, animationKey }: Props) {
  if (trips.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12 text-sm">
        ไม่พบทริปในหมวดนี้
      </p>
    );
  }

  return (
    <div
      key={animationKey}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-tripsFilterIn"
    >
      {trips.map((trip) => {
        const isFlagship = trip.tour_code === FLAGSHIP_TOUR_CODE;
        const comingSoon = isTripComingSoon(trip);
        return (
          <div
            key={trip.tour_code}
            className={isFlagship ? 'col-span-2 row-span-1' : undefined}
          >
            <TripCard trip={trip} comingSoon={comingSoon} featuredLayout={isFlagship} />
          </div>
        );
      })}
    </div>
  );
}
