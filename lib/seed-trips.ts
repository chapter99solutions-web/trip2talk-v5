import type { TripRow } from './supabase';
import { FLAGSHIP_TOUR_CODE, portfolioImageUrl } from './constants';

/** Canonical seed — only these 8 tour_codes may appear in the UI. */
export const SEED_TRIPS: Omit<TripRow, 'id' | 'created_at'>[] = [
  {
    tour_code: 'TAS-3D2N',
    name: 'Tasmania 3D2N',
    name_th: 'แทสเมเนีย 3 วัน 2 คืน',
    date: null,
    price: 1200,
    max_seats: 6,
    seats_taken: 0,
    cover_image: portfolioImageUrl('Tasmania/596873932_1428638042594626_8987722411601397177_n.jpg'),
    description: 'Tasmania 3D2N private photo journey.',
    duration: '3D2N',
    season: 'All Year',
  },
  {
    tour_code: 'MEL-4D3N',
    name: 'Melbourne 4D3N',
    name_th: 'เมลเบิร์น 4 วัน 3 คืน',
    date: null,
    price: 1350,
    max_seats: 6,
    seats_taken: 0,
    cover_image: portfolioImageUrl('Melbourne/01.jpg'),
    description: 'Melbourne 4D3N private photo journey.',
    duration: '4D3N',
    season: 'All Year',
  },
  {
    tour_code: 'ULU-4D3N',
    name: 'Red Desert Odyssey 4D3N',
    name_th: 'อูลูรู 4 วัน 3 คืน',
    date: null,
    price: 1690,
    max_seats: 5,
    seats_taken: 0,
    cover_image: portfolioImageUrl('Uluru/1.jpg'),
    description: 'Red Desert Odyssey 4D3N private photo journey.',
    duration: '4D3N',
    season: 'All Year',
  },
  {
    tour_code: FLAGSHIP_TOUR_CODE,
    name: 'New Zealand South Island 6D5N',
    name_th: 'นิวซีแลนด์ 6 วัน 5 คืน',
    date: null,
    price: 2350,
    max_seats: 5,
    seats_taken: 0,
    featured: true,
    cover_image: portfolioImageUrl('New Zealand/Spring/T2T-10.JPG'),
    description: 'New Zealand South Island 6D5N private photo journey.',
    duration: '6D5N',
    season: 'Spring',
  },
  {
    tour_code: 'TAS-LH-4D3N',
    name: 'The Launceston Highland 4D3N',
    name_th: 'ลอนเซสตัน 4 วัน 3 คืน',
    date: null,
    price: 1350,
    max_seats: 6,
    seats_taken: 0,
    cover_image: portfolioImageUrl('Tasmania/596371362_1428639202594510_8709278754225773992_n.jpg'),
    description: 'The Launceston Highland 4D3N private photo journey.',
    duration: '4D3N',
    season: 'Winter',
  },
  {
    tour_code: 'KIA-1DAY',
    name: 'Kiama 1 Day',
    name_th: 'เกียม่า 1 วัน',
    date: null,
    price: 290,
    max_seats: 8,
    seats_taken: 0,
    cover_image: portfolioImageUrl('SYD/705320467_10242162489108855_3820285517745745334_n.jpg'),
    description: 'Kiama 1 Day private photo journey.',
    duration: '1DAY',
    season: 'All Year',
  },
  {
    tour_code: 'CAN-2D1N',
    name: 'Canberra 2D1N',
    name_th: 'แคนเบอร์รา 2 วัน 1 คืน',
    date: null,
    price: 590,
    max_seats: 6,
    seats_taken: 0,
    cover_image: portfolioImageUrl('Cowra/12 (1).jpg'),
    description: 'Canberra 2D1N private photo journey.',
    duration: '2D1N',
    season: 'All Year',
  },
  {
    tour_code: 'SYD-1DAY',
    name: 'Sydney 1 Day',
    name_th: 'ซิดนีย์ 1 วัน',
    date: null,
    price: 190,
    max_seats: 10,
    seats_taken: 0,
    cover_image: portfolioImageUrl('SYDNEY/506861557_10236863821565478_6038697174671264606_n.jpg'),
    description: 'Sydney 1 Day private photo journey.',
    duration: '1DAY',
    season: 'All Year',
  },
];

export function withIds(trips: Omit<TripRow, 'id' | 'created_at'>[]): TripRow[] {
  return trips.map((t, i) => ({
    ...t,
    id: `seed-${t.tour_code}-${i}`,
    created_at: new Date().toISOString(),
  }));
}

export function sortTripsForDisplay(trips: TripRow[]): TripRow[] {
  return [...trips].sort((a, b) => {
    if (a.tour_code === FLAGSHIP_TOUR_CODE) return -1;
    if (b.tour_code === FLAGSHIP_TOUR_CODE) return 1;
    return 0;
  });
}
