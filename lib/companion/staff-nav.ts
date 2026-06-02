import type { StaffRole } from './types';

export type NavTab = {
  href: string;
  icon: string;
  labelTh: string;
};

export const STAFF_GREETINGS: Record<StaffRole, string> = {
  photographer: 'สวัสดี ช่างภาพ 📷',
  cohost: 'สวัสดี พลอย 🌸',
  owner: 'สวัสดี พี่แสน 🎯',
};

export const STAFF_NAV: Record<StaffRole, NavTab[]> = {
  photographer: [
    { href: '/companion/home', icon: '🏠', labelTh: 'หน้าแรก' },
    { href: '/companion/prepare', icon: '🎒', labelTh: 'เตรียมตัว' },
    { href: '/companion/rules', icon: '📋', labelTh: 'กฎ' },
    { href: '/companion/timeline', icon: '📅', labelTh: 'ไทม์ไลน์' },
    { href: '/companion/expenses', icon: '💰', labelTh: 'ค่าใช้จ่าย' },
  ],
  cohost: [
    { href: '/companion/home', icon: '🏠', labelTh: 'หน้าแรก' },
    { href: '/companion/bookings', icon: '📝', labelTh: 'จองทริป' },
    { href: '/companion/guests', icon: '👥', labelTh: 'ลูกทริป' },
    { href: '/companion/marketing', icon: '📣', labelTh: 'การตลาด' },
    { href: '/companion/timeline', icon: '📅', labelTh: 'ไทม์ไลน์' },
  ],
  owner: [
    { href: '/companion/home', icon: '🏠', labelTh: 'หน้าแรก' },
    { href: '/companion/owner/finance', icon: '💵', labelTh: 'การเงิน' },
    { href: '/companion/owner/passport', icon: '📘', labelTh: 'Passport' },
    { href: '/companion/owner/reviews', icon: '⭐', labelTh: 'รีวิว' },
    { href: '/companion/owner/customers', icon: '👥', labelTh: 'ลูกค้า' },
  ],
};

export const GUEST_NAV: NavTab[] = [
  { href: '/companion/home', icon: '🏠', labelTh: 'หน้าแรก' },
  { href: '/companion/prepare', icon: '🎒', labelTh: 'เตรียมตัว' },
  { href: '/companion/rules', icon: '📋', labelTh: 'กฎ' },
  { href: '/companion/timeline', icon: '📅', labelTh: 'ไทม์ไลน์' },
  { href: '/companion/booking', icon: '👤', labelTh: 'โปรไฟล์' },
];

export function pinToStaffRole(pin: string): StaffRole | null {
  if (pin === '1111') return 'photographer';
  if (pin === '4444') return 'cohost';
  if (pin === '9999') return 'owner';
  return null;
}

export function isStaffRole(role: string): role is StaffRole {
  return role === 'photographer' || role === 'cohost' || role === 'owner';
}
