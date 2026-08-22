'use client';

import { useState, useFormStatus } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
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

  const handleSchoolProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSchoolProfile(prev => ({
      ...schoolProfile,
      [name]: type === 'number' && value !== '' ? Number(value) : value
    }));
  };

  const handleInfrastructureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInfrastructure(prev => ({
      ...infrastructure,
      [name]: type === 'number' && value !== '' ? Number(value) : value
    }));
  };

  const handleTeacherReadinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeacherReadiness(prev => ({
      ...teacherReadiness,
      [name]: value
    }));
  };

  const handleSchoolManagementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSchoolManagement(prev => ({
      ...schoolManagement,
      [name]: value
    }));
  };

  const handleLearningRequirementsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLearningRequirements(prev => ({
      ...learningRequirements,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // In a real implementation, we would get the school ID from auth context
      // For MVP, we'll generate a temporary ID or use a demo school
      const schoolId = 'demo-school-' + Date.now();

      // Create school profile
      const schoolData: SchoolProfile = {
        id: schoolId,
        ...schoolProfile,
        studentCount: schoolProfile.studentCount || 0,
        teacherCount: schoolProfile.teacherCount || 0,
        gradeLevels: schoolProfile.gradeLevels ? Array.isArray(schoolProfile.gradeLevels) ? schoolProfile.gradeLevels : [schoolProfile.gradeLevels] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { error: schoolError } = await supabase
        .from('school_profiles')
        .upsert(schoolData);

      if (schoolError) throw schoolError;

      // Create infrastructure assessment
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

      const { error: infraError } = await supabase
        .from('infrastructure_assessments')
        .upsert(infraData);

      if (infraError) throw infraError;

      // Create teacher readiness assessment
      const teacherData: TeacherReadinessAssessment = {
        id: 'teacher-' + Date.now(),
        schoolId,
        digitalSkills: teacherReadiness.digitalSkills || 'fair',
        previousTechnologyUsage: teacherReadiness.previousTechnologyUsage || 'limited',
        trainingAvailability: teacherReadings.trainingAvailability || 'fair',
        confidenceUsingTechnology: teacherReadiness.confidenceUsingTechnology || 'fair',
        createdAt: new Date().toISOString()
      };

      const { error: teacherError } = await supabase
        .from('teacher_readiness_assessments')
        .upsert(teacherData);

      if (teacherError) throw teacherError;

      // Create school management assessment
      const managementData: SchoolManagementAssessment = {
        id: 'management-' + Date.now(),
        schoolId,
        technologyStrategy: schoolManagement.technologyStrategy || 'fair',
        leadershipSupport: schoolManagement.leadershipSupport || 'fair',
        budgetPlanning: schoolManagement.budgetPlanning || 'fair',
        implementationReadiness: schoolManagement.implementationReadiness || 'fair',
        createdAt: new Date().toISOString()
      };

      const { error: managementError } = await supabase
        .from('school_management_assessments')
        .upsert(managementData);

      if (managementError) throw managementError;

      // Create learning requirements assessment
      const learningData: LearningRequirementsAssessment = {
        id: 'learning-' + Date.now(),
        schoolId,
        subject: learningRequirements.subject || '',
        grade: learningRequirements.grade || '',
        learningGoals: learningRequirements.learningGoals || '',
        currentChallenges: learningRequirements.currentChallenges || '',
        createdAt: new Date().toISOString()
      };

      const { error: learningError } = await supabase
        .from('learning_requirements_assessments')
        .upsert(learningData);

      if (learningError) throw learningError;

      setSuccessMessage('Assessment submitted successfully! You can now view recommendations.');
      // Reset form after successful submission
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
          {/* School Profile Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">School Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  name="name"
                  value={schoolProfile.name || ''}
                  onChange={handleSchoolProfileChange}
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
                  onChange={handleSchoolProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
                <select
                  name="schoolType"
                  value={schoolProfile.schoolType || ''}
                  onChange={handleSchoolProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select school type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="ngo">NGO/Non-profit</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Count</label>
                <input
                  type="number"
                  name="studentCount"
                  value={schoolProfile.studentCount || ''}
                  onChange={handleSchoolProfileChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Levels</label>
                <input
                  type="text"
                  name="gradeLevels"
                  placeholder="e.g., 1-5, 6-8, 9-12"
                  value={schoolProfile.gradeLevels || ''}
                  onChange={handleSchoolProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Count</label>
                <input
                  type="number"
                  name="teacherCount"
                  value={schoolProfile.teacherCount || ''}
                  onChange={handleSchoolProfileChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Technology Usage</label>
                <input
                  type="text"
                  name="currentTechnologyUsage"
                  value={schoolProfile.currentTechnologyUsage || ''}
                  onChange={handleSchoolProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Infrastructure Assessment */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Infrastructure Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Devices</label>
                <input
                  type="number"
                  name="deviceCount"
                  value={infrastructure.deviceCount || ''}
                  onChange={handleInfrastructureChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Availability</label>
                <select
                  name="deviceAvailability"
                  value={infrastructure.deviceAvailability || ''}
                  onChange={handleInfrastructureChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select availability</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internet Quality</label>
                <select
                  name="internetQuality"
                  value={infrastructure.internetQuality || ''}
                  onChange={handleInfrastructureChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select quality</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technical Support</label>
                <select
                  name="technicalSupport"
                  value={infrastructure.technicalSupport || ''}
                  onChange={handleInfrastructureChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select support level</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
          </section>

          {/* Teacher Readiness Assessment */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Teacher Readiness Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Digital Skills</label>
                <select
                  name="digitalSkills"
                  value={teacherReadiness.digitalSkills || ''}
                  onChange={handleTeacherReadinessChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select skill level</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Technology Usage</label>
                <select
                  name="previousTechnologyUsage"
                  value={teacherReadiness.previousTechnologyUsage || ''}
                  onChange={handleTeacherReadinessChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select usage level</option>
                  <option value="extensive">Extensive</option>
                  <option value="moderate">Moderate</option>
                  <option value="limited">Limited</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Training Availability</label>
                <select
                  name="trainingAvailability"
                  value={teacherReadiness.trainingAvailability || ''}
                  onChange={handleTeacherReadinessChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select availability</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confidence Using Technology</label>
                <select
                  name="confidenceUsingTechnology"
                  value={teacherReadiness.confidenceUsingTechnology || ''}
                  onChange={handleTeacherReadinessChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select confidence level</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
          </section>

          {/* School Management Assessment */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">School Management Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technology Strategy</label>
                <select
                  name="technologyStrategy"
                  value={schoolManagement.technologyStrategy || ''}
                  onChange={handleSchoolManagementChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select strategy level</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leadership Support</label>
                <select
                  name="leadershipSupport"
                  value={schoolManagement.leadershipSupport || ''}
                  onChange={handleSchoolManagementChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select support level</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Planning</label>
                <select
                  name="budgetPlanning"
                  value={schoolManagement.budgetPlanning || ''}
                  onChange={handleSchoolManagementChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select planning level</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Implementation Readiness</label>
                <select
                  name="implementationReadiness"
                  value={schoolManagement.implementationReadiness || ''}
                  onChange={handleSchoolManagementChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select readiness level</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option