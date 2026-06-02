-- Business Record & Documentation (run on pcqxewzzypwxfldxkcxp)

CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref text,
  tour_code text NOT NULL,
  guest_name text NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  photo_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monthly_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  year integer NOT NULL,
  month integer NOT NULL,
  total_revenue_aud numeric(12, 2) DEFAULT 0,
  total_expenses_aud numeric(12, 2) DEFAULT 0,
  net_profit_aud numeric(12, 2) DEFAULT 0,
  total_bookings integer DEFAULT 0,
  total_guests integer DEFAULT 0,
  repeat_customers integer DEFAULT 0,
  top_tour_code text,
  notes text,
  generated_at timestamptz DEFAULT now(),
  UNIQUE (year, month)
);

CREATE TABLE IF NOT EXISTS business_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_type text NOT NULL,
  asset_name text NOT NULL,
  description text,
  estimated_value_aud numeric(12, 2),
  purchase_date date,
  expiry_date date,
  login_hint text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sop_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  version text DEFAULT '1.0',
  last_updated timestamptz DEFAULT now()
);

CREATE OR REPLACE VIEW customer_stats AS
SELECT
  lower(trim(email)) AS email,
  COUNT(*)::integer AS total_bookings,
  SUM(seats)::integer AS total_seats,
  array_agg(tour_code) AS tours_taken,
  MIN(created_at) AS first_booking,
  MAX(created_at) AS last_booking
FROM bookings
WHERE status IS DISTINCT FROM 'cancelled'
GROUP BY lower(trim(email));

GRANT SELECT, INSERT, UPDATE ON reviews TO anon;
GRANT SELECT, INSERT, UPDATE ON monthly_reports TO anon;
GRANT SELECT, INSERT, UPDATE ON business_assets TO anon;
GRANT SELECT, INSERT, UPDATE ON sop_documents TO anon;
GRANT SELECT ON customer_stats TO anon;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all" ON reviews;
DROP POLICY IF EXISTS "allow all" ON monthly_reports;
DROP POLICY IF EXISTS "allow all" ON business_assets;
DROP POLICY IF EXISTS "allow all" ON sop_documents;

CREATE POLICY "allow all" ON reviews FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON monthly_reports FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON business_assets FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON sop_documents FOR ALL TO anon USING (true) WITH CHECK (true);
