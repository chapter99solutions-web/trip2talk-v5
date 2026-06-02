'use client';

import type { TripRow } from '@/lib/supabase';
import { TRIP_CATEGORIES, countTripsInCategory, type TripCategory } from '@/lib/trip-categories';

type Props = {
  trips: TripRow[];
  active: TripCategory;
  onSelect: (category: TripCategory) => void;
};

export default function TripCategoryFilters({ trips, active, onSelect }: Props) {
  return (
    <div
      className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm md:top-20"
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
              className={`shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                isActive
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
