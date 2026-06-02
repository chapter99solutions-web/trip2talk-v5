'use client';

import { useEffect, useState } from 'react';
import { listAllTrips } from '@/app/actions/companion-staff';
import type { TripRow } from '@/lib/supabase';
import { tripDisplayTitle } from '@/lib/trip-display';

export default function CohostTimelineOverview() {
  const [trips, setTrips] = useState<TripRow[]>([]);

  useEffect(() => {
    listAllTrips().then((r) => {
      if (r.ok) setTrips(r.data);
    });
  }, []);

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="font-serif text-2xl font-semibold mb-1">ไทม์ไลน์ทริป</h1>
      <p className="text-white/60 text-sm mb-6">ภาพรวมวันเดินทางทุกทริป</p>
      <div className="space-y-3">
        {trips.map((t) => (
          <div key={t.tour_code} className="rounded-2xl border border-white/10 bg-companion-surface p-4">
            <p className="font-semibold">{tripDisplayTitle(t, 'TH')}</p>
            <p className="text-companion-accent text-sm mt-1">{t.tour_code}</p>
            <p className="text-white/70 text-sm mt-2">วันเดินทาง: {t.date ?? 'ยังไม่กำหนด'}</p>
            <p className="text-white/50 text-xs mt-1">
              ที่นั่ง {t.seats_taken}/{t.max_seats}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
