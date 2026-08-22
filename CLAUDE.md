# CLAUDE.md - Vite + React + TypeScript + Tailwind + Supabase Boilerplate

This file provides project-specific instructions for using Claude Code with this Vite + React + TypeScript + Tailwind + Supabase boilerplate.

## Global Instructions
See [RTK - Rust Token Killer](@RTK.md) for token-optimized CLI proxy usage (cuts up to 90% of bash output).

## Project Overview
This is a hackathon starter kit with:
- Vite for fast frontend tooling
- React 19 with React Router for client-side routing
- TypeScript for type safety
- Tailwind CSS for utility-first styling
- Supabase for authentication, Postgres database, and row-level security
- Pre-configured for Vercel static SPA deployment
- Capacitor configuration for mobile app wrapping

## Development Commands
All commands should be prefixed with `rtk` for token optimization:

- `rtk dev` - Start development server
- `rtk build` - Build for production
- `rtk preview` - Preview production build locally
- `rtk lint` - Run oxlint for code quality
- `rtk cap:sync` - Build and sync with Capacitor
- `rtk cap:android` - Open Android project in Android Studio

## Project Structure
Key directories and files to know:

```
src/
├── components/          # Reusable UI components
├── contexts/            # React contexts (AuthContext)
├── lib/                 # Supabase client initialization
├── pages/               # Page components (Landing, Login, Signup, Dashboard)
├── types/               # TypeScript type definitions
├── App.tsx              # Main app component
├── main.tsx             # Entry point
├── index.css            # Global styles
└── vite-env.d.ts        # Vite TypeScript definitions

# Key files:
# - src/lib/supabase.ts - Supabase client setup
# - src/contexts/AuthContext.tsx - Authentication context
# - src/components/ProtectedRoute.tsx - Route protection component
# - src/pages/Login.tsx - Email/password login page
# - src/pages/Signup.tsx - User registration page
# - src/pages/Dashboard.tsx - Protected user dashboard
# - .env.example - Environment variables template
```

## Supabase Integration
This boilerplate expects a Supabase project with:
1. **Table**: `public.profiles` (see README.md for full schema)
2. **Authentication**: Email/password and OAuth providers configured
3. **Row Level Security**: Policies enabled on profiles table

### Working with Supabase
- Initialize client: `import { supabase } from '@/lib/supabase'`
- Access auth: `supabase.auth` for signIn, signOut, user management
- Database queries: `supabase.from('table').select()/insert()/update()/delete()`
- Realtime: `supabase.channel('table').on('INSERT', payload => {...}).subscribe()`

### Environment Variables
Copy `.env.example` to `.env` and fill in:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Common Tasks

### Authentication Flow
1. **Login**: Use email/password or OAuth providers via Supabase Auth
2. **Signup**: Create new user account with email/password
3. **Password Reset**: Use `supabase.auth.resetPasswordForEmail(email)`
4. **Session Management**: Auth context provides user state and loading status

### Database Operations
- **Profiles**: Each auth user has a corresponding profile record
- **CRUD Operations**: Use Supabase client with proper RLS policies
- **Real-time Updates**: Subscribe to database changes for live UI updates

### Deployment
- **Vercel**: Output of `vite build` is a static SPA - deploy with zero configuration
- **Development**: `rtk dev` for local development with hot reload
- **Preview**: `rtk preview` to test production build locally

## Available MCP Servers
This project includes the Supabase MCP server for database operations:
- Use `mcp__supabase__*` tools for direct database interactions
- Refer to Supabase documentation for available operations

## Code Conventions
- **TypeScript**: Strict type checking enabled
- **Tailwind CSS**: Utility-first styling approach
- **Component Organization**: Follow React best practices
- **State Management**: React Context for global state (Auth)
- **Error Handling**: Proper error boundaries and loading states