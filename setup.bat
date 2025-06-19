@echo off
echo Installing dependencies for Intervue Poll System...
echo.

:: Install root dependencies
call npm install
echo.

:: Install server dependencies
echo Installing server dependencies...
cd server
call npm install
cd ..
echo.

:: Install client dependencies
echo Installing client dependencies...
cd client
call npm install
cd ..
echo.

echo All dependencies installed!
echo.
echo To start the application, run: npm run dev
echo This will start both the server and client applications.
echo.
echo Press any key to exit...
pause > nul
