export const SOP_CATEGORIES = [
  { id: 'booking', label: '📅 Booking', suggestions: ['วิธีรับจอง', 'นโยบายยกเลิก', 'วิธีส่ง consent link'] },
  { id: 'photography', label: '📷 Photography', suggestions: ['workflow ก่อนทริป', 'การ backup ไฟล์', 'การส่งมอบรูป'] },
  { id: 'safety', label: '🛡️ Safety', suggestions: ['emergency protocol', 'การแจ้งอุบัติเหตุ'] },
  { id: 'marketing', label: '📣 Marketing', suggestions: ['calendar โพสต์', 'วิธีใช้ promo code'] },
  { id: 'finance', label: '💰 Finance', suggestions: ['วิธีทำ BAS', 'วิธี export tax report'] },
] as const;

export const ASSET_TYPES = [
  { id: 'domain', label: 'Domain' },
  { id: 'social_account', label: 'Social account' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'brand_ip', label: 'Brand / IP' },
  { id: 'software', label: 'Software' },
  { id: 'other', label: 'Other' },
] as const;
