// TypeScript schemas for EduFit Nepal MVP

export interface SchoolProfile {
  id: string;
  name: string;
  location: string;
  schoolType: 'public' | 'private' | 'ngo' | 'other';
  studentCount: number;
  gradeLevels: string[]; // e.g., ['1-5', '6-8', '9-12']
  teacherCount: number;
  currentTechnologyUsage: string;
  createdAt: string;
  updatedAt: string;
}

export interface InfrastructureAssessment {
  id: string;
  schoolId: string;
  deviceCount: number;
  studentDeviceRatio: number; // students per device
  deviceAvailability: 'excellent' | 'good' | 'fair' | 'poor';
  internetQuality: 'excellent' | 'good' | 'fair' | 'poor';
  technicalSupport: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: string;
}

export interface TeacherReadinessAssessment {
  id: string;
  schoolId: string;
  digitalSkills: 'excellent' | 'good' | 'fair' | 'poor';
  previousTechnologyUsage: 'extensive' | 'moderate' | 'limited' | 'none';
  trainingAvailability: 'excellent' | 'good' | 'fair' | 'poor';
  confidenceUsingTechnology: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: string;
}

export interface SchoolManagementAssessment {
  id: string;
  schoolId: string;
  technologyStrategy: 'excellent' | 'good' | 'fair' | 'poor';
  leadershipSupport: 'excellent' | 'good' | 'fair' | 'poor';
  budgetPlanning: 'excellent' | 'good' | 'fair' | 'poor';
  implementationReadiness: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: string;
}

export interface LearningRequirementsAssessment {
  id: string;
  schoolId: string;
  subject: string;
  grade: string;
  learningGoals: string;
  currentChallenges: string;
  createdAt: string;
}

export interface StudentSurvey {
  id: string;
  schoolId: string;
  studentId: string;
  deviceOwnership: 'laptop' | 'phone' | 'shared' | 'none';
  internetAvailability: 'always' | 'sometimes' | 'never';
  learningPreferences: string; // comma-separated or JSON string
  digitalConfidence: 'excellent' | 'good' | 'fair' | 'poor';
  accessLimitations: string; // comma-separated or JSON string
  createdAt: string;
}

// EdTech tool requirements
export interface EdTechTool {
  id: string;
  name: string;
  description: string;
  // Requirements (scored 0-5, where 5 is highest requirement)
  deviceRequirement: number; // 1-5 scale
  internetRequirement: number; // 1-5 scale
  teacherMonitoringNeeded: boolean;
  requiresTraining: boolean;
  offlineCapable: boolean;
  bestFor: string[]; // e.g., ['Personalized practice', 'Remediation']
  // Compatibility thresholds
  minDeviceScore: number; // minimum device availability score needed
  minInternetScore: number; // minimum internet quality score needed
}

export interface CompatibilityResult {
  schoolId: string;
  toolId: string;
  compatibilityScore: number; // 0-100
  problems: string[]; // identified issues
  recommendation: string; // actionable advice
  details: {
    infrastructureScore: number;
    teacherReadinessScore: number;
    schoolManagementScore: number;
    learningRequirementsScore: number;
    studentAccessScore: number;
  };
  calculatedAt: string;
}

export interface ExplanationResult {
  compatibilityResult: CompatibilityResult;
  explanation: string; // human-readable explanation
  implementationPlan: {
    month1: string[];
    month2: string[];
    month3: string[];
  }; // 90-day roadmap
  generatedAt: string;
}