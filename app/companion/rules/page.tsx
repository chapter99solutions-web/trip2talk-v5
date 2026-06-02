'use client';



import { useCallback, useEffect, useState } from 'react';

import ChecklistItem from '@/components/companion/ChecklistItem';

import SafetyBanner from '@/components/companion/SafetyBanner';

import { useRequireCompanion } from '@/components/companion/CompanionProvider';

import { companionStorageKey } from '@/lib/companion/session';

import { isGuestSession, sessionStaffRole } from '@/lib/companion/staff-session';

import { formatThaiDateTime } from '@/lib/companion/format-thai-datetime';

import {

  getSafetyAckStatus,

  getSafetyAckStatusForStaff,

  saveSafetyAcknowledgement,

  saveStaffSafetyAcknowledgement,

} from '@/app/actions/safety-ack';



const SAFETY_ITEMS = [

  { id: 'medical', text: '🏥 แจ้งพี่แสนเรื่องโรคประจำตัวก่อนออกเดินทาง' },

  { id: 'ocean', text: '🌊 ถ่ายริมทะเล/หน้าผา: อย่าหันหลังให้คลื่น — คลื่นอันตรายมีจริง' },

  { id: 'night', text: '🏔️ ถ่ายกลางคืน: อยู่กับกลุ่ม นำไฟฉาย ใส่ชุดอุ่น' },

  { id: 'outback', text: '🐍 Outback (ULU): ระวังจุดเหยียบ ส่องรองเท้าทุกเช้า' },

  { id: 'drive', text: '🚗 เดินทางไกล: ดื่มน้ำ กินก่อนออก งีบในรถได้ถ้าเหนื่อย' },

  { id: 'alcohol', text: '⚠️ ห้ามดื่มแอลกอฮอล์ก่อนเซสชันถ่ายภาพ' },

  { id: 'location', text: '📱 แชร์ตำแหน่งกับคนที่บ้านสำหรับทริปหลายวัน' },

];



const LEGAL_ITEMS = [

  '📸 อุทยานแห่งชาติบางแห่งต้องมีใบอนุญาต — พี่แสนจัดการให้แล้ว',

  '🚁 โดรน: กฎ CASA — แขกห้ามบินโดรนส่วนตัวโดยไม่แจ้งทีม / no-fly ในอุทยาน',

  '🏛️ ที่ดินส่วนตัว: ห้ามเข้าโดยไม่ได้รับอนุญาตจากไกด์',

  '🤫 จุดลับ: อย่าแชร์พิกัด GPS แม่นยำบนโซเชียล — บอกแค่พื้นที่ทั่วไป',

  '📱 โซเชียล: แท็ก @trip2talk หรือ #trip2talk',

  '💰 มัดจำไม่คืน (ตามเงื่อนไขการจอง)',

  '🤝 เคารพวัฒนธรรมท้องถิ่นและสิ่งแวดล้อม',

  '🌿 Leave No Trace: เก็บขยะทุกชิ้น ไม่เก็บดอกไม้/หิน',

];



export default function CompanionRulesPage() {

  const { session, ready } = useRequireCompanion();

  const [ack, setAck] = useState(false);

  const [supabaseAt, setSupabaseAt] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const [saveError, setSaveError] = useState<string | null>(null);



  const ackKey = companionStorageKey('safety_ack');



  const loadFromSupabase = useCallback(async () => {

    if (!session) return;

    if (isGuestSession(session) && session.booking?.booking_ref) {

      const res = await getSafetyAckStatus({

        kind: 'guest',

        bookingRef: session.booking.booking_ref,

      });

      if (res.ok && res.data.acknowledged && res.data.acknowledgedAt) {

        setAck(true);

        setSupabaseAt(res.data.acknowledgedAt);

      }

      return;

    }

    const staffRole = sessionStaffRole(session);

    if (staffRole) {

      const identifier =

        session.booking?.booking_ref && session.booking.booking_ref !== 'TEAM-PREVIEW'

          ? session.booking.booking_ref

          : staffRole;

      const res = await getSafetyAckStatusForStaff({ staffRole, identifier });

      if (res.ok && res.data.acknowledged && res.data.acknowledgedAt) {

        setAck(true);

        setSupabaseAt(res.data.acknowledgedAt);

      }

    }

  }, [session]);



  useEffect(() => {

    try {

      const raw = localStorage.getItem(ackKey);

      if (raw) {

        const parsed = JSON.parse(raw) as { ok: boolean; at: string };

        setAck(parsed.ok);

      }

    } catch {

      /* ignore */

    }

    loadFromSupabase();

  }, [ackKey, loadFromSupabase]);



  async function toggleAck() {

    if (!session) return;

    const next = !ack;

    const at = new Date().toISOString();

    setAck(next);

    if (!next) setSupabaseAt(null);

    localStorage.setItem(ackKey, JSON.stringify({ ok: next, at: next ? at : '' }));



    if (!next) return;



    setSaving(true);

    setSaveError(null);

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;



    if (isGuestSession(session) && session.booking?.booking_ref) {

      const res = await saveSafetyAcknowledgement({

        kind: 'guest',

        bookingRef: session.booking.booking_ref,

        email: session.booking.email,

        tourCode: session.trip?.tour_code,

        userAgent,

      });

      setSaving(false);

      if (!res.ok) {

        setSaveError(res.error);

        return;

      }

      setSupabaseAt(res.data.acknowledgedAt);

      return;

    }



    const staffRole = sessionStaffRole(session);

    if (staffRole) {

      const identifier =

        session.booking?.booking_ref && session.booking.booking_ref !== 'TEAM-PREVIEW'

          ? session.booking.booking_ref

          : staffRole;

      const res = await saveStaffSafetyAcknowledgement({

        staffRole,

        identifier,

        userAgent,

      });

      setSaving(false);

      if (!res.ok) {

        setSaveError(res.error);

        return;

      }

      setSupabaseAt(res.data.acknowledgedAt);

    } else {

      setSaving(false);

    }

  }



  if (!ready || !session) return null;



  const guidePhone = process.env.NEXT_PUBLIC_GUIDE_PHONE ?? '—';

  const displayAt = ack && supabaseAt ? formatThaiDateTime(supabaseAt) : null;



  return (

    <div className="px-4 pt-4 pb-4">

      <h1 className="font-serif text-2xl font-semibold mb-1">กฎ & ความปลอดภัย</h1>

      <p className="text-white/60 text-sm mb-6">Rules & Safety</p>



      <section className="mb-8">

        <h2 className="text-companion-accent font-semibold mb-3">ความปลอดภัยแขก</h2>

        <div className="space-y-2">

          {SAFETY_ITEMS.map((item) => (

            <div key={item.id} className="rounded-xl bg-companion-card p-3 text-sm text-companion-text-dark">

              {item.text}

            </div>

          ))}

        </div>

        <SafetyBanner variant="info">

          <p className="font-semibold">🆘 ฉุกเฉิน</p>

          <p className="mt-2 text-lg font-mono">Police / Ambulance: 000</p>

          <p className="mt-2 text-sm">พี่แสน: {guidePhone}</p>

        </SafetyBanner>

      </section>



      <section className="mb-8">

        <h2 className="text-companion-accent-warm font-semibold mb-3">กฎหมาย & จรรยาบรรณ</h2>

        <div className="space-y-2">

          {LEGAL_ITEMS.map((text) => (

            <div key={text} className="rounded-xl bg-companion-card p-3 text-sm text-companion-text-dark">

              {text}

            </div>

          ))}

        </div>

      </section>



      <div className="rounded-2xl bg-companion-surface border border-white/10 p-4">

        <ChecklistItem

          id="safety_ack"

          label="I have read and understood the safety guidelines"

          labelTh="ฉันได้อ่านและเข้าใจแนวทางความปลอดภัยแล้ว"

          checked={ack}

          onToggle={() => toggleAck()}

        />

        {saving && <p className="text-xs text-white/50 mt-2 pl-8">กำลังบันทึก…</p>}

        {saveError && <p className="text-xs text-red-300 mt-2 pl-8">{saveError}</p>}

        {displayAt && !saving && (

          <p className="text-xs text-companion-accent mt-2 pl-8">✅ บันทึกแล้วเมื่อ {displayAt}</p>

        )}

      </div>

    </div>

  );

}

