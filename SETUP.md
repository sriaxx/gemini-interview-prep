
# Setting Up InterviewAI MERN Stack Application

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

## Step 1: Clone and Setup Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

   You can generate a JWT secret with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on http://localhost:5000 by default.

## Step 2: Setup Frontend

1. Return to the project root and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:5173 by default.

## Step 3: Testing the Application

1. Open your browser and navigate to http://localhost:5173
2. Sign up for a new account
3. Check the server console logs for the email confirmation link (in development mode)
4. Use the link to confirm your email address
5. Log in with your new account
6. Start creating interview sessions!

## Common Issues and Troubleshooting

### Backend Connection Issues

If you see errors connecting to MongoDB:
- Make sure your MongoDB instance is running
- Check your connection string in the .env file
- For MongoDB Atlas, ensure your IP address is whitelisted

### Authentication Issues

If you experience login problems:
- Check the server console logs for email confirmation details
- Make sure to confirm your email before logging in
- Reset your password if needed

### API Connection Issues

If the frontend can't connect to the API:
- Verify the backend server is running
- Check the VITE_API_URL in the frontend .env file
- Look for CORS errors in the browser console

## Development Tips

- Use `console.log` statements in the server code to debug
- Check the browser console for frontend errors
- MongoDB Compass or MongoDB Atlas web interface can help debug database issues
