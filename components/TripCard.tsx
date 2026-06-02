'use client';

import Link from 'next/link';
import type { TripRow } from '@/lib/supabase';
import { FLAGSHIP_TOUR_CODE } from '@/lib/constants';
import { tripDisplayTitle } from '@/lib/trip-display';
import { seatsRemaining, tripBookable } from '@/lib/trips';
import { useI18n } from '@/lib/i18n';
import CoverImage from './CoverImage';
import type { TripsListingVariant } from './TripsListingSection';

type TripCardProps = {
  trip: TripRow;
  comingSoon?: boolean;
  featuredLayout?: boolean;
  variant?: TripsListingVariant;
};

export default function TripCard({
  trip,
  comingSoon = false,
  featuredLayout = false,
  variant = 'default',
}: TripCardProps) {
  const { t, lang } = useI18n();
  const remaining = seatsRemaining(trip);
  const { bookable, reason } = tripBookable(trip);
  const title = tripDisplayTitle(trip, lang);
  const isFlagship = trip.tour_code === FLAGSHIP_TOUR_CODE || trip.featured;
  const dimmed = comingSoon;
  const luxury = variant === 'luxury';

  return (
    <article
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        luxury
          ? `bg-luxury-elevated shadow-lg shadow-black/40 ${
              dimmed ? 'opacity-70' : 'group hover:border-luxury-gold/35 hover:shadow-xl hover:shadow-black/50'
            } ${isFlagship ? 'border-luxury-gold ring-1 ring-luxury-gold/30' : 'border-luxury-border'}`
          : `bg-white shadow-sm ${dimmed ? 'opacity-70' : 'group hover:shadow-lg'} ${
              isFlagship ? 'border-gold ring-1 ring-gold/40' : 'border-slate-200'
            }`
      } ${featuredLayout ? 'h-full' : ''}`}
    >
      <div
        className={`relative w-full overflow-hidden ${
          featuredLayout ? 'aspect-[16/10] md:aspect-[2/1]' : 'h-[200px]'
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
          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold ${
              luxury ? 'bg-luxury-gold text-luxury-bg' : 'bg-gold text-navy'
            }`}
          >
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
          className={`font-serif font-semibold ${
            luxury ? 'text-luxury-ink' : 'text-navy'
          } ${featuredLayout ? 'text-xl md:text-2xl' : 'text-lg'}`}
        >
          {title}
        </h3>
        <p className={`text-sm ${luxury ? 'text-luxury-ink-muted' : 'text-slate-500'}`}>
          {trip.duration} · {trip.season}
        </p>
        <p className={`text-lg font-semibold ${luxury ? 'text-luxury-gold-bright' : 'text-teal-dark'}`}>
          ${trip.price}
          <span className={`text-sm font-normal ${luxury ? 'text-luxury-ink-muted' : 'text-slate-500'}`}>
            {' '}
            {t('AUD / person', 'AUD / คน')}
          </span>
        </p>
        <p className={`text-sm ${luxury ? 'text-luxury-ink-muted' : 'text-slate-600'}`}>
          {t('Seats left', 'ที่นั่งเหลือ')}: <strong className={luxury ? 'text-luxury-ink' : ''}>{remaining}</strong>
        </p>
        {bookable ? (
          <Link
            href={`/trips/${trip.tour_code}`}
            className={`mt-2 inline-flex w-full cursor-pointer justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              luxury
                ? 'bg-luxury-gold text-luxury-bg hover:bg-luxury-gold-bright'
                : 'bg-navy text-white hover:bg-navy-light'
            }`}
          >
            {t('View trip', 'ดูทริป')}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className={`mt-2 w-full cursor-not-allowed rounded-full px-4 py-2.5 text-sm font-semibold ${
              luxury ? 'bg-luxury-surface text-luxury-ink-muted' : 'bg-slate-200 text-slate-500'
            }`}
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
