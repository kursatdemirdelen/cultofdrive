# Cult of Drive - Technology Stack

## Core Framework
- **Next.js 15.5.6** - React framework with App Router
- **React 18.2.0** - UI library with concurrent features
- **TypeScript 5.2.2** - Static type checking and enhanced developer experience

## Styling & Animation
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **Framer Motion 10.16.4** - Animation library for React
- **PostCSS 8.4.31** - CSS processing and optimization
- **Autoprefixer 10.4.16** - Automatic vendor prefixing

## Backend & Database
- **Supabase 2.76.1** - Backend-as-a-Service with PostgreSQL
- **Supabase Auth** - User authentication and session management
- **Supabase Storage** - File upload and CDN delivery
- **Row Level Security** - Database access control policies

## Development Tools
- **ESLint 8.51.0** - Code linting and style enforcement
- **TypeScript Compiler** - Type checking and compilation
- **Next.js Dev Server** - Hot reload development environment

## Additional Libraries
- **Axios 1.7.7** - HTTP client for API requests
- **Date-fns 4.1.0** - Date manipulation and formatting
- **Lucide React 0.546.0** - Icon library
- **Vercel Analytics 1.5.0** - Performance and usage analytics
- **Vercel Speed Insights 1.2.0** - Core Web Vitals monitoring

## Build Configuration

### TypeScript Configuration
```json
{
  "target": "ES2017",
  "module": "esnext",
  "moduleResolution": "bundler",
  "strict": true,
  "jsx": "preserve"
}
```

### Next.js Configuration
- **Image Optimization**: Multiple formats (AVIF, WebP) with quality settings
- **Remote Patterns**: Instagram CDN and Supabase storage domains
- **Experimental Features**: Package import optimization for Framer Motion
- **TypeScript**: Strict mode with build error enforcement

### Package Management
- **NPM** - Package manager with lock file
- **ES Modules** - Modern module system throughout project

## Development Commands

### Primary Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code analysis
- `npm run type-check` - TypeScript compilation check

### Environment Setup
1. **Dependencies**: `npm install`
2. **Environment**: Copy `env.example` to `.env.local`
3. **Database**: Run `supabase/setup.sql` in Supabase SQL Editor
4. **Development**: `npm run dev`

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public Supabase key
- `SUPABASE_URL` - Server-side Supabase URL
- `SUPABASE_KEY` - Server-side Supabase key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin operations key
- `NEXT_PUBLIC_SITE_URL` - Application base URL

### Optional Variables
- `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` - Enable Google OAuth
- `SEED_SECRET` - Development data seeding key

## Performance Optimizations

### Image Handling
- **Next.js Image Component**: Automatic optimization and lazy loading
- **Multiple Formats**: AVIF and WebP with fallbacks
- **Responsive Images**: Device-specific sizes and quality levels
- **CDN Integration**: Supabase storage with global distribution

### Build Optimizations
- **Package Import Optimization**: Framer Motion tree shaking
- **TypeScript Strict Mode**: Enhanced type safety and performance
- **ESLint Integration**: Code quality enforcement during builds

## Deployment Requirements
- **Node.js Environment**: Compatible hosting platform
- **Environment Variables**: All required variables configured
- **Database Setup**: Supabase project with schema applied
- **OAuth Configuration**: Authentication providers enabled in Supabase
- **Build Verification**: Successful `npm run build` and `npm run type-check`