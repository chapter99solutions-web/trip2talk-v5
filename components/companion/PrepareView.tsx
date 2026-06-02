'use client';

import { useState } from 'react';
import ChecklistItem from './ChecklistItem';
import OutfitPalette from './OutfitPalette';
import SafetyBanner from './SafetyBanner';
import {
  CAMERA_SETTINGS,
  GEAR_ESSENTIAL,
  GEAR_SUPPORT,
  PACKING_CLOTHING_BASE,
  PACKING_ESSENTIALS,
  packingExtrasForTour,
} from '@/lib/companion/content';
import { useChecklist, useCompanionValue } from '@/lib/companion/useChecklist';

type Tab = 'packing' | 'gear' | 'outfit';

export default function PrepareView({ tourCode }: { tourCode: string }) {
  const [tab, setTab] = useState<Tab>('packing');
  const extras = packingExtrasForTour(tourCode);

  const packingIds = [
    ...PACKING_ESSENTIALS.map((i) => i.id),
    ...PACKING_CLOTHING_BASE.map((i) => i.id),
    ...extras.winter.map((i) => i.id),
    ...extras.desert.map((i) => i.id),
    ...extras.night.map((i) => i.id),
  ];
  const gearIds = [...GEAR_ESSENTIAL.map((i) => i.id), ...GEAR_SUPPORT.map((i) => i.id)];

  const packing = useChecklist(`packing_${tourCode}`, packingIds);
  const gear = useChecklist(`gear_${tourCode}`, gearIds);
  const [bagWeight, setBagWeight] = useCompanionValue(`bag_weight_${tourCode}`, '');

  const weightNum = Number(bagWeight);
  const weightColor =
    !bagWeight || !Number.isFinite(weightNum)
      ? 'text-slate-500'
      : weightNum < 18
        ? 'text-emerald-600'
        : weightNum <= 20
          ? 'text-amber-600'
          : 'text-red-600';

  const tabs: { id: Tab; label: string }[] = [
    { id: 'packing', label: 'Packing' },
    { id: 'gear', label: 'Camera Gear' },
    { id: 'outfit', label: 'Outfit' },
  ];

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="font-serif text-2xl font-semibold mb-1">เตรียมตัว</h1>
      <p className="text-white/60 text-sm mb-4">Prepare for your journey</p>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              tab === t.id ? 'bg-companion-accent text-companion-dark' : 'bg-companion-surface text-white/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'packing' && (
        <div className="space-y-4">
          <SafetyBanner>
            <p className="font-semibold">⚠️ Jetstar</p>
            <p className="mt-1">Checked bag สูงสุด 20kg · Carry-on 7kg (56×36×23cm)</p>
            <p className="mt-1 text-amber-200">❗ เกินน้ำหนักคิดค่าธรรมเนียมจาก AUD $20/kg</p>
          </SafetyBanner>

          <p className="text-xs text-white/50">
            {packing.done}/{packing.total} รายการ
          </p>

          <section className="space-y-2">
            <p className="text-sm font-semibold text-companion-accent">ของจำเป็น</p>
            {PACKING_ESSENTIALS.map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                label={item.en}
                labelTh={item.th}
                checked={!!packing.checked[item.id]}
                onToggle={packing.toggle}
              />
            ))}
          </section>

          <section className="space-y-2">
            <p className="text-sm font-semibold text-companion-accent">เสื้อผ้า</p>
            {PACKING_CLOTHING_BASE.map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                label={item.en}
                labelTh={item.th}
                checked={!!packing.checked[item.id]}
                onToggle={packing.toggle}
              />
            ))}
            {extras.winter.map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                label={item.en}
                labelTh={item.th}
                checked={!!packing.checked[item.id]}
                onToggle={packing.toggle}
              />
            ))}
            {extras.desert.map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                label={item.en}
                labelTh={item.th}
                checked={!!packing.checked[item.id]}
                onToggle={packing.toggle}
              />
            ))}
            {extras.night.map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                label={item.en}
                labelTh={item.th}
                checked={!!packing.checked[item.id]}
                onToggle={packing.toggle}
              />
            ))}
          </section>

          <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark">
            <label className="text-sm font-medium">น้ำหนักกระเป๋า (kg)</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={bagWeight}
              onChange={(e) => setBagWeight(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              placeholder="เช่น 18"
            />
            <p className={`mt-2 text-sm font-semibold ${weightColor}`}>
              {bagWeight ? `${bagWeight} kg` : 'กรอกน้ำหนักเพื่อดูสถานะ'}
              {Number.isFinite(weightNum) && weightNum > 20 && ' — เกิน 20kg!'}
            </p>
          </div>
        </div>
      )}

      {tab === 'gear' && (
        <div className="space-y-4">
          <p className="text-sm text-companion-accent-warm font-semibold">พี่แสน&apos;s Recommended Gear List</p>
          <p className="text-xs text-white/50">
            {gear.done}/{gear.total} รายการ
          </p>
          {GEAR_ESSENTIAL.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.en}
              labelTh={item.th}
              checked={!!gear.checked[item.id]}
              onToggle={gear.toggle}
            />
          ))}
          <p className="text-sm font-semibold text-companion-accent pt-2">Support & Accessories</p>
          {GEAR_SUPPORT.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.en}
              labelTh={item.th}
              checked={!!gear.checked[item.id]}
              onToggle={gear.toggle}
            />
          ))}

          <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark space-y-3">
            <p className="font-semibold text-sm">Settings Quick-Reference</p>
            {CAMERA_SETTINGS.map((s) => (
              <div key={s.label} className="text-sm border-b border-slate-100 pb-2 last:border-0">
                <p>
                  {s.icon} {s.label}
                </p>
                <p className="text-slate-600 font-mono text-xs mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          <SafetyBanner variant="info">
            <p>ℹ️ พี่แสนนำโดรน — แขกไม่ต้องนำโดรนเอง</p>
            <p className="mt-1 text-sm opacity-90">
              ⚠️ กฎ CASA — ห้ามบินในอุทยานแห่งชาติโดยไม่ได้รับอนุญาต
            </p>
          </SafetyBanner>
        </div>
      )}

      {tab === 'outfit' && (
        <div className="space-y-4">
          <p className="text-sm text-companion-accent-warm font-semibold">Look Your Best in Every Shot</p>
          <OutfitPalette tourCode={tourCode} />
          <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark text-sm space-y-2">
            <p className="font-semibold">เคล็ดลับทั่วไป</p>
            <ul className="space-y-1 text-slate-600">
              <li>• เตรียม 2-3 ชุด (เก็บในรถระหว่างจุดถ่าย)</li>
              <li>• หลีกเลี่ยงโลโก้/ตัวหนังสือบนเสื้อในภาพ landscape</li>
              <li>• ชุดชั้นใน neutral ถ้าใส่สีขาว/โปร่ง</li>
              <li>• รองเท้าสบายที่ดูดีในกล้อง</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
