-- Supabase Schema for EduFit Nepal Platform
-- This schema implements the database structure for the EduFit Nepal decision intelligence platform
-- Based on TypeScript interfaces in src/lib/types.ts

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- School Profiles Table
CREATE TABLE school_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    school_type VARCHAR(20) NOT NULL CHECK (school_type IN ('public', 'private', 'ngo', 'other')),
    student_count INTEGER NOT NULL CHECK (student_count >= 0),
    grade_levels TEXT[] NOT NULL, -- e.g., ['1-5', '6-8', '9-12']
    teacher_count INTEGER NOT NULL CHECK (teacher_count >= 0),
    current_technology_usage TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated_at trigger for school_profiles
CREATE TRIGGER update_school_profiles_updated_at
    BEFORE UPDATE ON school_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Infrastructure Assessments Table
CREATE TABLE infrastructure_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES school_profiles(id) ON DELETE CASCADE,
    device_count INTEGER NOT NULL CHECK (device_count >= 0),
    student_device_ratio DECIMAL(5,2) NOT NULL CHECK (student_device_ratio >= 0),
    device_availability VARCHAR(10) NOT NULL CHECK (device_availability IN ('excellent', 'good', 'fair', 'poor')),
    internet_quality VARCHAR(10) NOT NULL CHECK (internet_quality IN ('excellent', 'good', 'fair', 'poor')),
    technical_support VARCHAR(10) NOT NULL CHECK (technical_support IN ('excellent', 'good', 'fair', 'poor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teacher Readiness Assessments Table
CREATE TABLE teacher_readiness_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES school_profiles(id) ON DELETE CASCADE,
    digital_skills VARCHAR(10) NOT NULL CHECK (digital_skills IN ('excellent', 'good', 'fair', 'poor')),
    previous_technology_usage VARCHAR(15) NOT NULL CHECK (previous_technology_usage IN ('extensive', 'moderate', 'limited', 'none')),
    training_availability VARCHAR(10) NOT NULL CHECK (training_availability IN ('excellent', 'good', 'fair', 'poor')),
    confidence_using_technology VARCHAR(10) NOT NULL CHECK (confidence_using_technology IN ('excellent', 'good', 'fair', 'poor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- School Management Assessments Table
CREATE TABLE school_management_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES school_profiles(id) ON DELETE CASCADE,
    technology_strategy VARCHAR(10) NOT NULL CHECK (technology_strategy IN ('excellent', 'good', 'fair', 'poor')),
    leadership_support VARCHAR(10) NOT NULL CHECK (leadership_support IN ('excellent', 'good', 'fair', 'poor')),
    budget_planning VARCHAR(10) NOT NULL CHECK (budget_planning IN ('excellent', 'good', 'fair', 'poor')),
    implementation_readiness VARCHAR(10) NOT NULL CHECK (implementation_readiness IN ('excellent', 'good', 'fair', 'poor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Requirements Assessments Table
CREATE TABLE learning_requirements_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES school_profiles(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    learning_goals TEXT NOT NULL,
    current_challenges TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Surveys Table
CREATE TABLE student_surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES school_profiles(id) ON DELETE CASCADE,
    student_id VARCHAR(255) NOT NULL,
    device_ownership VARCHAR(10) NOT NULL CHECK (device_ownership IN ('laptop', 'phone', 'shared', 'none')),
    internet_availability VARCHAR(10) NOT NULL CHECK (internet_availability IN ('always', 'sometimes', 'never')),
    learning_preferences JSONB, -- Stores comma-separated or JSON string as JSONB
    digital_confidence VARCHAR(10) NOT NULL CHECK (digital_confidence IN ('excellent', 'good', 'fair', 'poor')),
    access_limitations JSONB, -- Stores comma-separated or JSON string as JSONB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EdTech Tools Table
CREATE TABLE edtech_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    device_requirement INTEGER NOT NULL CHECK (device_requirement >= 1 AND device_requirement <= 5),
    internet_requirement INTEGER NOT NULL CHECK (internet_requirement >= 1 AND internet_requirement <= 5),
    teacher_monitoring_needed BOOLEAN DEFAULT FALSE,
    requires_training BOOLEAN DEFAULT FALSE,
    offline_capable BOOLEAN DEFAULT FALSE,
    best_for JSONB, -- Stores string array as JSONB
    min_device_score INTEGER NOT NULL CHECK (min_device_score >= 1 AND min_device_score <= 5),
    min_internet_score INTEGER NOT NULL CHECK (min_internet_score >= 1 AND min_internet_score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compatibility Results Table
CREATE TABLE compatibility_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES school_profiles(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES edtech_tools(id) ON DELETE CASCADE,
    compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    problems JSONB, -- Stores string array as JSONB
    recommendation TEXT NOT NULL,
    details JSONB NOT NULL, -- Stores the detailed scoring breakdown
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, tool_id) -- Prevent duplicate compatibility results for same school-tool pair
);

-- Explanation Results Table
CREATE TABLE explanation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    compatibility_result_id UUID NOT NULL REFERENCES compatibility_results(id) ON DELETE CASCADE,
    explanation TEXT NOT NULL,
    implementation_plan JSONB NOT NULL, -- Stores the 90-day roadmap structure
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_infrastructure_assessments_school_id ON infrastructure_assessments(school_id);
CREATE INDEX idx_teacher_readiness_assessments_school_id ON teacher_readiness_assessments(school_id);
CREATE INDEX idx_school_management_assessments_school_id ON school_management_assessments(school_id);
CREATE INDEX idx_learning_requirements_assessments_school_id ON learning_requirements_assessments(school_id);
CREATE INDEX idx_student_surveys_school_id ON student_surveys(school_id);
CREATE INDEX idx_compatibility_results_school_id ON compatibility_results(school_id);
CREATE INDEX idx_compatibility_results_tool_id ON compatibility_results(tool_id);
CREATE INDEX idx_explanation_results_compatibility_result_id ON explanation_results(compatibility_result_id);

-- Comments for documentation
COMMENT ON TABLE school_profiles IS 'Core school information and demographics';
COMMENT ON COLUMN school_profiles.school_type IS 'Type of school: public, private, ngo, or other';
COMMENT ON COLUMN school_profiles.grade_levels IS 'Array of grade levels offered, e.g., ['1-5', '6-8', '9-12']';

COMMENT ON TABLE infrastructure_assessments IS 'Technology infrastructure evaluation for schools';
COMMENT ON COLUMN infrastructure_assessments.device_availability IS 'Excellent, good, fair, or poor';
COMMENT ON COLUMN infrastructure_assessments.internet_quality IS 'Excellent, good, fair, or poor';
COMMENT ON COLUMN infrastructure_assessments.technical_support IS 'Excellent, good, fair, or poor';

COMMENT ON TABLE teacher_readiness_assessments IS 'Teacher technology readiness assessment';
COMMENT ON COLUMN teacher_readiness_assessments.digital_skills IS 'Excellent, good, fair, or poor';
COMMENT ON COLUMN teacher_readiness_assessments.previous_technology_usage IS 'Extensive, moderate, limited, or none';
COMMENT ON COLUMN teacher_readiness_assessments.training_availability IS 'Excellent, good, fair, or poor';
COMMENT ON COLUMN teacher_readiness_assessments.confidence_using_technology IS 'Excellent, good, fair, or poor';

COMMENT ON TABLE school_management_assessments IS 'School management readiness for tech integration';
COMMENT ON COLUMN school_management_assessments.technology_strategy IS 'Excellent, good, fair, or poor';
COMMENT ON COLUMN school_management_assessments.leadership_support IS 'Excellent, good, fair, or poor';
COMMENT ON COLUMN school_management_assessments.budget_planning IS 'Excellent, good, fair, or poor';
COMMENT ON COLUMN school_management_assessments.implementation_readiness IS 'Excellent, good, fair, or poor';

COMMENT ON TABLE learning_requirements_assessments IS 'Subject-specific learning requirements and challenges';
COMMENT ON TABLE student_surveys IS 'Student-level device ownership and connectivity data';
COMMENT ON COLUMN student_surveys.device_ownership IS 'Laptop, phone, shared, or none';
COMMENT ON COLUMN student_surveys.internet_availability IS 'Always, sometimes, or never';
COMMENT ON COLUMN student_surveys.learning_preferences IS 'Student learning preferences stored as JSONB';
COMMENT ON COLUMN student_surveys.digital_confidence IS 'Excellent, good, fair, or poor';
COMMENT ON COLUMN student_surveys.access_limitations IS 'Any access limitations stored as JSONB';

COMMENT ON TABLE edtech_tools IS 'Catalog of educational technology tools with requirements';
COMMENT ON COLUMN edtech_tools.device_requirement IS 'Device requirement score (1-5 scale)';
COMMENT ON COLUMN edtech_tools.internet_requirement IS 'Internet requirement score (1-5 scale)';
COMMENT ON COLUMN edtech_tools.teacher_monitoring_needed IS 'Whether teacher monitoring is needed';
COMMENT ON COLUMN edtech_tools.requires_training IS 'Whether training is required to use the tool';
COMMENT ON COLUMN edtech_tools.offline_capable IS 'Whether the tool can work offline';
COMMENT ON COLUMN edtech_tools.best_for IS 'Array of use cases the tool is best suited for';
COMMENT ON COLUMN edtech_tools.min_device_score IS 'Minimum device availability score needed for compatibility';
COMMENT ON COLUMN edtech_tools.min_internet_score IS 'Minimum internet quality score needed for compatibility';

COMMENT ON TABLE compatibility_results IS 'Scoring results between schools and EdTech tools';
COMMENT ON COLUMN compatibility_results.compatibility_score IS 'Overall compatibility score (0-100)';
COMMENT ON COLUMN compatibility_results.problems IS 'Identified issues stored as JSONB array';
COMMENT ON COLUMN compatibility_results.recommendation IS 'Actionable advice for implementation';
COMMENT ON COLUMN compatibility_results.details IS 'Detailed breakdown of scoring components';

COMMENT ON TABLE explanation_results IS 'Human-readable explanations and 90-day implementation plans';
COMMENT ON COLUMN explanation_results.explanation IS 'Detailed human-readable explanation of the compatibility result';
COMMENT ON COLUMN explanation_results.implementation_plan IS '90-day roadmap stored as JSONB with month1, month2, month3 arrays';

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
-- ============================================
-- Saved Events Table (Student Hub MVP)
-- Personal event bookmarks per student account
-- ============================================
CREATE TABLE saved_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, event_id)
);

CREATE INDEX idx_saved_events_user_id ON saved_events(user_id);

ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved events"
    ON saved_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save events"
    ON saved_events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own saved events"
    ON saved_events FOR DELETE
    USING (auth.uid() = user_id);
