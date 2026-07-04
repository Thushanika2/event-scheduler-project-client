# Event Scheduler Client

Next.js frontend for the event-scheduler application.

## Prerequisites

- Node.js 20+
- Running Flask API (see `event-scheduler-project-api`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Routes

### Public
- `/` — Landing page
- `/schedule` — Browse sessions (filter by track/time)
- `/schedule/[sessionId]` — Session detail
- `/auth/login` — Sign in
- `/auth/register` — Attendee registration
- `/auth/register/organiser` — Organiser registration

### Attendee
- `/attendee/dashboard`
- `/attendee/profile`
- `/attendee/agenda`

### Organiser
- `/organiser/dashboard`
- `/organiser/sessions`
- `/organiser/sessions/new`
- `/organiser/sessions/edit/[id]`
- `/organiser/profile`

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
