'use client';

import { useRequireCompanion } from '@/components/companion/CompanionProvider';
import { getTimelineFallback, STOP_TYPE_ICON } from '@/lib/companion/content';
import { daysUntilTrip } from '@/lib/companion/sun';

export default function CompanionTimelinePage() {
  const { session, ready } = useRequireCompanion();
  if (!ready || !session) return null;

  const { trip } = session;
  const days = getTimelineFallback(trip.tour_code);
  const offset = daysUntilTrip(trip.date);
  const currentDay =
    offset !== null && offset >= 0 && offset < days.length ? offset + 1 : null;

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="font-serif text-2xl font-semibold mb-1">ไทม์ไลน์ทริป</h1>
      <p className="text-white/60 text-sm mb-6">Day-by-day itinerary</p>

      <div className="space-y-4">
        {days.map((day) => {
          const isCurrent = currentDay === day.day;
          return (
            <div
              key={day.day}
              className={`rounded-2xl border p-4 ${
                isCurrent
                  ? 'border-companion-accent bg-companion-accent/10'
                  : 'border-white/10 bg-companion-surface'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    isCurrent ? 'bg-companion-accent text-companion-dark' : 'bg-white/10'
                  }`}
                >
                  D{day.day}
                </span>
                <div>
                  <p className="font-semibold">{day.titleTh}</p>
                  <p className="text-xs text-white/50">{day.title}</p>
                  {isCurrent && (
                    <span className="text-xs text-companion-accent font-medium">วันนี้</span>
                  )}
                </div>
              </div>
              <ul className="space-y-2">
                {day.stops.map((stop, i) => (
                  <li
                    key={`${stop.name}-${i}`}
                    className="flex items-start gap-2 rounded-xl bg-companion-card px-3 py-2 text-sm text-companion-text-dark"
                  >
                    <span>{STOP_TYPE_ICON[stop.type]}</span>
                    <span>
                      {stop.nameTh ?? stop.name}
                      <span className="block text-xs text-slate-400 capitalize">{stop.type}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/40 mt-6 text-center">
        ข้อมูลจากแผนทริป — อัปเดตจากชีต Trip info เร็วๆ นี้
      </p>
    </div>
  );
}
