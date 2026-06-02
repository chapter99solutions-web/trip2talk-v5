'use client';

import Link from 'next/link';
import { REAL_TOUR_CODES } from '@/lib/constants';
import { STAFF_GREETINGS } from '@/lib/companion/staff-nav';
import type { CompanionSession, StaffRole } from '@/lib/companion/types';
import { sessionStaffRole } from '@/lib/companion/staff-session';
import StatCard from '@/components/companion/StatCard';

function HomeShell({
  staffRole,
  children,
}: {
  staffRole: StaffRole;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 pb-4">
      <p className="text-companion-accent text-sm font-medium pt-6">{STAFF_GREETINGS[staffRole]}</p>
      {children}
    </div>
  );
}

export function PhotographerHome({ session }: { session: CompanionSession }) {
  const code = session.activeTourCode ?? session.trip?.tour_code ?? 'NZ-6D5N';
  return (
    <HomeShell staffRole="photographer">
      <h1 className="font-serif text-2xl font-semibold mt-2">ทริปในสนาม</h1>
      <p className="text-white/60 text-sm mt-1">บันทึกค่าใช้จ่ายและดูไทม์ไลน์ — ไม่มีข้อมูลการจองแขก</p>
      <div className="mt-4 space-y-3">
        <StatCard label="ทริปที่ทำงาน" value={code} sub="เปลี่ยนได้จากหน้าเตรียมตัว" />
        <Link
          href="/companion/expenses"
          className="block rounded-2xl bg-companion-accent text-companion-dark p-4 font-semibold text-center"
        >
          💰 บันทึกค่าใช้จ่าย
        </Link>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Link href="/companion/timeline" className="rounded-xl bg-companion-card text-companion-text-dark p-3 text-center">
            ไทม์ไลน์
          </Link>
          <Link href="/companion/rules" className="rounded-xl bg-companion-card text-companion-text-dark p-3 text-center">
            กฎทริป
          </Link>
        </div>
      </div>
    </HomeShell>
  );
}

export function CohostHome() {
  return (
    <HomeShell staffRole="cohost">
      <h1 className="font-serif text-2xl font-semibold mt-2">ศูนย์ Co-Host</h1>
      <p className="text-white/60 text-sm mt-1">จัดการจอง ลูกทริป และการตลาด</p>
      <div className="mt-4 grid gap-2">
        <Link href="/companion/bookings" className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          <span className="font-semibold">📝 จองทริป</span>
          <p className="text-xs text-slate-500 mt-1">เพิ่ม/แก้ไขการจอง</p>
        </Link>
        <Link href="/companion/guests" className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          <span className="font-semibold">👥 ลูกทริป</span>
        </Link>
        <Link href="/companion/marketing" className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          <span className="font-semibold">📣 การตลาด</span>
        </Link>
      </div>
    </HomeShell>
  );
}

export function OwnerHome() {
  return (
    <HomeShell staffRole="owner">
      <h1 className="font-serif text-2xl font-semibold mt-2">แดชบอร์ดเจ้าของ</h1>
      <p className="text-white/60 text-sm mt-1">บันทึกธุรกิจ · การเงิน · ลูกค้า · รีวิว</p>
      <div className="mt-4 grid gap-2">
        <Link href="/companion/owner/finance" className="rounded-2xl bg-companion-accent text-companion-dark p-4 font-semibold">
          💵 Finance Dashboard
        </Link>
        <Link href="/companion/owner/passport" className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          📘 Business Passport
        </Link>
        <Link href="/companion/owner/reviews" className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          ⭐ Reviews Manager
        </Link>
        <Link href="/companion/owner/customers" className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          👥 Customer Database
        </Link>
        <Link href="/companion/trips-admin" className="rounded-2xl bg-companion-surface border border-white/10 p-3 text-sm text-center">
          🗺️ ทริปทั้งหมด
        </Link>
        <Link href="/companion/consents" className="rounded-2xl bg-companion-surface border border-white/10 p-3 text-sm text-center">
          ✅ Consent
        </Link>
        <Link href="/companion/manage" className="rounded-2xl bg-companion-surface border border-white/10 p-3 text-sm text-center">
          ⚙️ จัดการ
        </Link>
      </div>
      <p className="text-xs text-white/40 mt-4">{REAL_TOUR_CODES.length} ทริปหลักในระบบ</p>
    </HomeShell>
  );
}

export function StaffHomeRouter({ session }: { session: CompanionSession }) {
  const role = sessionStaffRole(session);
  if (role === 'photographer') return <PhotographerHome session={session} />;
  if (role === 'cohost') return <CohostHome />;
  if (role === 'owner') return <OwnerHome />;
  return null;
}
