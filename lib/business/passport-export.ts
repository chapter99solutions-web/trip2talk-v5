import type { BusinessAssetRow, BusinessPassportMetrics, SopDocumentRow } from './types';

const IDENTITY = {
  businessName: 'Trip2Talk / Chapter99 Photography',
  abn: '81 951 461 769',
  owner: 'Saen Saard',
  location: 'Sydney, NSW, Australia',
  website: 'trip2talk.com.au',
  instagram: '@trip2talk',
  email: 'trip2talksyd@gmail.com',
};

export function buildPassportHtml(opts: {
  founded: string;
  metrics: BusinessPassportMetrics;
  assets: BusinessAssetRow[];
  sops: SopDocumentRow[];
  brandValue: number;
  estimatedValue: number;
}): string {
  const date = new Date().toISOString().slice(0, 10);
  const sopHtml = opts.sops
    .map(
      (s) =>
        `<h3>${s.category} — ${s.title} (v${s.version})</h3><pre>${escapeHtml(s.content)}</pre>`
    )
    .join('');
  const assetsRows = opts.assets
    .map(
      (a) =>
        `<tr><td>${a.asset_type}</td><td>${escapeHtml(a.asset_name)}</td><td>$${Number(a.estimated_value_aud ?? 0).toLocaleString()}</td><td>${a.expiry_date ?? '—'}</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8"/>
<title>Trip2Talk Business Passport ${date}</title>
<style>
body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:1rem;color:#111}
h1{color:#b8860b} h2{border-bottom:1px solid #ddd;padding-bottom:.25rem;margin-top:2rem}
table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px;text-align:left}
pre{white-space:pre-wrap;background:#f5f5f5;padding:1rem;border-radius:8px}
.disclaimer{font-size:.85rem;color:#666;margin-top:2rem}
</style>
</head>
<body>
<h1>Trip2Talk Business Passport</h1>
<p>Generated: ${date}</p>

<h2>A — ข้อมูลธุรกิจ</h2>
<ul>
<li>Business Name: ${IDENTITY.businessName}</li>
<li>ABN: ${IDENTITY.abn}</li>
<li>Founded: ${opts.founded}</li>
<li>Owner: ${IDENTITY.owner}</li>
<li>Location: ${IDENTITY.location}</li>
<li>Website: ${IDENTITY.website}</li>
<li>Instagram: ${IDENTITY.instagram}</li>
<li>Email: ${IDENTITY.email}</li>
</ul>

<h2>B — ตัวเลขธุรกิจ</h2>
<ul>
<li>Total trips conducted: ${opts.metrics.totalTripsConducted}</li>
<li>Total guests served: ${opts.metrics.totalGuestsServed}</li>
<li>Repeat customer rate: ${opts.metrics.repeatCustomerRate.toFixed(1)}%</li>
<li>Average rating: ${opts.metrics.averageRating.toFixed(2)} / 5</li>
<li>Total reviews: ${opts.metrics.totalReviews}</li>
<li>Active trip products: ${opts.metrics.activeTripProducts}</li>
<li>Revenue this year: $${opts.metrics.revenueThisYear.toLocaleString()} AUD</li>
</ul>

<h2>C — Assets Registry</h2>
<table>
<thead><tr><th>Type</th><th>Name</th><th>Value AUD</th><th>Expiry</th></tr></thead>
<tbody>${assetsRows}</tbody>
</table>

<h2>D — SOP Library</h2>
${sopHtml || '<p>No SOPs on file.</p>'}

<h2>E — Valuation Snapshot</h2>
<p><strong>Estimated Business Value: AUD $${opts.estimatedValue.toLocaleString()}</strong></p>
<ul>
<li>Annual revenue × 2.5 multiplier</li>
<li>+ Asset value (sum of registry)</li>
<li>+ Brand value: $${opts.brandValue.toLocaleString()}</li>
</ul>
<p class="disclaimer">ข้อมูลนี้เป็นการประมาณการเบื้องต้นเท่านั้น ควรใช้ผู้ประเมินมืออาชีพสำหรับการขายกิจการจริง</p>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export { IDENTITY };
