<p align="center">
  <img src="public/logo.png" alt="TheSolvers Logo" width="80" />
</p>

<h1 align="center">TheSolvers</h1>

<p align="center">
  100 real problems. 100 real solutions. Built in public.
</p>

---

<p align="center">
  <img src="public/hero-illustration2.png" alt="TheSolvers Hero" width="600" />
</p>

---

## Overview

TheSolvers is a public challenge to find and solve 100 real-world problems over 100 weeks. Each week, a problem is identified, a solution is built, and the entire process is documented — including what worked and what did not.

The website serves as the central hub: showcasing solutions, publishing weekly blog posts, and allowing people to follow the journey.

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Styling** — Vanilla CSS with CSS variables
- **Database** — Supabase (PostgreSQL)
- **Fonts** — Playfair Display, DM Sans (Google Fonts)

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, solutions grid, newsletter |
| `/blog` | Blog listing — fetched from Supabase |
| `/contact` | Contact page with form connected to Supabase |

## Database Tables

Two Supabase tables are required:

**`subscribers`** — stores newsletter emails

```sql
CREATE TABLE subscribers (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz default now() not null
);
```

**`contacts`** — stores contact form submissions

```sql
CREATE TABLE contacts (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now() not null
);
```

**`blogs`** — stores blog posts

```sql
CREATE TABLE blogs (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  tags text[] default '{}',
  author text not null default 'TheSolvers Team',
  read_time text default '3 min read',
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now() not null
);
```

## Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Links

- Website — [thesolvers.in](https://thesolvers.in)
- GitHub — [github.com/the-solvers](https://github.com/the-solvers)
- Contact — [solvers.real@gmail.com](mailto:solvers.real@gmail.com)
