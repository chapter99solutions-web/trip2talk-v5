export const EXPENSE_CATEGORIES = [
  { id: 'fuel', labelTh: 'เชื้อเพลิง' },
  { id: 'accommodation', labelTh: 'ที่พัก' },
  { id: 'team_food', labelTh: 'อาหารทีมงาน' },
  { id: 'venue', labelTh: 'ค่าเข้าสถานที่' },
  { id: 'gear', labelTh: 'อุปกรณ์' },
  { id: 'other', labelTh: 'อื่นๆ' },
] as const;

export type ExpenseCategoryId = (typeof EXPENSE_CATEGORIES)[number]['id'];

export function categoryLabelTh(id: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.id === id)?.labelTh ?? id;
}
