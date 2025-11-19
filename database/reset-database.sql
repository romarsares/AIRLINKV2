-- AirLink Database Reset Script
-- WARNING: This will delete all data and recreate the database

-- Drop all tables in correct order (respecting foreign keys)
USE airlink_dev;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS sync_logs;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS servers;
DROP TABLE IF EXISTS bracelets;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS patch_history;

SET FOREIGN_KEY_CHECKS = 1;

-- Recreate clean database
SOURCE setup.sql;

SELECT 'Database reset complete - all data cleared' as status;