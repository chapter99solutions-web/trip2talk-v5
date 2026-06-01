-- Trip2Talk V5 — run in Supabase SQL Editor (project: niuibpznjvytprbrzvnn)

CREATE TABLE IF NOT EXISTS trips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_code text UNIQUE NOT NULL,
  name text NOT NULL,
  name_th text,
  date date,
  price integer NOT NULL,
  max_seats integer NOT NULL DEFAULT 6,
  seats_taken integer NOT NULL DEFAULT 0,
  cover_image text,
  description text,
  duration text,
  season text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_code text NOT NULL,
  booking_ref text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  seats integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_code text,
  description text NOT NULL,
  amount integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION claim_seats(p_tour_code text, p_seats integer)
RETURNS json AS $$
DECLARE v_trip trips%ROWTYPE;
BEGIN
  SELECT * INTO v_trip FROM trips WHERE tour_code = p_tour_code FOR UPDATE;
  IF NOT FOUND THEN RETURN json_build_object('ok', false, 'reason', 'trip not found'); END IF;
  IF v_trip.date IS NULL THEN RETURN json_build_object('ok', false, 'reason', 'no date set'); END IF;
  IF v_trip.date < CURRENT_DATE THEN RETURN json_build_object('ok', false, 'reason', 'trip already departed'); END IF;
  IF (v_trip.seats_taken + p_seats) > v_trip.max_seats THEN
    RETURN json_build_object('ok', false, 'reason', 'not enough seats');
  END IF;
  UPDATE trips SET seats_taken = seats_taken + p_seats WHERE tour_code = p_tour_code;
  RETURN json_build_object(
    'ok', true,
    'seats_remaining', v_trip.max_seats - v_trip.seats_taken - p_seats
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION release_seats(p_tour_code text, p_seats integer)
RETURNS json AS $$
BEGIN
  UPDATE trips SET seats_taken = GREATEST(0, seats_taken - p_seats) WHERE tour_code = p_tour_code;
  RETURN json_build_object('ok', true);
END;
$$ LANGUAGE plpgsql;

INSERT INTO trips (tour_code, name, name_th, price, max_seats, duration, season, cover_image) VALUES
('TAS-3D2N', 'Tasmania 3D2N', 'แทสเมเนีย 3 วัน 2 คืน', 1200, 6, '3D2N', 'All Year', 'Tasmania/596873932_1428638042594626_8987722411601397177_n.jpg'),
('MEL-4D3N', 'Melbourne 4D3N', 'เมลเบิร์น 4 วัน 3 คืน', 1350, 6, '4D3N', 'All Year', 'Melbourne/01.jpg'),
('ULU-4D3N', 'Red Desert Odyssey 4D3N', 'อูลูรู 4 วัน 3 คืน', 1690, 5, '4D3N', 'All Year', 'Uluru/1.jpg'),
('NZ-6D5N', 'New Zealand South Island 6D5N', 'นิวซีแลนด์ 6 วัน 5 คืน', 2350, 5, '6D5N', 'Spring', 'New Zealand/Spring/T2T-10.JPG'),
('TAS-LH-4D3N', 'The Launceston Highland 4D3N', 'ลอนเซสตัน 4 วัน 3 คืน', 1350, 6, '4D3N', 'Winter', 'Tasmania/596371362_1428639202594510_8709278754225773992_n.jpg'),
('KIA-1DAY', 'Kiama 1 Day', 'เกียม่า 1 วัน', 290, 8, '1DAY', 'All Year', 'SYD/705320467_10242162489108855_3820285517745745334_n.jpg'),
('CAN-2D1N', 'Canberra 2D1N', 'แคนเบอร์รา 2 วัน 1 คืน', 590, 6, '2D1N', 'All Year', 'Cowra/12 (1).jpg'),
('SYD-1DAY', 'Sydney 1 Day', 'ซิดนีย์ 1 วัน', 190, 10, '1DAY', 'All Year', 'SYDNEY/506861557_10236863821565478_6038697174671264606_n.jpg')
ON CONFLICT (tour_code) DO NOTHING;
