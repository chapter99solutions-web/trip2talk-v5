'use client';

import Link from 'next/link';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { useCompanion } from '@/components/companion/CompanionProvider';

const SUPABASE_PROJECT = 'https://supabase.com/dashboard/project/pcqxewzzypwxfldxkcxp';

export default function OwnerManageView() {
  const { logout } = useCompanion();

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="จัดการ" />
      <div className="px-4 space-y-3 pb-6">
        <Link
          href="/dashboard"
          className="block rounded-2xl bg-companion-accent text-companion-dark p-4 font-semibold text-center"
        >
          Owner Dashboard
        </Link>
        <a
          href={SUPABASE_PROJECT}
          target="_blank"
          rel="noreferrer"
          className="block rounded-2xl bg-companion-card text-companion-text-dark p-4 font-semibold text-center"
        >
          Supabase Dashboard
        </a>
        <div className="rounded-2xl bg-companion-surface border border-white/10 p-4 text-sm text-white/70">
          <p className="font-medium text-white">App settings</p>
          <p className="mt-2 text-xs">Companion PWA · session ใน localStorage</p>
          <p className="text-xs mt-1">t2t_staff_role · t2t_companion_session</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-xl border border-red-500/40 text-red-200 py-3 text-sm"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
