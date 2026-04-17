@echo off
REM SmartUniEvent - Quick Start Script
REM This script starts all services for development

echo.
echo ========================================
echo   SmartUniEvent - Starting Services
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/4] Starting PostgreSQL Database...
docker-compose up -d postgres
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start database!
    pause
    exit /b 1
)
echo       Database started successfully!
echo.

REM Wait for database to be ready
echo [2/4] Waiting for database to be ready...
timeout /t 3 /nobreak >nul
docker exec smartunievent-db pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo       Database is initializing... waiting 5 more seconds
    timeout /t 5 /nobreak >nul
)
echo       Database is ready!
echo.

echo [3/4] Starting Backend Server...
echo       Opening backend in new terminal...
start "SmartUniEvent Backend" cmd /k "cd /d %~dp0backend && npm run dev"
echo       Backend starting on http://localhost:5000
echo.

echo [4/4] Starting Frontend Server...
echo       Opening frontend in new terminal...
timeout /t 2 /nobreak >nul
start "SmartUniEvent Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo       Frontend starting on http://localhost:5173
echo.

echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Frontend: http://localhost:5173 (or next available port)
echo Backend:  http://localhost:5000/api
echo Database: localhost:5432
echo.
echo Default Login:
echo   Email:    admin@university.edu
echo   Password: Admin@123
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Wait a bit for servers to start
timeout /t 5 /nobreak >nul

REM Open browser
start http://localhost:5173

echo.
echo To stop all services:
echo   1. Close the backend and frontend terminal windows
echo   2. Run: docker-compose down
echo.
pause
