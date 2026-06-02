'use client';

import { usePathname } from 'next/navigation';
import { CompanionProvider } from './CompanionProvider';
import CompanionBottomNav from './BottomNav';

export default function CompanionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav =
    pathname.startsWith('/companion/') &&
    pathname !== '/companion' &&
    pathname !== '/companion/onboarding';

  return (
    <CompanionProvider>
      <div className="min-h-screen bg-companion-dark text-white max-w-[430px] mx-auto relative">
        <div className={showNav ? 'pb-28' : ''}>{children}</div>
        {showNav && <CompanionBottomNav />}
      </div>
    </CompanionProvider>
  );
}
