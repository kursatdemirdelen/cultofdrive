# Cult of Drive - Project Structure

## Directory Architecture

### Root Level
```
cultofdrive/
├── app/                    # Next.js App Router application
├── public/                 # Static assets and data
├── supabase/              # Database schema and migrations
├── utils/                 # Shared utility functions
├── .amazonq/              # AI assistant rules and memory bank
└── config files           # TypeScript, Next.js, Tailwind configs
```

## Core Application Structure

### App Directory (`/app`)
**Next.js 15 App Router Structure**

#### Pages & Routes
- `page.tsx` - Homepage with hero and featured cars
- `layout.tsx` - Root layout with navigation and providers
- `globals.css` - Global styles and Tailwind imports

#### Feature Modules
```
app/
├── admin/                 # Admin dashboard and management
│   ├── components/        # Admin-specific UI components
│   ├── page.tsx          # Main admin interface
│   └── types.ts          # Admin data types
├── auth/                  # Authentication pages
├── cars/[id]/            # Individual car detail pages
├── driver/[owner]/       # User profile pages
├── feed/                 # Social feed functionality
└── garage/               # Car collection management
    ├── add/              # Add new car form
    ├── mine/             # Personal garage view
    └── page.tsx          # Public garage browser
```

#### API Routes (`/app/api`)
```
api/
├── admin/                # Admin operations
│   ├── cars/            # Car CRUD operations
│   └── upload/          # Image upload handling
├── cars/                # Public car data endpoints
├── instagram/           # Social media integration
├── social-posts/        # Community feed management
├── subscribe/           # Email subscription
└── seed-*/             # Development data seeding
```

#### Component Architecture (`/app/components`)
```
components/
├── auth/                # Authentication components
├── bottom-components/   # Footer and bottom sections
├── cars/               # Car display and interaction
├── drivers-garage/     # User garage components
├── hero/               # Homepage hero section
├── hooks/              # Custom React hooks
├── nav/                # Navigation components
├── social-feed/        # Community feed components
└── types/              # Shared TypeScript types
```

## Data Layer

### Public Assets (`/public`)
- `data/` - JSON seed data for development
- `images/` - Car photos and static assets

### Database (`/supabase`)
- `schema.sql` - Complete database schema with tables, policies, and indexes

### Utilities (`/utils`)
- `supabase.ts` - Server-side Supabase client
- `supabase-browser.ts` - Client-side Supabase client
- `admin.ts` - Admin authentication utilities
- `api.ts` - API helper functions

## Architectural Patterns

### Next.js App Router
- **Server Components**: Default for data fetching and static content
- **Client Components**: Interactive UI with 'use client' directive
- **API Routes**: RESTful endpoints for data operations
- **Dynamic Routes**: Parameterized pages for cars and users

### Component Organization
- **Feature-Based**: Components grouped by functionality
- **Shared Components**: Reusable UI elements across features
- **Custom Hooks**: Business logic abstraction
- **Type Safety**: Comprehensive TypeScript coverage

### Data Flow
- **Supabase Integration**: Real-time database with authentication
- **Server-Side Rendering**: Optimized performance and SEO
- **Client-Side Interactions**: Real-time updates and user actions
- **Image Management**: Supabase storage with CDN optimization

## Key Relationships

### Authentication Flow
1. User authentication via Supabase Auth
2. Session management in layout component
3. Protected routes and admin access control
4. Real-time user state across components

### Data Management
1. Server components fetch initial data
2. Client components handle user interactions
3. Custom hooks manage complex state
4. API routes handle mutations and uploads

### Content Pipeline
1. Admin creates/edits cars via dashboard
2. Images uploaded to Supabase storage
3. Data stored in PostgreSQL with RLS policies
4. Public pages render with optimized images and metadata