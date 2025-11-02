# Cult of Drive - Terminology Guide

## Overview
This document clarifies the terminology used throughout the Cult of Drive project to maintain consistency.

## Core Terms

### 🏎️ Driver
**Context**: UI, user-facing content, URLs  
**Usage**: Refers to community members, BMW enthusiasts  
**Examples**:
- "Driver Profile" (page title)
- `/driver/[slug]` (URL structure)
- "Top Drivers" (community section)
- "Driver's Garage" (collection view)

**Why**: Aligns with "Cult of Drive" brand, emphasizes the driving experience and automotive culture.

### 🔑 Owner
**Context**: Car ownership, specific to vehicles  
**Usage**: Refers to the person who owns a specific car  
**Examples**:
- "Owner: John Doe" (car detail page)
- `car.owner` (data field showing car owner's name)
- "Car Owner" (form labels)

**Why**: Clear and specific when referring to car ownership, not confused with general user identity.

### 💾 User
**Context**: Backend, database, authentication  
**Usage**: Technical term for database relationships  
**Examples**:
- `user_id` (database foreign key)
- `user_profiles` (database table)
- `auth.users` (Supabase auth table)
- API parameters: `?user_id=...`

**Why**: Standard database/backend terminology, keeps technical layer consistent.

## Data Flow

```
Database (user_profiles) → API (user_id) → Frontend (driver/owner)
     ↓                          ↓                    ↓
  user_id              user_profiles join      Display as:
  display_name         fetch owner name        - Driver (profile)
  slug                 return driverSlug       - Owner (car context)
```

## Type Definitions

### Car Interface
```typescript
export interface Car {
  id: string;
  model: string;
  owner: string;        // Car owner's display name
  driverSlug?: string;  // Link to driver profile
  // ... other fields
}
```

### API Response
```typescript
// API returns:
{
  owner: "John Doe",      // From user_profiles.display_name
  driverSlug: "john-doe"  // From user_profiles.slug
}
```

## URL Structure

| Route | Purpose | Term Used |
|-------|---------|-----------|
| `/driver/[slug]` | Public profile | Driver |
| `/profile` | Own profile (redirects) | - |
| `/cars/[id]` | Car detail | Owner |
| `/garage` | Browse cars | - |

## UI Text Guidelines

### ✅ Correct Usage

**Profile Pages**:
- "Driver Profile"
- "Member since..."
- "Driver's Builds"

**Car Pages**:
- "Owner: John Doe"
- "Added by [owner name]"
- "Car owner"

**Navigation**:
- "View Driver Profile"
- "Top Drivers"

### ❌ Avoid

- "User Profile" (use "Driver Profile")
- "Driver: John Doe" on car pages (use "Owner")
- Mixing terms: "User's Garage" (use "Driver's Garage")

## Code Examples

### Linking to Profile
```tsx
// ✅ Correct
<Link href={`/driver/${car.driverSlug}`}>
  {car.owner}
</Link>

// ❌ Wrong
<Link href={`/user/${car.ownerSlug}`}>
  {car.owner}
</Link>
```

### API Queries
```typescript
// ✅ Correct - Backend uses user_id
const { data } = await supabase
  .from('cars')
  .select('*, user_profiles!cars_user_id_fkey(display_name, slug)')
  .eq('user_id', userId);

// Map to frontend terms
const owner = profile?.display_name;
const driverSlug = profile?.slug;
```

## Migration Notes

### Changed
- `ownerSlug` → `driverSlug` (in Car type)
- `/user/[slug]` → `/driver/[slug]` (URL)
- "User Profile" → "Driver Profile" (UI text)

### Unchanged
- `user_id` (database field)
- `user_profiles` (table name)
- `owner` field (still shows car owner's name)
- Backend API structure

## Summary

| Context | Term | Example |
|---------|------|---------|
| **UI/Frontend** | Driver | "Driver Profile", `/driver/john` |
| **Car Ownership** | Owner | "Owner: John Doe" |
| **Backend/DB** | User | `user_id`, `user_profiles` |

This terminology creates a clear separation:
- **Driver** = Community member identity
- **Owner** = Car ownership relationship
- **User** = Technical/database layer
