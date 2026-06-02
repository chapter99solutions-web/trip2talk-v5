'use client';

import { useI18n } from '@/lib/i18n';

const STATS = [
  { labelEn: '13 Curated Trips', labelTh: '13 ทริปคัดสรร' },
  { labelEn: 'Small Group Max 6', labelTh: 'Small Group Max 6' },
  { labelEn: 'Led by พี่แสน', labelTh: 'Led by พี่แสน' },
] as const;

export default function HomeTrustBar() {
  const { lang } = useI18n();

  return (
    <section className="relative border-y border-luxury-border bg-luxury-surface">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/60 to-transparent" />
      <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-luxury-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map((stat, i) => (
          <div
            key={stat.labelEn}
            className="home-animate-in px-6 py-10 text-center"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <p className="font-serif text-xl font-light tracking-tight text-luxury-ink md:text-2xl">
              {lang === 'TH' ? stat.labelTh : stat.labelEn}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
