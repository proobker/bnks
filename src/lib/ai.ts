// AI explanation layer for EduFit Nepal
// Generates human-readable explanations and implementation roadmaps from compatibility scores
// Template-based initially, designed for easy LLM integration (Gemini/NVIDIA API) later
import type {
  SchoolProfile,
  InfrastructureAssessment,
  TeacherReadinessAssessment,
  SchoolManagementAssessment,
  LearningRequirementsAssessment,
  StudentSurvey,
  EdTechTool,
  CompatibilityResult,
  ExplanationResult
} from './types';

/**
 * Generate human-readable explanation of compatibility results
 * Uses templated responses based on score ranges and identified problems
 */
export const generateExplanation = (
  school: SchoolProfile,
  tool: EdTechTool,
  result: CompatibilityResult
): string => {
  const { compatibilityScore, problems, details } = result;

  // Start with basic assessment
  let explanation = `${school.name}'s readiness for "${tool.name}": ${compatibilityScore}% compatibility. `;

  // Add score interpretation
  if (compatibilityScore >= 80) {
    explanation += 'This is an excellent match for your school\'s current capabilities and infrastructure. ';
  } else if (compatibilityScore >= 60) {
    explanation += 'This is a good match that would work well with some preparation. ';
  } else if (compatibilityScore >= 40) {
    explanation += 'This is a moderate match that would require some improvements before implementation. ';
  } else {
    explanation += 'This is a poor match that would require significant improvements before consideration. ';
  }

  // Add dimension-specific insights
  explanation += `Breakdown: Infrastructure (${details.infrastructureScore}%), Teacher Readiness (${details.teacherReadinessScore}%), `;
  explanation += `School Management (${details.schoolManagementScore}%), Learning Requirements (${details.learningRequirementsScore}%), `;
  explanation += `Student Access (${details.studentAccessScore}%). `;

  // Add problem-specific explanations
  if (problems.length > 0) {
    explanation += 'Key challenges identified: ';
    explanation += problems.join(', ') + '. ';

    // Add specific advice based on problems
    if (problems.includes('Device shortage')) {
      explanation += 'Consider implementing device-sharing stations or seeking grants for additional hardware. ';
    }

    if (problems.includes('Internet requirement too high')) {
      explanation += 'Look for offline-capable versions or plan for improved connectivity before implementation. ';
    }

    if (problems.includes('Teacher training gap')) {
      explanation += 'Invest in targeted professional development to build teacher confidence with similar technologies. ';
    }

    if (problems.includes('Limited student device access')) {
      explanation += 'Focus on classroom-based implementation rather than models requiring home device access. ';
    }
  } else {
    explanation += 'No significant barriers identified. ';
  }

  // Add tool-specific context
  explanation += `The ${tool.name} is best suited for ${tool.bestFor.join(', ')}. `;

  // Add final recommendation
  explanation += result.recommendation;

  return explanation;
};

/**
 * Generate 90-day implementation roadmap based on readiness score and gaps
 * Returns month-by-month actionable steps
 */
export const generateImplementationPlan = (
  school: SchoolProfile,
  tool: EdTechTool,
  result: CompatibilityResult
): ExplanationResult['implementationPlan'] => {
  const { compatibilityScore, problems } = result;
  const plan: ExplanationResult['implementationPlan'] = {
    month1: [],
    month2: [],
    month3: []
  };

  // Month 1: Foundation and preparation
  if (compatibilityScore >= 80) {
    plan.month1 = [
      'Conduct baseline assessment of current technology usage',
      'Form implementation committee with teachers, IT staff, and administrators',
      'Schedule initial teacher orientation session'
    ];
  } else if (compatibilityScore >= 60) {
    plan.month1 = [
      'Address critical infrastructure gaps identified in assessment',
      'Begin teacher awareness workshops on similar technologies',
      'Develop detailed implementation timeline and resource plan'
    ];
  } else if (compatibilityScore >= 40) {
    plan.month1 = [
      'Focus on resolving device and internet accessibility issues',
      'Start basic digital literacy training for teachers',
      'Explore alternative lower-requirement technologies as interim solutions'
    ];
  } else {
    plan.month1 = [
      'Conduct comprehensive needs assessment with all stakeholders',
      'Develop technology improvement plan focusing on priority gaps',
      'Research and identify more suitable technology alternatives'
    ];
  }

  // Month 2: Pilot and testing
  if (compatibilityScore >= 80) {
    plan.month2 = [
      'Launch small-scale pilot with volunteer teachers (5-10% of staff)',
      'Establish technical support protocols and feedback mechanisms',
      'Begin integrating tool into lesson planning for pilot group'
    ];
  } else if (compatibilityScore >= 60) {
    plan.month2 = [
      'Implement recommended infrastructure improvements',
      'Begin teacher training on specific tool functionality',
      'Prepare pilot classroom(s) for technology integration'
    ];
  } else if (compatibilityScore >= 40) {
    plan.month2 = [
      'Continue infrastructure improvements based on Month 1 progress',
      'Launch technology familiarity program for interested teachers',
      'Develop contingency plans for technology-dependent activities'
    ];
  } else {
    plan.month2 = [
      'Implement foundational technology improvements (devices, connectivity)',
      'Begin mandatory digital literacy training for all teaching staff',
      'Re-evaluate technology selection based on improved readiness'
    ];
  }

  // Month 3: Expansion and evaluation
  if (compatibilityScore >= 80) {
    plan.month3 = [
      'Expand implementation to additional teachers and classrooms',
      'Collect and analyze pilot data for effectiveness and user feedback',
      'Develop scaling plan for school-wide implementation'
    ];
  } else if (compatibilityScore >= 60) {
    plan.month3 = [
      'Launch expanded pilot with 25-50% of teaching staff',
      'Begin regular assessment of technology integration effectiveness',
      'Adjust implementation plan based on pilot feedback'
    ];
  } else if (compatibilityScore >= 40) {
    plan.month3 = [
      'Assess readiness for technology pilot based on Month 1-2 improvements',
      'If ready, launch limited pilot with appropriate support structures',
      'Continue infrastructure development for Long-term technology goals'
    ];
  } else {
    plan.month3 = [
      'Evaluate progress on foundational technology improvements',
      'Determine readiness for technology pilot in next 3-6 months',
      'Update technology plan based on current capabilities and constraints'
    ];
  }

  // Add tool-specific adjustments to the plan
  if (!tool.offlineCapable && problems.includes('Internet requirement too high')) {
    // Add connectivity-specific steps
    plan.month1.push('Investigate connectivity improvement options with local providers');
    plan.month2.push('Explore grant opportunities for infrastructure upgrades');
  }

  if (tool.requiresTraining && problems.includes('Teacher training gap')) {
    // Add training-specific steps
    plan.month1.push('Identify internal technology champions for peer training');
    plan.month2.push('Schedule hands-on workshops with technology vendor or experts');
    plan.month3.push('Establish ongoing professional development calendar');
  }

  return plan;
};

/**
 * Generate complete explanation result including both narrative and roadmap
 */
export const generateExplanationResult = (
  school: SchoolProfile,
  tool: EdTechTool,
  compatibilityResult: CompatibilityResult
): ExplanationResult => {
  return {
    compatibilityResult,
    explanation: generateExplanation(school, tool, compatibilityResult),
    implementationPlan: generateImplementationPlan(school, tool, compatibilityResult),
    generatedAt: new Date().toISOString()
  };
};

// Template responses for different score ranges (can be replaced with LLM later)
const scoreRangeTemplates = {
  excellent: (schoolName: string, toolName: string) =>
    `${schoolName} shows strong readiness for implementing ${toolName}. The school has adequate infrastructure, teacher capabilities, and student access to support successful adoption.`,

  good: (schoolName: string, toolName: string) =>
    `${schoolName} is moderately ready for ${toolName} implementation. Some preparation in specific areas would ensure successful adoption.`,

  moderate: (schoolName: string, toolName: string) =>
    `${schoolName} has limited readiness for ${toolName} at this time. Significant preparation would be needed before considering implementation.`,

  poor: (schoolName: string, toolName: string) =>
    `${schoolName} currently lacks the necessary infrastructure and readiness for ${toolName} implementation. Consider addressing fundamental gaps first.`
};

export default { generateExplanation, generateImplementationPlan, generateExplanationResult };