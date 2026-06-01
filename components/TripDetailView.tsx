'use client';

import Link from 'next/link';
import type { TripRow } from '@/lib/supabase';
import { isMultiDayTrip } from '@/lib/constants';
import { seatsRemaining, tripBookable } from '@/lib/trips';
import { useI18n } from '@/lib/i18n';
import BookingForm from './BookingForm';

const INCLUDES = [
  'Professional photo guide for the full trip',
  'Curated locations and timing for best light',
  'Small group — never a crowded bus',
];

const EXCLUDES = ['Flights', 'Travel insurance', 'Personal expenses', 'Meals unless noted'];

export default function TripDetailView({ trip }: { trip: TripRow }) {
  const { t, lang } = useI18n();
  const title = lang === 'TH' && trip.name_th ? trip.name_th : trip.name;
  const remaining = seatsRemaining(trip);
  const { reason } = tripBookable(trip);
  const multiDay = isMultiDayTrip(trip.duration);
  const showPaymentPlan = trip.price > 500;
  const installment = showPaymentPlan ? Math.round((trip.price - 100) / 2) : 0;

  return (
    <div>
      <div className="relative h-[55vh] min-h-[320px]">
        {trip.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.cover_image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'translateZ(0)' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl">
          <p className="text-gold text-sm font-medium tracking-wide">{trip.tour_code}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-semibold mt-1">{title}</h1>
          <p className="text-white/80 mt-2">
            {trip.duration} · {trip.season} · ${trip.price} AUD
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h2 className="font-serif text-2xl text-navy mb-3">{t('Overview', 'ภาพรวม')}</h2>
          <p className="text-slate-600 leading-relaxed">{trip.description}</p>
          <p className="mt-3 text-sm text-slate-500">
            {t('Seats remaining', 'ที่นั่งเหลือ')}: {remaining}
            {reason === 'soon' && (
              <span className="ml-2 text-amber-600 font-medium">({t('Coming soon', 'เร็วๆ นี้')})</span>
            )}
            {reason === 'full' && (
              <span className="ml-2 text-red-600 font-medium">({t('Full', 'เต็มแล้ว')})</span>
            )}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-3">{t('Itinerary', 'กำหนดการ')}</h2>
          <p className="text-slate-600">
            {t(
              'Your Private Photo Journey is shaped around golden-hour light, comfortable pacing, and portrait-friendly locations. Full day-by-day timing is shared after booking.',
              'ทริปถ่ายภาพส่วนตัวของคุณออกแบบรอบแสงทอง จังหวะสบาย และจุดถ่ายที่เหมาะกับ portrait — รายละเอียดรายวันแจ้งหลังจอง'
            )}
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-serif text-xl text-navy mb-3">{t('Includes', 'รวมในราคา')}</h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              {INCLUDES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-xl text-navy mb-3">{t('Excludes', 'ไม่รวม')}</h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              {EXCLUDES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {multiDay && (
          <section>
            <h2 className="font-serif text-2xl text-navy mb-3">{t('Meeting point', 'จุดนัดพบ')}</h2>
            <p className="text-slate-600">Sydney International Airport (T1)</p>
          </section>
        )}

        {showPaymentPlan && (
          <section className="rounded-2xl border border-teal/30 bg-teal-light/50 p-6">
            <h2 className="font-serif text-xl text-navy mb-3">{t('Payment plan', 'แผนชำระเงิน')}</h2>
            <ul className="text-slate-700 space-y-2">
              <li>$100 {t('deposit to secure your seat', 'มัดจำเพื่อจองที่นั่ง')}</li>
              <li>
                2 × ${installment} AUD {t('installments before departure', 'งวดก่อนออกทริป')}
              </li>
            </ul>
          </section>
        )}

        <section id="book">
          <BookingForm trip={trip} />
        </section>

        <p>
          <Link href="/" className="text-emerald-700 hover:underline text-sm">
            ← {t('All trips', 'ทริปทั้งหมด')}
          </Link>
        </p>
      </div>
    </div>
  );
}
