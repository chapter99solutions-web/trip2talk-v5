-- Trip expenses for Companion photographer (run on pcqxewzzypwxfldxkcxp)

CREATE TABLE IF NOT EXISTS trip_expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_code text NOT NULL,
  trip_date date,
  category text NOT NULL,
  description text,
  amount_aud numeric(10, 2) NOT NULL,
  receipt_url text,
  recorded_by text DEFAULT 'photographer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trip_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon read trip_expenses" ON trip_expenses FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert trip_expenses" ON trip_expenses FOR INSERT TO anon WITH CHECK (true);

GRANT SELECT, INSERT ON trip_expenses TO anon;

-- Storage bucket: create "receipts" in Supabase Dashboard (public read) or:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true);
