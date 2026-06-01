import { NextResponse } from 'next/server';
import { addExpense } from '@/lib/dashboard-data';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      tour_code?: string | null;
      description?: string;
      amount?: number;
    };
    await addExpense(
      body.tour_code ?? null,
      String(body.description || ''),
      Number(body.amount) || 0
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status: 400 }
    );
  }
}
