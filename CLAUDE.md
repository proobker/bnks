# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EduFit Nepal prevents failed EdTech investments by assessing school readiness and student accessibility. It features a rule-based compatibility engine paired with an AI narrative layer to recommend EdTech tools and build deployment roadmaps.

### Implemented MVP Features
- Google OAuth & role-based authentication (Supabase Auth)
- School infrastructure & readiness assessment forms
- Student access layer survey (device access, home internet reliability)
- Deterministic compatibility scoring engine (rule-based math, not AI-calculated)
- AI-assisted implementation planner (Gemini API for strategy/roadmaps)
- Recommendation dashboard with identified resource gaps
- Supabase SQL schema + seed files for core entities (Schools, Tools, Surveys, Recommendations)

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Mobile: Capacitor (Student survey view wrapper)
- Supabase (Auth, PostgreSQL, Storage)
- Gemini API (Implementation planning & advice explanations)

## Setup
1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in values.
3. In Supabase SQL editor:
   - Run `supabase/migrations/0001_init.sql`
   - Run `supabase/seed.sql`
4. In Supabase Auth settings:
   - Enable Google provider
   - Add callback URL: `http://localhost:3000/auth/callback` (and production equivalent)
5. Run the app:
   `npm run dev`

## Environment Variables
- `NEXT_PUBLIC_APP_URL`: Base URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-only)
- `GOOGLE_GEMINI_API_KEY`: Gemini API key (optional; uses fallback templates if omitted)

## Commonly Used Commands
- `npm run dev`: Start development server
- `npm run build`: Production build
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript typecheck

## Code Architecture

### High-Level Structure
- `src/app`: Next.js App Router route definitions
  - `(app)`: Protected application group
    - `dashboard/`: School readiness overview and metrics
    - `assessment/`: Assessment intake steps for educators
    - `student/`: Student access survey interface
    - `recommendations/`: Tool compatibility scores and gap analysis
    - `roadmap/`: AI-generated 90-day implementation plan
  - `auth/`: Authentication callback and sign-in handling
  - `actions/`: Server actions for database operations and scoring calculations
  - `layout.tsx`: Root layout
  - `page.tsx`: Landing page

- `src/components`: Reusable UI elements
  - Assessment forms, progress gauges, matrix cards, and gap warnings
  - `ui/`: Core components (buttons, inputs, modals, indicators)

- `src/lib`: Logic and data helpers
  - `supabase/`: Supabase client configuration (browser, server, and admin)
  - `scoring.ts`: Deterministic engine for evaluating compatibility scores
  - `ai.ts`: Gemini API integration for generating implementation plans
  - `data.ts`: Supabase database queries and mutations
  - `types.ts`: TypeScript schemas for tools, readiness inputs, and scores

### Key Design Rules & Patterns
- **Rule Engine First**: Compatibility scores MUST be calculated strictly by `src/lib/scoring.ts` using deterministic logic. Never use LLMs to calculate compatibility metrics.
- **AI as Explainer**: The Gemini API in `src/lib/ai.ts` takes calculated scores and generates human-readable explanations and 90-day roadmaps.
- **Supabase Integration**: Uses `@supabase/supabase-js` for public queries and `@supabase/ssr` for server-side auth inside App Router server actions.
- **Styling**: Tailwind CSS with responsive layout prioritization (mobile-first for student routes).

## Development Notes
- Refer to Next.js App Router conventions when creating route handlers or Server Actions.
- Ensure database modifications are captured in `supabase/migrations/`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code.