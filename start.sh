#!/bin/bash

echo "Starting School Payment Backend System..."
echo

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi

echo
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi
cd ..

echo
echo "Starting both servers..."
echo "Frontend will be available at: http://localhost:3000 (or 3001 if 3000 is busy)"
echo "Backend API will be available at: http://localhost:3002"
echo

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd .. && npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Please wait for both servers to fully load before accessing the application."
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
