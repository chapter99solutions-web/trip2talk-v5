import { Suspense } from 'react';
import SiteHeader from '@/components/SiteHeader';
import TripsListingSection from '@/components/TripsListingSection';
import { sortTripsForDisplay } from '@/lib/seed-trips';
import { loadTrips } from '@/lib/trips';

function TripsListingFallback() {
  return <p className="text-center text-slate-500 py-16 text-sm">กำลังโหลดทริป…</p>;
}

export default async function TripsPage() {
  const trips = sortTripsForDisplay(await loadTrips());

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-20">
        <h1 className="font-serif text-2xl md:text-3xl text-navy text-center mb-2">Our trips</h1>
        <p className="text-center text-slate-500 mb-6 text-sm">
          ทริปคัดสรร — เลือกตามสไตล์และงบของคุณ
        </p>
        <Suspense fallback={<TripsListingFallback />}>
          <TripsListingSection trips={trips} useTripsRoute />
        </Suspense>
      </main>
    </div>
  );
}
