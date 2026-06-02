-- Trip2Talk V5 — RLS policies (run in Supabase SQL Editor after schema.sql)

-- Allow anon to read trips
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon read trips" ON trips FOR SELECT TO anon USING (true);

-- claim_seats uses SELECT ... FOR UPDATE; anon needs UPDATE policy or rows are invisible.
CREATE POLICY "anon update trips" ON trips FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Allow anon to insert bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon insert bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);

-- Allow anon to call seat RPCs
GRANT EXECUTE ON FUNCTION claim_seats TO anon;
GRANT EXECUTE ON FUNCTION release_seats TO anon;

-- Duplicate booking check (see booking-one-per-email.sql)
GRANT EXECUTE ON FUNCTION check_booking_allowed(text, text) TO anon;
