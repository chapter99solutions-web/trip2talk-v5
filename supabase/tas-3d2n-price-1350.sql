-- Run in Supabase SQL Editor: correct TAS-3D2N Standard Rate (4–6 guests)
UPDATE trips
SET price = 1350
WHERE tour_code = 'TAS-3D2N';
