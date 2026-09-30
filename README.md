# TechEvents — Event & Ticket Booking MVP

A simple full-stack platform for discovering upcoming technology events, registering for an event and receiving a digital ticket code.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Features

- Upcoming event listing
- Event date, location and seat availability
- Registration form
- Seat deduction after booking
- Sold-out handling
- Unique ticket code generation
- Booking confirmation ticket displayed in the frontend
- MongoDB persistence

## Run locally

### 1. Start MongoDB

Make sure MongoDB is running locally.

### 2. Start backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 3. Seed sample events

With the backend running, send:

```bash
POST http://localhost:5000/api/events/seed
```

You can use Postman, Thunder Client or curl.

### 4. Start frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Main API endpoints

- `GET /api/health`
- `GET /api/events`
- `POST /api/events/seed`
- `POST /api/bookings`

## MVP flow

Visitor → Browse upcoming events → Select event → Enter name/email → Confirm registration → Seat count decreases → Ticket code is generated and displayed.

## Next logical upgrades

Authentication, admin event management, QR-code tickets, email ticket delivery, payment integration for paid events, search/filtering, and deployment.
