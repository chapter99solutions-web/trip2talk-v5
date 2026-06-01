-- Trip2Talk V5 — RLS policies (run in Supabase SQL Editor after schema.sql)

-- Allow anon to read trips
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon read trips" ON trips FOR SELECT TO anon USING (true);

-- Allow anon to insert bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon insert bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);

-- Allow anon to call seat RPCs
GRANT EXECUTE ON FUNCTION claim_seats TO anon;
GRANT EXECUTE ON FUNCTION release_seats TO anon;
