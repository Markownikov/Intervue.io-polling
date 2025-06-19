@echo off
echo ===================================
echo Intervue.io Docker Deployment
echo ===================================

echo.
echo Building and starting containers...
docker-compose up -d --build

echo.
echo Application deployed!
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:10000
echo.
echo To stop the deployment, run: docker-compose down
echo ===================================
