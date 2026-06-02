'use client';

import { useRequireCompanion } from '@/components/companion/CompanionProvider';
import { MEETING_POINT } from '@/lib/companion/content';
import { tripDisplayTitle } from '@/lib/trip-display';

export default function CompanionProfilePage() {
  const { session, ready, logout } = useRequireCompanion();
  if (!ready || !session) return null;

  const { booking, trip } = session;
  const title = tripDisplayTitle(trip, 'TH');
  const guidePhone = process.env.NEXT_PUBLIC_GUIDE_PHONE ?? 'ติดต่อพี่แสน';

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">โปรไฟล์</h1>
          <p className="text-white/60 text-sm">My booking</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-white/60 underline"
        >
          ออกจากระบบ
        </button>
      </div>

      <div className="rounded-2xl bg-companion-card p-5 text-companion-text-dark shadow-lg space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-wide">Booking ref</p>
        <p className="font-mono text-2xl font-bold text-companion-accent break-all">
          {booking.booking_ref}
        </p>
        <p className="text-xs text-slate-500 mt-4">แคปหน้าจอเก็บไว้ / Screenshot this page</p>
      </div>

      <div className="mt-4 rounded-2xl bg-companion-card p-5 text-companion-text-dark space-y-3">
        <div>
          <p className="text-xs text-slate-500">ชื่อ</p>
          <p className="font-medium">{booking.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Email</p>
          <p className="font-medium">{booking.email}</p>
        </div>
        {booking.phone && (
          <div>
            <p className="text-xs text-slate-500">โทรศัพท์</p>
            <p className="font-medium">{booking.phone}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-slate-500">ทริป</p>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-slate-500">{trip.tour_code}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">วันเดินทาง</p>
          <p className="font-medium">{trip.date ?? 'เร็วๆ นี้'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">ที่นั่ง</p>
          <p className="font-medium">{booking.seats}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">สถานะ</p>
          <p className="font-medium capitalize">{booking.status}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">ชำระเงิน</p>
          <p className="font-medium">${trip.price} AUD / คน (ตามแผนทริป)</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-companion-surface border border-companion-accent/30 p-4">
        <p className="text-sm font-semibold text-companion-accent">จุดนัดพบ</p>
        <p className="text-sm mt-1 text-white/90">{MEETING_POINT}</p>
      </div>

      <div className="mt-4 rounded-2xl bg-companion-card p-4 text-companion-text-dark">
        <p className="text-xs text-slate-500">ติดต่อฉุกเฉินทริป</p>
        <p className="font-semibold mt-1">{guidePhone}</p>
      </div>

      {session.role !== 'guest' && (
        <p className="mt-4 text-xs text-amber-400/90 text-center">
          โหมดทีมงาน ({session.role})
          {booking.booking_ref === 'TEAM-PREVIEW' && ' — ตัวอย่าง กรุณาใส่รหัสจองแขก'}
        </p>
      )}
    </div>
  );
}
