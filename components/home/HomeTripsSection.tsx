'use client';

import { Suspense } from 'react';
import type { TripRow } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import TripsListingSection from '../TripsListingSection';

export default function HomeTripsSection({ trips }: { trips: TripRow[] }) {
  const { t } = useI18n();

  return (
    <section id="trips" className="scroll-mt-0 bg-luxury-bg px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="home-animate-in mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-luxury-gold">
            {t('Curated departures', 'ทริปคัดสรร')}
          </p>
          <h2
            className="font-serif text-3xl font-light tracking-tight text-luxury-ink md:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {t('Our trips', 'ทริปของเรา')}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-luxury-ink-muted md:text-base">
            {t('Curated journeys — no filler packages.', 'ทริปคัดสรร — ไม่มีแพ็กเกจปลอม')}
          </p>
          <div className="mx-auto mt-8 h-px w-12 bg-luxury-gold/50" />
        </div>

        <Suspense
          fallback={
            <p className="py-16 text-center text-sm text-luxury-ink-muted">
              {t('Loading journeys…', 'กำลังโหลดทริป…')}
            </p>
          }
        >
          <TripsListingSection trips={trips} variant="luxury" />
        </Suspense>
      </div>
    </section>
  );
}
