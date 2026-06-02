'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { downloadCsv } from '@/lib/companion/csv';
import type { CustomerStatRow } from '@/lib/business/types';
import { listCustomerStats } from '@/app/actions/business';
import { listAllBookings } from '@/app/actions/companion-staff';

type Row = CustomerStatRow & { displayName: string };

export default function OwnerCustomersView() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    const [stats, bookings] = await Promise.all([listCustomerStats(), listAllBookings()]);
    if (!stats.ok) return;
    const nameByEmail: Record<string, string> = {};
    if (bookings.ok) {
      for (const b of bookings.data) {
        const em = b.email.toLowerCase();
        if (!nameByEmail[em]) nameByEmail[em] = b.name;
      }
    }
    setRows(
      stats.data.map((s) => ({
        ...s,
        displayName: nameByEmail[s.email.toLowerCase()] ?? s.email.split('@')[0],
      }))
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        !term ||
        r.email.toLowerCase().includes(term) ||
        r.displayName.toLowerCase().includes(term)
    );
  }, [rows, q]);

  function exportCsv() {
    downloadCsv(
      'trip2talk-customers.csv',
      ['ชื่อ', 'อีเมล', 'จองครั้ง', 'ที่นั่งรวม', 'ทริป', 'ครั้งแรก', 'ล่าสุด'],
      filtered.map((r) => [
        r.displayName,
        r.email,
        r.total_bookings,
        r.total_seats,
        (r.tours_taken ?? []).join('; '),
        r.first_booking?.slice(0, 10) ?? '',
        r.last_booking?.slice(0, 10) ?? '',
      ])
    );
  }

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="ฐานข้อมูลลูกค้า" subtitle={`${rows.length} ลูกค้าไม่ซ้ำ`} />
      <div className="px-4 space-y-4 pb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาชื่อหรืออีเมล…"
          className="w-full rounded-xl bg-companion-card text-companion-text-dark px-4 py-3"
        />
        <button type="button" onClick={exportCsv} className="w-full rounded-xl border border-white/20 py-3 text-sm">
          Export CSV
        </button>
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.email} className="rounded-xl bg-companion-surface border border-white/10 p-3 text-sm">
              <div className="flex justify-between items-start">
                <p className="font-medium">
                  {r.displayName}
                  {r.total_bookings >= 3 && <span className="ml-1">🌟 VIP</span>}
                </p>
                <span className="text-companion-accent text-xs">{r.total_bookings} ครั้ง</span>
              </div>
              <p className="text-white/60 text-xs mt-1">{r.email}</p>
              <p className="text-white/50 text-xs mt-1">
                ทริป: {(r.tours_taken ?? []).join(', ')}
              </p>
              <p className="text-white/40 text-xs">
                ครั้งแรก {r.first_booking?.slice(0, 10)} · ล่าสุด {r.last_booking?.slice(0, 10)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
