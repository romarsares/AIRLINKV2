@echo off
echo ========================================
echo AirLink Development Tools Check
echo ========================================
echo.

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Node.js: 
    node --version
) else (
    echo [✗] Node.js: NOT INSTALLED
    echo     Download from: https://nodejs.org/
)
echo.

echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] npm: 
    npm --version
) else (
    echo [✗] npm: NOT INSTALLED
)
echo.

echo Checking Git...
git --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Git: 
    git --version
) else (
    echo [✗] Git: NOT INSTALLED
    echo     Download from: https://git-scm.com/
)
echo.

echo Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] MySQL: 
    mysql --version
) else (
    echo [✗] MySQL: NOT INSTALLED or not in PATH
    echo     Download from: https://dev.mysql.com/downloads/mysql/
)
echo.

echo ========================================
echo Installation Status Summary:
echo ========================================
echo Required for AirLink development:
echo - Node.js (v18+) for backend server
echo - npm (comes with Node.js) for package management  
echo - Git for version control
echo - MySQL (v8.0+) for database
echo.
echo Optional but recommended:
echo - VS Code editor
echo - MySQL Workbench for database management
echo - Postman for API testing
echo ========================================
pause