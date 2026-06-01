# Trip2Talk V5 — Product & Technical Spec

Chapter 99 Photography · Private Photo Journey PWA · **Next.js 14** (App Router) + TypeScript + Tailwind.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14.2, App Router, **no `src/` directory** |
| Styling | Tailwind CSS 3.4, brand tokens (`navy`, `gold`, `teal`, `sage`) |
| Data (trips/bookings) | Google Apps Script Web App → Sheets (`Trips_Data`, `Customer_Bookings`, `Consents`) |
| Data (ops/CRM) | Supabase (optional; env-driven) |
| Deploy | Vercel |

## Vocabulary (UI copy)

- Thai: **ทริป** — not **ทัวร์**
- English: **trip** — not **tour** (customer-facing)
- **Do not rename:** DB `tours`, `tour_bookings`; URLs `/tours/:tourId` (SEO)

## Business rules — trip size tiers

| Tier | Guests | Pricing |
|------|--------|---------|
| Tier 1 Standard | 4–6 | List price per person |
| Tier 2 Private | 1–3 | Premium (`PRIVATE_PRICE_MULTIPLIER` = 1.3) |

Solo traveller (1) = Tier 2 Private. Source: `lib/bookingPolicy.ts`.

## Other product rules

- Positioning: **Private Photo Journey** (not mass-market tour operator)
- Album: **.JPG only**, signed link **60 days** (not 90)
- Owner cancel &lt;45 days before departure → **100% refund**

## Routes (parity with V4)

| Path | Purpose |
|------|---------|
| `/` | Public portfolio / trip grid |
| `/trips` | Alias → home |
| `/tours/:tourId` | Trip detail |
| `/book/:tourId` | Booking checkout |
| `/portal` | Client portal login |
| `/trip/:bookingRef`, `/pass/:bookingId` | VIP hub / waivers |
| `/about`, `/contact`, `/calendar`, `/saved` | Marketing & utilities |
| `/terms`, `/package-terms` | Legal |
| `/album/:tourId`, `/album-prep` | Album prep |
| `/ops` | Staff PIN gate |
| `/dashboard/staff|cohost|owner|platform` | Role dashboards |
| `/cms` | Owner/platform CMS |

## API routes (Next.js Route Handlers)

| Route | Method | GAS action |
|-------|--------|------------|
| `/api/booking/create` | POST | `createBooking` |
| `/api/booking/status` | GET | `getBookingStatus` |
| `/api/booking/intake` | POST | `updateIntake` |

## Environment

| Variable | Scope |
|----------|--------|
| `GAS_WEBAPP_URL` | Server — Apps Script `/exec` |
| `NEXT_PUBLIC_GAS_WEBAPP_URL` | Optional client fallback |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client |

## Dev

```bash
npm run dev    # next dev (webpack, not turbopack)
npm run build
```
