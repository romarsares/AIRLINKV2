-- Check GES001 Bracelet Assignment Status
USE airlink_db;

-- Check bracelet status
SELECT * FROM bracelets WHERE bracelet_id = 'GES001';

-- Check if GES001 is assigned to any booking
SELECT b.booking_id, b.booking_status, b.assigned_bracelet, 
       p.name as passenger_name, f.flight_no, f.gate_no
FROM bookings b
JOIN passengers p ON b.passenger_id = p.passenger_id
JOIN flights f ON b.flight_id = f.flight_id
WHERE b.assigned_bracelet = 'GES001';

-- Check all bracelet assignments
SELECT b.booking_id, b.assigned_bracelet, p.name, f.flight_no, b.booking_status
FROM bookings b
JOIN passengers p ON b.passenger_id = p.passenger_id
JOIN flights f ON b.flight_id = f.flight_id
WHERE b.assigned_bracelet IS NOT NULL
ORDER BY b.booking_id;

-- Update GES001 to show correct assignment if needed
-- UPDATE bracelets SET status = 'Active' WHERE bracelet_id = 'GES001';