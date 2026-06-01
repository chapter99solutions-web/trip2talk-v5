export const SUPABASE_PROJECT = 'niuibpznjvytprbrzvnn';

export const STORAGE_PUBLIC_BASE = `https://${SUPABASE_PROJECT}.supabase.co/storage/v1/object/public/portfolio`;

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
  { id: 'all', labelEn: 'All', labelTh: 'ทั้งหมด', folders: ['Melbourne', 'Tasmania', 'Ulruru', 'Uluru', 'New Zealand', 'Sydney', 'SYD', 'SYDNEY', 'Cowra', 'Mixed Cover'] },
  { id: 'melbourne', labelEn: 'Melbourne', labelTh: 'เมลเบิร์น', folders: ['Melbourne'] },
  { id: 'tasmania', labelEn: 'Tasmania', labelTh: 'แทสเมเนีย', folders: ['Tasmania'] },
  { id: 'uluru', labelEn: 'Uluru', labelTh: 'อูลูรู', folders: ['Ulruru', 'Uluru'] },
  { id: 'nz', labelEn: 'New Zealand', labelTh: 'นิวซีแลนด์', folders: ['New Zealand'] },
  { id: 'sydney', labelEn: 'Sydney', labelTh: 'ซิดนีย์', folders: ['Sydney', 'SYD', 'SYDNEY'] },
] as const;

export function isRealTourCode(code: string): code is TourCode {
  return (REAL_TOUR_CODES as readonly string[]).includes(code.toUpperCase());
}

export function portfolioImageUrl(path: string): string {
  const clean = path.replace(/^\/+/, '');
  return `${STORAGE_PUBLIC_BASE}/${encodeURI(clean)}`;
}

export function isMultiDayTrip(duration: string): boolean {
  return !duration.toUpperCase().includes('1DAY');
}
