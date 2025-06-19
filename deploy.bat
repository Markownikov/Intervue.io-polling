@echo off
echo ===================================
echo Intervue.io Deployment Preparation
echo ===================================

echo.
echo [1/5] Building React frontend...
cd client
call npm run build
cd ..

echo.
echo [2/5] Preparing backend for production...
cd server
echo NODE_ENV=production > .env
cd ..

echo.
echo [3/5] Creating deployment package...
mkdir deploy
mkdir deploy\client
mkdir deploy\server

echo.
echo [4/5] Copying build files...
xcopy /E /I client\build deploy\client\build
xcopy /E /I server\*.* deploy\server\ /exclude:server\node_modules\*.*
copy package.json deploy\
copy README.md deploy\

echo.
echo [5/5] Creating deployment instructions...
echo # Deployment Instructions > deploy\DEPLOY.md
echo. >> deploy\DEPLOY.md
echo ## Frontend (React) >> deploy\DEPLOY.md
echo 1. Deploy the `client/build` folder to your hosting provider (Vercel, Netlify, etc.) >> deploy\DEPLOY.md
echo 2. Set environment variables for production (REACT_APP_API_URL=your-backend-url) >> deploy\DEPLOY.md
echo. >> deploy\DEPLOY.md
echo ## Backend (Express + Socket.IO) >> deploy\DEPLOY.md
echo 1. Deploy the `server` folder to your backend hosting (Heroku, Render, Railway, etc.) >> deploy\DEPLOY.md
echo 2. Set environment variables for production (PORT=8080, NODE_ENV=production) >> deploy\DEPLOY.md
echo 3. Ensure CORS is properly configured for your frontend domain >> deploy\DEPLOY.md

echo.
echo Deployment package created in the 'deploy' folder.
echo Open deploy\DEPLOY.md for further instructions.
echo.
echo ===================================
