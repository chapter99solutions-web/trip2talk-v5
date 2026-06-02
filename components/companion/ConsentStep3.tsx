'use client';

import { useEffect, useRef, useState } from 'react';
import {
  COMPANION_CONSENT_ITEMS,
  CONSENT_ITEM_IDS,
  type ConsentItemId,
} from '@/lib/companion/consent-items';

type Props = {
  onSubmit: () => void;
  onBack?: () => void;
  submitting?: boolean;
};

function emptyChecks(): Record<ConsentItemId, boolean> {
  return Object.fromEntries(CONSENT_ITEM_IDS.map((id) => [id, false])) as Record<
    ConsentItemId,
    boolean
  >;
}

export default function ConsentStep3({ onSubmit, onBack, submitting = false }: Props) {
  const [checked, setChecked] = useState<Record<ConsentItemId, boolean>>(emptyChecks);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const masterRef = useRef<HTMLInputElement>(null);

  const allChecked = CONSENT_ITEM_IDS.every((id) => checked[id]);
  const someChecked = CONSENT_ITEM_IDS.some((id) => checked[id]);
  const masterChecked = allChecked;

  useEffect(() => {
    const el = masterRef.current;
    if (!el) return;
    el.indeterminate = someChecked && !allChecked;
  }, [someChecked, allChecked]);

  function setMaster(next: boolean) {
    setChecked(Object.fromEntries(CONSENT_ITEM_IDS.map((id) => [id, next])) as Record<
      ConsentItemId,
      boolean
    >);
  }

  function toggleItem(id: ConsentItemId) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-companion-accent text-xs font-semibold uppercase tracking-wide">
          STEP 3 / 3
        </p>
        <h2 className="font-serif text-xl font-semibold mt-1">ข้อตกลงและความยินยอม</h2>
        <p className="text-white/60 text-sm">Terms & consent</p>
      </div>

      <label className="flex items-start gap-3 rounded-2xl bg-companion-card p-4 text-companion-text-dark cursor-pointer border-2 border-companion-accent/40">
        <input
          ref={masterRef}
          type="checkbox"
          checked={masterChecked}
          onChange={(e) => setMaster(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-slate-300 text-companion-accent focus:ring-companion-accent"
        />
        <span className="text-sm font-semibold leading-snug">
          <span className="block">ข้าพเจ้ายอมรับเงื่อนไขและข้อตกลงทั้งหมด</span>
          <span className="block text-xs font-normal text-slate-500 mt-1">
            I accept all terms and conditions
          </span>
        </span>
      </label>

      <div className="space-y-2">
        {COMPANION_CONSENT_ITEMS.map((item) => {
          const isOpen = expanded[item.id];
          return (
            <div
              key={item.id}
              className="rounded-2xl bg-companion-card text-companion-text-dark overflow-hidden"
            >
              <div className="flex items-start gap-3 p-3">
                <input
                  type="checkbox"
                  checked={checked[item.id]}
                  onChange={() => toggleItem(item.id)}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-companion-accent focus:ring-companion-accent"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">
                    {item.emoji} {item.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="mt-1 text-xs text-companion-accent font-medium"
                  >
                    {isOpen ? 'ย่อ ▴' : 'อ่านเพิ่มเติม ▾'}
                  </button>
                </div>
              </div>
              {isOpen && (
                <p className="px-3 pb-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {item.body}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/50 text-center">
        {CONSENT_ITEM_IDS.filter((id) => checked[id]).length} / {CONSENT_ITEM_IDS.length} ข้อ
      </p>

      <div className="flex gap-3 pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-white/20 py-3 text-sm font-medium text-white/80"
          >
            ย้อนกลับ
          </button>
        )}
        <button
          type="button"
          disabled={!allChecked || submitting}
          onClick={onSubmit}
          className="flex-[2] rounded-xl bg-companion-accent py-3 text-sm font-semibold text-companion-dark disabled:opacity-40"
        >
          {submitting ? 'กำลังบันทึก…' : 'ยืนยันและเข้าใช้งาน'}
        </button>
      </div>
    </div>
  );
}
