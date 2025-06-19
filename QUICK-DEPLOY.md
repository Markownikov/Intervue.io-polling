# Quick Deployment Guide: GitHub Pages + Railway

This guide provides simple deployment instructions for the Intervue.io polling application using free services.

## Frontend Deployment with GitHub Pages

1. **Create a GitHub repository** for your project if you haven't already.

2. **Update package.json** in the client folder:

   ```json
   {
     "name": "polling-system-client",
     "version": "0.1.0",
     "homepage": "https://yourusername.github.io/intervue-io",
     "private": true,
     "dependencies": {
       // existing dependencies...
     },
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build",
       "start": "react-scripts start",
       "build": "react-scripts build",
       "test": "react-scripts test",
       "eject": "react-scripts eject"
     }
   }
   ```

3. **Install GitHub Pages package**:

   ```
   cd client
   npm install gh-pages --save-dev
   ```

4. **Create .env.production** in the client folder:

   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app
   ```

5. **Deploy to GitHub Pages**:

   ```
   npm run deploy
   ```

6. **Enable GitHub Pages** in your repository settings:
   - Go to Settings > Pages
   - Select "gh-pages" branch
   - Save

## Backend Deployment with Railway

1. **Sign up for Railway** at https://railway.app using your GitHub account.

2. **Create a new project** and select the option to create from GitHub.

3. **Select your repository** and configure the deployment:
   - Choose the "server" directory when prompted
   - Set environment variables:
     ```
     PORT=10000
     NODE_ENV=production
     CORS_ORIGIN=https://yourusername.github.io
     ```

4. **Deploy** - Railway will automatically build and deploy your backend.

5. **Get your Railway URL** - Copy the URL provided by Railway (it will look like https://your-app-name.up.railway.app).

6. **Update client .env.production** with this URL.

7. **Redeploy frontend** with `npm run deploy` if needed.

## Testing the Deployment

1. Open your GitHub Pages URL (https://yourusername.github.io/intervue-io).
2. The frontend should connect to the backend running on Railway.
3. Test all features (both student and teacher views).

## Troubleshooting

- **CORS issues**: Double-check that `CORS_ORIGIN` on the backend matches your GitHub Pages URL exactly.
- **Connection issues**: Make sure the API URL in the frontend environment variables is correct.
- **404 errors on frontend**: Check that routes are properly handled in React.

## Maintenance

Railway offers a free tier with limitations. Monitor your usage to avoid any unexpected charges.

## Additional Resources

- GitHub Pages Documentation: https://pages.github.com/
- Railway Documentation: https://docs.railway.app/
