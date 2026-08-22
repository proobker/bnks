'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import type {
  SchoolProfile,
  InfrastructureAssessment,
  TeacherReadinessAssessment,
  SchoolManagementAssessment,
  LearningRequirementsAssessment
} from '@/lib/types';

export default function AssessmentPage() {
  const [schoolProfile, setSchoolProfile] = useState<Partial<SchoolProfile>>({});
  const [infrastructure, setInfrastructure] = useState<Partial<InfrastructureAssessment>>({});
  const [teacherReadiness, setTeacherReadiness] = useState<Partial<TeacherReadinessAssessment>>({});
  const [schoolManagement, setSchoolManagement] = useState<Partial<SchoolManagementAssessment>>({});
  const [learningRequirements, setLearningRequirements] = useState<Partial<LearningRequirementsAssessment>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();
  const { pending } = useFormStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const schoolId = 'demo-school-' + Date.now();

      const schoolData: SchoolProfile = {
        id: schoolId,
        name: schoolProfile.name || '',
        location: schoolProfile.location || '',
        schoolType: schoolProfile.schoolType || 'public',
        studentCount: schoolProfile.studentCount || 0,
        gradeLevels: Array.isArray(schoolProfile.gradeLevels) ? schoolProfile.gradeLevels : [],
        teacherCount: schoolProfile.teacherCount || 0,
        currentTechnologyUsage: schoolProfile.currentTechnologyUsage || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await supabase.from('school_profiles').upsert(schoolData);

      const infraData: InfrastructureAssessment = {
        id: 'infra-' + Date.now(),
        schoolId,
        deviceCount: infrastructure.deviceCount || 0,
        studentDeviceRatio: infrastructure.deviceCount && schoolProfile.studentCount
          ? schoolProfile.studentCount / infrastructure.deviceCount
          : 0,
        deviceAvailability: infrastructure.deviceAvailability || 'fair',
        internetQuality: infrastructure.internetQuality || 'fair',
        technicalSupport: infrastructure.technicalSupport || 'fair',
        createdAt: new Date().toISOString()
      };

      await supabase.from('infrastructure_assessments').upsert(infraData);

      const teacherData: TeacherReadinessAssessment = {
        id: 'teacher-' + Date.now(),
        schoolId,
        digitalSkills: teacherReadiness.digitalSkills || 'fair',
        previousTechnologyUsage: teacherReadiness.previousTechnologyUsage || 'limited',
        trainingAvailability: teacherReadiness.trainingAvailability || 'fair',
        confidenceUsingTechnology: teacherReadiness.confidenceUsingTechnology || 'fair',
        createdAt: new Date().toISOString()
      };

      await supabase.from('teacher_readiness_assessments').upsert(teacherData);

      const managementData: SchoolManagementAssessment = {
        id: 'management-' + Date.now(),
        schoolId,
        technologyStrategy: schoolManagement.technologyStrategy || 'fair',
        leadershipSupport: schoolManagement.leadershipSupport || 'fair',
        budgetPlanning: schoolManagement.budgetPlanning || 'fair',
        implementationReadiness: schoolManagement.implementationReadiness || 'fair',
        createdAt: new Date().toISOString()
      };

      await supabase.from('school_management_assessments').upsert(managementData);

      const learningData: LearningRequirementsAssessment = {
        id: 'learning-' + Date.now(),
        schoolId,
        subject: learningRequirements.subject || '',
        grade: learningRequirements.grade || '',
        learningGoals: learningRequirements.learningGoals || '',
        currentChallenges: learningRequirements.currentChallenges || '',
        createdAt: new Date().toISOString()
      };

      await supabase.from('learning_requirements_assessments').upsert(learningData);

      setSuccessMessage('Assessment submitted successfully! You can now view recommendations.');
      setSchoolProfile({});
      setInfrastructure({});
      setTeacherReadiness({});
      setSchoolManagement({});
      setLearningRequirements({});
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      setErrorMessage('Failed to submit assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute role="teacher">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">School Readiness Assessment</h1>
          <p className="text-gray-600 mb-8">
            Help us understand your school's technology readiness to provide personalized EdTech recommendations.
          </p>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">School Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    name="name"
                    value={schoolProfile.name || ''}
                    onChange={(e) => setSchoolProfile({...schoolProfile, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={schoolProfile.location || ''}
                    onChange={(e) => setSchoolProfile({...schoolProfile, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Infrastructure Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Devices</label>
                  <input
                    type="number"
                    name="deviceCount"
                    value={infrastructure.deviceCount || ''}
                    onChange={(e) => setInfrastructure({...infrastructure, deviceCount: Number(e.target.value) || 0})}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Availability</label>
                  <select
                    name="deviceAvailability"
                    value={infrastructure.deviceAvailability || ''}
                    onChange={(e) => setInfrastructure({...infrastructure, deviceAvailability: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select availability</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Teacher Readiness Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Digital Skills</label>
                  <select
                    name="digitalSkills"
                    value={teacherReadiness.digitalSkills || ''}
                    onChange={(e) => setTeacherReadiness({...teacherReadiness, digitalSkills: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select skill level</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">School Management Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technology Strategy</label>
                  <select
                    name="technologyStrategy"
                    value={schoolManagement.technologyStrategy || ''}
                    onChange={(e) => setSchoolManagement({...schoolManagement, technologyStrategy: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select strategy level</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Learning Requirements Assessment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={learningRequirements.subject || ''}
                    onChange={(e) => setLearningRequirements({...learningRequirements, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                disabled={pending || isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {pending ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}