# Trip2Talk V5 — Implementation Reference

See [README.md](./README.md) for setup. This file mirrors the product spec.

## Real tour codes (only these 8)

`TAS-3D2N` · `MEL-4D3N` · `ULU-4D3N` · `NZ-6D5N` · `TAS-LH-4D3N` · `KIA-1DAY` · `CAN-2D1N` · `SYD-1DAY`

## Data

- **Primary:** Supabase `trips` / `bookings` / `expenses`
- **Enrichment:** GAS `doGet` → Sheet tab `Trip info` (`NEXT_PUBLIC_GAS_URL`)
- **Seats:** `claim_seats` / `release_seats` RPC only (never client-side seat math for writes)

## Dashboard PINs

| PIN | Role |
|-----|------|
| 1111 | Staff — bookings, check-in |
| 4444 | Co-host — walk-in ±1 seat via RPC |
| 9999 | Owner — revenue, expenses, P&L |
| 3501 | Platform — trip CRUD, raw bookings |

## Assets

`https://niuibpznjvytprbrzvnn.supabase.co/storage/v1/object/public/portfolio/[path]`
