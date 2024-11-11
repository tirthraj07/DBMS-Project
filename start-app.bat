@echo off
echo Starting all services...

:: Navigate to backend folder
cd backend

:: Start movies-service in a new command window
start cmd /k "cd movies-service && npm run dev"

:: Start customer-service in a new command window
start cmd /k "cd customer-service && npm run dev"

:: Start theatre-service in a new command window
start cmd /k "cd theatre-service && npm run dev"

:: Start booking-service in a new command window
start cmd /k "cd booking-service && npm run dev"

:: Start front-end application in a new command window
cd ..
cd frontend
start cmd /k "npm run dev"


echo All services started.
