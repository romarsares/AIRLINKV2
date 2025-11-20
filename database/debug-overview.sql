-- Debug Overview Queries - Check what the API sees
USE airlink_dev;

-- Test the exact queries from server.js
SELECT COUNT(*) as totalBookings FROM bookings;
SELECT COUNT(*) as activeBracelets FROM bracelets WHERE status = "Active";
SELECT COUNT(*) as todayFlights FROM flights WHERE DATE(departure_time) = CURDATE();
SELECT COUNT(*) as todaySyncs FROM sync_logs WHERE DATE(timestamp) = CURDATE();

-- Show current date
SELECT CURDATE() as today;

-- Show actual flight dates
SELECT flight_no, departure_time, DATE(departure_time) as flight_date FROM flights;

-- Show actual sync dates  
SELECT bracelet_id, timestamp, DATE(timestamp) as sync_date FROM sync_logs ORDER BY timestamp DESC LIMIT 5;