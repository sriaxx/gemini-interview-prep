
# InterviewAI - MERN Stack Application

A comprehensive interview preparation platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication with email confirmation
- Create custom interview sessions
- AI-generated interview questions based on job descriptions
- Score and feedback for interview responses
- Dashboard to track progress

## Project Structure

```
├── client (React frontend)
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── lib
│   │   ├── pages
│   │   ├── services
│   │   └── types
└── server (Node.js/Express backend)
    ├── middleware
    ├── models
    ├── routes
    └── utils
```

## Setup Instructions

### Backend Setup

1. Navigate to the server directory
   ```
   cd server
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string and other configuration

5. Start the server
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the root directory

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file for frontend configuration
   ```
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. Start the frontend development server
   ```
   npm run dev
   ```

5. Visit `http://localhost:5173` in your browser

## Environment Variables

### Backend (.env)
- `PORT` - Port for Express server
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - URL of the React frontend

### Frontend (.env)
- `VITE_API_URL` - URL of the Express API

## Deployment

For production deployment:
1. Build the frontend: `npm run build`
2. Set appropriate environment variables for both frontend and backend
3. Deploy both frontend static files and backend server

## License

MIT
