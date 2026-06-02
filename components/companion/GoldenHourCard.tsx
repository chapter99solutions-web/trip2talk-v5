'use client';

import { getCoordsForTour } from '@/lib/companion/coords';
import { getSunTimes } from '@/lib/companion/sun';

type Props = {
  tourCode: string;
  tripDate?: string | null;
};

export default function GoldenHourCard({ tourCode, tripDate }: Props) {
  const { city } = getCoordsForTour(tourCode);
  const coords = getCoordsForTour(tourCode);
  const date = tripDate ? new Date(tripDate + 'T12:00:00') : new Date();
  const { sunrise, sunset } = getSunTimes(coords.lat, coords.lng, date);

  return (
    <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-companion-accent">Golden Hour</p>
      <p className="font-serif text-lg font-semibold mt-1">{city}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-xs text-amber-800">พระอาทิตย์ขึ้น</p>
          <p className="text-lg font-semibold text-amber-900">{sunrise}</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-3">
          <p className="text-xs text-orange-800">พระอาทิตย์ตก</p>
          <p className="text-lg font-semibold text-orange-900">{sunset}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">ประมาณการตามพิกัด — อาจเปลี่ยนตามสภาพอากาศ</p>
    </div>
  );
}
