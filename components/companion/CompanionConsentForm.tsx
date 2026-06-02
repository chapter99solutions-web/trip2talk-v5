'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConsentStep3 from './ConsentStep3';
import { useCompanion } from './CompanionProvider';
import { saveCompanionConsentComplete } from '@/lib/companion/consent-storage';
import type { ConsentItemId } from '@/lib/companion/consent-items';
import { saveGuestConsentRecord } from '@/app/actions/companion-staff';
import { tripDisplayTitle } from '@/lib/trip-display';

/** Multi-step companion onboarding — only Step 3 consent UI is fully specified. */
export default function CompanionConsentForm() {
  const router = useRouter();
  const { session } = useCompanion();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  if (!session?.booking || !session.trip) return null;

  const booking = session.booking;
  const trip = session.trip;
  const tripTitle = tripDisplayTitle(trip, 'TH');

  async function finishConsent(checks: Record<ConsentItemId, boolean>) {
    setSubmitting(true);
    saveCompanionConsentComplete(booking.booking_ref);
    await saveGuestConsentRecord({
      booking_ref: booking.booking_ref,
      email: booking.email,
      tour_code: trip.tour_code,
      has_medical_condition: false,
      consent_items: checks,
    });
    setSubmitting(false);
    router.replace('/companion/home');
  }

  return (
    <div className="min-h-screen px-4 pt-8 pb-8">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <p className="text-companion-accent text-xs font-semibold uppercase">STEP 1 / 3</p>
            <h2 className="font-serif text-xl font-semibold mt-1">ยินดีต้อนรับ</h2>
            <p className="text-white/60 text-sm mt-2">Welcome, {booking.name}</p>
          </div>
          <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark">
            <p className="text-sm text-slate-500">ทริปของคุณ</p>
            <p className="font-semibold mt-1">{tripTitle}</p>
            <p className="text-xs font-mono text-slate-500 mt-2">{booking.booking_ref}</p>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full rounded-xl bg-companion-accent py-3.5 font-semibold text-companion-dark"
          >
            ถัดไป
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="text-companion-accent text-xs font-semibold uppercase">STEP 2 / 3</p>
            <h2 className="font-serif text-xl font-semibold mt-1">ยืนยันข้อมูล</h2>
            <p className="text-white/60 text-sm mt-2">Confirm your details</p>
          </div>
          <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark space-y-2 text-sm">
            <p>
              <span className="text-slate-500">Email:</span> {booking.email}
            </p>
            <p>
              <span className="text-slate-500">ที่นั่ง:</span> {booking.seats}
            </p>
            <p>
              <span className="text-slate-500">วันเดินทาง:</span>{' '}
              {trip.date ?? 'เร็วๆ นี้'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-white/20 py-3 text-sm text-white/80"
            >
              ย้อนกลับ
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-[2] rounded-xl bg-companion-accent py-3.5 font-semibold text-companion-dark"
            >
              ถัดไป — ข้อตกลง
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <ConsentStep3
          onSubmit={finishConsent}
          onBack={() => setStep(2)}
          submitting={submitting}
        />
      )}
    </div>
  );
}
