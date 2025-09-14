@echo off
echo Career Platform Startup Script
echo ================================

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH
    pause
    exit /b 1
)

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install Python dependencies
    pause
    exit /b 1
)

echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo Database Setup Instructions:
echo 1. Make sure MySQL is running
echo 2. Create a database named 'career_platform'
echo 3. Run the SQL script in MySQL Workbench:
echo    mysql -u root -p career_platform ^< database_schema.sql
echo 4. Update the database credentials in app.py
echo.

set /p start_app="Do you want to start the application now? (y/n): "
if /i "%start_app%"=="y" (
    echo Starting Career Platform...
    echo.
    echo Starting Flask backend...
    start "Flask Backend" python app.py
    timeout /t 3 /nobreak >nul
    
    echo Starting React frontend...
    start "React Frontend" npm start
    timeout /t 5 /nobreak >nul
    
    echo.
    echo Career Platform is running!
    echo Frontend: http://localhost:3000
    echo Backend: http://localhost:5000
    echo Admin Login: admin / admin123
    echo.
    echo Press any key to exit...
    pause >nul
) else (
    echo.
    echo Manual startup instructions:
    echo 1. Start backend: python app.py
    echo 2. Start frontend: npm start
    echo 3. Open http://localhost:3000 in your browser
    pause
)
