'use client';

import type { MonthChartPoint } from '@/lib/business/types';

export default function MonthBarChart({ data }: { data: MonthChartPoint[] }) {
  const max = Math.max(...data.flatMap((d) => [d.revenue, d.expenses]), 1);

  return (
    <div className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
      <p className="text-sm font-semibold mb-4">รายได้ vs ค่าใช้จ่าย (6 เดือน)</p>
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((d) => (
          <div key={`${d.year}-${d.month}`} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end justify-center gap-0.5 h-32">
              <div
                className="w-[42%] bg-companion-accent rounded-t"
                style={{ height: `${(d.revenue / max) * 100}%`, minHeight: d.revenue > 0 ? 4 : 0 }}
                title={`รายได้ $${d.revenue.toFixed(0)}`}
              />
              <div
                className="w-[42%] bg-slate-400 rounded-t"
                style={{ height: `${(d.expenses / max) * 100}%`, minHeight: d.expenses > 0 ? 4 : 0 }}
                title={`ค่าใช้จ่าย $${d.expenses.toFixed(0)}`}
              />
            </div>
            <span className="text-[9px] text-slate-500">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-companion-accent rounded" /> รายได้
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-slate-400 rounded" /> ค่าใช้จ่าย
        </span>
      </div>
    </div>
  );
}
