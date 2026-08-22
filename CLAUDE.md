# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**EduFit Nepal** is a decision intelligence platform that helps schools avoid failed EdTech investments by analyzing their environment, student accessibility, and readiness before recommending educational technologies. Built with Next.js 16.3.2, React 19, TypeScript, Tailwind CSS, and Supabase.

## Development Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## Code Structure & Architecture

### Core Directories
- `src/app/` - Next.js App Router (pages, layouts, route groups)
- `src/lib/` - Utility libraries (Supabase client, AI explanations, types, scoring)
- `public/` - Static assets

### Key Files
- `src/app/layout.tsx` - Root layout with navigation and metadata
- `src/app/page.tsx` - Home page with hero section, features, and call-to-action
- `src/lib/supabase.ts` - Supabase client initialization (browser/server variants)
- `src/lib/ai.ts` - Explanation generation and implementation planning logic
- `src/lib/types.ts` - TypeScript interfaces for school data, assessments, EdTech tools
- `src/lib/scoring.ts` - Compatibility scoring algorithms (referenced but not shown in exploration)

### Technology Stack
- **Framework**: Next.js 16.3.2 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19.2.8 with Tailwind CSS 4
- **Backend**: Supabase (via `@supabase/supabase-js`)
- **Styling**: Tailwind CSS via PostCSS
- **Environment Variables**: Configured in `.env.example`

## Supabase Integration

The project uses Supabase for data storage and authentication:

### Client Initialization
- **Browser Client**: `createBrowserSupabaseClient()` uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Server Client**: `createServerSupabaseClient()` uses service role key for elevated permissions
- **Environment Helper**: `getSupabaseClient()` returns appropriate client based on runtime

### MCP Server Configuration
- Supabase MCP server configured in `.mcp.json` for extended functionality
- Enabled via `.claude/settings.local.json`
- Provides direct access to Supabase features (database, functions, debugging, etc.)

### Data Models (src/lib/types.ts)
- `SchoolProfile`: School information and demographics
- Assessment interfaces: Infrastructure, Teacher Readiness, School Management, Learning Requirements
- `StudentSurvey`: Student device ownership, internet availability, learning preferences
- `EdTechTool`: Technology requirements and compatibility thresholds
- `CompatibilityResult`: Scoring output with detailed breakdown
- `ExplanationResult`: Human-readable explanations and 90-day implementation plans

## Environment Variables

Required variables (see `.env.example`):
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)
- `NVIDIA_NIM_API_KEY` - For AI explanation layer (planned LLM integration)

## Current Development Notes

### Testing
- No testing framework currently configured
- To add testing: Install Jest/Vitest, add test scripts to package.json, create `__tests__` directories
- Recommended: Add unit tests for utility functions in `src/lib/` (scoring, AI explanations, type guards)

### Styling
- Tailwind CSS 4 via PostCSS
- Custom styling in `src/app/globals.css`
- Component classes use utility-first approach

### AI Features
- Template-based explanation system in `src/lib/ai.ts`
- Designed for easy LLM integration (NVIDIA Nemotron/Gemini)
- Generates human-readable explanations and 90-day implementation roadmaps
- Uses compatibility scores to provide actionable recommendations

## Development Best Practices

1. **Type Safety**: Leverage TypeScript interfaces in `src/lib/types.ts` for all data structures
2. **Supabase Usage**: Use browser client for component-level queries, server client for mutations/actions
3. **Component Structure**: Follow Next.js App Router conventions (server components by default)
4. **Environment Variables**: Never commit `.env`; use `.env.example` as template
5. **Code Organization**: Keep business logic in `src/lib/`, UI components in `src/app/`
6. **Accessibility**: Maintain semantic HTML and proper ARIA attributes in components