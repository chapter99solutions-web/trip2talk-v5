'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/companion/home', icon: '🏠', label: 'Home', labelTh: 'หน้าแรก' },
  { href: '/companion/prepare', icon: '🎒', label: 'Prepare', labelTh: 'เตรียมตัว' },
  { href: '/companion/rules', icon: '📋', label: 'Rules', labelTh: 'กฎ' },
  { href: '/companion/timeline', icon: '📅', label: 'Timeline', labelTh: 'ไทม์ไลน์' },
  { href: '/companion/booking', icon: '👤', label: 'Profile', labelTh: 'โปรไฟล์' },
] as const;

export default function CompanionBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[390px]"
      aria-label="Companion navigation"
    >
      <div className="flex items-center justify-between gap-1 rounded-full bg-companion-surface/95 backdrop-blur-md border border-white/10 px-2 py-2 shadow-2xl">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center rounded-full py-2 px-1 text-[10px] font-medium transition-colors ${
                active ? 'bg-companion-accent text-companion-dark' : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {tab.icon}
              </span>
              <span className="mt-0.5">{tab.labelTh}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
