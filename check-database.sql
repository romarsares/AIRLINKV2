-- Check if database exists
SHOW DATABASES LIKE 'airlink_db';

-- Use database
USE airlink_dev;

-- Check all tables
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- Count records
SELECT 'Passengers' as table_name, COUNT(*) as count FROM passengers
UNION ALL
SELECT 'Bracelets', COUNT(*) FROM bracelets
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Flights', COUNT(*) FROM flights
UNION ALL
SELECT 'Users', COUNT(*) FROM users;

-- Check if users exist
SELECT user_id, username, role, full_name FROM users;
