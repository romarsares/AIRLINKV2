@echo off
echo Resetting AirLink Database with Filipino Names...

mysql -u root -pN1mbu$12354 < database\reset-clean-filipino.sql

echo Database reset completed!
echo.
echo Final counts:
mysql -u root -pN1mbu$12354 airlink_dev -e "SELECT 'Passengers' as Item, COUNT(*) as Count FROM passengers UNION ALL SELECT 'Bracelets', COUNT(*) FROM bracelets UNION ALL SELECT 'Bookings', COUNT(*) FROM bookings UNION ALL SELECT 'Flights', COUNT(*) FROM flights;"

pause