# 🛠️ Setup Guide

Complete setup guide for Cult of Drive. Follow these steps to get your local development environment running.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier works)
- Git

## Step-by-Step Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/cultofdrive.git
cd cultofdrive
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and keys

### 3. Environment Variables

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

### 4. Database Setup

Run SQL files in Supabase SQL Editor **in this exact order**:

1. `supabase/schema.sql` - Main tables and RLS policies
2. `supabase/notifications.sql` - Notifications system
3. `supabase/analytics.sql` - View tracking and analytics
4. `supabase/moderation.sql` - Content moderation and reports
5. `supabase/marketplace.sql` - Marketplace features

> ⚠️ **Important**: Run these files in order as they have dependencies on each other.

### 5. Storage Setup

In Supabase Dashboard:
1. Go to **Storage** section
2. Create a new bucket named `garage`
3. Make it **public**
4. Policies are automatically set from `schema.sql`

### 6. Authentication Setup (Optional)

To enable Google OAuth:
1. Go to Authentication → Providers in Supabase
2. Enable Google provider
3. Add OAuth credentials
4. Set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`

### 7. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Admin Access

To access the admin dashboard:
1. Navigate to `/admin` in your browser
2. Enter your admin key (use `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`)
3. The key is stored in localStorage for convenience
4. You can now manage cars, view reports, and moderate content

## 🌱 Seed Data (Optional)

To add sample data for development:
1. Set `SEED_SECRET` in `.env.local` (any random string)
2. Visit `http://localhost:3000/api/seed-cars?secret=your_seed_secret`
3. Visit `http://localhost:3000/api/seed-social-posts?secret=your_seed_secret`
4. Refresh your homepage to see the sample data

## 🐞 Troubleshooting

### Build Errors

```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting issues
```

### Database Issues

- Ensure all SQL files are run in order
- Check RLS policies are enabled
- Verify service role key is correct

### Authentication Issues

- Check OAuth provider configuration
- Verify redirect URLs in Supabase
- Ensure `NEXT_PUBLIC_SITE_URL` is correct

## 🚀 Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Update `NEXT_PUBLIC_SITE_URL` to your domain
5. Deploy

### Post-Deployment

- Test all features
- Configure custom domain
- Enable Vercel Analytics
- Set up monitoring

## ❓ Need Help?

- Check existing [Issues](https://github.com/yourusername/cultofdrive/issues)
- Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide
- Open a new issue with detailed information
- Join the community discussions

---

**Happy building! 🚗**
