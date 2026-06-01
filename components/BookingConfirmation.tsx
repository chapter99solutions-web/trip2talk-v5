'use client';

import Link from 'next/link';
import type { TripRow } from '@/lib/supabase';
import { tripDisplayTitle } from '@/lib/trip-display';
import { useI18n } from '@/lib/i18n';

export default function BookingConfirmation({
  trip,
  bookingRef,
  seats,
}: {
  trip: TripRow;
  bookingRef: string;
  seats: number;
}) {
  const { t, lang } = useI18n();
  const title = tripDisplayTitle(trip, lang);
  const total = trip.price * seats;

  function addToCalendar() {
    if (!trip.date) return;
    const start = trip.date.replace(/-/g, '');
    const end = start;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Trip2Talk: ${title}`
    )}&dates=${start}/${end}&details=${encodeURIComponent(`Ref: ${bookingRef}`)}`;
    window.open(url, '_blank');
  }

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <div className="rounded-full bg-teal-light w-16 h-16 flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>
      <h1 className="font-serif text-2xl text-navy">{t('Booking confirmed', 'จองสำเร็จ')}</h1>
      <dl className="text-left bg-slate-50 rounded-2xl p-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">{t('Reference', 'รหัสจอง')}</dt>
          <dd className="font-mono font-semibold">{bookingRef}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">{t('Trip', 'ทริป')}</dt>
          <dd>{title}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">{t('Seats', 'ที่นั่ง')}</dt>
          <dd>{seats}</dd>
        </div>
        <div className="flex justify-between border-t pt-3">
          <dt className="text-slate-500">{t('Total', 'รวม')}</dt>
          <dd className="font-semibold text-teal-dark">${total} AUD</dd>
        </div>
      </dl>
      {trip.date && (
        <button
          type="button"
          onClick={addToCalendar}
          className="w-full rounded-full border border-navy text-navy py-3 text-sm font-semibold hover:bg-navy hover:text-white transition-colors"
        >
          {t('Add to calendar', 'เพิ่มในปฏิทิน')}
        </button>
      )}
      <Link href="/" className="inline-block text-sm text-emerald-700 hover:underline">
        ← {t('Back to trips', 'กลับหน้าทริป')}
      </Link>
    </div>
  );
}
