# Angels One Healthcare Services

A production-ready **MERN** platform for booking and managing healthcare services, with
role-based dashboards, real-time updates, OTP-verified service completion, payments, and a
support ticketing system.

> **Status:** Architecture & scaffolding only. Folder structure and documented placeholder
> files are in place; business logic is not yet implemented.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | Google OAuth (Passport) + JWT (access/refresh), RBAC |
| Realtime | Socket.IO |
| Email | Nodemailer (Titan SMTP) |
| Payments | Razorpay |

## Repository Layout

```
Angelsonecare/
├── client/   # React + Vite frontend
├── server/   # Express + MongoDB API
├── docs/     # Architecture documentation
└── package.json  # Root scripts to run both apps together
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full design (folder purposes, data
models, API routes, auth flow, and Socket.IO architecture).

## User Roles

- **Client** — book services, track progress, raise tickets, submit reviews, complete via OTP.
- **Leader** — view assigned bookings, update progress, verify OTP, respond to tickets.
- **Admin/Founder** — manage bookings (accept/reject/assign), leaders, tickets, reviews, analytics.

## Service Workflow

`PENDING → ACCEPTED → IN_PROGRESS → COMPLETED` (with `REJECTED` / `CANCELLED` as terminal
alternatives). Completion requires **OTP verification** by the leader.

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string
- Google OAuth, Razorpay, and Titan SMTP credentials

### Setup

```bash
# from the repo root
npm run install:all          # installs root, server, and client deps

# configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# then fill in real values in both .env files
```

### Run (development)

```bash
npm run dev                  # runs server + client concurrently
# or individually:
npm run dev:server           # http://localhost:5000  (API: /api/health)
npm run dev:client           # http://localhost:5173
```

## Scripts

| Command | Description |
|---|---|
| `npm run install:all` | Install dependencies for root, server, and client |
| `npm run dev` | Run server and client together |
| `npm run dev:server` | Run the API only |
| `npm run dev:client` | Run the frontend only |
| `npm start` | Start the server in production mode |
