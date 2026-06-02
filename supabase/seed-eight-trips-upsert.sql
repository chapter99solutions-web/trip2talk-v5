-- Upsert 8 core trips (fixes claim_seats "trip not found" for NZ-6D5N etc.)
-- slots_max (user spec) → max_seats; slots_booked → seats_taken (default 0)

INSERT INTO public.trips (
  tour_code,
  name,
  name_th,
  price,
  max_seats,
  seats_taken,
  duration,
  season,
  cover_image
)
VALUES
  ('TAS-3D2N', 'Tasmania 3D2N', 'แทสเมเนีย 3 วัน 2 คืน', 1350, 6, 0, '3D2N', 'All Year', 'https://pcqxewzzypwxfldxkcxp.supabase.co/storage/v1/object/public/Trip2Talk%20Photos/Photos/Melbourne/3.jpg'),
  ('MEL-4D3N', 'Melbourne 4D3N', 'เมลเบิร์น 4 วัน 3 คืน', 1350, 5, 0, '4D3N', 'All Year', 'Melbourne/01.jpg'),
  ('ULU-4D3N', 'Red Desert Odyssey 4D3N', 'อูลูรู 4 วัน 3 คืน', 1690, 5, 0, '4D3N', 'All Year', 'Uluru/1.jpg'),
  ('NZ-6D5N', 'New Zealand South Island 6D5N', 'นิวซีแลนด์ 6 วัน 5 คืน', 2350, 5, 0, '6D5N', 'Spring', 'New Zealand/Spring/T2T-10.JPG'),
  ('TAS-LH-4D3N', 'The Launceston Highland 4D3N', 'ลอนเซสตัน 4 วัน 3 คืน', 1350, 5, 0, '4D3N', 'Winter', 'Tasmania/596371362_1428639202594510_8709278754225773992_n.jpg'),
  ('KIA-1DAY', 'Kiama 1 Day', 'เกียม่า 1 วัน', 290, 4, 0, '1DAY', 'All Year', 'SYD/705320467_10242162489108855_3820285517745745334_n.jpg'),
  ('CAN-2D1N', 'Cowra & Canowindra Canola Fields 2D1N', 'คาวราและทุ่งคานาล่าคาโนวินดรา 2 วัน 1 คืน', 380, 4, 0, '2D1N', 'Spring Season Only (October)', 'Cowra/12 (1).jpg'),
  ('SYD-1DAY', 'Sydney 1 Day', 'ซิดนีย์ 1 วัน', 190, 4, 0, '1DAY', 'All Year', 'SYDNEY/506861557_10236863821565478_6038697174671264606_n.jpg')
ON CONFLICT (tour_code) DO UPDATE SET
  max_seats = EXCLUDED.max_seats,
  seats_taken = LEAST(COALESCE(public.trips.seats_taken, 0), EXCLUDED.max_seats),
  name = EXCLUDED.name,
  name_th = EXCLUDED.name_th,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  season = EXCLUDED.season,
  cover_image = EXCLUDED.cover_image;
