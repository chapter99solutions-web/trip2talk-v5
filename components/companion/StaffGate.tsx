'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireCompanion } from './CompanionProvider';
import { sessionStaffRole } from '@/lib/companion/staff-session';
import type { StaffRole } from '@/lib/companion/types';

export function StaffGate({
  role,
  children,
}: {
  role: StaffRole | StaffRole[];
  children: React.ReactNode;
}) {
  const allowed = Array.isArray(role) ? role : [role];
  const router = useRouter();
  const { session, ready } = useRequireCompanion();

  useEffect(() => {
    if (!ready || !session) return;
    const sr = sessionStaffRole(session);
    if (!sr || !allowed.includes(sr)) router.replace('/companion/home');
  }, [ready, session, allowed, router]);

  if (!ready || !session) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-white/60">กำลังโหลด…</div>
    );
  }

  const sr = sessionStaffRole(session);
  if (!sr || !allowed.includes(sr)) return null;
  return <>{children}</>;
}
