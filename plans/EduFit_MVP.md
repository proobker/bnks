# EduFit Nepal - MVP Specification

Based on the EduFit Nepal full context document, here is the Minimum Viable Product specification.

## Core Goal
Build a working EdTech compatibility engine that helps schools avoid failed EdTech investments by analyzing their environment, student accessibility, and readiness before recommending educational technologies.

## MVP Components (in priority order)

### 1. School Assessment Dashboard
- Web application for principals/teachers/education organizations
- School profile collection:
  - School name
  - Location
  - School type
  - Student count
  - Grade levels
  - Number of teachers
  - Current technology usage
- Digital readiness assessment covering:
  - Infrastructure (devices, student/device ratio, internet quality, technical support)
  - Teacher readiness (digital skills, previous usage, training availability, confidence)
  - School management (technology strategy, leadership support, budget planning, implementation readiness)
  - Learning requirements (subject, grade, learning goals, current challenges)

### 2. Compatibility Scoring Engine
- Rule-based scoring (NOT AI-based for transparency)
- Takes school readiness data and EdTech tool requirements
- Calculates compatibility percentage
- Identifies specific problems (device shortage, internet requirements, etc.)
- Provides clear explanations for recommendations
- Example scoring:
  - Input: School with low device availability, medium teacher readiness, poor internet
  - Input: Tool requiring many devices and stable internet
  - Output: Compatibility Score: 45%
  - Problems: Device shortage, Internet requirement too high
  - Recommendation: Start with offline or classroom-based tools

### 3. Student Mobile Survey
- Mobile application (Capacitor wrapper around web app)
- Student account creation (school code + student ID initially)
- Digital access survey collecting:
  - Device ownership (laptop, phone, shared device, no device)
  - Internet availability (always, sometimes, never)
  - Learning preferences
  - Digital confidence
  - Access limitations
- Purpose: Provides reality data to complement school-reported information

### 4. Recommendation Screen
- Displays compatibility scores for various EdTech tools
- Shows identified problems/gaps
- Provides actionable recommendations
- Example: "Avoid homework-only online platforms. Recommended: Classroom-based digital learning."

### 5. AI Explanation Feature (Layer)
- Takes compatibility results from the engine
- Uses LLM to generate human-readable explanations
- Creates implementation roadmaps/plans
- Example: 90-day plan based on readiness score and identified problems
- Important: AI does NOT calculate scores - only explains them

## What to Avoid in MVP
- Full AI tutor
- Complete learning management system
- Large education marketplace
- Complex social network features
- These distract from the unique value proposition

## Technology Stack Suggestions
- Frontend: React / Next.js
- Mobile: Capacitor
- Backend: Node.js / FastAPI
- Database: PostgreSQL / SQLite
- AI: LLM API or local model (for explanation layer only)

## Demo Flow
1. Teacher creates school profile
2. School completes readiness assessment
3. Student logs into mobile app
4. Students complete access survey
5. Dashboard updates with real accessibility data
6. System recommends suitable EdTech
7. AI creates implementation roadmap

This MVP focuses on the core value proposition: preventing failed EdTech investments by connecting school reality with technology decisions through transparent compatibility scoring and explainable recommendations.