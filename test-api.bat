@echo off
echo Testing AirLink API endpoints...

echo.
echo 1. Testing health endpoint:
curl -X GET http://localhost:3000/api/health

echo.
echo.
echo 2. Testing login:
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin12354\"}"

echo.
echo.
echo 3. Testing overview without auth (should fail):
curl -X GET http://localhost:3000/api/admin/overview

pause