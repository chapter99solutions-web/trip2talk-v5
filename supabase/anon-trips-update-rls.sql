-- claim_seats does SELECT ... FOR UPDATE on trips. With RLS enabled, Postgres requires
-- a matching UPDATE policy for FOR UPDATE to see rows as anon; SELECT-only policy is not enough.
-- Symptom: RPC returns {"ok":false,"reason":"trip not found"} even when tour_code exists.

DROP POLICY IF EXISTS "anon update trips" ON public.trips;
CREATE POLICY "anon update trips" ON public.trips
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
