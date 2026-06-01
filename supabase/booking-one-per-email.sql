-- One active booking per email + tour_code (run in Supabase SQL Editor)

CREATE OR REPLACE FUNCTION check_booking_allowed(p_email text, p_tour_code text)
RETURNS json AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM bookings
    WHERE lower(trim(email)) = lower(trim(p_email))
      AND tour_code = upper(trim(p_tour_code))
      AND status IS DISTINCT FROM 'cancelled'
  ) THEN
    RETURN json_build_object('ok', false, 'reason', 'already booked');
  END IF;
  RETURN json_build_object('ok', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION check_booking_allowed(text, text) TO anon;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_one_active_per_email_tour
  ON bookings (lower(trim(email)), tour_code)
  WHERE (status IS DISTINCT FROM 'cancelled');
