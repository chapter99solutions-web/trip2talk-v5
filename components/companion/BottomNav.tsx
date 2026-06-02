'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompanion } from './CompanionProvider';
import { GUEST_NAV, STAFF_NAV } from '@/lib/companion/staff-nav';
import { sessionStaffRole } from '@/lib/companion/staff-session';

export default function CompanionBottomNav() {
  const pathname = usePathname();
  const { session } = useCompanion();

  if (!session) return null;

  const staffRole = sessionStaffRole(session);
  const tabs = staffRole ? STAFF_NAV[staffRole] : GUEST_NAV;

  return (
    <nav
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[390px]"
      aria-label="Companion navigation"
    >
      <div className="flex items-center justify-between gap-1 rounded-full bg-companion-surface/95 backdrop-blur-md border border-white/10 px-2 py-2 shadow-2xl overflow-x-auto">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            pathname.startsWith(tab.href + '/') ||
            (tab.href === '/companion/owner/finance' && pathname === '/companion/finance');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 min-w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-full py-2 px-0.5 text-[9px] font-medium transition-colors ${
                active ? 'bg-companion-accent text-companion-dark' : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {tab.icon}
              </span>
              <span className="mt-0.5 leading-tight text-center">{tab.labelTh}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
