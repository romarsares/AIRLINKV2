@echo off
echo Adding Windows Firewall rule for AirLink...

netsh advfirewall firewall add rule name="AirLink Server" dir=in action=allow protocol=TCP localport=3000

echo.
echo Firewall rule added successfully!
echo.
echo Your IP addresses:
ipconfig | findstr IPv4
echo.
echo Access AirLink from other devices using:
echo http://192.168.0.1:3000
echo.
pause