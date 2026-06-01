'use client';

import BottomNav from './BottomNav';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pb-20 md:pb-0 min-h-screen">{children}</div>
      <BottomNav />
    </>
  );
}
