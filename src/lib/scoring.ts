// Rule-based compatibility scoring engine for EduFit Nepal
// Implements deterministic algorithms to calculate EdTech tool compatibility percentages
import type {
  SchoolProfile,
  InfrastructureAssessment,
  TeacherReadinessAssessment,
  SchoolManagementAssessment,
  LearningRequirementsAssessment,
  StudentSurvey,
  EdTechTool,
  CompatibilityResult
} from './types';

/**
 * Calculate normalized score (0-100) from assessment data
 */
const normalizeScore = (value: number, min: number, max: number): number => {
  if (max === min) return 50; // Avoid division by zero
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

/**
 * Convert categorical assessments to numerical scores (0-100 scale)
 */
const categoricalToScore = (value: string): number => {
  const mapping: Record<string, number> = {
    'excellent': 100,
    'good': 75,
    'fair': 50,
    'poor': 25,
    'extensive': 100,
    'moderate': 75,
    'limited': 25,
    'none': 0,
    'always': 100,
    'sometimes': 50,
    'never': 0
  };

  return mapping[value.toLowerCase()] || 50; // Default to middle value
};

/**
 * Calculate infrastructure score (0-100)
 * Based on device count, student/device ratio, device availability, internet quality, technical support
 */
export const calculateInfrastructureScore = (
  infra: InfrastructureAssessment,
  studentCount: number
): number => {
  // Device availability component (0-40 points)
  const deviceScore = categoricalToScore(infra.deviceAvailability) * 0.4;

  // Student/device ratio component (0-30 points)
  // Ideal ratio is 1:1, worse ratios get lower scores
  const idealRatio = 1;
  const ratioScore = Math.max(0, 100 - ((infra.studentDeviceRatio - idealRatio) / idealRatio) * 50) * 0.3;

  // Internet quality component (0-20 points)
  const internetScore = categoricalToScore(infra.internetQuality) * 0.2;

  // Technical support component (0-10 points)
  const supportScore = categoricalToScore(infra.technicalSupport) * 0.1;

  return Math.min(100, deviceScore + ratioScore + internetScore + supportScore);
};

/**
 * Calculate teacher readiness score (0-100)
 * Based on digital skills, previous usage, training availability, confidence
 */
export const calculateTeacherReadinessScore = (
  readiness: TeacherReadinessAssessment
): number => {
  const skillsScore = categoricalToScore(readiness.digitalSkills) * 0.25;
  const usageScore = categoricalToScore(readiness.previousTechnologyUsage) * 0.25;
  const trainingScore = categoricalToScore(readiness.trainingAvailability) * 0.25;
  const confidenceScore = categoricalToScore(readiness.confidenceUsingTechnology) * 0.25;

  return Math.min(100, skillsScore + usageScore + trainingScore + confidenceScore);
};

/**
 * Calculate school management score (0-100)
 * Based on technology strategy, leadership support, budget planning, implementation readiness
 */
export const calculateSchoolManagementScore = (
  management: SchoolManagementAssessment
): number => {
  const strategyScore = categoricalToScore(management.technologyStrategy) * 0.25;
  const leadershipScore = categoricalToScore(management.leadershipSupport) * 0.25;
  const budgetScore = categoricalToScore(management.budgetPlanning) * 0.25;
  const implementationScore = categoricalToScore(management.implementationReadiness) * 0.25;

  return Math.min(100, strategyScore + leadershipScore + budgetScore + implementationScore);
};

/**
 * Calculate learning requirements score (0-100)
 * For MVP, we'll use a simplified approach based on goal clarity and challenge awareness
 */
export const calculateLearningRequirementsScore = (
  requirements: LearningRequirementsAssessment
): number => {
  // Simple heuristic: longer, more detailed goals and challenges indicate better awareness
  const goalsDetailScore = Math.min(100, requirements.learningGoals.length * 2);
  const challengesDetailScore = Math.min(100, requirements.currentChallenges.length * 2);

  return (goalsDetailScore + challengesDetailScore) / 2;
};

/**
 * Calculate student access score (0-100)
 * Based on device ownership and internet availability from student surveys
 */
export const calculateStudentAccessScore = (
  surveys: StudentSurvey[]
): number => {
  if (surveys.length === 0) return 50; // Default middle value when no data

  // Device ownership scoring
  const deviceScores: Record<string, number> = {
    laptop: 100,
    phone: 75,
    shared: 50,
    none: 0
  };

  const deviceScoreAvg = surveys.reduce((sum, survey) => {
    return sum + deviceScores[survey.deviceOwnership];
  }, 0) / surveys.length;

  // Internet availability scoring
  const internetScores: Record<string, number> = {
    always: 100,
    sometimes: 50,
    never: 0
  };

  const internetScoreAvg = surveys.reduce((sum, survey) => {
    return sum + internetScores[survey.internetAvailability];
  }, 0) / surveys.length;

  // Weighted average (60% device, 40% internet)
  return deviceScoreAvg * 0.6 + internetScoreAvg * 0.4;
};

/**
 * Calculate overall school readiness score (0-100)
 * Weighted average of all assessment dimensions
 */
export const calculateSchoolReadinessScore = (
  school: SchoolProfile,
  infrastructure: InfrastructureAssessment,
  teacherReadiness: TeacherReadinessAssessment,
  schoolManagement: SchoolManagementAssessment,
  learningRequirements: LearningRequirementsAssessment,
  studentSurveys: StudentSurvey[]
): number => {
  const infraScore = calculateInfrastructureScore(infrastructure, school.studentCount);
  const teacherScore = calculateTeacherReadinessScore(teacherReadiness);
  const managementScore = calculateSchoolManagementScore(schoolManagement);
  const learningScore = calculateLearningRequirementsScore(learningRequirements);
  const studentScore = calculateStudentAccessScore(studentSurveys);

  // Weighted average: Infrastructure (30%), Teacher (25%), Management (20%), Learning (15%), Student (10%)
  return (
    infraScore * 0.3 +
    teacherScore * 0.25 +
    managementScore * 0.2 +
    learningScore * 0.15 +
    studentScore * 0.1
  );
};

/**
 * Calculate compatibility between school readiness and EdTech tool requirements
 * Returns compatibility percentage (0-100) and identifies specific problems
 */
export const calculateCompatibility = (
  school: SchoolProfile,
  infrastructure: InfrastructureAssessment,
  teacherReadiness: TeacherReadinessAssessment,
  schoolManagement: SchoolManagementAssessment,
  learningRequirements: LearningRequirementsAssessment,
  studentSurveys: StudentSurvey[],
  tool: EdTechTool
): CompatibilityResult => {
  // Calculate dimension scores
  const infraScore = calculateInfrastructureScore(infrastructure, school.studentCount);
  const teacherScore = calculateTeacherReadinessScore(teacherReadiness);
  const managementScore = calculateSchoolManagementScore(schoolManagement);
  const learningScore = calculateLearningRequirementsScore(learningRequirements);
  const studentScore = calculateStudentAccessScore(studentSurveys);

  // Overall readiness score
  const readinessScore = calculateSchoolReadinessScore(
    school, infrastructure, teacherReadiness, schoolManagement, learningRequirements, studentSurveys
  );

  // Calculate tool-specific compatibility
  // Device compatibility: how well school device readiness meets tool requirements
  const deviceCompatibility = Math.max(0, 100 - Math.abs(infraScore - (tool.deviceRequirement * 20))) * 0.4;

  // Internet compatibility: how well school internet readiness meets tool requirements
  const internetCompatibility = Math.max(0, 100 - Math.abs(
    (infraScore * 0.5 + studentScore * 0.5) - (tool.internetRequirement * 20)
  )) * 0.3;

  // Teacher readiness compatibility
  const teacherCompatibility = Math.max(0, 100 - Math.abs(teacherScore - 75)) * 0.2; // Assuming 75 is target for teacher readiness

  // Overall compatibility score
  let compatibilityScore = deviceCompatibility + internetCompatibility + teacherCompatibility;

  // Apply minimum thresholds - if school doesn't meet basic requirements, heavily penalize
  if (infraScore < tool.minDeviceScore * 20) {
    compatibilityScore *= 0.5; // 50% penalty for insufficient devices
  }

  const internetAvailabilityScore = (infraScore * 0.5 + studentScore * 0.5);
  if (internetAvailabilityScore < tool.minInternetScore * 20) {
    compatibilityScore *= 0.5; // 50% penalty for insufficient internet
  }

  compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));

  // Identify specific problems
  const problems: string[] = [];

  if (infraScore < tool.minDeviceScore * 20) {
    problems.push('Device shortage');
  }

  if (internetAvailabilityScore < tool.minInternetScore * 20) {
    problems.push('Internet requirement too high');
  }

  if (teacherScore < 50) {
    problems.push('Teacher training gap');
  }

  if (studentScore < 50) {
    problems.push('Limited student device access');
  }

  // Generate recommendation based on problems and score
  let recommendation = '';

  if (compatibilityScore >= 80) {
    recommendation = 'This tool is well-suited for your school environment.';
  } else if (compatibilityScore >= 60) {
    recommendation = 'Consider this tool with some preparatory work.';
  } else if (compatibilityScore >= 40) {
    recommendation = 'Start with offline or classroom-based tools before implementing this solution.';
  } else {
    recommendation = 'This tool requires significant improvements in infrastructure or readiness before implementation.';
  }

  // Add specific recommendations based on problems
  if (problems.includes('Device shortage')) {
    recommendation += ' Consider device-sharing models or seek additional hardware resources.';
  }

  if (problems.includes('Internet requirement too high')) {
    recommendation += ' Look for offline-capable alternatives or improve connectivity first.';
  }

  if (problems.includes('Teacher training gap')) {
    recommendation += ' Invest in teacher professional development before implementation.';
  }

  if (problems.includes('Limited student device access')) {
    recommendation += ' Focus on classroom-based implementation rather than homework-dependent models.';
  }

  return {
    schoolId: school.id,
    toolId: tool.id,
    compatibilityScore: Math.round(compatibilityScore),
    problems,
    recommendation: recommendation.trim(),
    details: {
      infrastructureScore: Math.round(infraScore),
      teacherReadinessScore: Math.round(teacherScore),
      schoolManagementScore: Math.round(managementScore),
      learningRequirementsScore: Math.round(learningScore),
      studentAccessScore: Math.round(studentScore)
    },
    calculatedAt: new Date().toISOString()
  };
};

// Predefined EdTech tools database for MVP
export const edTechTools: EdTechTool[] = [
  {
    id: 'ai-tutor',
    name: 'AI Tutor',
    description: 'Adaptive learning platform with personalized AI tutoring',
    deviceRequirement: 5, // High device requirement
    internetRequirement: 5, // High internet requirement
    teacherMonitoringNeeded: true,
    requiresTraining: true,
    offlineCapable: false,
    bestFor: ['Personalized practice', 'Remediation', 'Advanced learners'],
    minDeviceScore: 4, // Needs at least 4/5 device availability
    minInternetScore: 4 // Needs at least 4/5 internet quality
  },
  {
    id: 'offline-platform',
    name: 'Offline Learning Platform',
    description: 'Downloadable content for learning without constant internet',
    deviceRequirement: 3, // Medium device requirement
    internetRequirement: 2, // Low internet requirement
    teacherMonitoringNeeded: true,
    requiresTraining: false,
    offlineCapable: true,
    bestFor: ['Low-resource environments', 'Homework', 'Remote areas'],
    minDeviceScore: 2, // Needs at least 2/5 device availability
    minInternetScore: 1 // Can work with minimal internet
  },
  {
    id: 'classroom-digital',
    name: 'Classroom Digital Learning',
    description: 'Teacher-led digital lessons for classroom instruction',
    deviceRequirement: 2, // Low-Medium device requirement (shared devices ok)
    internetRequirement: 3, // Medium internet requirement
    teacherMonitoringNeeded: true,
    requiresTraining: true,
    offlineCapable: true,
    bestFor: ['Classroom instruction', 'Group activities', 'Teacher-guided learning'],
    minDeviceScore: 2, // Needs at least 2/5 device availability
    minInternetScore: 2 // Needs at least 2/5 internet quality
  },
  {
    id: 'lms-basic',
    name: 'Basic Learning Management System',
    description: 'Simple platform for posting assignments and collecting work',
    deviceRequirement: 3, // Medium device requirement
    internetRequirement: 4, // High-Medium internet requirement
    teacherMonitoringNeeded: true,
    requiresTraining: true,
    offlineCapable: false,
    bestFor: ['Assignment distribution', 'Grade tracking', 'Parent communication'],
    minDeviceScore: 3, // Needs at least 3/5 device availability
    minInternetScore: 3 // Needs at least 3/5 internet quality
  }
];

// Helper function to get compatibility scores for all tools
export const getAllToolCompatibility = (
  school: SchoolProfile,
  infrastructure: InfrastructureAssessment,
  teacherReadiness: TeacherReadinessAssessment,
  schoolManagement: SchoolManagementAssessment,
  learningRequirements: LearningRequirementsAssessment,
  studentSurveys: StudentSurvey[]
): CompatibilityResult[] => {
  return edTechTools.map(tool =>
    calculateCompatibility(
      school, infrastructure, teacherReadiness, schoolManagement, learningRequirements, studentSurveys, tool
    )
  ).sort((a, b) => b.compatibilityScore - a.compatibilityScore); // Sort by score descending
};