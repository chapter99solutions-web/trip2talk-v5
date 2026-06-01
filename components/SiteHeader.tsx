'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import LangToggle from './LangToggle';

const NAV = [
  { href: '/#trips', en: 'Trips', th: 'ทริป' },
  { href: '/gallery', en: 'Gallery', th: 'แกลเลอรี' },
  { href: '/reviews', en: 'Reviews', th: 'รีวิว' },
  { href: '/about', en: 'About', th: 'เกี่ยวกับ' },
  { href: '/contact', en: 'Contact', th: 'ติดต่อ' },
  { href: '/pricing', en: 'Pricing', th: 'ราคา' },
] as const;

export default function SiteHeader({ dark = false }: { dark?: boolean }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const linkClass = dark
    ? 'text-white/90 hover:text-white'
    : 'text-slate-600 hover:text-navy';

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        <Link href="/" className={`font-serif text-xl font-semibold shrink-0 ${dark ? 'text-white' : 'text-navy'}`}>
          Trip2Talk
        </Link>
        <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-sm font-medium">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${linkClass} ${pathname === item.href ? 'underline underline-offset-4' : ''}`}
            >
              {t(item.en, item.th)}
            </Link>
          ))}
          <LangToggle />
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <LangToggle />
        </div>
      </div>
    </header>
  );
}
