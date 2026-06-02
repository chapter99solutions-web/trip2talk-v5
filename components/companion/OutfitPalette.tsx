'use client';

import { getOutfitPalette } from '@/lib/companion/content';

type Props = { tourCode: string };

export default function OutfitPalette({ tourCode }: Props) {
  const palette = getOutfitPalette(tourCode);

  return (
    <div className="rounded-2xl bg-companion-card p-4 text-companion-text-dark shadow-lg space-y-4">
      <div>
        <p className="font-serif text-lg font-semibold">{palette.titleTh}</p>
        <p className="text-xs text-slate-500">{palette.title}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-700 mb-2">✅ แนะนำ</p>
        <ul className="text-sm space-y-1 text-slate-700">
          {palette.good.map((g) => (
            <li key={g}>• {g}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold text-red-600 mb-2">❌ หลีกเลี่ยง</p>
        <ul className="text-sm space-y-1 text-slate-700">
          {palette.avoid.map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      </div>
      <p className="text-sm rounded-xl bg-slate-50 p-3">
        <span className="font-medium">{palette.tipTh}</span>
        <span className="block text-xs text-slate-500 mt-1">{palette.tip}</span>
      </p>
    </div>
  );
}
