![BMW E36](public/images/bmw-e36.png)

# 🚗 Cult of Drive

> A curated digital garage for 90s-2000s BMW enthusiasts. Share builds, connect with the community, and preserve automotive stories.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 + React 18 |
| Language | TypeScript 5.2 |
| Styling | Tailwind CSS 3.3 |
| Animation | Framer Motion 10.16 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |

---

## 🗄️ Database Setup

Run this single SQL file in Supabase SQL Editor:

```bash
supabase/setup.sql
```

This file includes:
- Core tables (cars, comments, favorites)
- User profiles with auto-sync
- Analytics & notifications
- Row Level Security (RLS)
- Storage bucket
- Indexes
- Data migration

---

## 🌐 Routes

### Public Pages
```
/                    Homepage
/garage              Browse all cars
/cars/[id]           Car detail page
/driver/[slug]       Public driver profile
```

### Driver Pages
```
/auth                Sign in / Sign up
/profile             Your profile + cars
/profile/edit        Edit profile
/garage/add          Add new car
```

### Admin
```
/admin               Admin dashboard
```

### Marketplace
```
/marketplace         Browse listings
/marketplace/create  Create listing
/marketplace/[id]    Listing details
```

---

## 📁 Project Structure

```
app/
├── api/                    # API routes
│   ├── cars/              # Car operations
│   ├── profiles/          # User profiles
│   └── admin/             # Admin operations
│
├── components/            # React components
│   ├── ui/               # Reusable UI (Avatar, Toast, EmptyState)
│   ├── cars/             # Car features
│   ├── hero/             # Homepage sections
│   ├── home/             # Homepage components
│   ├── loading/          # Skeleton loaders
│   └── ...
│
├── (pages)/              # Next.js pages
│   ├── garage/           # Browse & add cars
│   ├── cars/[id]/        # Car detail
│   ├── user/[slug]/      # Public profile
│   ├── profile/          # Own profile
│   └── admin/            # Admin panel
│
└── types/                # TypeScript types

supabase/
├── setup.sql            # Complete database setup
└── archive/             # Old migration files
utils/                   # Shared utilities
```

---

## 🔑 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🎨 Key Features

### User System
- **Avatar System**: Upload profile pictures with fallback to initials
- **Slug URLs**: Clean URLs like `/user/john-doe`
- **Profile Pages**: Public profile vs own profile with edit

### Car Management
- **Browse & Search**: Filter by model, year, tags
- **Favorites**: Save favorite builds
- **Comments**: Discuss builds with avatars
- **Analytics**: Track views and engagement

### Social Features
- **Comments**: Threaded discussions with user avatars
- **Favorites**: Like and save builds with toast feedback
- **Notifications**: Real-time updates
- **Social Feed**: Community posts

### UI Components
- **Toast Notifications**: Success, error, and info messages
- **Empty States**: Consistent empty state design
- **Skeleton Loaders**: Loading states for better UX
- **Live Indicator**: Animated green dot on "Now Live" badge

### Admin Panel
- **Car Management**: CRUD operations
- **User Management**: View and manage users
- **Analytics**: Platform statistics
- **Moderation**: Content reports

---

## 🗃️ Database Schema

### Core Tables
```sql
user_profiles           # User data (display_name, slug, avatar_url, bio)
cars                    # Car listings (linked to user_profiles)
car_comments            # Comments with user info
favorites               # User favorites
car_views               # View analytics
notifications           # Real-time notifications
reports                 # Content reports
marketplace_listings    # Marketplace car/part listings
marketplace_inquiries   # Marketplace inquiries
"E-mail"                # Email subscriptions
```

### Key Relationships
```
cars.user_id → user_profiles.id
car_comments.user_id → user_profiles.id
favorites.user_id → user_profiles.id
```

---

## 🎯 Development Guidelines

### File Naming
- Pages: `page.tsx`
- Components: `PascalCase.tsx`
- Utils: `camelCase.ts`
- API Routes: `route.ts`

### Import Order
```tsx
// 1. React/Next.js
import { useState } from "react";

// 2. Third-party
import { Car } from "lucide-react";

// 3. Components
import { Avatar } from "@/app/components/ui/Avatar";

// 4. Utils
import { supabaseBrowser } from "@/utils/supabase-browser";

// 5. Types
import type { Car } from "@/app/types";
```

### Styling
- **Tailwind CSS only** (no CSS modules)
- **Mobile-first** responsive design
- **Consistent spacing** using Tailwind scale
- **Color palette**: `white/[opacity]` for transparency

---

## 🔐 Authentication Flow

```
User Sign Up → Supabase Auth → user_profiles (auto-created)
                                      ↓
                              display_name, slug, avatar_url
```

---

## 🚢 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy

### Environment Variables (Production)
```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
```

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

Built with ❤️ for BMW enthusiasts by the community.

---

**[Live Demo](https://cultofdrive.vercel.app)** • **[Report Bug](https://github.com/kursatdemirdelen/cultofdrive/issues)** • **[Request Feature](https://github.com/kursatdemirdelen/cultofdrive/issues)**
