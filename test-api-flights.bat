@echo off
echo Testing Flights API Endpoint...
curl -X GET http://localhost:3000/api/flights
echo.
pause
