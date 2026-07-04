# AgendaFlow Client

Next.js frontend for AgendaFlow — public schedule browsing, role-based portals for attendees and organisers, and JWT authentication against the Flask API.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui
- axios
- react-hook-form + zod
- sonner (toast notifications)
- lucide-react icons
- next-themes (dark / light mode)

## Project Structure

```
event-scheduler-project-client/
├── .env.local / .env.example
├── app/                     # Routes (thin pages)
│   ├── page.tsx             # Public landing
│   ├── schedule/            # Public schedule
│   ├── auth/                # Login + registration
│   ├── attendee/            # Attendee portal
│   └── organiser/           # Organiser portal
├── components/
│   ├── ui/                  # shadcn primitives
│   ├── auth-guard.tsx       # AuthenticatedRoute, GuestRoute
│   └── portal-layout.tsx    # Sidebar layout for portals
├── providers/
│   └── auth-provider.tsx    # login / register / logout
├── lib/
│   ├── api-client.ts        # axios + Bearer interceptor
│   ├── format.ts            # date/time helpers
│   └── utils.ts
├── types/                   # TypeScript types (snake_case)
├── services/                # Typed API calls
└── sections/                # Client views + forms
```

## Prerequisites

- Node.js 20+
- Running [event-scheduler-project-api](https://github.com/Thushanika2/event-scheduler-project-api)

## Setup

### 1. Clone and enter the project

```bash
git clone https://github.com/Thushanika2/event-scheduler-project-client.git
cd event-scheduler-project-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

| Variable              | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Flask API base URL (default: `http://127.0.0.1:5000`) |

### 4. Start the development server

Make sure the API is running first, then:

```bash
npm run dev
```

App: **http://localhost:3000**

## Routes

### Public

| Route                      | Description                                 |
| -------------------------- | ------------------------------------------- |
| `/`                        | Landing page                                |
| `/schedule`                | Browse sessions (filter by track / time)    |
| `/schedule/[sessionId]`    | Session detail; attendees can add to agenda |
| `/auth/login`              | Sign in                                     |
| `/auth/register`           | Register as attendee                        |
| `/auth/register/organiser` | Register as organiser                       |

### Attendee (requires login, role: `attendee`)

| Route                 | Description                                    |
| --------------------- | ---------------------------------------------- |
| `/attendee/dashboard` | Overview and quick links                       |
| `/attendee/profile`   | Edit name and phone                            |
| `/attendee/agenda`    | Personal agenda, remove sessions, download PDF |

### Organiser (requires login, role: `organiser`)

| Route                           | Description                    |
| ------------------------------- | ------------------------------ |
| `/organiser/dashboard`          | Overview and quick links       |
| `/organiser/sessions`           | List own sessions              |
| `/organiser/sessions/new`       | Create a session               |
| `/organiser/sessions/edit/[id]` | Edit a session                 |
| `/organiser/profile`            | Edit name, organisation, phone |

## Features

- **Registration flow** — creates a user + attendee or organiser profile, logs in, and redirects to the correct dashboard
- **Public schedule** — filter sessions by track and datetime range; shows booking count and "Full" badge
- **Personal agenda** — add sessions, receive clash warnings for overlapping times, persist across logins
- **Session management** — organiser CRUD with capacity tracking
- **Role protection** — routes gated by `AuthenticatedRoute`; sidebar filtered by role
- **Dark mode** — toggle in portal sidebar

## Scripts

| Command             | Description             |
| ------------------- | ----------------------- |
| `npm run dev`       | Development server      |
| `npm run build`     | Production build        |
| `npm run start`     | Start production server |
| `npm run typecheck` | TypeScript check        |
| `npm run lint`      | ESLint                  |
| `npm run format`    | Prettier format         |

## Production

```bash
npm run build
npm run start
```

Set `NEXT_PUBLIC_API_URL` to your deployed API URL before building.

## Related Repository

Backend (Flask API): [event-scheduler-project-api](https://github.com/Thushanika2/event-scheduler-project-api)
