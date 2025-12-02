USE airlink_dev;

-- Update all flight departure times to December 3, 2025
UPDATE flights 
SET departure_time = CONCAT('2025-12-03 ', TIME(departure_time));

-- Update all booking created_at timestamps to December 3, 2025
UPDATE bookings 
SET created_at = CONCAT('2025-12-03 ', TIME(created_at))
WHERE created_at IS NOT NULL;

-- Verify the updates
SELECT 'Flights Updated' as Status, COUNT(*) as Count, 
       MIN(departure_time) as Earliest, 
       MAX(departure_time) as Latest 
FROM flights;

SELECT 'Bookings Updated' as Status, COUNT(*) as Count,
       MIN(created_at) as Earliest,
       MAX(created_at) as Latest
FROM bookings;
