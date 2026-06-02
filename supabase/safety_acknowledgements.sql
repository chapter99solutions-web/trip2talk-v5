-- Safety rules acknowledgement (Companion /companion/rules)

ALTER TABLE guest_consents ADD COLUMN IF NOT EXISTS consent_rules boolean DEFAULT false;
ALTER TABLE guest_consents ADD COLUMN IF NOT EXISTS rules_acknowledged_at timestamptz;
ALTER TABLE guest_consents ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE TABLE IF NOT EXISTS safety_acknowledgements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL,
  identifier text NOT NULL,
  acknowledged_at timestamptz DEFAULT now(),
  user_agent text
);

ALTER TABLE safety_acknowledgements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all" ON safety_acknowledgements;
CREATE POLICY "allow all" ON safety_acknowledgements FOR ALL TO anon USING (true) WITH CHECK (true);

GRANT INSERT, SELECT ON safety_acknowledgements TO anon;
