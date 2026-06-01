import { NextResponse } from 'next/server';
import { deleteTripByCode, upsertTrip } from '@/lib/dashboard-data';
import { isRealTourCode } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const tour_code = String(body.tour_code || '').trim().toUpperCase();
    if (!isRealTourCode(tour_code)) {
      return NextResponse.json({ error: 'Invalid tour_code' }, { status: 400 });
    }
    await upsertTrip({
      tour_code,
      name: String(body.name || tour_code),
      name_th: body.name_th ? String(body.name_th) : null,
      price: Number(body.price) || 0,
      max_seats: Number(body.max_seats) || 6,
      seats_taken: Number(body.seats_taken) || 0,
      duration: String(body.duration || ''),
      season: body.season ? String(body.season) : null,
      date: body.date ? String(body.date) : null,
      cover_image: body.cover_image ? String(body.cover_image) : null,
      description: body.description ? String(body.description) : null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  try {
    const tour_code = new URL(request.url).searchParams.get('tour_code') || '';
    if (!isRealTourCode(tour_code)) {
      return NextResponse.json({ error: 'Invalid tour_code' }, { status: 400 });
    }
    await deleteTripByCode(tour_code);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 400 });
  }
}
