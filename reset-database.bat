@echo off
echo ========================================
echo AirLink Database Reset Script
echo ========================================
echo.
echo This will completely reset the AirLink database
echo All existing data will be lost!
echo.
set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Reset cancelled.
    pause
    exit /b
)

echo.
echo Resetting database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" root -p < "database\reset-complete.sql"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Database reset completed successfully!
    echo ========================================
    echo.
    echo Default Login Credentials:
    echo - Admin: admin / admin12354
    echo - Operator: operator / operator123
    echo.
    echo Available Bracelets: GES001, GES002, GES003, GES004, GES005
    echo Available Gates: A12, A13, A14, B01, B02, B03, G1, G2, G3
    echo.
) else (
    echo.
    echo ========================================
    echo Database reset failed!
    echo ========================================
    echo Please check your MySQL connection and try again.
    echo.
)

pause