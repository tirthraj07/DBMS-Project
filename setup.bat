@echo off
echo Setting up all services...

:: Navigate to backend folder
cd backend

:: Start movies-service in a new command window
start cmd /k "cd movies-service && npm install"

:: Start customer-service in a new command window
start cmd /k "cd customer-service && npm install"

:: Start theatre-service in a new command window
start cmd /k "cd theatre-service && npm install"

:: Start booking-service in a new command window
start cmd /k "cd booking-service && npm install"

:: Start front-end application in a new command window
cd ..
cd frontend
start cmd /k "npm install"


echo All services setup
