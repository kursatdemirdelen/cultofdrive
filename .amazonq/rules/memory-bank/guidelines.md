# Cult of Drive - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict Mode**: All files use strict TypeScript with comprehensive type definitions
- **Type Imports**: Use `type` keyword for type-only imports: `import type { User } from "@supabase/supabase-js"`
- **Interface Definitions**: Prefer interfaces over types for object shapes
- **Null Safety**: Consistent null checking with `??` operator and optional chaining

### File Organization
- **Client Components**: Mark with `"use client"` directive at top of file
- **Export Patterns**: Use default exports for pages, named exports for utilities
- **Import Grouping**: External libraries first, then internal imports with `@/` alias
- **File Extensions**: Use `.tsx` for React components, `.ts` for utilities

### Error Handling
- **Try-Catch Blocks**: Comprehensive error handling in async operations
- **Error Types**: Type errors as `any` with fallback messages
- **User Feedback**: Set error state for user-facing error messages
- **API Responses**: Always check response.ok before processing JSON

## React Patterns

### Hook Usage
- **useCallback**: Wrap event handlers and functions passed as props
- **useMemo**: Memoize expensive calculations and filtered data
- **useEffect**: Include all dependencies in dependency arrays
- **Custom Hooks**: Extract complex logic into reusable hooks like `useCars`

### State Management
- **Multiple useState**: Separate concerns with individual state variables
- **State Updates**: Use functional updates when depending on previous state
- **Loading States**: Track loading, saving, and uploading states separately
- **Form State**: Dedicated state objects for complex forms

### Component Structure
```typescript
// 1. Imports (external first, then internal)
// 2. Type definitions and interfaces
// 3. Constants and utility functions
// 4. Main component function
// 5. State declarations
// 6. Effects and callbacks
// 7. Computed values with useMemo
// 8. Event handlers
// 9. JSX return
```

### Event Handling
- **Prevent Default**: Always call `event.preventDefault()` in form handlers
- **Type Events**: Use specific event types like `FormEvent<HTMLFormElement>`
- **Async Handlers**: Properly handle async operations in event handlers
- **Loading States**: Disable actions during async operations

## API Development

### Route Structure
- **Runtime Declaration**: Use `export const runtime = 'nodejs'` for API routes
- **HTTP Methods**: Export named functions (GET, POST, PATCH, DELETE)
- **Request Handling**: Parse JSON with try-catch for error handling
- **Response Format**: Consistent JSON responses with error objects

### Authentication
- **Admin Routes**: Use `assertAdminKey(req)` for admin-only endpoints
- **Supabase Client**: Use appropriate client (admin vs regular) based on operation
- **Header Validation**: Check `x-admin-key` header for admin operations

### Data Validation
```typescript
// Normalize input data with utility functions
function normalizeTags(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((tag) => String(tag).trim()).filter(Boolean)
  }
  // Handle string input...
}
```

### Database Operations
- **Select Specific Fields**: Use `.select()` to specify returned columns
- **Error Handling**: Check Supabase error objects and return appropriate HTTP status
- **Single Records**: Use `.maybeSingle()` for operations expecting one result

## Styling Conventions

### Tailwind CSS
- **Responsive Design**: Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- **Color Palette**: Consistent use of white opacity variants (`white/10`, `white/60`)
- **Spacing**: Use Tailwind spacing scale consistently
- **Gradients**: Background gradients for visual depth (`bg-gradient-to-br`)

### Component Styling
- **Base Classes**: Define reusable style constants like `buttonBase`
- **Conditional Classes**: Use template literals for dynamic styling
- **Focus States**: Include focus-visible styles for accessibility
- **Hover Effects**: Consistent hover transitions across interactive elements

## Performance Optimizations

### React Optimizations
- **Memoization**: Use `useMemo` for expensive calculations
- **Callback Stability**: Use `useCallback` to prevent unnecessary re-renders
- **Dependency Arrays**: Minimize dependencies to reduce effect triggers
- **Component Splitting**: Separate concerns into focused components

### Data Fetching
- **Cache Control**: Use appropriate cache headers for API responses
- **Abort Controllers**: Implement request cancellation in custom hooks
- **Loading States**: Provide immediate feedback during data operations
- **Error Boundaries**: Handle and display errors gracefully

### Image Handling
- **URL Resolution**: Utility functions for consistent image URL handling
- **Preview Generation**: Use `URL.createObjectURL()` for file previews
- **Lazy Loading**: Leverage Next.js Image component optimizations

## Security Practices

### Input Validation
- **Sanitization**: Trim and validate all user inputs
- **Type Checking**: Verify data types before processing
- **Array Handling**: Safe array operations with proper checks
- **SQL Injection Prevention**: Use Supabase query builders, not raw SQL

### Authentication
- **Key Storage**: Store admin keys in localStorage with proper cleanup
- **Session Management**: Handle user sessions with Supabase Auth
- **Route Protection**: Verify authentication before sensitive operations
- **Error Messages**: Avoid exposing sensitive information in error responses

## Development Workflow

### Environment Setup
- **Environment Variables**: Use `.env.local` for local development
- **Database Setup**: Run `supabase/setup.sql` in Supabase SQL Editor
- **Type Checking**: Run `npm run type-check` before commits
- **Linting**: Use ESLint configuration for code consistency
- **Build Verification**: Ensure `npm run build` succeeds

### Debugging Practices
- **Console Logging**: Strategic console.log statements for debugging
- **Error Boundaries**: Implement proper error handling at component level
- **Network Inspection**: Use browser dev tools for API debugging
- **State Debugging**: Log state changes for complex interactions

### Code Organization
- **Feature Modules**: Group related components and utilities
- **Shared Components**: Extract reusable UI elements
- **Type Definitions**: Centralize types in dedicated files
- **Utility Functions**: Create focused, single-purpose utilities

## UI Patterns

### Toast Notifications
- **Usage**: Import from `@/app/components/ui/Toast`
- **Types**: `toast.success()`, `toast.error()`, `toast.info()`
- **Auto-dismiss**: 3 seconds with manual close option
- **Placement**: Top-right corner with stack support
- **Example**: `toast.success("Added to favorites!")`

### Empty States
- **Component**: `EmptyState` from `@/app/components/ui/EmptyState`
- **Props**: icon, title, description (optional), action (optional)
- **Consistent Styling**: Matches app design system
- **Example**: 
```typescript
<EmptyState
  icon={MessageCircle}
  title="No comments yet"
  description="Be the first to share your thoughts!"
  action={{ label: "Add Comment", onClick: handleAction }}
/>
```