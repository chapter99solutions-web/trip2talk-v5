'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

function PlatformTripEditor({
  trips,
  onSaved,
  t,
}: {
  trips: TripRow[];
  onSaved: () => Promise<void>;
  t: (en: string, th: string) => string;
}) {
  const [code, setCode] = useState(trips[0]?.tour_code ?? '');
  const trip = trips.find((x) => x.tour_code === code) ?? trips[0];
  const [price, setPrice] = useState(String(trip?.price ?? ''));
  const [maxSeats, setMaxSeats] = useState(String(trip?.max_seats ?? ''));
  const [date, setDate] = useState(trip?.date ?? '');

  useEffect(() => {
    const tr = trips.find((x) => x.tour_code === code);
    if (tr) {
      setPrice(String(tr.price));
      setMaxSeats(String(tr.max_seats));
      setDate(tr.date ?? '');
    }
  }, [code, trips]);

  if (!trip) return null;

  return (
    <form
      className="flex flex-wrap gap-3 items-end"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch('/api/dashboard/trip', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_code: code,
            name: trip.name,
            name_th: trip.name_th,
            price: Number(price),
            max_seats: Number(maxSeats),
            seats_taken: trip.seats_taken,
            duration: trip.duration,
            season: trip.season,
            date: date || null,
            cover_image: trip.cover_image,
            description: trip.description,
          }),
        });
        await onSaved();
      }}
    >
      <label className="text-sm">
        Code
        <select value={code} onChange={(e) => setCode(e.target.value)} className="block mt-1 border rounded-lg px-2 py-2">
          {trips.map((tr) => (
            <option key={tr.tour_code} value={tr.tour_code}>
              {tr.tour_code}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Price
        <input value={price} onChange={(e) => setPrice(e.target.value)} className="block mt-1 border rounded-lg px-2 py-2 w-24" />
      </label>
      <label className="text-sm">
        Max seats
        <input value={maxSeats} onChange={(e) => setMaxSeats(e.target.value)} className="block mt-1 border rounded-lg px-2 py-2 w-20" />
      </label>
      <label className="text-sm">
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="block mt-1 border rounded-lg px-2 py-2" />
      </label>
      <button type="submit" className="rounded-full bg-navy text-white px-4 py-2 text-sm">
        {t('Save', 'บันทึก')}
      </button>
    </form>
  );
}

import { DASHBOARD_PINS, type DashboardRole } from '@/lib/constants';
import type { BookingRow, ExpenseRow, TripRow } from '@/lib/supabase';
import { adjustSeats, markCheckedIn } from '@/app/actions/booking';
import { useI18n } from '@/lib/i18n';

type Props = {
  initialTrips: TripRow[];
  initialBookings: BookingRow[];
  initialExpenses: ExpenseRow[];
};

function roleFromPin(pin: string): DashboardRole | null {
  const entry = Object.entries(DASHBOARD_PINS).find(([, v]) => v === pin);
  return entry ? (entry[0] as DashboardRole) : null;
}

export default function DashboardView({ initialTrips, initialBookings, initialExpenses }: Props) {
  const { t } = useI18n();
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<DashboardRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState(initialTrips);
  const [bookings, setBookings] = useState(initialBookings);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState('');
  const [activeTrip, setActiveTrip] = useState(trips[0]?.tour_code ?? '');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expTour, setExpTour] = useState('');

  const refresh = useCallback(async () => {
    const res = await fetch('/api/dashboard');
    if (!res.ok) return;
    const data = await res.json();
    setTrips(data.trips ?? []);
    setBookings(data.bookings ?? []);
    setExpenses(data.expenses ?? []);
  }, []);

  function tryLogin(e: React.FormEvent) {
    e.preventDefault();
    const r = roleFromPin(pin);
    if (!r) {
      setError(t('Invalid PIN', 'รหัสไม่ถูกต้อง'));
      return;
    }
    setError(null);
    setRole(r);
    sessionStorage.setItem('t2t_dashboard_role', r);
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('t2t_dashboard_role') as DashboardRole | null;
    if (stored && Object.keys(DASHBOARD_PINS).includes(stored)) setRole(stored);
  }, []);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.booking_ref.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q)
    );
  }, [bookings, search]);

  const revenue = useMemo(() => {
    const prices = new Map(trips.map((tr) => [tr.tour_code, tr.price]));
    return bookings.reduce((s, b) => {
      if (b.status === 'cancelled') return s;
      return s + (prices.get(b.tour_code) ?? 0) * b.seats;
    }, 0);
  }, [bookings, trips]);

  const expenseTotal = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  if (!role) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <form onSubmit={tryLogin} className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl space-y-4">
          <h1 className="font-serif text-2xl text-navy text-center">{t('Staff access', 'เข้าสู่ระบบทีมงาน')}</h1>
          <p className="text-sm text-slate-500 text-center">{t('Enter 4-digit PIN', 'กรอกรหัส 4 หลัก')}</p>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full text-center text-2xl tracking-[0.5em] border border-slate-300 rounded-xl py-3"
          />
          <button type="submit" className="w-full rounded-full bg-navy text-white py-3 font-semibold">
            {t('Enter', 'เข้าใช้งาน')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy text-white px-4 py-4 flex justify-between items-center">
        <span className="font-semibold capitalize">{role} dashboard</span>
        <button
          type="button"
          className="text-sm text-white/80 hover:text-white"
          onClick={() => {
            sessionStorage.removeItem('t2t_dashboard_role');
            setRole(null);
            setPin('');
          }}
        >
          {t('Logout', 'ออก')}
        </button>
      </header>
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {role === 'staff' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-xl text-navy">{t('Upcoming bookings', 'การจองที่จะมาถึง')}</h2>
            <input
              placeholder={t('Search name or ref…', 'ค้นหาชื่อหรือรหัส…')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b">
                    <th className="py-2">Ref</th>
                    <th>Name</th>
                    <th>Trip</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="border-b border-slate-100">
                      <td className="py-2 font-mono text-xs">{b.booking_ref}</td>
                      <td>{b.name}</td>
                      <td>{b.tour_code}</td>
                      <td>{b.seats}</td>
                      <td>{b.status}</td>
                      <td>
                        {b.status !== 'checked_in' && (
                          <button
                            type="button"
                            className="text-teal-dark text-xs font-semibold"
                            onClick={async () => {
                              await markCheckedIn(b.booking_ref);
                              await refresh();
                            }}
                          >
                            {t('Check in', 'เช็คอิน')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {role === 'cohost' && (
          <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-xl text-navy">{t('Active trip', 'ทริปที่กำลังดำเนิน')}</h2>
            <select
              value={activeTrip}
              onChange={(e) => setActiveTrip(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
            >
              {trips.map((tr) => (
                <option key={tr.tour_code} value={tr.tour_code}>
                  {tr.tour_code} — {tr.name}
                </option>
              ))}
            </select>
            {(() => {
              const tr = trips.find((x) => x.tour_code === activeTrip);
              if (!tr) return null;
              const left = tr.max_seats - tr.seats_taken;
              return (
                <div className="flex items-center gap-4">
                  <p>
                    {t('Seats', 'ที่นั่ง')}: {tr.seats_taken}/{tr.max_seats} ({left} {t('left', 'เหลือ')})
                  </p>
                  <button
                    type="button"
                    className="rounded-full bg-navy text-white px-4 py-2 text-sm"
                    onClick={async () => {
                      await adjustSeats(activeTrip, 1);
                      await refresh();
                    }}
                  >
                    Walk-in +1
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm"
                    onClick={async () => {
                      await adjustSeats(activeTrip, -1);
                      await refresh();
                    }}
                  >
                    -1
                  </button>
                </div>
              );
            })()}
          </section>
        )}

        {role === 'owner' && (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-slate-500 text-sm">{t('Revenue', 'รายได้')}</p>
                <p className="text-2xl font-semibold text-navy">${revenue}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-slate-500 text-sm">{t('Expenses', 'ค่าใช้จ่าย')}</p>
                <p className="text-2xl font-semibold text-navy">${expenseTotal}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-slate-500 text-sm">P&amp;L</p>
                <p className="text-2xl font-semibold text-teal-dark">${revenue - expenseTotal}</p>
              </div>
            </div>
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif text-xl text-navy mb-4">{t('Add expense', 'บันทึกค่าใช้จ่าย')}</h2>
              <form
                className="flex flex-wrap gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await fetch('/api/dashboard/expense', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      tour_code: expTour || null,
                      description: expDesc,
                      amount: Number(expAmount),
                    }),
                  });
                  setExpDesc('');
                  setExpAmount('');
                  await refresh();
                }}
              >
                <input
                  placeholder={t('Description', 'รายละเอียด')}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  required
                  className="border rounded-lg px-3 py-2 flex-1 min-w-[140px]"
                />
                <input
                  type="number"
                  placeholder="AUD"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  required
                  className="border rounded-lg px-3 py-2 w-24"
                />
                <select value={expTour} onChange={(e) => setExpTour(e.target.value)} className="border rounded-lg px-2">
                  <option value="">{t('General', 'ทั่วไป')}</option>
                  {trips.map((tr) => (
                    <option key={tr.tour_code} value={tr.tour_code}>
                      {tr.tour_code}
                    </option>
                  ))}
                </select>
                <button type="submit" className="rounded-full bg-navy text-white px-4 py-2 text-sm">
                  {t('Add', 'เพิ่ม')}
                </button>
              </form>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
              <h2 className="font-serif text-xl text-navy mb-4">{t('Bookings', 'การจอง')}</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b">
                    <th className="py-2">Ref</th>
                    <th>Name</th>
                    <th>Trip</th>
                    <th>Seats</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b">
                      <td className="py-2 font-mono text-xs">{b.booking_ref}</td>
                      <td>{b.name}</td>
                      <td>{b.tour_code}</td>
                      <td>{b.seats}</td>
                      <td>{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {role === 'platform' && (
          <>
            <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-xl text-navy">{t('Edit trip', 'แก้ไขทริป')}</h2>
              <PlatformTripEditor trips={trips} onSaved={refresh} t={t} />
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
              <h2 className="font-serif text-xl text-navy mb-4">{t('Trips', 'ทริป')}</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b">
                    <th>Code</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Seats</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((tr) => (
                    <tr key={tr.tour_code} className="border-b">
                      <td className="py-2">{tr.tour_code}</td>
                      <td>{tr.name}</td>
                      <td>${tr.price}</td>
                      <td>
                        {tr.seats_taken}/{tr.max_seats}
                      </td>
                      <td>{tr.date ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
              <h2 className="font-serif text-xl text-navy mb-4">{t('Raw bookings', 'ข้อมูลจองดิบ')}</h2>
              <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(bookings, null, 2)}</pre>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
