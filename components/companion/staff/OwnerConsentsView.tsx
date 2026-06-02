'use client';

import { useCallback, useEffect, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { downloadCsv } from '@/lib/companion/csv';
import type { GuestConsentRow } from '@/lib/companion/types';
import { listGuestConsents } from '@/app/actions/companion-staff';

export default function OwnerConsentsView() {
  const [rows, setRows] = useState<GuestConsentRow[]>([]);

  const load = useCallback(async () => {
    const res = await listGuestConsents();
    if (res.ok) setRows(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function exportCsv() {
    downloadCsv(
      'guest-consents.csv',
      ['booking_ref', 'email', 'tour', 'medical', 'completed'],
      rows.map((r) => [
        r.booking_ref,
        r.email ?? '',
        r.tour_code ?? '',
        r.has_medical_condition ? 'YES' : 'no',
        r.completed_at,
      ])
    );
  }

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="Consent" subtitle="หลักฐานการยินยอม" />
      <div className="px-4 space-y-4 pb-6">
        <button type="button" onClick={exportCsv} className="w-full rounded-xl border border-white/20 py-3 text-sm">
          Export CSV
        </button>
        {rows.map((r) => (
          <div
            key={r.id}
            className={`rounded-xl border p-3 text-sm ${
              r.has_medical_condition
                ? 'border-amber-500/60 bg-amber-500/10'
                : 'border-white/10 bg-companion-surface'
            }`}
          >
            <p className="font-medium">{r.booking_ref}</p>
            <p className="text-white/60 text-xs">{r.email} · {r.tour_code}</p>
            {r.has_medical_condition && (
              <p className="text-amber-200 text-xs mt-2">⚠️ มีโรคประจำตัว — {r.medical_notes}</p>
            )}
            <p className="text-white/40 text-xs mt-1">{r.completed_at}</p>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-white/50 text-sm text-center">ยังไม่มีข้อมูลใน guest_consents — จะบันทึกเมื่อแขกส่ง Step 3</p>
        )}
      </div>
    </div>
  );
}
