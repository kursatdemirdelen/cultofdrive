# 🚗 Cult of Drive

> A curated digital garage celebrating 90s-2000s BMW icons. Share authentic builds, connect with enthusiasts, and preserve the stories that make these cars legendary.

![BMW E36](public/images/bmw-e36.png)

## ✨ Features

### Core Features
- **Browse & Discover**: Curated BMW builds with advanced search and filtering
- **My Garage**: Personal collection management for authenticated users
- **Car Details**: Comprehensive pages with specs, images, and owner stories
- **User Profiles**: Driver pages showcasing their builds and history

### Social Features
- **Favorites**: Save and track your favorite builds
- **Comments**: Engage with the community on car listings
- **Notifications**: Real-time updates for favorites and comments
- **Social Feed**: Community posts and updates

### Admin & Advanced
- **Admin Dashboard**: Complete car management with analytics
- **Marketplace**: Buy and sell BMW builds with inquiry system
- **Moderation**: Content reporting and review system
- **Analytics**: View tracking and engagement metrics

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + React 18 |
| Language | TypeScript 5.2 |
| Styling | Tailwind CSS 3.3 |
| Animation | Framer Motion 10.16 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kursatdemirdelen/cultofdrive.git
cd cultofdrive
```



2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

4. **Set up the database**

Run the SQL files in your Supabase SQL Editor in this order:
```bash
supabase/schema.sql
supabase/notifications.sql
supabase/analytics.sql
supabase/moderation.sql
supabase/marketplace.sql
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
cultofdrive/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── cars/[id]/         # Car detail pages
│   ├── components/         # Shared components
│   ├── driver/[owner]/    # User profile pages
│   ├── garage/            # Garage management
│   ├── marketplace/       # Marketplace features
│   └── page.tsx           # Homepage
├── public/                 # Static assets
├── supabase/              # Database schemas
├── utils/                 # Utility functions
└── README.md
```

## 🗄️ Database Schema

The project uses 11 main tables:
- `cars` - Car listings with specs and details
- `car_images` - Multiple images per car
- `car_views` - Analytics and view tracking
- `favorites` - User favorites system
- `car_comments` - Comments and discussions
- `notifications` - Real-time notifications
- `reports` - Content moderation
- `marketplace_listings` - Marketplace listings
- `marketplace_inquiries` - Buyer inquiries
- `social_posts` - Social feed posts
- `email_subscriptions` - Newsletter subscriptions

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_URL` | Server-side Supabase URL | Yes |
| `SUPABASE_KEY` | Server-side Supabase key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin operations key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Application base URL | Yes |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | Enable Google OAuth | No |
| `SEED_SECRET` | Development seed data key | No |





## 🛠️ Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run type-check   # Check types
```





## 🚢 Deployment

Deploy to Vercel in minutes. Connect your GitHub repo, add environment variables, and you're live.

## 🤝 Contributing

Contributions welcome! Fork, create a feature branch, and submit a PR.

## 🔐 Admin

Visit `/admin` and enter your Supabase service role key to manage content.

---

**Built with ❤️ for BMW enthusiasts**
