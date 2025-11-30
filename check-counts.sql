USE airlink_dev;

SELECT 'Bracelets' as Table_Name, COUNT(*) as Count FROM bracelets
UNION ALL
SELECT 'Passengers', COUNT(*) FROM passengers
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Flights', COUNT(*) FROM flights;

-- Show first 10 bracelets
SELECT bracelet_id, status, battery_level FROM bracelets ORDER BY bracelet_id LIMIT 10;