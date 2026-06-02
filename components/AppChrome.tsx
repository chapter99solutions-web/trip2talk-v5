'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/companion')) {
    return <>{children}</>;
  }
  return (
    <>
      <div className="pb-20 md:pb-0 min-h-screen">{children}</div>
      <BottomNav />
    </>
  );
}
