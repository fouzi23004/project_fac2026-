@echo off
REM SmartUniEvent - Stop All Services Script

echo.
echo ========================================
echo   SmartUniEvent - Stopping Services
echo ========================================
echo.

echo [1/3] Stopping Node.js processes (Backend/Frontend)...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo       Node.js processes stopped!
) else (
    echo       No Node.js processes found running.
)
echo.

echo [2/3] Stopping PostgreSQL Database container...
docker-compose stop postgres
if %errorlevel% equ 0 (
    echo       Database container stopped!
) else (
    echo       Database was not running or failed to stop.
)
echo.

echo [3/3] Checking for processes on ports 5000 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo       Killing process on port 5000 (PID: %%a)
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo       Killing process on port 5173 (PID: %%a)
    taskkill /F /PID %%a 2>nul
)
echo.

echo ========================================
echo   All Services Stopped!
echo ========================================
echo.
echo Note: Database container is stopped but not removed.
echo To completely remove the database and data:
echo   docker-compose down -v
echo.
echo To start services again, run: start.bat
echo.
pause
