-- Update flight dates to today for dashboard to show data
USE airlink_dev;

-- Update all flights to today's date with different times
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 08:30:00') WHERE flight_id = 1;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 10:15:00') WHERE flight_id = 2;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 12:30:00') WHERE flight_id = 3;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 14:45:00') WHERE flight_id = 4;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 16:20:00') WHERE flight_id = 5;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 18:35:00') WHERE flight_id = 6;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 20:10:00') WHERE flight_id = 7;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 22:25:00') WHERE flight_id = 8;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 23:40:00') WHERE flight_id = 9;
UPDATE flights SET departure_time = CONCAT(CURDATE(), ' 23:55:00') WHERE flight_id = 10;

-- Update sync logs to today
UPDATE sync_logs SET timestamp = NOW();

COMMIT;