# Setup Guide

Get Cult of Drive running locally in minutes.

## Prerequisites

- Node.js 18+
- Supabase account

## Step-by-Step Setup

### 1. Install

```bash
npm install
```

### 2. Environment

Create `.env.local` file:

```bash
cp env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Supabase Setup

**Create Project:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and keys

**Database:**
Run SQL files in Supabase SQL Editor in this order:
1. `supabase/schema.sql`
2. `supabase/notifications.sql`
3. `supabase/analytics.sql`
4. `supabase/moderation.sql`
5. `supabase/marketplace.sql`

**Storage:**
1. Go to Storage section
2. Create a new bucket named `garage`
3. Make it public

### 4. Start

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

Visit [http://localhost:3000](http://localhost:3000)

## Admin

Go to `/admin` and enter your `SUPABASE_SERVICE_ROLE_KEY`.

---

**That's it! 🚗**
