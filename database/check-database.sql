-- Check Current Database Status
USE airlink_dev;

-- Show all tables
SHOW TABLES;

-- Check passengers
SELECT COUNT(*) as passenger_count FROM passengers;
SELECT * FROM passengers LIMIT 5;

-- Check flights  
SELECT COUNT(*) as flight_count FROM flights;
SELECT * FROM flights LIMIT 5;

-- Check bracelets
SELECT COUNT(*) as bracelet_count FROM bracelets;
SELECT bracelet_id, status, battery_level FROM bracelets;

-- Check bookings and assignments
SELECT COUNT(*) as booking_count FROM bookings;
SELECT b.booking_id, p.name, f.flight_no, b.assigned_bracelet, b.booking_status 
FROM bookings b 
JOIN passengers p ON b.passenger_id = p.passenger_id 
JOIN flights f ON b.flight_id = f.flight_id 
LIMIT 10;

-- Check sync logs
SELECT COUNT(*) as sync_log_count FROM sync_logs;
SELECT * FROM sync_logs ORDER BY timestamp DESC LIMIT 5;

-- Check users
SELECT username, role FROM users;