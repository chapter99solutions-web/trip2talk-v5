'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import type { TripRow } from '@/lib/supabase';
import { listAllTrips, setTripBookingOpen, updateTripAdmin } from '@/app/actions/companion-staff';

export default function OwnerTripsView() {
  const [trips, setTrips] = useState<TripRow[]>([]);

  const load = useCallback(async () => {
    const res = await listAllTrips();
    if (res.ok) setTrips(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleOpen(t: TripRow) {
    const open = t.max_seats <= 0;
    await setTripBookingOpen(t.tour_code, open);
    load();
  }

  async function saveDate(code: string, date: string) {
    await updateTripAdmin(code, { date: date || null });
    load();
  }

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="ทริปทั้งหมด" />
      <div className="px-4 space-y-3 pb-6">
        <Link href="/dashboard" className="block text-center rounded-xl bg-companion-accent text-companion-dark py-3 font-semibold text-sm">
          เปิด Owner Dashboard (/dashboard)
        </Link>
        {trips.map((t) => (
          <div key={t.tour_code} className="rounded-2xl bg-companion-card text-companion-text-dark p-4 text-sm">
            <p className="font-semibold">{t.tour_code}</p>
            <p className="text-slate-500">{t.name_th ?? t.name}</p>
            <p className="mt-1">
              ที่นั่ง {t.seats_taken}/{t.max_seats}
            </p>
            <label className="block mt-2 text-xs">วันเดินทาง</label>
            <input
              type="date"
              defaultValue={t.date ?? ''}
              onBlur={(e) => saveDate(t.tour_code, e.target.value)}
              className="w-full rounded-lg border px-2 py-2 mt-1"
            />
            <button
              type="button"
              onClick={() => toggleOpen(t)}
              className="mt-3 w-full rounded-lg border py-2 font-medium"
            >
              {t.max_seats > 0 ? 'ปิดการจอง' : 'เปิดการจอง'}
            </button>
            <Link href={`/trips/${t.tour_code}`} className="block text-center text-companion-accent text-xs mt-2">
              ดูหน้าทริป
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
