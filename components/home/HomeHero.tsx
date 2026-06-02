'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import HeroVideoBackground from '../HeroVideoBackground';
import SiteHeader from '../SiteHeader';
import LangToggle from '../LangToggle';

export default function HomeHero() {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-screen min-h-[100dvh] flex-col">
      <HeroVideoBackground />

      <div className="absolute top-4 right-4 z-30 md:hidden">
        <LangToggle />
      </div>

      <SiteHeader dark />

      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-4 pb-28 pt-24 text-center md:pb-32">
        <p className="home-animate-in mb-5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-luxury-gold-bright md:text-xs">
          {t('Australia · Private Photo Journeys', 'ออสเตรเลีย · ทริปถ่ายภาพส่วนตัว')}
        </p>

        <div className="home-gold-line mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-luxury-gold to-transparent md:w-24" />

        <h1
          className="home-animate-in home-animate-in-delay-1 font-serif text-[clamp(2.25rem,6vw,4.5rem)] font-light leading-[1.08] text-luxury-ink max-w-4xl"
          style={{ textWrap: 'balance' }}
        >
          Capture the World, One Journey
        </h1>

        <p
          className="home-animate-in home-animate-in-delay-2 mt-6 max-w-xl text-base leading-relaxed text-luxury-ink-muted md:text-lg"
          style={{ textWrap: 'pretty' }}
        >
          {t(
            'Private Photo Journeys — small groups, real light, your story.',
            'ทริปถ่ายภาพส่วนตัว — กลุ่มเล็ก แสงจริง เรื่องราวของคุณ'
          )}
        </p>

        <div className="home-animate-in home-animate-in-delay-3 mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="#trips"
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-luxury-gold px-8 py-3.5 text-sm font-semibold tracking-wide text-luxury-bg transition-all duration-300 hover:bg-luxury-gold-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-gold"
          >
            {t('Explore journeys', 'ดูทริปทั้งหมด')}
          </Link>
          <Link
            href="/trips/NZ-6D5N"
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-luxury-gold/50 bg-white/5 px-8 py-3.5 text-sm font-semibold tracking-wide text-luxury-ink backdrop-blur-sm transition-all duration-300 hover:border-luxury-gold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxury-gold"
          >
            {t('Flagship: New Zealand', 'ทริปไฮไลท์: นิวซีแลนด์')}
          </Link>
        </div>
      </div>

      <a
        href="#trips"
        className="home-scroll-cue absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-luxury-ink-muted transition-colors duration-300 hover:text-luxury-gold"
        aria-label={t('Scroll to trips', 'เลื่อนไปดูทริป')}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.25em]">{t('Discover', 'สำรวจ')}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-80">
          <path
            d="M12 5v14M5 13l7 7 7-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
