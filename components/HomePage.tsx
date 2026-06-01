'use client';

import type { TripRow } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import SiteHeader from './SiteHeader';
import HeroSlideshow from './HeroSlideshow';
import TripCard from './TripCard';
import LangToggle from './LangToggle';

const STATS = [
  {
    labelEn: '8 Curated Trips',
    labelTh: '8 ทริปคัดสรร',
  },
  {
    labelEn: 'Small Group Max 6',
    labelTh: 'Small Group Max 6',
  },
  {
    labelEn: 'Led by พี่แสน',
    labelTh: 'Led by พี่แสน',
  },
] as const;

export default function HomePage({ trips, slides }: { trips: TripRow[]; slides: string[] }) {
  const { t, lang } = useI18n();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen min-h-[560px] flex flex-col">
        <HeroSlideshow images={slides} />
        <div className="absolute top-4 right-4 z-30 md:hidden">
          <LangToggle />
        </div>
        <SiteHeader dark />
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center text-center px-4 pb-24">
          <h1 className="font-serif text-4xl md:text-6xl text-white font-semibold max-w-3xl drop-shadow-lg">
            Capture the World, One Journey
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-xl">
            {t(
              'Private Photo Journeys — small groups, real light, your story.',
              'ทริปถ่ายภาพส่วนตัว — กลุ่มเล็ก แสงจริง เรื่องราวของคุณ'
            )}
          </p>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.labelEn}>
              <p className="font-serif text-xl md:text-2xl text-navy font-semibold">
                {lang === 'TH' ? stat.labelTh : stat.labelEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="trips" className="max-w-6xl mx-auto px-4 py-16 md:py-24 scroll-mt-20">
        <h2 className="font-serif text-2xl md:text-3xl text-navy text-center mb-2">
          {t('Our trips', 'ทริปของเรา')}
        </h2>
        <p className="text-center text-slate-500 mb-10 text-sm">
          {t('Eight curated journeys — no filler packages.', 'แปดทริปคัดสรร — ไม่มีแพ็กเกจปลอม')}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.tour_code} trip={trip} />
          ))}
        </div>
      </section>
    </div>
  );
}
