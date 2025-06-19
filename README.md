# Live Polling System

A real-time polling application with teacher and student interfaces, built with React, Redux, Express, and Socket.IO.

## Features

### Teacher Features
- Create polls with customizable options and time limits
- View real-time poll results
- Kick students from the session
- View student list
- Chat with students
- View poll history

### Student Features
- Join with a unique name
- Answer polls within time limits
- View poll results after answering or when time expires
- Chat with teacher and other students

## Technology Stack

### Frontend
- React
- Redux for state management
- Socket.IO client for real-time communications
- React Router for navigation

### Backend
- Express.js
- Socket.IO for real-time communication
- Node.js environment

## Deployment

This application can be deployed using various methods. See the deployment guides for detailed instructions:

- [Comprehensive Deployment Guide](./DEPLOYMENT.md) - Detailed options for various platforms
- [Quick Deployment Guide](./QUICK-DEPLOY.md) - Simple deployment using GitHub Pages + Railway
- [Docker Deployment](./docker-compose.yml) - Containerized deployment

### Quick Deployment Scripts

- `deploy.bat` - Creates a deployment package
- `deploy-docker.bat` - Builds and starts Docker containers
- Socket.IO for bidirectional communication
- Node.js

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd intervue-polling-system
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

### Running the application

1. Start the backend server
```bash
cd server
npm start
```

2. In a new terminal, start the frontend
```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

### Client
Create a `.env` file in the client directory with:
```
REACT_APP_API_URL=http://localhost:5000
```

### Server
Create a `.env` file in the server directory with:
```
PORT=5000
```

## Deployment
The application can be deployed on platforms like Heroku, Vercel, or Netlify.

## License
This project is licensed under the MIT License.
