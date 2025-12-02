@echo off
echo Applying Patch 0017 - Flight & Gate Management UI...
mysql -u root -p airlink_dev < database\patch-0017-gate-management-ui.sql
echo.
echo Patch 0017 applied successfully!
pause
