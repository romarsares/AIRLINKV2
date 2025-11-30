-- Fix GES001 Bracelet Assignment Issue
USE airlink_db;

-- Option 1: Reactivate the cancelled booking
UPDATE bookings 
SET booking_status = 'Confirmed' 
WHERE assigned_bracelet = 'GES001' AND booking_status = 'Cancelled';

-- Option 2: Or clear the assignment from cancelled booking and make bracelet available
-- UPDATE bookings 
-- SET assigned_bracelet = NULL 
-- WHERE assigned_bracelet = 'GES001' AND booking_status = 'Cancelled';

-- Update bracelet status to Active
UPDATE bracelets 
SET status = 'Active', last_sync_time = NOW() 
WHERE bracelet_id = 'GES001';

-- Verify the fix
SELECT b.booking_id, b.booking_status, b.assigned_bracelet, 
       p.name as passenger_name, f.flight_no, f.gate_no
FROM bookings b
JOIN passengers p ON b.passenger_id = p.passenger_id
JOIN flights f ON b.flight_id = f.flight_id
WHERE b.assigned_bracelet = 'GES001';