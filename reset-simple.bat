@echo off
echo Resetting AirLink Database (Simple Version)...
echo.

mysql -u root -pN1mbu$12354 < database\reset-complete-with-patches.sql

echo.
echo Database reset completed!
echo.
echo Checking results:
mysql -u root -pN1mbu$12354 airlink_dev -e "SHOW TABLES;"

pause