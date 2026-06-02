# Trip info — Google Sheet reference

**Spreadsheet:** `1L1VUu0qvL0-G0C1z9byscU11kKcuMCM0iajNLjxH9eE`  
**Tab:** `Trip info` (exact name, including space)  
**Row 1:** headers · **Row 2+:** data  

## Step 1 — Confirmed column headers (20 columns, Title Case)

These match the production **Trip info** layout used across Trip2Talk (`ensureTripHeaders_` in the main repo).  
Live v5 GAS could not read the tab on the deployed `/exec` URL (`Sheet not found: Trip info`) — redeploy Apps Script bound to this spreadsheet if `getTrips` fails.

| # | Column header |
|---|----------------|
| 1 | Tour Code |
| 2 | Tour Name |
| 3 | Country Tag |
| 4 | City |
| 5 | Weather |
| 6 | Messenger |
| 7 | Cover |
| 8 | Duration Days |
| 9 | Standard Price |
| 10 | Private Price |
| 11 | Trip Type |
| 12 | Season |
| 13 | Max Pax |
| 14 | Highlights |
| 15 | Pickup Type |
| 16 | Category |
| 17 | Departure Start |
| 18 | Departure End |
| 19 | Slots Booked |
| 20 | Slots Max |

**v5 app field mapping:** `Standard Price` → price · `Season` → season · `Max Pax` → max seats (display) · `Duration Days` → duration · leave **Departure Start/End** empty for “Coming soon” · **do not** rely on Slots columns (seats live in Supabase only).

## Price correction — TAS-3D2N

| Column | Value |
|--------|--------|
| Tour Code | TAS-3D2N |
| Standard Price | **1350** (Standard Rate 4–6 guests; was 1200) |

On **Trip info**, find the row where **Tour Code** = `TAS-3D2N` and set **Standard Price** to `1350`.  
Or run `fixTas3d2nStandardPrice()` once in the Apps Script editor (`gas/Code.gs`), then redeploy the web app.

Also run `supabase/tas-3d2n-price-1350.sql` in Supabase if the `trips` table still has `1200`.

## Step 2 — Append these 5 rows (do not edit existing rows)

Add **after** the last existing trip row. Copy each value into the matching column.

### PSP-1DAY

| Column | Value |
|--------|--------|
| Tour Code | PSP-1DAY |
| Tour Name | Sydney - Port Stephens One Day Photo Trip |
| Country Tag | Australia |
| City | Sydney |
| Cover | SYD/705320467_10242162489108855_3820285517745745334_n.jpg |
| Duration Days | 1 |
| Standard Price | 260 |
| Trip Type | Photo Journey |
| Season | All Year |
| Max Pax | 6 |
| Departure Start | *(empty)* |
| Departure End | *(empty)* |
| Slots Booked | *(empty or 0)* |
| Slots Max | *(empty)* |

### SYD-MW-WIN

| Column | Value |
|--------|--------|
| Tour Code | SYD-MW-WIN |
| Tour Name | Sydney Milky Way Hunt |
| Country Tag | Australia |
| City | Sydney |
| Cover | milkyway/1.jpg |
| Duration Days | 1 |
| Standard Price | 120 |
| Trip Type | Photo Journey |
| Season | Winter Only |
| Max Pax | 6 |
| Departure Start | *(empty)* |
| Departure End | *(empty)* |

### LAV-ANB-1D

| Column | Value |
|--------|--------|
| Tour Code | LAV-ANB-1D |
| Tour Name | Lavender Farm & Anna Bay One Day |
| Country Tag | Australia |
| City | Sydney |
| Cover | Cowra/12 (1).jpg |
| Duration Days | 1 |
| Standard Price | 299 |
| Trip Type | Photo Journey |
| Season | December Only |
| Max Pax | 4 |
| Departure Start | *(empty)* |
| Departure End | *(empty)* |

### TAS-SU-4D3N

| Column | Value |
|--------|--------|
| Tour Code | TAS-SU-4D3N |
| Tour Name | Tasmania Summer: Cradle Mountain & Bay of Fires 4D3N |
| Country Tag | Australia |
| City | Tasmania |
| Cover | Tasmania/596873932_1428638042594626_8987722411601397177_n.jpg |
| Duration Days | 4 |
| Standard Price | 1450 |
| Trip Type | Photo Journey |
| Season | Summer |
| Max Pax | 5 |
| Departure Start | *(empty)* |
| Departure End | *(empty)* |

### BER-3D2N

| Column | Value |
|--------|--------|
| Tour Code | BER-3D2N |
| Tour Name | Bermagui Photo Expedition 3D2N |
| Country Tag | Australia |
| City | South Coast |
| Cover | SYDNEY/506861557_10236863821565478_6038697174671264606_n.jpg |
| Duration Days | 3 |
| Standard Price | 390 |
| Trip Type | Photo Journey |
| Season | January Only |
| Max Pax | 6 |
| Departure Start | *(empty)* |
| Departure End | *(empty)* |

After saving the sheet, redeploy **gas/Code.gs** so `ALLOWED_TOUR_CODES` includes the new codes.
