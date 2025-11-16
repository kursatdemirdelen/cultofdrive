# Cult of Drive - User System Architecture

## Overview
The user system is built on Supabase Auth with a custom user_profiles table that automatically syncs with auth.users. This provides a consistent user identity across the application.

## Core Components

### User Profiles Table
**Table**: `user_profiles`
- **id** (uuid, PK, FK to auth.users.id)
- **email** (text, unique)
- **display_name** (text, not null) - Used as owner name throughout app
- **slug** (text, unique) - URL-friendly version of display_name
- **avatar_url** (text, nullable)
- **bio** (text, nullable)
- **created_at** (timestamptz)
- **updated_at** (timestamptz)

### Automatic Profile Creation
A database trigger automatically creates a user_profiles entry when a new user signs up:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

The trigger:
1. Extracts display_name from user metadata (full_name, name, or email)
2. Generates a URL-friendly slug
3. Creates user_profiles entry with id matching auth.users.id

### Slug Generation
Slugs are automatically generated from display_name:
- Lowercase conversion
- Space to hyphen replacement
- Special character removal
- Ensures URL-friendly format

Example: "Kürşat Demirdelen" → "kursat-demirdelen"

## Data Relationships

### Cars Table
- **user_id** (uuid, FK to user_profiles.id ON DELETE SET NULL)
- Owner display fetched via join: `user_profiles!cars_user_id_fkey(display_name, slug, avatar_url)`

### Comments Table
- **user_id** (uuid, FK to user_profiles.id ON DELETE SET NULL)
- User info fetched via join for display

### Favorites Table
- **user_id** (uuid, FK to user_profiles.id ON DELETE CASCADE)
- Removed when user is deleted

## API Integration

### Car Listing APIs
All car APIs join with user_profiles to fetch owner name:
```typescript
.select(`
  id, model, year, image_url, description, specs, tags, is_featured, created_at, user_id,
  user_profiles!cars_user_id_fkey(display_name)
`)
```

Owner extracted from join result:
```typescript
const profile = Array.isArray(row.user_profiles) ? row.user_profiles[0] : row.user_profiles;
const owner = profile?.display_name || 'Anonymous';
```

### Upload API
When users add cars:
1. Validates user_id is present (authentication required)
2. Fetches display_name from user_profiles
3. Uses display_name for file naming
4. Stores user_id in cars table

### Profile APIs
- `/api/profiles/[display_name]` - Fetch profile by slug or display_name
- `/api/profiles/[display_name]/stats` - User statistics (cars, views, favorites, comments)
- `/api/drivers/top` - Top contributors by car count

## URL Structure

### Profile URLs
- **Current User**: `/profile` (redirects to `/driver/[slug]`)
- **Public Profile**: `/driver/[slug]` (e.g., `/driver/kursat-demirdelen`)
- **Legacy Support**: Falls back to display_name if slug not found

### Profile Links
Throughout the app, driver names link to profiles:
- Car detail pages: Owner name links to driver profile
- Comments: Username links to driver profile
- Garage cards: Owner name links to driver profile
- Community section: Top contributors link to driver profiles

## Form Handling

### User Car Submission
**No manual owner input** - Owner determined by authentication:
1. User must be signed in (user_id required)
2. Form submits user_id only
3. Backend fetches display_name from user_profiles
4. Owner field populated automatically via database join

### Admin Car Management
Admin creates cars without owner:
1. Cars created by admin have no user_id
2. Display as "Anonymous" in listings

## Security & Permissions

### Row Level Security (RLS)
- **user_profiles**: Public read, users can update own profile
- **cars**: Public read, users can delete/update own cars (user_id match)
- **comments**: Public read, users can delete own comments
- **favorites**: Public read, users can manage own favorites

### Foreign Key Constraints
- **cars.user_id**: ON DELETE SET NULL (car persists without owner)
- **comments.user_id**: ON DELETE SET NULL (comment persists without user)
- **favorites.user_id**: ON DELETE CASCADE (favorite removed with user)

## Database Setup

### Single Setup File
All database setup is handled by `supabase/setup.sql`:
1. Creates all tables with proper relationships
2. Sets up user_profiles with auto-sync triggers
3. Configures RLS policies for security
4. Creates indexes for performance
5. Sets up storage bucket for images

## Best Practices

### When Adding User Features
1. Always use user_id for relationships
2. Join with user_profiles for display data
3. Use display_name from user_profiles (shown as owner)
4. Link to driver profile using slug (/driver/[slug])

### When Displaying User Info
1. Fetch via user_profiles join
2. Use display_name for display
3. Use slug for profile URLs
4. Fallback to "Anonymous" if no profile
5. Handle both array and object join results

### When Creating User Content
1. Require authentication (user_id)
2. Validate user_id exists in user_profiles
3. Store user_id in content table
4. Let database joins handle display data
