'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { isCompanionConsentComplete } from '@/lib/companion/consent-storage';
import type { ExtendedBookingRow, GuestConsentRow } from '@/lib/companion/types';
import { listAllBookings, listGuestConsents } from '@/app/actions/companion-staff';

export default function CohostGuestsView() {
  const [bookings, setBookings] = useState<ExtendedBookingRow[]>([]);
  const [consents, setConsents] = useState<GuestConsentRow[]>([]);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<ExtendedBookingRow | null>(null);

  const load = useCallback(async () => {
    const [b, c] = await Promise.all([listAllBookings(), listGuestConsents()]);
    if (b.ok) setBookings(b.data.filter((x) => x.status !== 'cancelled'));
    if (c.ok) setConsents(c.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const consentByRef = useMemo(
    () => Object.fromEntries(consents.map((c) => [c.booking_ref, c])),
    [consents]
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return bookings.filter(
      (b) =>
        !term ||
        b.name.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term)
    );
  }, [bookings, q]);

  const grouped = useMemo(() => {
    const map: Record<string, ExtendedBookingRow[]> = {};
    for (const b of filtered) {
      map[b.tour_code] = map[b.tour_code] ?? [];
      map[b.tour_code].push(b);
    }
    return map;
  }, [filtered]);

  function consentOk(b: ExtendedBookingRow) {
    if (consentByRef[b.booking_ref]) return true;
    return isCompanionConsentComplete(b.booking_ref);
  }

  function paymentLabel(p?: string | null) {
    if (p === 'paid') return 'ชำระครบ';
    if (p === 'deposit') return 'มัดจำแล้ว';
    return 'ยังไม่ชำระ';
  }

  return (
    <div>
      <StaffPageHeader staffRole="cohost" title="ลูกทริป" subtitle="ค้นหาชื่อหรืออีเมล" />
      <div className="px-4 space-y-4 pb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหา…"
          className="w-full rounded-xl bg-companion-card text-companion-text-dark px-4 py-3"
        />

        {selected && (
          <div className="rounded-2xl bg-companion-accent text-companion-dark p-4 text-sm">
            <button type="button" className="text-xs underline mb-2" onClick={() => setSelected(null)}>
              ปิด
            </button>
            <p className="font-semibold text-lg">{selected.name}</p>
            <p>{selected.email}</p>
            <p>{selected.phone}</p>
            <p className="mt-2">ทริป: {selected.tour_code}</p>
            <p>ที่นั่ง: {selected.seats}</p>
            <p>สถานะ: {selected.status}</p>
            <p>ชำระ: {paymentLabel(selected.payment_status)}</p>
            <p className="mt-2">{selected.notes}</p>
          </div>
        )}

        {Object.entries(grouped).map(([code, list]) => (
          <div key={code}>
            <p className="text-companion-accent text-sm font-medium mb-2">{code}</p>
            <div className="space-y-2">
              {list.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelected(b)}
                  className="w-full text-left rounded-xl bg-companion-surface border border-white/10 p-3 text-sm"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{b.name}</span>
                    <span>{consentOk(b) ? '✓' : '✗'} consent</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">
                    {b.email} · {paymentLabel(b.payment_status)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
