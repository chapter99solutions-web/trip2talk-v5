'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { REAL_TOUR_CODES } from '@/lib/constants';
import type { ExtendedBookingRow } from '@/lib/companion/types';
import {
  cohostCreateBooking,
  cohostUpdateBooking,
  listAllBookings,
  listAllTrips,
} from '@/app/actions/companion-staff';

const PAYMENT_OPTS = [
  { id: 'deposit', label: 'มัดจำแล้ว' },
  { id: 'paid', label: 'ชำระครบ' },
  { id: 'unpaid', label: 'ยังไม่ชำระ' },
];

const STATUS_OPTS = ['confirmed', 'pending', 'cancelled'] as const;

export default function CohostBookingsView() {
  const [bookings, setBookings] = useState<ExtendedBookingRow[]>([]);
  const [trips, setTrips] = useState<{ tour_code: string; max_seats: number; seats_taken: number }[]>([]);
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState<ExtendedBookingRow | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    tour_code: REAL_TOUR_CODES[0] as string,
    seats: 1,
    payment_status: 'unpaid',
    notes: '',
    status: 'pending' as string,
  });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [b, t] = await Promise.all([listAllBookings(), listAllTrips()]);
    if (b.ok) setBookings(b.data);
    if (t.ok) setTrips(t.data.map((x) => ({ tour_code: x.tour_code, max_seats: x.max_seats, seats_taken: x.seats_taken })));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const map: Record<string, ExtendedBookingRow[]> = {};
    for (const b of bookings) {
      if (filter && b.tour_code !== filter) continue;
      map[b.tour_code] = map[b.tour_code] ?? [];
      map[b.tour_code].push(b);
    }
    return map;
  }, [bookings, filter]);

  const seatsLeft = (code: string) => {
    const t = trips.find((x) => x.tour_code === code);
    if (!t) return '—';
    return Math.max(0, t.max_seats - t.seats_taken);
  };

  async function saveNew(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await cohostCreateBooking(form);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setForm({ ...form, name: '', email: '', phone: '', notes: '' });
    load();
  }

  async function saveEdit() {
    if (!editing) return;
    const res = await cohostUpdateBooking(editing.id, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      tour_code: form.tour_code,
      seats: form.seats,
      payment_status: form.payment_status,
      notes: form.notes,
      status: form.status,
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setEditing(null);
    load();
  }

  function startEdit(b: ExtendedBookingRow) {
    setEditing(b);
    setForm({
      name: b.name,
      email: b.email,
      phone: b.phone ?? '',
      tour_code: b.tour_code,
      seats: b.seats,
      payment_status: b.payment_status ?? 'unpaid',
      notes: b.notes ?? '',
      status: b.status,
    });
  }

  return (
    <div>
      <StaffPageHeader staffRole="cohost" title="จองทริป" subtitle="จัดการรายการจองทั้งหมด" />
      <div className="px-4 space-y-4 pb-6">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full rounded-xl bg-companion-card text-companion-text-dark px-3 py-2 text-sm">
          <option value="">ทุกทริป</option>
          {REAL_TOUR_CODES.map((c) => (
            <option key={c} value={c}>
              {c} (เหลือ {seatsLeft(c)} ที่)
            </option>
          ))}
        </select>

        <form onSubmit={saveNew} className="rounded-2xl bg-companion-card text-companion-text-dark p-4 space-y-2 text-sm">
          <p className="font-semibold">{editing ? 'แก้ไขการจอง' : 'เพิ่มลูกทริปใหม่'}</p>
          <input required placeholder="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          <input required type="email" placeholder="อีเมล" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          <input placeholder="เบอร์โทร" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          <select value={form.tour_code} onChange={(e) => setForm({ ...form, tour_code: e.target.value })} className="w-full rounded-lg border px-3 py-2">
            {REAL_TOUR_CODES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input type="number" min={1} value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} className="w-full rounded-lg border px-3 py-2" />
          <select value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })} className="w-full rounded-lg border px-3 py-2">
            {PAYMENT_OPTS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border px-3 py-2">
            {STATUS_OPTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <textarea placeholder="หมายเหตุ" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-lg border px-3 py-2" rows={2} />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          {editing ? (
            <div className="flex gap-2">
              <button type="button" onClick={saveEdit} className="flex-1 rounded-xl bg-companion-accent py-2 font-semibold text-companion-dark">บันทึก</button>
              <button type="button" onClick={() => setEditing(null)} className="flex-1 rounded-xl border py-2">ยกเลิก</button>
            </div>
          ) : (
            <button type="submit" className="w-full rounded-xl bg-companion-accent py-3 font-semibold text-companion-dark">เพิ่มการจอง</button>
          )}
        </form>

        {Object.entries(grouped).map(([code, list]) => (
          <div key={code}>
            <p className="text-sm font-medium text-companion-accent mb-2">
              {code} · เหลือ {seatsLeft(code)} ที่นั่ง
            </p>
            <div className="space-y-2">
              {list.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => startEdit(b)}
                  className="w-full text-left rounded-xl bg-companion-surface border border-white/10 p-3 text-sm"
                >
                  <p className="font-medium">{b.name}</p>
                  <p className="text-white/60 text-xs">{b.email} · {b.seats} ที่ · {b.status}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
