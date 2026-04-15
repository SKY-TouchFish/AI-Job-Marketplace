# Next.js App Router Supabase Auth

Minimal authentication scaffold for an AI job marketplace MVP.

## Features

- Email/password signup
- Email/password login
- Session stored with Supabase SSR cookies
- Redirect to protected routes after login
- Protected dashboard page

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your Supabase project values.

3. In Supabase Auth settings, make sure your site URL matches your local app, for example:

```text
http://localhost:3000
```

4. Run the app:

```bash
npm run dev
```

## Routes

- `/` public landing page
- `/signup` signup page
- `/login` login page
- `/dashboard` protected page
