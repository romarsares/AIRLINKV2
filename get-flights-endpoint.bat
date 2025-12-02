@echo off
more +369 backend\server.js | findstr /N "." | findstr "^[1-9]:" | findstr /V "^1[5-9]:"
pause
