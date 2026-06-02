'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CoverImage from '@/components/CoverImage';
import GoldenHourCard from '@/components/companion/GoldenHourCard';
import StatCard from '@/components/companion/StatCard';
import { useRequireCompanion } from '@/components/companion/CompanionProvider';
import { isCompanionConsentComplete } from '@/lib/companion/consent-storage';
import { MEETING_POINT, getShotList } from '@/lib/companion/content';
import { daysUntilTrip } from '@/lib/companion/sun';
import { tripDisplayTitle } from '@/lib/trip-display';

export default function CompanionHomePage() {
  const router = useRouter();
  const { session, ready } = useRequireCompanion();

  useEffect(() => {
    if (!ready || !session) return;
    if (
      session.role === 'guest' &&
      !isCompanionConsentComplete(session.booking.booking_ref)
    ) {
      router.replace('/companion/onboarding');
    }
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/60">
        กำลังโหลด…
      </div>
    );
  }

  const { trip, booking } = session;
  const title = tripDisplayTitle(trip, 'TH');
  const days = daysUntilTrip(trip.date);
  const countdown =
    days === null
      ? 'วันเดินทางจะประกาศเร็วๆ นี้'
      : days > 0
        ? `อีก ${days} วันถึงทริปของคุณ`
        : days === 0
          ? 'วันนี้วันออกเดินทาง!'
          : `ทริปเริ่มแล้ว (${Math.abs(days)} วันที่แล้ว)`;

  const shots = getShotList(trip.tour_code);

  return (
    <div>
      <div className="relative h-56">
        <CoverImage
          src={trip.cover_image}
          alt={title}
          tourCode={trip.tour_code}
          className="absolute inset-0 w-full h-full"
          imgClassName="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-companion-dark via-companion-dark/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-companion-accent text-sm font-medium">{countdown}</p>
          <h1 className="font-serif text-2xl font-semibold mt-1">{title}</h1>
          <p className="text-white/80 text-sm mt-1">
            สวัสดี {booking.name.split(' ')[0]} 👋
          </p>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="ที่นั่งยืนยัน" value={`${booking.seats} ที่`} />
          <StatCard
            label="วันเดินทาง"
            value={trip.date ?? 'เร็วๆ นี้'}
            sub={trip.tour_code}
          />
        </div>
        <StatCard label="จุดนัดพบ" value={MEETING_POINT} sub="Departure · T2" />
        <StatCard label="เวลาออกเดินทาง" value="ตามแจ้งในวันเดินทาง" sub="ดูใน Timeline" />

        <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark">
          <p className="text-xs font-semibold text-slate-500">สภาพอากาศ</p>
          <p className="text-2xl font-semibold mt-1">--</p>
          <p className="text-xs text-slate-500">Weather API เร็วๆ นี้</p>
        </div>

        <GoldenHourCard tourCode={trip.tour_code} tripDate={trip.date} />

        <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark">
          <p className="font-semibold text-sm">Shot list แนะนำ</p>
          <ul className="mt-3 space-y-2">
            {shots.map((s) => (
              <li key={s.name} className="text-sm flex gap-2">
                <span className="text-companion-accent">📷</span>
                <span>{s.nameTh}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
