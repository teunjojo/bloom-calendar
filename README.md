# Bloom Calendar

A web application to view events and forecasts for Pikmin Bloom.

Live at: [https://bloom-calendar.teunjojo.com](https://bloom-calendar.teunjojo.com)

## Running Locally

### Backend

1. Create a `.env` file in the `backend` directory based on the `.env.example` file.
2. Install dependencies with `npm install`.
3. Run `npm run start:dev` to start the backend in development mode.
4. The backend will be accessible at `http://localhost:3000`.

### Frontend

1. Create a `.env.local` file in the `frontend` directory based on the `.env.example` file.
2. Install dependencies with `npm install`.
3. Run `npm run dev` to start the frontend development server.
4. The frontend will be accessible at `http://localhost:5173`.

## Running Locally in Offline Mode

To run the application in offline mode, set the `VITE_OFFLINE_MODE` variable to `true` in the `frontend/.env.local` file. This will make the frontend use static data instead of fetching from the backend API.
