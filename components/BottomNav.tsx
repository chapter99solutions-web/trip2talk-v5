'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

const ITEMS = [
  { href: '/', icon: '⌂', en: 'Home', th: 'หน้าแรก' },
  { href: '/calendar', icon: '▦', en: 'Calendar', th: 'ปฏิทิน' },
  { href: '/saved', icon: '♡', en: 'Saved', th: 'บันทึก' },
  { href: '/dashboard', icon: '◉', en: 'Portal', th: 'พอร์ทัล' },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { t, lang } = useI18n();

  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
      aria-label="Main"
    >
      <div className="grid grid-cols-5 items-end h-16 max-w-lg mx-auto">
        {ITEMS.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-2 text-xs ${
              pathname === item.href ? 'text-navy font-semibold' : 'text-slate-500'
            }`}
          >
            <span className="text-lg leading-none" aria-hidden>
              {item.icon}
            </span>
            <span className="mt-0.5">{lang === 'TH' ? item.th : item.en}</span>
          </Link>
        ))}

        <div className="flex justify-center -mt-5">
          <Link
            href="/"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-lg ring-4 ring-white font-serif text-sm font-bold"
            aria-label={t('Trip2Talk home', 'หน้าแรก Trip2Talk')}
          >
            T2T
          </Link>
        </div>

        {ITEMS.slice(2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-2 text-xs ${
              pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/dashboard'))
                ? 'text-navy font-semibold'
                : 'text-slate-500'
            }`}
          >
            <span className="text-lg leading-none" aria-hidden>
              {item.icon}
            </span>
            <span className="mt-0.5">{lang === 'TH' ? item.th : item.en}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
