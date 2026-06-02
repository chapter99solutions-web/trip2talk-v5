'use client';

import { useEffect, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { TRIP_TARGETS, allTourCodes, bookingLink, promoTextTh, randomPromoCode } from '@/lib/companion/marketing';
import { listAllTrips } from '@/app/actions/companion-staff';
import type { TripRow } from '@/lib/supabase';

export default function CohostMarketingView() {
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [promo, setPromo] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    listAllTrips().then((r) => {
      if (r.ok) setTrips(r.data);
    });
    setPromo(randomPromoCode());
  }, []);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <StaffPageHeader staffRole="cohost" title="การตลาด" subtitle="โปรโมทและที่นั่งว่าง" />
      <div className="px-4 space-y-4 pb-6">
        <div className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          <p className="font-semibold text-sm">Promo code</p>
          <p className="text-2xl font-mono mt-1">{promo}</p>
          <button
            type="button"
            onClick={() => setPromo(randomPromoCode())}
            className="mt-2 text-sm text-companion-accent font-medium"
          >
            สร้างใหม่
          </button>
        </div>

        {allTourCodes().map((code) => {
          const t = trips.find((x) => x.tour_code === code);
          const left = t ? Math.max(0, t.max_seats - t.seats_taken) : 0;
          const target = TRIP_TARGETS[code] ?? 6;
          const booked = t?.seats_taken ?? 0;
          const pct = Math.min(100, Math.round((booked / target) * 100));
          return (
            <div key={code} className="rounded-2xl bg-companion-surface border border-white/10 p-4">
              <p className="font-semibold">{code}</p>
              <p className="text-sm text-white/70 mt-1">
                จองแล้ว {booked} / เป้า {target} · เหลือ {left} ที่นั่ง
              </p>
              <div className="h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
                <div className="h-full bg-companion-accent" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => copy(promoTextTh(code), `promo-${code}`)}
                  className="rounded-lg bg-companion-card text-companion-text-dark px-3 py-2 text-xs font-medium"
                >
                  {copied === `promo-${code}` ? 'คัดลอกแล้ว' : 'คัดลอกโปรโมท'}
                </button>
                <button
                  type="button"
                  onClick={() => copy(bookingLink(code), `link-${code}`)}
                  className="rounded-lg bg-companion-card text-companion-text-dark px-3 py-2 text-xs font-medium"
                >
                  {copied === `link-${code}` ? 'คัดลอกแล้ว' : 'ลิงก์จอง'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
