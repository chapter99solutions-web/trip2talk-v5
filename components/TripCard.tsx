'use client';

import Link from 'next/link';
import type { TripRow } from '@/lib/supabase';
import { FLAGSHIP_TOUR_CODE } from '@/lib/constants';
import { tripDisplayTitle } from '@/lib/trip-display';
import { seatsRemaining, tripBookable } from '@/lib/trips';
import { useI18n } from '@/lib/i18n';
import CoverImage from './CoverImage';

type TripCardProps = {
  trip: TripRow;
  comingSoon?: boolean;
  featuredLayout?: boolean;
};

export default function TripCard({
  trip,
  comingSoon = false,
  featuredLayout = false,
}: TripCardProps) {
  const { t, lang } = useI18n();
  const remaining = seatsRemaining(trip);
  const { bookable, reason } = tripBookable(trip);
  const title = tripDisplayTitle(trip, lang);
  const isFlagship = trip.tour_code === FLAGSHIP_TOUR_CODE || trip.featured;
  const dimmed = comingSoon;

  return (
    <article
      className={`rounded-2xl overflow-hidden border bg-white shadow-sm transition-shadow duration-150 ${
        dimmed ? 'opacity-70' : 'group hover:shadow-lg'
      } ${isFlagship ? 'border-gold ring-1 ring-gold/40' : 'border-slate-200'} ${
        featuredLayout ? 'h-full' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          featuredLayout ? 'aspect-[16/10] md:aspect-[2/1]' : 'aspect-[4/3]'
        }`}
      >
        <CoverImage
          src={trip.cover_image}
          alt={title}
          tourCode={trip.tour_code}
          className="absolute inset-0 w-full h-full"
          imgClassName={`w-full h-full object-cover transition-transform duration-500 ${
            dimmed ? '' : 'group-hover:scale-105'
          }`}
        />
        {isFlagship && (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">
            {t('Flagship', 'ทริปไฮไลท์')}
          </span>
        )}
        {reason === 'full' && (
          <span className="absolute top-3 right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            {t('Full', 'เต็มแล้ว')}
          </span>
        )}
        {reason === 'soon' && (
          <span className="absolute top-3 right-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
            {t('Coming soon', 'เร็วๆ นี้')}
          </span>
        )}
      </div>
      <div className={`space-y-2 ${featuredLayout ? 'p-6' : 'p-5'}`}>
        <h3
          className={`font-serif font-semibold text-navy ${
            featuredLayout ? 'text-xl md:text-2xl' : 'text-lg'
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-slate-500">
          {trip.duration} · {trip.season}
        </p>
        <p className="text-lg font-semibold text-teal-dark">
          ${trip.price}
          <span className="text-sm font-normal text-slate-500"> {t('AUD / person', 'AUD / คน')}</span>
        </p>
        <p className="text-sm text-slate-600">
          {t('Seats left', 'ที่นั่งเหลือ')}: <strong>{remaining}</strong>
        </p>
        {bookable ? (
          <Link
            href={`/trips/${trip.tour_code}`}
            className="mt-2 inline-flex w-full justify-center rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
          >
            {t('View trip', 'ดูทริป')}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="mt-2 w-full rounded-full bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed"
          >
            {reason === 'full'
              ? t('Full', 'เต็มแล้ว')
              : reason === 'soon'
                ? t('Coming soon', 'เร็วๆ นี้')
                : t('Unavailable', 'ไม่พร้อมจอง')}
          </button>
        )}
      </div>
    </article>
  );
}
