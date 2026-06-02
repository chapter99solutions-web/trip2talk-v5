'use client';

import type { TripRow } from '@/lib/supabase';
import { TRIP_CATEGORIES, countTripsInCategory, type TripCategory } from '@/lib/trip-categories';

import type { TripsListingVariant } from './TripsListingSection';

type Props = {
  trips: TripRow[];
  active: TripCategory;
  onSelect: (category: TripCategory) => void;
  variant?: TripsListingVariant;
};

export default function TripCategoryFilters({ trips, active, onSelect, variant = 'default' }: Props) {
  const luxury = variant === 'luxury';

  return (
    <div
      className={
        luxury
          ? 'sticky top-0 z-20 -mx-4 border-b border-luxury-border bg-luxury-bg/90 px-4 py-4 backdrop-blur-md md:top-0'
          : 'sticky top-16 z-20 -mx-4 border-b border-slate-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md md:top-20'
      }
      role="tablist"
      aria-label="Trip categories"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin snap-x snap-mandatory">
        {TRIP_CATEGORIES.map((cat) => {
          const count = countTripsInCategory(trips, cat);
          const isActive = active.id === cat.id;
          const label =
            cat.id === 'all'
              ? `${cat.labelTh} (${count})`
              : `${cat.emoji} ${cat.labelTh} (${count})`.trim();
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(cat)}
              className={`shrink-0 cursor-pointer snap-start rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                luxury
                  ? isActive
                    ? 'bg-luxury-gold text-luxury-bg shadow-md shadow-black/30'
                    : 'border border-luxury-border bg-luxury-elevated text-luxury-ink-muted hover:border-luxury-gold/40 hover:text-luxury-ink'
                  : isActive
                    ? 'bg-navy text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-navy/30 hover:text-navy'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
