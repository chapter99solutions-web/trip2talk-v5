import { getGasUrl } from './env';

type GasResponse = {
  ok?: boolean;
  reason?: string;
  trips?: unknown[];
};

async function parseGasJson(res: Response): Promise<GasResponse | null> {
  try {
    return (await res.json()) as GasResponse;
  } catch {
    return null;
  }
}

/** GET ?action=getTrips */
export async function gasGetTrips(): Promise<Record<string, unknown>[] | null> {
  const base = getGasUrl();
  if (!base) return null;
  try {
    const url = `${base.replace(/\/$/, '')}?action=getTrips`;
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
    if (!res.ok) return null;
    const json = await parseGasJson(res);
    if (!json?.ok || !Array.isArray(json.trips) || json.trips.length === 0) return null;
    return json.trips as Record<string, unknown>[];
  } catch {
    return null;
  }
}

/** POST JSON body to GAS web app */
export async function gasPost<T extends GasResponse>(
  payload: Record<string, unknown>
): Promise<T | null> {
  const url = getGasUrl();
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type GasAddBookingInput = {
  booking_ref: string;
  tour_code: string;
  name: string;
  email: string;
  phone?: string;
  seats: number;
  status?: string;
};

/** Sync confirmed booking to Google Sheet — failures are silent. */
export async function gasAddBooking(input: GasAddBookingInput): Promise<void> {
  await gasPost({
    action: 'addBooking',
    booking_ref: input.booking_ref,
    tour_code: input.tour_code.toUpperCase(),
    name: input.name,
    email: input.email,
    phone: input.phone ?? '',
    seats: input.seats,
    status: input.status ?? 'confirmed',
  });
}

export type GasAddExpenseInput = {
  tour_code?: string | null;
  description: string;
  amount: number;
};

/** Sync expense to Google Sheet — failures are silent. */
export async function gasAddExpense(input: GasAddExpenseInput): Promise<void> {
  await gasPost({
    action: 'addExpense',
    tour_code: input.tour_code?.toUpperCase() ?? '',
    description: input.description,
    amount: input.amount,
  });
}
