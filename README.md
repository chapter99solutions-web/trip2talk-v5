# Trip2Talk V5

Next.js 14 · Private Photo Journey PWA · Supabase `niuibpznjvytprbrzvnn` · Vercel.

## Setup

1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. Deploy `gas/Code.gs` as a Google Apps Script web app (execute as you, access: anyone).
3. Copy `.env.example` → `.env.local` and set keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://niuibpznjvytprbrzvnn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/.../exec
```

4. `npm install && npm run dev`

## Routes

| Path | Purpose |
|------|---------|
| `/` | Hero + 8 trip cards |
| `/trips/[tourCode]` | Trip detail + booking form |
| `/booking/[tourCode]` | Confirmation |
| `/gallery` | Portfolio masonry |
| `/dashboard` | PIN ops (1111 / 4444 / 9999 / 3501) |

## Rules

- Only 8 real `tour_code` values; no fake trips.
- Seat changes via `claim_seats` / `release_seats` RPC only.
- `date IS NULL` → เร็วๆ นี้, not bookable.
- UI copy uses **ทริป**, never **ทัวร์**.

## Deploy

Connect this repo to Vercel and set the same env vars.
