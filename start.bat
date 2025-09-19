@echo off
echo 🚀 Starting School Payment Dashboard Development Environment...
echo.

echo 📡 Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run backend:dev"

echo 🎨 Starting Frontend Server...
start "Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting...
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:3002/api
echo.
echo Press any key to exit...
pause > nul