'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import StaffPageHeader from '@/components/companion/StaffPageHeader';
import { IDENTITY, buildPassportHtml } from '@/lib/business/passport-export';
import { ASSET_TYPES, SOP_CATEGORIES } from '@/lib/business/sop-categories';
import type { BusinessAssetRow, BusinessPassportMetrics, SopDocumentRow } from '@/lib/business/types';
import {
  getBusinessPassportMetrics,
  listBusinessAssets,
  listSopDocuments,
  upsertBusinessAsset,
  upsertSopDocument,
} from '@/app/actions/business';

const FOUNDED_KEY = 't2t_founded_year';
const BRAND_KEY = 't2t_brand_value_aud';

const DEFAULT_ASSETS: Omit<BusinessAssetRow, 'id' | 'created_at'>[] = [
  {
    asset_type: 'domain',
    asset_name: 'trip2talk.com.au',
    description: 'Hostinger',
    estimated_value_aud: 50,
    purchase_date: null,
    expiry_date: null,
    login_hint: 'email: trip2talksyd@gmail.com',
    notes: null,
  },
  {
    asset_type: 'social_account',
    asset_name: 'Instagram @trip2talk',
    description: 'Social following',
    estimated_value_aud: 500,
    purchase_date: null,
    expiry_date: null,
    login_hint: '@trip2talk',
    notes: null,
  },
  {
    asset_type: 'equipment',
    asset_name: 'Camera gear',
    description: 'Primary kit',
    estimated_value_aud: 15000,
    purchase_date: null,
    expiry_date: null,
    login_hint: null,
    notes: null,
  },
  {
    asset_type: 'software',
    asset_name: 'Vercel, Supabase, Cursor',
    description: 'Subscriptions',
    estimated_value_aud: 1200,
    purchase_date: null,
    expiry_date: null,
    login_hint: 'trip2talksyd@gmail.com',
    notes: 'Annual estimate',
  },
];

export default function OwnerPassportView() {
  const [metrics, setMetrics] = useState<BusinessPassportMetrics | null>(null);
  const [assets, setAssets] = useState<BusinessAssetRow[]>([]);
  const [sops, setSops] = useState<SopDocumentRow[]>([]);
  const [founded, setFounded] = useState('2020');
  const [brandValue, setBrandValue] = useState('5000');
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showSopForm, setShowSopForm] = useState(false);
  const [assetForm, setAssetForm] = useState({
    asset_type: 'domain',
    asset_name: '',
    description: '',
    estimated_value_aud: '',
    expiry_date: '',
    login_hint: '',
  });
  const [sopForm, setSopForm] = useState({
    id: '',
    category: 'booking',
    title: '',
    content: '',
  });

  const load = useCallback(async () => {
    const [m, a, s] = await Promise.all([
      getBusinessPassportMetrics(),
      listBusinessAssets(),
      listSopDocuments(),
    ]);
    if (m.ok) setMetrics(m.data);
    if (a.ok) {
      if (a.data.length === 0) {
        for (const row of DEFAULT_ASSETS) {
          await upsertBusinessAsset(row);
        }
        const again = await listBusinessAssets();
        if (again.ok) setAssets(again.data);
      } else {
        setAssets(a.data);
      }
    }
    if (s.ok) setSops(s.data);
  }, []);

  useEffect(() => {
    load();
    if (typeof window !== 'undefined') {
      setFounded(localStorage.getItem(FOUNDED_KEY) ?? '2020');
      setBrandValue(localStorage.getItem(BRAND_KEY) ?? '5000');
    }
  }, [load]);

  const assetSum = assets.reduce((s, a) => s + Number(a.estimated_value_aud ?? 0), 0);
  const annualRevenue = metrics?.revenueThisYear ?? 0;
  const estimatedValue = useMemo(
    () => annualRevenue * 2.5 + assetSum + (parseFloat(brandValue) || 0),
    [annualRevenue, assetSum, brandValue]
  );

  function saveLocalPrefs() {
    localStorage.setItem(FOUNDED_KEY, founded);
    localStorage.setItem(BRAND_KEY, brandValue);
  }

  async function saveAsset(e: React.FormEvent) {
    e.preventDefault();
    await upsertBusinessAsset({
      asset_type: assetForm.asset_type,
      asset_name: assetForm.asset_name,
      description: assetForm.description || null,
      estimated_value_aud: parseFloat(assetForm.estimated_value_aud) || null,
      expiry_date: assetForm.expiry_date || null,
      login_hint: assetForm.login_hint || null,
    });
    setShowAssetForm(false);
    load();
  }

  async function saveSop(e: React.FormEvent) {
    e.preventDefault();
    await upsertSopDocument({
      id: sopForm.id || undefined,
      category: sopForm.category,
      title: sopForm.title,
      content: sopForm.content,
    });
    setShowSopForm(false);
    setSopForm({ id: '', category: 'booking', title: '', content: '' });
    load();
  }

  function exportPassport() {
    if (!metrics) return;
    saveLocalPrefs();
    const html = buildPassportHtml({
      founded,
      metrics,
      assets,
      sops,
      brandValue: parseFloat(brandValue) || 0,
      estimatedValue,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip2talk_business_passport_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const sopsByCat = SOP_CATEGORIES.map((c) => ({
    ...c,
    docs: sops.filter((s) => s.category === c.id),
  }));

  return (
    <div>
      <StaffPageHeader staffRole="owner" title="Business Passport" subtitle="เอกสารธุรกิจ" />
      <div className="px-4 space-y-4 pb-6">
        <section className="rounded-2xl bg-companion-card text-companion-text-dark p-4 text-sm space-y-1">
          <p className="font-semibold">A — ข้อมูลธุรกิจ</p>
          <p>{IDENTITY.businessName}</p>
          <p>ABN: {IDENTITY.abn}</p>
          <label className="block mt-2 text-xs text-slate-500">
            Founded
            <input
              value={founded}
              onChange={(e) => setFounded(e.target.value)}
              onBlur={saveLocalPrefs}
              className="w-full mt-1 rounded-lg border px-2 py-1"
            />
          </label>
          <p>Owner: {IDENTITY.owner}</p>
          <p>{IDENTITY.location}</p>
          <p>{IDENTITY.website} · {IDENTITY.instagram}</p>
          <p>{IDENTITY.email}</p>
        </section>

        {metrics && (
          <section className="rounded-2xl bg-companion-surface border border-white/10 p-4 text-sm space-y-1">
            <p className="font-semibold text-companion-accent">B — ตัวเลขธุรกิจ (Live)</p>
            <p>ทริปที่ดำเนินการ: {metrics.totalTripsConducted}</p>
            <p>แขกทั้งหมด: {metrics.totalGuestsServed}</p>
            <p>อัตราลูกค้าซ้ำ: {metrics.repeatCustomerRate.toFixed(1)}%</p>
            <p>คะแนนเฉลี่ย: {metrics.averageRating.toFixed(2)} / 5 ({metrics.totalReviews} รีวิว)</p>
            <p>ทริปที่เปิดขาย: {metrics.activeTripProducts}</p>
            <p>รายได้ปีนี้: ${metrics.revenueThisYear.toLocaleString()} AUD</p>
          </section>
        )}

        <section className="rounded-2xl bg-companion-card text-companion-text-dark p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-sm">C — Assets Registry</p>
            <button type="button" onClick={() => setShowAssetForm(!showAssetForm)} className="text-xs text-companion-accent">
              + เพิ่ม
            </button>
          </div>
          {showAssetForm && (
            <form onSubmit={saveAsset} className="space-y-2 mb-3 text-sm border-b pb-3">
              <select value={assetForm.asset_type} onChange={(e) => setAssetForm({ ...assetForm, asset_type: e.target.value })} className="w-full rounded border px-2 py-1">
                {ASSET_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <input required placeholder="ชื่อ" value={assetForm.asset_name} onChange={(e) => setAssetForm({ ...assetForm, asset_name: e.target.value })} className="w-full rounded border px-2 py-1" />
              <input placeholder="มูลค่า AUD" value={assetForm.estimated_value_aud} onChange={(e) => setAssetForm({ ...assetForm, estimated_value_aud: e.target.value })} className="w-full rounded border px-2 py-1" />
              <input type="date" value={assetForm.expiry_date} onChange={(e) => setAssetForm({ ...assetForm, expiry_date: e.target.value })} className="w-full rounded border px-2 py-1" />
              <button type="submit" className="w-full rounded bg-companion-accent py-2 text-companion-dark font-medium">บันทึก</button>
            </form>
          )}
          <div className="overflow-x-auto text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-slate-500">
                  <th className="text-left py-1">ประเภท</th>
                  <th className="text-left">ชื่อ</th>
                  <th>มูลค่า</th>
                  <th>หมดอายุ</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="py-1">{a.asset_type}</td>
                    <td>{a.asset_name}</td>
                    <td className="text-center">${Number(a.estimated_value_aud ?? 0).toLocaleString()}</td>
                    <td className="text-center">{a.expiry_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-companion-surface border border-white/10 p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-sm">D — SOP Library</p>
            <button type="button" onClick={() => setShowSopForm(!showSopForm)} className="text-xs text-companion-accent">
              + SOP
            </button>
          </div>
          {showSopForm && (
            <form onSubmit={saveSop} className="space-y-2 mb-3 text-sm">
              <select value={sopForm.category} onChange={(e) => setSopForm({ ...sopForm, category: e.target.value })} className="w-full rounded-lg bg-companion-card text-companion-text-dark px-2 py-2">
                {SOP_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <input required placeholder="หัวข้อ" value={sopForm.title} onChange={(e) => setSopForm({ ...sopForm, title: e.target.value })} className="w-full rounded-lg bg-companion-card text-companion-text-dark px-2 py-2" />
              <textarea required rows={6} placeholder="เนื้อหา (markdown)" value={sopForm.content} onChange={(e) => setSopForm({ ...sopForm, content: e.target.value })} className="w-full rounded-lg bg-companion-card text-companion-text-dark px-2 py-2 text-xs" />
              <button type="submit" className="w-full rounded-xl bg-companion-accent py-2 text-companion-dark font-medium">บันทึก SOP</button>
            </form>
          )}
          {sopsByCat.map((c) => (
            <div key={c.id} className="mb-3">
              <p className="text-xs text-companion-accent font-medium">{c.label}</p>
              {c.docs.length === 0 && (
                <p className="text-xs text-white/40 mt-1">แนะนำ: {c.suggestions.join(' · ')}</p>
              )}
              {c.docs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSopForm({ id: d.id, category: d.category, title: d.title, content: d.content })}
                  className="block w-full text-left mt-1 text-sm text-white/80 underline"
                >
                  {d.title}
                </button>
              ))}
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-companion-accent text-companion-dark p-4">
          <p className="font-semibold">E — Valuation Snapshot</p>
          <p className="text-2xl font-bold mt-2">AUD ${estimatedValue.toLocaleString()}</p>
          <ul className="text-xs mt-2 space-y-1 opacity-90">
            <li>รายได้ปีนี้ × 2.5 = ${(annualRevenue * 2.5).toLocaleString()}</li>
            <li>+ สินทรัพย์ ${assetSum.toLocaleString()}</li>
            <li>
              + Brand value:{' '}
              <input
                type="number"
                value={brandValue}
                onChange={(e) => setBrandValue(e.target.value)}
                onBlur={saveLocalPrefs}
                className="w-24 rounded border border-companion-dark/20 px-1 py-0.5 text-companion-dark"
              />
            </li>
          </ul>
          <p className="text-xs mt-3 opacity-80">
            ข้อมูลนี้เป็นการประมาณการเบื้องต้นเท่านั้น ควรใช้ผู้ประเมินมืออาชีพสำหรับการขายกิจการจริง
          </p>
        </section>

        <button type="button" onClick={exportPassport} className="w-full rounded-xl border border-white/30 py-3 text-sm font-medium">
          Export Business Passport (HTML)
        </button>
      </div>
    </div>
  );
}
