import { REAL_TOUR_CODES } from '@/lib/constants';
import { getCanonicalSeed } from '@/lib/trip-canonical';

export const TRIP_TARGETS: Record<string, number> = {
  'TAS-3D2N': 6,
  'MEL-4D3N': 6,
  'ULU-4D3N': 5,
  'NZ-6D5N': 5,
  'TAS-LH-4D3N': 6,
  'KIA-1DAY': 8,
  'CAN-2D1N': 6,
  'SYD-1DAY': 10,
};

export function promoTextTh(tourCode: string): string {
  const seed = getCanonicalSeed(tourCode);
  const name = seed?.name_th ?? seed?.name ?? tourCode;
  const price = seed?.price ?? 0;
  return `📸 Trip2Talk — ${name}\nทริปถ่ายภาพส่วนตัว กลุ่มเล็ก แสงจริง\nราคา $${price} AUD / คน\nจอง: https://trip2talk.com/trips/${tourCode}\n#trip2talk`;
}

export function bookingLink(tourCode: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://trip2talk.com';
  return `${base}/trips/${tourCode}`;
}

export function randomPromoCode(): string {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `T2T-${part}`;
}

export function allTourCodes() {
  return [...REAL_TOUR_CODES];
}
