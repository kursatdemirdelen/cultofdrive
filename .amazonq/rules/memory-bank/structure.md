# Cult of Drive - Project Structure

## Directory Architecture

```
cultofdrive/
├── app/                    # Next.js App Router
├── supabase/              # Database schemas
├── utils/                 # Utilities
├── .amazonq/              # AI rules
└── README.md              # Documentation
```

## Terminology
- **driver** - User/member of the community (UI term)
- **owner** - Car owner (specific to car ownership context)
- **user** - Backend/database term (user_id, user_profiles)

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
├── driver/[slug]/        # Driver profile pages
├── profile/              # Own profile (redirects to driver)
├── feed/                 # Social feed functionality
└── garage/               # Car collection management
    ├── add/              # Add new car form
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
├── home/               # Homepage sections (stats, community, recent)
├── hooks/              # Custom React hooks
├── loading/            # Skeleton loaders
├── nav/                # Navigation components
├── social-feed/        # Community feed components
├── ui/                 # Reusable UI components
│   ├── Avatar.tsx      # User avatar component
│   ├── Toast.tsx       # Toast notification system
│   └── EmptyState.tsx  # Empty state component
└── types/              # Shared TypeScript types
```

## Data Layer

### Public Assets (`/public`)
- `data/cars.json` - Sample car data for development
- `images/` - Car photos and static assets

### Database (`/supabase`)
- `setup.sql` - Single complete database setup file

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
- **User Profiles**: Automatic sync with auth.users via trigger, display_name used for owner field
- **Server-Side Rendering**: Optimized performance and SEO
- **Client-Side Interactions**: Real-time updates and user actions
- **Image Management**: Supabase storage with CDN optimization

## Key Relationships

### Authentication Flow
1. User authentication via Supabase Auth
2. Automatic user_profiles creation via database trigger
3. Session management in layout component
4. Protected routes and admin access control
5. Real-time user state across components

### Data Management
1. Server components fetch initial data with user_profiles joins
2. Client components handle user interactions
3. Custom hooks manage complex state
4. API routes handle mutations and uploads
5. Owner field populated from user_profiles.display_name via foreign key

### Content Pipeline
1. Users/Admin create cars (user_id required for ownership)
2. Images uploaded to Supabase storage
3. Data stored in PostgreSQL with RLS policies
4. Owner display name fetched from user_profiles via join
5. Public pages render with optimized images and metadata