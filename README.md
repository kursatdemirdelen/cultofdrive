![Cult of Drive hero](public/images/bmw-e36.png)

# Cult of Drive

> A curated garage for 90s–2000s BMW icons. Authentic builds, lived-in stories, and a community that still feels the road.

## Quick Glance
- Animated hero with spotlighted builds and community highlights.
- Supabase-powered garage: browse the public collection or manage “My Garage” when signed in.
- Real-time favourites and comments keep every build alive.
- Social feed and waitlist form backed by secure API routes.

## Under the Hood
| Layer | Details |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 18 |
| Styling & Motion | Tailwind CSS, Framer Motion |
| Data Platform | Supabase (Postgres, Auth, Storage) |
| Tooling | TypeScript, ESLint |

## Getting Started
1. Clone the project:
   ```bash
   git clone https://github.com/kursatdemirdelen/cultofdrive.git
   cd cultofdrive
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and update values:
   ```bash
   cp env.example .env.local
   ```
4. Launch the local server:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 and start exploring.

## Environment Checklist
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` if Google OAuth is enabled in Supabase
- `SEED_SECRET` when using the optional seed routes
- Run `supabase/schema.sql` inside the Supabase SQL Editor to create tables, policies, and indexes.

## Handy Commands
- `npm run dev` – development server
- `npm run build` – production build output
- `npm run start` – start the production server
- `npm run lint` – lint the project
- `npm run type-check` – static type validation

## Ready for Launch?
- `npm run lint` and `npm run type-check` complete without issues.
- `.env.local` is configured and excluded from git.
- Supabase OAuth providers (Google, etc.) are enabled and tested.
- Seed data (if used) is refreshed with `SEED_SECRET`.
- Metadata and README reflect the latest product narrative.

## Deployment
Deploy seamlessly with Vercel or any Node-capable hosting. Remember to add every environment variable in your hosting dashboard before the first deployment.

## License
MIT © Cult of Drive
