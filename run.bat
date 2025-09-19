@echo off
echo 🚀 Starting School Payment Dashboard...
echo.

echo 📦 Installing dependencies...
call npm run install:all

echo.
echo 🚀 Starting both servers...
call npm run start:all

pause
