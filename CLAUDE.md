# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**EduFit Nepal** is a decision intelligence platform that helps schools avoid failed EdTech investments by analyzing their environment, student accessibility, and readiness before recommending educational technologies. Built with Next.js 16.3.2, React 19, TypeScript, Tailwind CSS, and Supabase.

Primary users are NGOs, municipalities, and school networks doing due diligence before EdTech spend — not individual schools acting alone. Keep that in mind when naming things, writing copy, or deciding what a "user" needs to see.

---

## How an Agent Should Work in This Repo

These are non-negotiable architecture rules, not style preferences. Violating them breaks the core premise of the product.

1. **The compatibility engine is deterministic. Full stop.** Everything in `src/lib/scoring.ts` must be pure, rule-based logic — no AI/LLM calls, no external API calls, no non-determinism of any kind. Given the same inputs, it must always produce the same outputs. This is what makes recommendations explainable and auditable; do not "improve" it by routing any part of it through a model.

2. **The AI layer explains. It never calculates.** Everything in `src/lib/ai.ts` takes the engine's already-computed `CompatibilityResult` as input and produces prose (explanations, 90-day action plans, reports). It must never re-derive, override, or contradict a score. If you're touching `ai.ts` and find yourself computing a number instead of describing one, stop — that logic belongs in `scoring.ts`, not here.

3. **`types.ts` is the single source of truth for shape.** If a change touches the shape of `SchoolProfile`, `StudentSurvey`, `EdTechTool`, or `CompatibilityResult`, update `types.ts` first, then propagate. Don't let `scoring.ts`, `ai.ts`, and the UI silently drift into different assumptions about the same object.

4. **Before writing new scoring logic, read what's already there.** `types.ts` and any existing `scoring.ts` content define the current contract — don't invent new field names or assumptions without checking first. If something's missing or ambiguous, flag it rather than guessing silently.

5. **Auth for the student side is school-issued email as primary, school code as fallback.** Don't implement personal-email signup or add new auth providers without confirming with the maintainer first — this was a deliberate call, not a placeholder.

6. **Ask before large refactors or new dependencies.** Hackathon timeline rewards speed, but architecture drift here is expensive to unwind mid-build. Small, scoped changes > sweeping ones.

7. **Known constraint on this repo's current agent setup:** if you're running through a non-default model backend, keep tasks small and single-purpose rather than long multi-step instructions — some backends are more prone to getting stuck repeating output on broad, open-ended tasks. If something loops, interrupt and re-scope narrower rather than letting it retry.

---

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
- `src/lib/ai.ts` - Explanation generation and implementation planning logic (explanation-only, see rule #2 above)
- `src/lib/types.ts` - TypeScript interfaces for school data, assessments, EdTech tools
- `src/lib/scoring.ts` - Compatibility scoring algorithms (deterministic, see rule #1 above)

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
- `NVIDIA_NIM_API_KEY` - For AI explanation layer (planned LLM integration; hosted API, not self-hosted)

## Current Development Notes

### Testing
- No testing framework currently configured
- To add testing: Install Jest/Vitest, add test scripts to package.json, create `__tests__` directories
- **Priority**: `scoring.ts` is the highest-risk file in the codebase — untested scoring math produces wrong recommendations silently. Add sanity-check tests against known scenarios even before a formal framework is wired up.

### Styling
- Tailwind CSS 4 via PostCSS
- Custom styling in `src/app/globals.css`
- Component classes use utility-first approach

### AI Features
- Template-based explanation system in `src/lib/ai.ts`
- Designed for easy LLM integration (NVIDIA Nemotron/Gemini)
- Generates human-readable explanations and 90-day implementation roadmaps
- Uses compatibility scores to provide actionable recommendations — see rule #2 above: explanation only, never recalculation

## Development Best Practices

1. **Type Safety**: Leverage TypeScript interfaces in `src/lib/types.ts` for all data structures
2. **Supabase Usage**: Use browser client for component-level queries, server client for mutations/actions
3. **Component Structure**: Follow Next.js App Router conventions (server components by default)
4. **Environment Variables**: Never commit `.env`; use `.env.example` as template
5. **Code Organization**: Keep business logic in `src/lib/`, UI components in `src/app/`
6. **Accessibility**: Maintain semantic HTML and proper ARIA attributes in components
