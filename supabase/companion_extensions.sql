-- Companion staff extensions (bookings + guest consents)

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS medical_flag boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS guest_consents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref text UNIQUE NOT NULL,
  email text,
  tour_code text,
  completed_at timestamptz NOT NULL DEFAULT now(),
  has_medical_condition boolean DEFAULT false,
  medical_notes text,
  consent_items jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guest_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon read guest_consents" ON guest_consents FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert guest_consents" ON guest_consents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon update guest_consents" ON guest_consents FOR UPDATE TO anon USING (true);

GRANT SELECT, INSERT, UPDATE ON guest_consents TO anon;
GRANT UPDATE ON bookings TO anon;
