'use client';

import { useCallback, useEffect, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { EXPENSE_CATEGORIES, categoryLabelTh } from '@/lib/companion/expenses';
import { downloadCsv } from '@/lib/companion/csv';
import type { TripExpenseRow } from '@/lib/companion/types';
import { addTripExpense, listTripExpenses, uploadReceipt } from '@/app/actions/companion-staff';
import { REAL_TOUR_CODES } from '@/lib/constants';

export default function ExpensesView({ defaultTourCode }: { defaultTourCode: string }) {
  const [tourCode, setTourCode] = useState(defaultTourCode);
  const [items, setItems] = useState<TripExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripDate, setTripDate] = useState('');
  const [category, setCategory] = useState('fuel');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await listTripExpenses(tourCode);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError(null);
    setItems(res.data);
  }, [tourCode]);

  useEffect(() => {
    load();
  }, [load]);

  const total = items.reduce((s, i) => s + Number(i.amount_aud), 0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    let receiptUrl: string | null = null;
    if (receiptFile) {
      const fd = new FormData();
      fd.set('file', receiptFile);
      fd.set('tour_code', tourCode);
      const up = await uploadReceipt(fd);
      if (!up.ok) {
        setSaving(false);
        setError(up.error);
        return;
      }
      receiptUrl = up.data;
    }
    const res = await addTripExpense({
      tour_code: tourCode,
      trip_date: tripDate,
      category,
      description,
      amount_aud: parseFloat(amount) || 0,
      receipt_url: receiptUrl,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDescription('');
    setAmount('');
    setReceiptFile(null);
    load();
  }

  function exportCsv() {
    downloadCsv(
      `trip-expenses-${tourCode}.csv`,
      ['วันที่', 'หมวด', 'รายละเอียด', 'AUD', 'ใบเสร็จ'],
      items.map((i) => [
        i.trip_date ?? '',
        categoryLabelTh(i.category),
        i.description ?? '',
        i.amount_aud,
        i.receipt_url ?? '',
      ])
    );
  }

  return (
    <div>
      <StaffPageHeader staffRole="photographer" title="ค่าใช้จ่ายทริป" subtitle="บันทึกสำหรับทำ tax" />
      <div className="px-4 space-y-4">
        <div className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          <p className="text-xs text-slate-500">ยอดรวม (ทริปนี้)</p>
          <p className="text-3xl font-semibold text-companion-accent">${total.toFixed(2)} AUD</p>
          <div className="flex gap-2 mt-3">
            <select
              value={tourCode}
              onChange={(e) => setTourCode(e.target.value)}
              className="flex-1 rounded-lg border px-2 py-2 text-sm"
            >
              {REAL_TOUR_CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-lg border px-3 py-2 text-sm font-medium"
            >
              CSV
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl bg-companion-card text-companion-text-dark p-4 space-y-3">
          <p className="font-semibold text-sm">เพิ่มรายการ</p>
          <input
            type="date"
            required
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.labelTh}
              </option>
            ))}
          </select>
          <input
            placeholder="รายละเอียด"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <input
            type="number"
            step="0.01"
            required
            placeholder="จำนวนเงิน AUD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
            className="w-full text-xs"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-companion-accent py-3 font-semibold text-companion-dark disabled:opacity-60"
          >
            {saving ? 'กำลังบันทึก…' : 'บันทึกรายการ'}
          </button>
        </form>

        <div className="space-y-2 pb-4">
          <p className="text-sm text-white/70">รายการทั้งหมด</p>
          {loading && <p className="text-white/50 text-sm">กำลังโหลด…</p>}
          {!loading &&
            items.map((i) => (
              <div key={i.id} className="rounded-xl bg-companion-surface border border-white/10 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{categoryLabelTh(i.category)}</span>
                  <span className="text-companion-accent">${Number(i.amount_aud).toFixed(2)}</span>
                </div>
                <p className="text-white/60 mt-1">{i.description}</p>
                <p className="text-white/40 text-xs mt-1">{i.trip_date}</p>
                {i.receipt_url && (
                  <a href={i.receipt_url} target="_blank" rel="noreferrer" className="text-xs text-companion-accent mt-1 inline-block">
                    ดูใบเสร็จ
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
