'use client';

import { useCallback, useEffect, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { downloadCsv } from '@/lib/companion/csv';
import { categoryLabelTh } from '@/lib/companion/expenses';
import type { TripExpenseRow } from '@/lib/companion/types';
import { getFinanceSummary, listTripExpenses } from '@/app/actions/companion-staff';
import type { FinanceSummary } from '@/app/actions/companion-staff';

export default function OwnerFinanceView() {
  const [month, setMonth] = useState('');
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [expenses, setExpenses] = useState<TripExpenseRow[]>([]);
  const [catFilter, setCatFilter] = useState('');
  const [tourFilter, setTourFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const m = month || undefined;
    const [s, e] = await Promise.all([getFinanceSummary(m), listTripExpenses()]);
    if (!s.ok) {
      setError(s.error);
      return;
    }
    setSummary(s.data);
    if (e.ok) setExpenses(e.data);
    setError(null);
  }, [month]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredExp = expenses.filter((x) => {
    if (catFilter && x.category !== catFilter) return false;
    if (tourFilter && x.tour_code !== tourFilter) return false;
    if (month && x.created_at && !x.created_at.startsWith(month)) return false;
    return true;
  });

  function exportReport() {
    if (!summary) return;
    downloadCsv(
      `finance-${month || 'all'}.csv`,
      ['ทริป', 'รายได้', 'ค่าใช้จ่าย', 'กำไร'],
      summary.byTour.map((r) => [
        r.tour_code,
        r.revenue.toFixed(2),
        r.expenses.toFixed(2),
        (r.revenue - r.expenses).toFixed(2),
      ])
    );
  }

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="การเงิน" subtitle="รายได้ · ค่าใช้จ่าย · กำไร" />
      <div className="px-4 space-y-4 pb-6">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full rounded-xl bg-companion-card text-companion-text-dark px-4 py-3"
        />
        {error && <p className="text-red-300 text-sm">{error}</p>}
        {summary && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-companion-card text-companion-text-dark p-3">
                <p className="text-xs text-slate-500">รายได้รวม</p>
                <p className="text-xl font-semibold">${summary.revenue.toFixed(0)}</p>
              </div>
              <div className="rounded-xl bg-companion-card text-companion-text-dark p-3">
                <p className="text-xs text-slate-500">ค่าใช้จ่าย</p>
                <p className="text-xl font-semibold">${summary.expenses.toFixed(0)}</p>
              </div>
              <div className="rounded-xl bg-companion-accent text-companion-dark p-3 col-span-2">
                <p className="text-xs opacity-80">กำไรสุทธิ</p>
                <p className="text-2xl font-semibold">${summary.profit.toFixed(0)} AUD</p>
              </div>
            </div>
            <div className="rounded-xl bg-companion-surface border border-white/10 p-3 text-sm space-y-1">
              <p>มัดจำรับแล้ว: ${summary.depositReceived.toFixed(0)}</p>
              <p>รอรับชำระ: ${summary.pendingReceivable.toFixed(0)}</p>
            </div>
            <button type="button" onClick={exportReport} className="w-full rounded-xl border border-white/20 py-3 text-sm">
              Export CSV รายงาน
            </button>
          </>
        )}

        <p className="text-sm font-medium text-white/80">ค่าใช้จ่าย (trip_expenses)</p>
        <div className="flex gap-2">
          <input
            placeholder="ทริป"
            value={tourFilter}
            onChange={(e) => setTourFilter(e.target.value.toUpperCase())}
            className="flex-1 rounded-lg bg-companion-card text-companion-text-dark px-3 py-2 text-sm"
          />
          <input
            placeholder="หมวด id"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="flex-1 rounded-lg bg-companion-card text-companion-text-dark px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          {filteredExp.map((i) => (
            <div key={i.id} className="rounded-xl bg-companion-surface border border-white/10 p-3 text-sm">
              <p className="font-medium">
                {i.tour_code} · {categoryLabelTh(i.category)} · ${Number(i.amount_aud).toFixed(2)}
              </p>
              <p className="text-white/60 text-xs">{i.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
