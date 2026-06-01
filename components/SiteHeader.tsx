'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import LangToggle from './LangToggle';

export default function SiteHeader({ dark = false }: { dark?: boolean }) {
  const { t } = useI18n();
  const linkClass = dark
    ? 'text-white/90 hover:text-white'
    : 'text-slate-600 hover:text-navy';

  return (
    <header className={`absolute top-0 left-0 right-0 z-30 px-4 py-4`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className={`font-serif text-xl font-semibold ${dark ? 'text-white' : 'text-navy'}`}>
          Trip2Talk
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className={linkClass}>
            {t('Trips', 'ทริป')}
          </Link>
          <Link href="/gallery" className={linkClass}>
            {t('Gallery', 'แกลเลอรี')}
          </Link>
          <Link href="/dashboard" className={linkClass}>
            {t('Ops', 'ทีมงาน')}
          </Link>
          <LangToggle />
        </nav>
      </div>
    </header>
  );
}
