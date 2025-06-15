# ChatGPT Book Assistant

This repository contains a simple book recommendation assistant built with a Node.js backend and a React Native frontend.

## Project Structure

- **backend**: Express server that proxies requests to OpenAI's ChatGPT API.
- **frontend**: Expo app that interacts with the backend to get book suggestions.

## Prerequisites

- Node.js (for both backend and frontend).
- An OpenAI API key.

## Setup

### Backend

1. Navigate to the `backend` directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend` with your ChatGPT token:
   ```env
   OPENAI_API_KEY=your-api-key-here
   ```
3. If you need to use a different port, edit `index.js` and change the
   `PORT` constant near the bottom of the file, e.g.:
   ```js
   const PORT = 4000; // default is 3001
   ```
   Restart the server after making changes.
4. Start the backend server:
   ```bash
   node index.js
   ```
   The server runs on `http://localhost:3001` by default.

### Frontend

1. Navigate to the `frontend` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. **Update the backend API URL** if your server is not running on
   `http://localhost:3001`. Open `frontend/app/(tabs)/index.tsx` and find the
   axios request:
   ```ts
   const res = await axios.post("http://localhost:3001/chat", {
     message,
   });
   ```
   Replace `http://localhost:3001` with your backend address, for example:
   ```ts
   const res = await axios.post("http://192.168.1.10:4000/chat", {
     message,
   });
   ```
   Save the file and reload the app.
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
   Follow the Expo instructions to open the app on a simulator or device.

## Notes

- Ensure the backend is running and accessible from your device.
- The OpenAI token is required for the backend to communicate with ChatGPT.
- Do not commit your `.env` file to version control.
