'use client';

import { useCallback, useEffect, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { downloadCsv } from '@/lib/companion/csv';
import { formatThaiDateTime } from '@/lib/companion/format-thai-datetime';
import type { GuestConsentRow } from '@/lib/companion/types';
import { listGuestConsents } from '@/app/actions/companion-staff';
import { getRulesAckDashboard, type RulesAckDisplayRow } from '@/app/actions/safety-ack';

export default function OwnerConsentsView() {
  const [rows, setRows] = useState<GuestConsentRow[]>([]);
  const [rulesRows, setRulesRows] = useState<RulesAckDisplayRow[]>([]);
  const [statsByTour, setStatsByTour] = useState<
    { tour_code: string; confirmed: number; total: number }[]
  >([]);

  const load = useCallback(async () => {
    const [consents, rules] = await Promise.all([listGuestConsents(), getRulesAckDashboard()]);
    if (consents.ok) setRows(consents.data);
    if (rules.ok) {
      setRulesRows(rules.data.rows);
      setStatsByTour(rules.data.statsByTour);
    }
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

  function exportRulesCsv() {
    downloadCsv(
      'safety-rules-ack.csv',
      ['name_or_role', 'booking_ref', 'acknowledged_at', 'user_agent', 'source'],
      rulesRows.map((r) => [
        r.nameOrRole,
        r.bookingRef,
        r.acknowledgedAt,
        r.userAgent ?? '',
        r.source,
      ])
    );
  }

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="Consent" subtitle="หลักฐานการยินยอม" />
      <div className="px-4 space-y-4 pb-6">
        <section className="rounded-2xl bg-companion-surface border border-white/10 p-4">
          <p className="font-semibold text-companion-accent mb-3">✅ ยืนยันกฎความปลอดภัย</p>
          {statsByTour.map((s) => (
            <p key={s.tour_code} className="text-xs text-white/70 mb-1">
              ยืนยันแล้ว {s.confirmed} คน จาก {s.total} คนที่จอง {s.tour_code}
            </p>
          ))}
          {statsByTour.length === 0 && (
            <p className="text-xs text-white/50 mb-3">ยังไม่มีสถิติตามทริป</p>
          )}
          <button
            type="button"
            onClick={exportRulesCsv}
            className="w-full rounded-lg border border-white/20 py-2 text-xs mb-3"
          >
            Export กฎความปลอดภัย CSV
          </button>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-white/50">
                <tr>
                  <th className="text-left py-2 pr-2">ชื่อ/Role</th>
                  <th className="text-left py-2 pr-2">Booking Ref</th>
                  <th className="text-left py-2 pr-2">วันที่ยืนยัน</th>
                  <th className="text-left py-2">อุปกรณ์</th>
                </tr>
              </thead>
              <tbody>
                {rulesRows.map((r, i) => (
                  <tr key={`${r.bookingRef}-${i}`} className="border-t border-white/10">
                    <td className="py-2 pr-2 text-white/90">{r.nameOrRole}</td>
                    <td className="py-2 pr-2 font-mono">{r.bookingRef}</td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      {formatThaiDateTime(r.acknowledgedAt)}
                    </td>
                    <td className="py-2 text-white/50 max-w-[100px] truncate" title={r.userAgent ?? ''}>
                      {r.userAgent ? r.userAgent.slice(0, 24) + '…' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rulesRows.length === 0 && (
            <p className="text-white/50 text-xs text-center mt-3">ยังไม่มีการยืนยันกฎ</p>
          )}
        </section>

        <button type="button" onClick={exportCsv} className="w-full rounded-xl border border-white/20 py-3 text-sm">
          Export Consent Step 3 CSV
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
            {r.consent_rules && r.rules_acknowledged_at && (
              <p className="text-companion-accent text-xs mt-1">
                กฎ ✓ {formatThaiDateTime(r.rules_acknowledged_at)}
              </p>
            )}
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
