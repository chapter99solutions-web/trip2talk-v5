export type TimelineStop = {
  name: string;
  nameTh?: string;
  type: 'shoot' | 'walk' | 'food' | 'rest';
};

export type TimelineDay = {
  day: number;
  title: string;
  titleTh: string;
  stops: TimelineStop[];
};

export const MEETING_POINT = 'Sydney International Airport (Terminal 2)';
export const MEETING_POINT_TH = 'สนามบินซิดนีย์ ท่าอากาศยานระหว่างประเทศ (T2)';

export const SHOT_LIST_PREVIEW: Record<string, { name: string; nameTh: string }[]> = {
  'MEL-4D3N': [
    { name: 'Twelve Apostles golden hour', nameTh: 'Twelve Apostles ช่วงแสงทอง' },
    { name: 'Great Ocean Road coastline', nameTh: 'ชายฝั่ง Great Ocean Road' },
    { name: 'Melbourne laneways', nameTh: 'ตรอกเมลเบิร์น' },
  ],
  'ULU-4D3N': [
    { name: 'Uluru sunrise', nameTh: 'พระอาทิตย์ขึ้นที่อูลูรู' },
    { name: 'Kata Tjuta domes', nameTh: 'Kata Tjuta' },
    { name: 'Desert star trail', nameTh: 'ทางช้างเต่ากลางทะเลทราย' },
  ],
  'NZ-6D5N': [
    { name: 'Lake Tekapo church', nameTh: 'โบสถ์เลคเทคาโป' },
    { name: 'Mount Cook alpine', nameTh: 'เทือกเขา Mount Cook' },
    { name: 'Queenstown lakefront', nameTh: 'ริมทะเลสาบควีนส์ทาวน์' },
  ],
  default: [
    { name: 'Golden hour landscape', nameTh: 'ภูมิทัศน์แสงทอง' },
    { name: 'Portrait at scenic lookout', nameTh: 'พอร์เทรตจุดชมวิว' },
    { name: 'Night sky (if applicable)', nameTh: 'ท้องฟ้ายามค่ำ' },
  ],
};

export function getShotList(tourCode: string) {
  return SHOT_LIST_PREVIEW[tourCode.toUpperCase()] ?? SHOT_LIST_PREVIEW.default;
}

export const PACKING_ESSENTIALS = [
  { id: 'passport', en: 'Passport / ID', th: 'พาสปอร์ต / บัตรประชาชน' },
  { id: 'insurance', en: 'Travel insurance documents', th: 'เอกสารประกันการเดินทาง' },
  { id: 'confirm', en: 'Booking confirmation (screenshot)', th: 'ยืนยันการจอง (แคปหน้าจอ)' },
  { id: 'cash', en: 'Cash AUD + card', th: 'เงินสด AUD + บัตร' },
  { id: 'phone', en: 'Phone + charger + power bank', th: 'โทรศัพท์ + ที่ชาร์จ + power bank' },
  { id: 'sunscreen', en: 'Sunscreen SPF50+', th: 'ครีมกันแดด SPF50+' },
  { id: 'insect', en: 'Insect repellent', th: 'ยากันยุง' },
  { id: 'meds', en: 'Personal medication', th: 'ยาส่วนตัว' },
  { id: 'sanitiser', en: 'Hand sanitiser', th: 'เจลล้างมือ' },
  { id: 'bottle', en: 'Reusable water bottle', th: 'กระบอกน้ำ' },
];

export const PACKING_CLOTHING_BASE = [
  { id: 'shoes', en: 'Comfortable walking shoes', th: 'รองเท้าเดินสบาย' },
  { id: 'sandals', en: 'Sandals', th: 'รองเท้าแตะ' },
  { id: 'rain', en: 'Rain jacket (light)', th: 'เสื้อกันฝน (เบา)' },
];

export const PACKING_WINTER = [
  { id: 'thermal', en: 'Thermal base layer', th: 'ชั้นในกันหนาว' },
  { id: 'wp-jacket', en: 'Waterproof jacket', th: 'เสื้อกันฝน/ลม' },
  { id: 'beanie', en: 'Beanie', th: 'หมวกไหมพรม' },
  { id: 'gloves', en: 'Gloves', th: 'ถุงมือ' },
];

export const PACKING_DESERT = [
  { id: 'sunhat', en: 'Sun hat', th: 'หมวกกันแดด' },
  { id: 'longsleeve', en: 'Light long-sleeve shirt', th: 'เสื้อแขนยาวบาง' },
  { id: 'buff', en: 'Buff / neck gaiter', th: 'ผ้าบัฟคลุมคอ' },
];

export const PACKING_NIGHT = [
  { id: 'torch', en: 'Head torch', th: 'ไฟฉายคาดหัว' },
  { id: 'redfilter', en: 'Red filter for torch', th: 'ฟิลเตอร์แดงสำหรับไฟฉาย' },
  { id: 'warmers', en: 'Hand warmers', th: 'ถุงมือให้ความร้อน' },
];

export function packingExtrasForTour(tourCode: string) {
  const code = tourCode.toUpperCase();
  const winter = ['MEL-4D3N', 'TAS-3D2N', 'TAS-LH-4D3N', 'NZ-6D5N', 'TAS-SU-4D3N', 'SYD-MW-WIN'].includes(code);
  const desert = code === 'ULU-4D3N';
  const night = ['SYD-MW-WIN', 'TAS-3D2N', 'TAS-LH-4D3N', 'NZ-6D5N'].includes(code);
  return {
    winter: winter ? PACKING_WINTER : [],
    desert: desert ? PACKING_DESERT : [],
    night: night ? PACKING_NIGHT : [],
  };
}

export const GEAR_ESSENTIAL = [
  { id: 'body', en: 'Camera body (mirrorless/DSLR)', th: 'ตัวกล้อง (mirrorless/DSLR)' },
  { id: 'wide', en: 'Wide angle lens (16-35mm) — Milky Way & landscapes', th: 'เลนส์มุมกว้าง 16-35mm' },
  { id: 'std', en: 'Standard zoom (24-70mm)', th: 'ซูมมาตรฐาน 24-70mm' },
  { id: 'tele', en: 'Telephoto (70-200mm) — optional', th: 'เทเลโฟโต้ 70-200mm (ถ้ามี)' },
  { id: 'bat', en: 'Extra batteries x2 minimum', th: 'แบตเตอรี่สำรองอย่างน้อย 2' },
  { id: 'cards', en: 'Memory cards x3 (64GB+)', th: 'การ์ดความจำ x3 (64GB+)' },
  { id: 'clean', en: 'Lens cleaning kit + blower', th: 'ชุดทำความสะอาดเลนส์' },
];

export const GEAR_SUPPORT = [
  { id: 'tripod', en: 'Sturdy tripod — MANDATORY for night shoots', th: 'ขาตั้งกล้องแข็งแรง — จำเป็นสำหรับถ่ายกลางคืน' },
  { id: 'remote', en: 'Remote shutter release', th: 'รีโมทชัตเตอร์' },
  { id: 'nd', en: 'ND filters (ND64, ND1000)', th: 'ฟิลเตอร์ ND' },
  { id: 'cpl', en: 'Polarising filter', th: 'ฟิลเตอร์ CPL' },
  { id: 'raincover', en: 'Rain cover for camera', th: 'ผ้าคลุมกล้องกันฝน' },
];

export const CAMERA_SETTINGS = [
  { icon: '🌅', label: 'Golden Hour', value: 'f/8 | ISO 100-400 | Shutter varies' },
  { icon: '🌌', label: 'Milky Way', value: 'f/2.8 | ISO 3200-6400 | 15-25sec | WB 3800K' },
  { icon: '💧', label: 'Waterfall', value: 'f/11 | ISO 100 | ND1000 | 1-4sec' },
  { icon: '🏔️', label: 'Landscape', value: 'f/8-f/11 | ISO 100 | Focus 1/3 into frame' },
];

export type OutfitPalette = {
  title: string;
  titleTh: string;
  good: string[];
  avoid: string[];
  tip: string;
  tipTh: string;
};

export const OUTFIT_PALETTES: Record<string, OutfitPalette> = {
  'MEL-4D3N': {
    title: 'Melbourne (Urban + Nature)',
    titleTh: 'เมลเบิร์น (เมือง +ธรรมชาติ)',
    good: [
      'Earth tones: camel, terracotta, olive, cream',
      'Jewel tones: burgundy, forest green, cobalt',
    ],
    avoid: ['Neon colours, busy patterns, all-black in shadows'],
    tip: 'Layered looks for changeable weather',
    tipTh: 'ใส่เป็นชั้นๆ รองรับอากาศเปลี่ยน',
  },
  'ULU-4D3N': {
    title: 'Uluru (Desert / Outback)',
    titleTh: 'อูลูรู (ทะเลทราย)',
    good: [
      'Desert palette: white, sand, rust, burnt orange, sage',
      'Bold contrast: electric blue, turquoise vs red rock',
    ],
    avoid: ['Camouflage tones, light grey that blends in'],
    tip: 'Flowy breathable fabrics + sun hat',
    tipTh: 'ผ้าบางระบายอากาศ + หมวกกันแดด',
  },
  'NZ-6D5N': {
    title: 'New Zealand (Alpine / Autumn)',
    titleTh: 'นิวซีแลนด์ (เทือกเขา / ใบไม้ร่วง)',
    good: [
      'Autumn: mustard, burnt sienna, cream, wine red',
      'Cool tones: slate blue, muted sage, warm white',
    ],
    avoid: ['Bright neon, gym wear on camera'],
    tip: 'Coats and puffers look great in alpine shots',
    tipTh: 'เสื้อโค้ท/พัฟเฟอร์ถ่ายรูปสวยบนภูเขา',
  },
  'TAS-3D2N': {
    title: 'Tasmania (Historic + Aurora)',
    titleTh: 'แทสเมเนีย (ประวัติศาสตร์ + ออโรร่า)',
    good: ['Charcoal, deep teal, burgundy, forest green', 'Cream, soft pink for MONA'],
    avoid: ['Very light colours at night shoots'],
    tip: 'Smart-casual for MONA, warm layers for aurora',
    tipTh: 'แต่งสมาร์ทแคชวัลที่ MONA ชุดอุ่นสำหรับออโรร่า',
  },
  'TAS-LH-4D3N': {
    title: 'Launceston Highland',
    titleTh: 'ลอนเซสตัน ไฮแลนด์',
    good: ['Charcoal, deep teal, burgundy, forest green', 'Cream accents'],
    avoid: ['Very light colours at night'],
    tip: 'Warm layers essential',
    tipTh: 'ชุดกันหนาวสำคัญ',
  },
  coastal: {
    title: 'Coastal (Kiama / Sydney)',
    titleTh: 'ชายฝั่ง (เกียม่า / ซิดนีย์)',
    good: ['White, sky blue, coral, lemon yellow', 'Sunset: peach, gold, terracotta'],
    avoid: ['Dark navy near rocks'],
    tip: 'Light linen or flowy dress for golden hour',
    tipTh: 'ผ้าลินินหรือชุดพลิ้วสำหรับแสงทอง',
  },
};

export function getOutfitPalette(tourCode: string): OutfitPalette {
  const code = tourCode.toUpperCase();
  if (OUTFIT_PALETTES[code]) return OUTFIT_PALETTES[code];
  if (['KIA-1DAY', 'SYD-1DAY', 'PSP-1DAY', 'BER-3D2N', 'LAV-ANB-1D'].includes(code)) {
    return OUTFIT_PALETTES.coastal;
  }
  return OUTFIT_PALETTES['MEL-4D3N'];
}

export const TIMELINE_FALLBACK: Record<string, TimelineDay[]> = {
  'MEL-4D3N': [
    {
      day: 1,
      title: 'Melbourne arrival & city light',
      titleTh: 'วันที่ 1 — เมลเบิร์น',
      stops: [
        { name: 'Airport meet & greet', type: 'rest', nameTh: 'นัดพบสนามบิน' },
        { name: 'City sunset shoot', type: 'shoot', nameTh: 'ถ่ายพระอาทิตย์ตกในเมือง' },
        { name: 'Group dinner', type: 'food', nameTh: 'มื้อเย็น' },
      ],
    },
    {
      day: 2,
      title: 'Great Ocean Road',
      titleTh: 'วันที่ 2 — Great Ocean Road',
      stops: [
        { name: 'Twelve Apostles sunrise', type: 'shoot', nameTh: 'พระอาทิตย์ขึ้น Twelve Apostles' },
        { name: 'Coastal lookouts', type: 'walk', nameTh: 'จุดชมวิว' },
      ],
    },
  ],
  default: [
    {
      day: 1,
      title: 'Day 1 — Welcome',
      titleTh: 'วัน 1 — ยินดีต้อนรับ',
      stops: [
        { name: 'Meet at airport', type: 'rest', nameTh: 'นัดพบสนามบิน' },
        { name: 'Orientation & first shoot', type: 'shoot', nameTh: 'แนะนำทริป + ถ่ายภาพแรก' },
      ],
    },
  ],
};

export function getTimelineFallback(tourCode: string): TimelineDay[] {
  return TIMELINE_FALLBACK[tourCode.toUpperCase()] ?? TIMELINE_FALLBACK.default;
}

export const STOP_TYPE_ICON: Record<TimelineStop['type'], string> = {
  shoot: '📷',
  walk: '🚶',
  food: '🍽️',
  rest: '😴',
};
