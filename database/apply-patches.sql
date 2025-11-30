-- AirLink Database Patch Application Script
-- Run this script to apply all patches in sequence

USE airlink_dev;

-- Create patch tracking table first
SOURCE patch-tracker.sql;

-- Apply patches in order
SOURCE 0001-add-airport-support.sql;
SOURCE 0002-default-data-ges.sql;

-- Verify all patches applied
SELECT 
    patch_id,
    patch_name,
    description,
    applied_date
FROM patch_history 
ORDER BY patch_id;

-- Show current airport configuration
SELECT 
    airport_code,
    airport_name,
    city,
    country
FROM airports;

-- Show sample booking with airport info
SELECT 
    b.booking_id,
    p.name as passenger_name,
    f.flight_no,
    a.airport_name as origin_airport,
    f.destination,
    b.seat_no,
    b.booking_status,
    b.assigned_bracelet
FROM bookings b
JOIN passengers p ON b.passenger_id = p.passenger_id
JOIN flights f ON b.flight_id = f.flight_id
JOIN airports a ON f.origin_airport_id = a.airport_id
WHERE b.booking_id = 1;