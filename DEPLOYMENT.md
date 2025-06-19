# Intervue.io Polling System Deployment Guide

This guide provides step-by-step instructions for deploying the Intervue.io polling system to production. The application consists of:

1. **Frontend**: React application (in `/client`)
2. **Backend**: Express + Socket.IO server (in `/server`)

## Prerequisites

- Node.js (v14+) and npm installed
- Git repository with your code
- Accounts on deployment platforms (based on your preferred option below)

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment on Vercel

1. Sign up for a free account at [Vercel](https://vercel.com)
2. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Navigate to the client directory:
   ```
   cd client
   ```
4. Configure environment variables:
   - Create a `.env.production` file with:
     ```
     REACT_APP_API_URL=https://your-backend-url.render.com
     ```
5. Deploy to Vercel:
   ```
   vercel
   ```
6. Follow the prompts to link your project
7. Once deployed, note the URL provided by Vercel

#### Backend Deployment on Render

1. Sign up for a free account at [Render](https://render.com)
2. Create a new Web Service
3. Connect your Git repository
4. Configure the service:
   - **Name**: intervue-io-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add environment variables:
   - `PORT`: 10000
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: https://your-frontend-url.vercel.app
6. Deploy the service
7. Update your frontend's `.env.production` with the Render URL, then redeploy the frontend

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Frontend Deployment on Netlify

1. Sign up for a free account at [Netlify](https://netlify.com)
2. Build your React app locally:
   ```
   cd client
   npm run build
   ```
3. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
4. Deploy to Netlify:
   ```
   netlify deploy --prod
   ```
   When prompted, specify the `build` folder
5. Configure environment variables in Netlify site settings:
   - `REACT_APP_API_URL`: https://your-backend-url.herokuapp.com

#### Backend Deployment on Heroku

1. Sign up for a free account at [Heroku](https://heroku.com)
2. Install Heroku CLI:
   ```
   npm install -g heroku
   ```
3. Create a new Heroku app:
   ```
   heroku create intervue-io-backend
   ```
4. Create a `Procfile` in the server directory:
   ```
   web: node server.js
   ```
5. Set environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-url.netlify.app
   ```
6. Deploy the backend:
   ```
   git subtree push --prefix server heroku main
   ```

## Environment Variables

### Frontend (client/.env.production)

```
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (server/.env)

```
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
```

## CORS Configuration

Ensure that the backend server properly allows requests from the frontend domain. In `server/server.js`, make sure CORS is configured correctly:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST"]
}));

// For Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});
```

## SSL/HTTPS

Most hosting providers handle SSL/HTTPS automatically. If you're using a custom server, you'll need to configure SSL certificates using services like Let's Encrypt.

## Quick Deployment with Railway.app

For an even simpler deployment:

1. Sign up for [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add two services (one for client, one for server)
4. Configure environment variables for each
5. Deploy

Railway handles the building, deployment and provides URLs for both services.

## Production Checks

Before deploying to production, ensure:

1. All console.log statements are removed or configured for production
2. Error handling is implemented throughout the application
3. Environment variables are properly set up
4. Rate limiting is in place on the backend
5. Security headers are configured

## Monitoring and Maintenance

Consider setting up:

- Error tracking (e.g., Sentry)
- Performance monitoring
- Regular backups of any persistent data
- Automated tests

## Support

If you need further assistance with deployment, refer to the documentation of the respective hosting providers or reach out to your DevOps team.
