@echo off
echo Starting Intervue Poll System...

:: Start the server in a new terminal window
start cmd /k "cd /d %~dp0server && node server.js"

:: Wait a moment for the server to start
timeout /t 3 /nobreak > nul

:: Start the client in a new terminal window
start cmd /k "cd /d %~dp0client && npm start"

echo The application is starting...
echo.
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
