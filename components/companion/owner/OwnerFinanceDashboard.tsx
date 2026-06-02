'use client';

import { useCallback, useEffect, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import MonthBarChart from '@/components/companion/owner/MonthBarChart';
import { downloadCsv } from '@/lib/companion/csv';
import type { FinanceDashboardData } from '@/lib/business/types';
import { generateAndSaveMonthlyReport, getOwnerFinanceDashboard } from '@/app/actions/business';

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function OwnerFinanceDashboard() {
  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getOwnerFinanceDashboard();
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError(null);
    setData(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onGenerateReport() {
    setGenerating(true);
    const res = await generateAndSaveMonthlyReport();
    setGenerating(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const d = new Date();
    const fname = `trip2talk-monthly-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}.csv`;
    downloadTextFile(fname, res.data.csv);
    load();
  }

  if (loading) {
    return <p className="p-6 text-white/60 text-center">กำลังโหลด…</p>;
  }

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="การเงิน" subtitle="Finance Dashboard" />
      <div className="px-4 space-y-4 pb-6">
        {error && <p className="text-red-300 text-sm">{error}</p>}
        {data && (
          <>
            <p className="text-xs text-white/50">เดือนปัจจุบัน: {data.currentMonth}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-companion-card text-companion-text-dark p-3">
                <p className="text-xs">💰 รายได้รวม</p>
                <p className="text-lg font-semibold">${data.overview.revenue.toFixed(0)}</p>
              </div>
              <div className="rounded-xl bg-companion-card text-companion-text-dark p-3">
                <p className="text-xs">💸 ค่าใช้จ่ายรวม</p>
                <p className="text-lg font-semibold">${data.overview.expenses.toFixed(0)}</p>
              </div>
              <div className="rounded-xl bg-companion-accent text-companion-dark p-3 col-span-2">
                <p className="text-xs opacity-80">📈 กำไรสุทธิ</p>
                <p className="text-2xl font-semibold">${data.overview.profit.toFixed(0)}</p>
              </div>
              <div className="rounded-xl bg-companion-card text-companion-text-dark p-3">
                <p className="text-xs">👥 ลูกทริปทั้งหมด</p>
                <p className="text-lg font-semibold">{data.overview.totalGuests}</p>
              </div>
              <div className="rounded-xl bg-companion-card text-companion-text-dark p-3">
                <p className="text-xs">🔄 ลูกทริปขาประจำ</p>
                <p className="text-lg font-semibold">{data.overview.repeatCustomers}</p>
              </div>
            </div>

            <MonthBarChart data={data.chart} />

            <div className="rounded-2xl bg-companion-surface border border-white/10 overflow-hidden">
              <p className="text-sm font-medium p-3 border-b border-white/10">แยกตามทริป</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-white/50">
                    <tr>
                      <th className="text-left p-2">ทริป</th>
                      <th className="p-2">ลูกทริป</th>
                      <th className="p-2">รายได้</th>
                      <th className="p-2">ค่าใช้จ่าย</th>
                      <th className="p-2">กำไร</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byTrip.map((r) => (
                      <tr key={r.tour_code} className="border-t border-white/5">
                        <td className="p-2 font-mono">{r.tour_code}</td>
                        <td className="p-2 text-center">{r.guests}</td>
                        <td className="p-2 text-right">${r.revenue.toFixed(0)}</td>
                        <td className="p-2 text-right">${r.expenses.toFixed(0)}</td>
                        <td className="p-2 text-right text-companion-accent">${r.profit.toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {data.pending.length > 0 && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
                <p className="text-sm font-semibold text-amber-100 mb-2">⚠️ ค้างชำระ</p>
                <div className="space-y-2">
                  {data.pending.map((p) => (
                    <div key={p.id} className="text-sm flex justify-between gap-2">
                      <span>
                        {p.name} · {p.tour_code}
                      </span>
                      <span className="text-amber-200 shrink-0">
                        ${p.amount_remaining.toFixed(0)} ·{' '}
                        {p.days_until_trip != null ? `${p.days_until_trip} วัน` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={generating}
              onClick={onGenerateReport}
              className="w-full rounded-xl bg-companion-accent py-3.5 font-semibold text-companion-dark disabled:opacity-60"
            >
              {generating ? 'กำลังสร้าง…' : 'สร้างรายงานประจำเดือน + ดาวน์โหลด CSV'}
            </button>

            <button
              type="button"
              onClick={() =>
                downloadCsv(
                  `finance-trips-${data.currentMonth}.csv`,
                  ['ทริป', 'ลูกทริป', 'รายได้', 'ค่าใช้จ่าย', 'กำไร'],
                  data.byTrip.map((r) => [
                    r.tour_code,
                    r.guests,
                    r.revenue.toFixed(2),
                    r.expenses.toFixed(2),
                    r.profit.toFixed(2),
                  ])
                )
              }
              className="w-full rounded-xl border border-white/20 py-3 text-sm"
            >
              Export ตารางทริป CSV
            </button>
          </>
        )}
      </div>
    </div>
  );
}
