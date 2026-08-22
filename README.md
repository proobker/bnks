# EduFit Nepal

EduFit Nepal is a decision intelligence platform for educational technology adoption. It helps schools avoid failed EdTech investments by analyzing their infrastructure, teacher readiness, and student accessibility before recommending technologies and implementation roadmaps.

## Implemented MVP Features
- **Google OAuth & Role Auth**: Authentication via Supabase Auth for educators and students.
- **School Profile & Readiness Assessment**: Collects infrastructure, connectivity, and teacher digital skills data.
- **Student Reality Survey**: Mobile-friendly survey capturing home device availability and internet access.
- **Deterministic Compatibility Engine**: Transparent rule-based scoring matching school and student realities with EdTech tools.
- **AI Implementation Advisor**: Gemini API integration generating 90-day rollout plans based on calculated gaps.
- **EdTech Recommendation Dashboard**: Real-time display of compatible EdTech options and gap analysis.
- **Supabase Backend**: SQL schema and seed files for schools, students, EdTech tools, and assessments.

## Stack
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Mobile Access**: Capacitor (web wrapper for student mobile access)
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **AI Integration**: Nvidia API (for narrative explanation and implementation roadmaps only)

## Setup
1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in the required values.
3. In the Supabase SQL editor:
   - Run `supabase/migrations/0001_init.sql`
   - Run `supabase/seed.sql`
4. In Supabase Auth settings:
   - Enable Google provider.
   - Add callback URL: `http://localhost:3000/auth/callback` (and production URL).
5. Run the application:
   `npm run dev`

## Environment Variables
- `NEXT_PUBLIC_APP_URL`: App base URL.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (required for administrative tasks and scoring pipelines; server-only, never expose to client).
- `NVIDIA NIM AI API` : 

## Commands
- `npm run dev`: Start development server.
- `npm run lint`: Run ESLint.
- `npm run typecheck`: Run TypeScript typecheck.
- `npm run build`: Production build.