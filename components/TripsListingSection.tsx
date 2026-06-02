'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { TripRow } from '@/lib/supabase';
import { sortTripsForDisplay } from '@/lib/seed-trips';
import {
  categoryBySlug,
  filterTripsByCategory,
  partitionTripsForDisplay,
  type TripCategory,
} from '@/lib/trip-categories';
import { useI18n } from '@/lib/i18n';
import TripCategoryFilters from './TripCategoryFilters';
import TripsGrid from './TripsGrid';

type Props = {
  trips: TripRow[];
  /** When true, filter changes navigate to /trips?cat= */
  useTripsRoute?: boolean;
  id?: string;
  className?: string;
};

export default function TripsListingSection({
  trips,
  useTripsRoute = false,
  id = 'trips',
  className = '',
}: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = useTripsRoute ? searchParams.get('cat') : null;
  const activeCategory = categoryBySlug(slug);

  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const sortedAll = useMemo(() => sortTripsForDisplay(trips), [trips]);

  const filtered = useMemo(
    () => sortTripsForDisplay(filterTripsByCategory(sortedAll, activeCategory)),
    [sortedAll, activeCategory]
  );

  const { bookable, comingSoon } = useMemo(
    () => partitionTripsForDisplay(filtered),
    [filtered]
  );

  const showComingSoonSection =
    activeCategory.id === 'all' && comingSoon.length > 0;

  const displayBookable = useMemo(() => {
    if (activeCategory.id !== 'all') return filtered;
    return bookable;
  }, [activeCategory.id, filtered, bookable]);

  const onSelectCategory = useCallback(
    (cat: TripCategory) => {
      setComingSoonOpen(false);
      if (useTripsRoute) {
        const q = cat.slug === 'all' ? '' : `?cat=${cat.slug}`;
        router.push(`/trips${q}`, { scroll: false });
        return;
      }
      router.push(cat.slug === 'all' ? '/trips' : `/trips?cat=${cat.slug}`);
    },
    [router, useTripsRoute]
  );

  const gridKey = `${activeCategory.slug}-${displayBookable.length}-${comingSoon.length}`;

  return (
    <section id={id} className={`scroll-mt-20 ${className}`}>
      <TripCategoryFilters trips={sortedAll} active={activeCategory} onSelect={onSelectCategory} />

      <div className="mt-8">
        <TripsGrid trips={displayBookable} animationKey={`bookable-${gridKey}`} />

        {showComingSoonSection && (
          <div className="mt-10 col-span-full">
            <button
              type="button"
              onClick={() => setComingSoonOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-navy hover:bg-slate-100"
              aria-expanded={comingSoonOpen}
            >
              <span>
                {t('Upcoming trips', 'ทริปที่กำลังจะมา')} ({comingSoon.length})
              </span>
              <span className="text-slate-400" aria-hidden>
                {comingSoonOpen ? '▴' : '▾'}
              </span>
            </button>
            {comingSoonOpen && (
              <div className="mt-4">
                <TripsGrid trips={comingSoon} animationKey={`soon-${gridKey}`} />
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
