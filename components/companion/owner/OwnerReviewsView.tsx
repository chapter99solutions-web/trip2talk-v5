'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { REAL_TOUR_CODES } from '@/lib/constants';
import type { ReviewRow } from '@/lib/business/types';
import { addReview, listReviews, setReviewPublished } from '@/app/actions/business';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-companion-accent" aria-label={`${rating} stars`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function OwnerReviewsView() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [form, setForm] = useState({
    tour_code: REAL_TOUR_CODES[0] as string,
    guest_name: '',
    rating: 5,
    review_text: '',
  });

  const load = useCallback(async () => {
    const res = await listReviews();
    if (res.ok) setRows(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const avgByTour = useMemo(() => {
    const map: Record<string, { sum: number; n: number }> = {};
    for (const r of rows) {
      if (!r.rating) continue;
      map[r.tour_code] = map[r.tour_code] ?? { sum: 0, n: 0 };
      map[r.tour_code].sum += r.rating;
      map[r.tour_code].n += 1;
    }
    return Object.entries(map).map(([code, v]) => ({
      code,
      avg: v.sum / v.n,
      n: v.n,
    }));
  }, [rows]);

  async function togglePublish(r: ReviewRow) {
    await setReviewPublished(r.id, !r.is_published);
    load();
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    await addReview(form);
    setForm({ ...form, guest_name: '', review_text: '' });
    load();
  }

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="Reviews" subtitle="จัดการรีวิวบนเว็บ" />
      <div className="px-4 space-y-4 pb-6">
        {avgByTour.length > 0 && (
          <div className="rounded-xl bg-companion-surface border border-white/10 p-3 text-sm">
            <p className="font-medium mb-2">คะแนนเฉลี่ยต่อทริป</p>
            {avgByTour.map((a) => (
              <p key={a.code} className="flex justify-between">
                <span>{a.code}</span>
                <Stars rating={Math.round(a.avg)} />
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onAdd} className="rounded-2xl bg-companion-card text-companion-text-dark p-4 space-y-2 text-sm">
          <p className="font-semibold">เพิ่มรีวิว (Facebook / Line)</p>
          <select value={form.tour_code} onChange={(e) => setForm({ ...form, tour_code: e.target.value })} className="w-full rounded border px-2 py-2">
            {REAL_TOUR_CODES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input required placeholder="ชื่อแขก" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} className="w-full rounded border px-2 py-2" />
          <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full rounded border px-2 py-2" />
          <textarea required rows={3} placeholder="ข้อความรีวิว" value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} className="w-full rounded border px-2 py-2" />
          <button type="submit" className="w-full rounded-xl bg-companion-accent py-2 font-semibold text-companion-dark">บันทึก</button>
        </form>

        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl bg-companion-surface border border-white/10 p-3 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{r.guest_name}</p>
                  <p className="text-white/50 text-xs">{r.tour_code}</p>
                </div>
                {r.rating && <Stars rating={r.rating} />}
              </div>
              <p className="mt-2 text-white/80">{r.review_text}</p>
              <button
                type="button"
                onClick={() => togglePublish(r)}
                className={`mt-2 text-xs font-medium px-3 py-1 rounded-full ${
                  r.is_published ? 'bg-green-500/20 text-green-200' : 'bg-white/10 text-white/60'
                }`}
              >
                {r.is_published ? 'เผยแพร่แล้ว' : 'ซ่อนจากเว็บ'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
