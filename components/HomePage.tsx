'use client';

import type { TripRow } from '@/lib/supabase';
import HomeHero from './home/HomeHero';
import HomeTrustBar from './home/HomeTrustBar';
import HomeTripsSection from './home/HomeTripsSection';

export default function HomePage({ trips }: { trips: TripRow[] }) {
  return (
    <div className="home-luxury min-h-screen bg-luxury-bg text-luxury-ink">
      <HomeHero />
      <HomeTrustBar />
      <HomeTripsSection trips={trips} />
    </div>
  );
}
