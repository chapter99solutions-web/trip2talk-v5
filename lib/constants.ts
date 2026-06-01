import { getStoragePublicBase } from './env';

export const FLAGSHIP_TOUR_CODE = 'NZ-6D5N' as const;

export const REAL_TOUR_CODES = [
  'TAS-3D2N',
  'MEL-4D3N',
  'ULU-4D3N',
  FLAGSHIP_TOUR_CODE,
  'TAS-LH-4D3N',
  'KIA-1DAY',
  'CAN-2D1N',
  'SYD-1DAY',
] as const;

export type TourCode = (typeof REAL_TOUR_CODES)[number];

export const DASHBOARD_PINS = {
  staff: '1111',
  cohost: '4444',
  owner: '9999',
  platform: '3501',
} as const;

export type DashboardRole = keyof typeof DASHBOARD_PINS;

export const GALLERY_TABS = [
  {
    id: 'all',
    labelEn: 'All',
    labelTh: 'ทั้งหมด',
    folders: ['Melbourne', 'Tasmania', 'Uluru', 'New Zealand', 'SYDNEY'],
  },
  { id: 'melbourne', labelEn: 'Melbourne', labelTh: 'เมลเบิร์น', folders: ['Melbourne'] },
  { id: 'tasmania', labelEn: 'Tasmania', labelTh: 'แทสเมเนีย', folders: ['Tasmania'] },
  { id: 'uluru', labelEn: 'Uluru', labelTh: 'อูลูรู', folders: ['Uluru'] },
  { id: 'nz', labelEn: 'New Zealand', labelTh: 'นิวซีแลนด์', folders: ['New Zealand'] },
  { id: 'sydney', labelEn: 'Sydney', labelTh: 'ซิดนีย์', folders: ['SYDNEY'] },
] as const;

/** Gradient fallbacks when cover images fail to load (never plain black). */
export const TRIP_COVER_GRADIENT: Record<TourCode, string> = {
  'TAS-3D2N': 'from-emerald-600 via-teal-700 to-slate-900',
  'MEL-4D3N': 'from-rose-500 via-orange-600 to-amber-900',
  'ULU-4D3N': 'from-orange-600 via-red-700 to-stone-900',
  'NZ-6D5N': 'from-sky-500 via-indigo-600 to-slate-900',
  'TAS-LH-4D3N': 'from-violet-600 via-purple-700 to-slate-900',
  'KIA-1DAY': 'from-cyan-500 via-blue-600 to-teal-900',
  'CAN-2D1N': 'from-amber-500 via-yellow-600 to-orange-900',
  'SYD-1DAY': 'from-blue-500 via-sky-600 to-navy',
};

export function isRealTourCode(code: string): code is TourCode {
  return (REAL_TOUR_CODES as readonly string[]).includes(code.toUpperCase());
}

export function portfolioImageUrl(path: string): string {
  const clean = path.replace(/^\/+/, '');
  return `${getStoragePublicBase()}/${encodeURI(clean)}`;
}

/** Normalize any storage URL or relative path to NEXT_PUBLIC_STORAGE_URL base. */
export function normalizeCoverImageUrl(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  const trimmed = url.trim();
  const base = getStoragePublicBase();

  if (trimmed.startsWith('http')) {
    const pathMatch = trimmed.match(/\/object\/public\/portfolio\/(.+)$/i);
    if (pathMatch) return `${base}/${pathMatch[1]}`;
    return trimmed.replace(/pcqxewzzypwxfldxkcxp\.supabase\.co/gi, 'niuibpznjvytprbrzvnn.supabase.co');
  }
  return portfolioImageUrl(trimmed);
}

export function isMultiDayTrip(duration: string): boolean {
  return !duration.toUpperCase().includes('1DAY');
}
