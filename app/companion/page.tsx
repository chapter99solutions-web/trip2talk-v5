'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  loginCompanionWithBookingRef,
  loginCompanionWithPin,
} from '@/app/actions/companion';
import { useCompanion } from '@/components/companion/CompanionProvider';

export default function CompanionLoginPage() {
  const router = useRouter();
  const { setSession, session } = useCompanion();
  const [mode, setMode] = useState<'guest' | 'team'>('guest');
  const [bookingRef, setBookingRef] = useState('');
  const [pin, setPin] = useState('');
  const [teamRef, setTeamRef] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    if (session.role === 'guest') router.replace('/companion/onboarding');
    else router.replace('/companion/home');
  }, [session, router]);

  async function onGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await loginCompanionWithBookingRef(bookingRef);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSession({
      role: result.role,
      bookingRef: result.booking?.booking_ref,
      booking: result.booking,
      trip: result.trip,
      savedAt: new Date().toISOString(),
    });
    router.push('/companion/onboarding');
  }

  async function onTeamSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await loginCompanionWithPin(pin, teamRef || undefined);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSession({
      role: result.role,
      staffRole: result.staffRole,
      bookingRef: result.booking?.booking_ref,
      booking: result.booking,
      trip: result.trip,
      activeTourCode: result.activeTourCode ?? result.trip?.tour_code,
      savedAt: new Date().toISOString(),
    });
    router.push(result.role === 'guest' ? '/companion/onboarding' : '/companion/home');
  }

  return (
    <div className="min-h-screen flex flex-col px-5 pt-12 pb-8">
      <div className="text-center mb-8">
        <p className="text-companion-accent text-sm font-semibold tracking-widest uppercase">Trip2Talk</p>
        <h1 className="font-serif text-3xl font-semibold mt-2">Companion</h1>
        <p className="text-white/60 text-sm mt-2">คู่มือทริประหว่างเดินทาง</p>
      </div>

      <div className="flex rounded-full bg-companion-surface p-1 mb-6">
        <button
          type="button"
          onClick={() => setMode('guest')}
          className={`flex-1 rounded-full py-2.5 text-sm font-medium ${
            mode === 'guest' ? 'bg-companion-accent text-companion-dark' : 'text-white/70'
          }`}
        >
          แขก (รหัสจอง)
        </button>
        <button
          type="button"
          onClick={() => setMode('team')}
          className={`flex-1 rounded-full py-2.5 text-sm font-medium ${
            mode === 'team' ? 'bg-companion-accent text-companion-dark' : 'text-white/70'
          }`}
        >
          ทีมงาน (PIN)
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-500/20 border border-red-500/40 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      {mode === 'guest' ? (
        <form onSubmit={onGuestSubmit} className="space-y-4">
          <div className="rounded-2xl bg-companion-card p-5 text-companion-text-dark">
            <label className="block text-sm font-medium">รหัสการจอง (Booking ref)</label>
            <input
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
              placeholder="T2T-XXXX"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-mono"
            />
            <p className="text-xs text-slate-500 mt-2">หาได้ในอีเมลยืนยันการจอง</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-companion-accent py-3.5 font-semibold text-companion-dark disabled:opacity-60"
          >
            {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ทริปของฉัน'}
          </button>
        </form>
      ) : (
        <form onSubmit={onTeamSubmit} className="space-y-4">
          <div className="rounded-2xl bg-companion-card p-5 text-companion-text-dark space-y-4">
            <label className="block text-sm font-medium">PIN ทีมงาน</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl tracking-[0.4em] font-mono"
            />
            <label className="block text-sm font-medium">รหัสจองแขก (ไม่บังคับ)</label>
            <input
              value={teamRef}
              onChange={(e) => setTeamRef(e.target.value.toUpperCase())}
              placeholder="ดูข้อมูลแขกจริง"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm"
            />
            <p className="text-xs text-slate-500">1111 ช่างภาพ · 4444 พลอย · 9999 พี่แสน</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-companion-accent py-3.5 font-semibold text-companion-dark disabled:opacity-60"
          >
            {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าใช้งาน'}
          </button>
        </form>
      )}
    </div>
  );
}
