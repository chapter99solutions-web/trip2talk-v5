'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitBooking } from '@/app/actions/booking';
import type { TripRow } from '@/lib/supabase';
import { tripBookable } from '@/lib/trips';
import { useI18n } from '@/lib/i18n';

export default function BookingForm({ trip }: { trip: TripRow }) {
  const { t } = useI18n();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { bookable } = tripBookable(trip);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!bookable) return;
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set('tour_code', trip.tour_code);
    const result = await submitBooking(fd);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(
      `/booking/${trip.tour_code}?ref=${encodeURIComponent(result.bookingRef)}&seats=${fd.get('seats')}`
    );
  }

  if (!bookable) {
    return (
      <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
        {t('This trip is not open for booking yet.', 'ทริปนี้ยังไม่เปิดจอง')}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 p-6 bg-slate-50">
      <h3 className="font-serif text-xl font-semibold text-navy">{t('Book this trip', 'จองทริปนี้')}</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-600">{t('Full name', 'ชื่อ-นามสกุล')}</span>
          <input name="name" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Email</span>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">{t('Phone', 'โทรศัพท์')}</span>
          <input name="phone" type="tel" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">{t('Seats', 'จำนวนที่นั่ง')}</span>
          <input
            name="seats"
            type="number"
            min={1}
            max={trip.max_seats - trip.seats_taken}
            defaultValue={1}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
      >
        {loading ? t('Booking…', 'กำลังจอง…') : t('Confirm booking', 'ยืนยันการจอง')}
      </button>
    </form>
  );
}
