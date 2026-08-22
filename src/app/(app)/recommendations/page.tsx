'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { getAllToolCompatibility, edTechTools } from '@/lib/scoring';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import type {
  SchoolProfile,
  InfrastructureAssessment,
  TeacherReadinessAssessment,
  SchoolManagementAssessment,
  LearningRequirementsAssessment,
  StudentSurvey,
  CompatibilityResult
} from '@/lib/types';

export default function RecommendationsPage() {
  const [schoolData, setSchoolData] = useState<{
    profile: SchoolProfile | null;
    infrastructure: InfrastructureAssessment | null;
    teacherReadiness: TeacherReadinessAssessment | null;
    schoolManagement: SchoolManagementAssessment | null;
    learningRequirements: LearningRequirementsAssessment | null;
    studentSurveys: StudentSurvey[];
  }>({
    profile: null,
    infrastructure: null,
    teacherReadiness: null,
    schoolManagement: null,
    learningRequirements: null,
    studentSurveys: []
  });
  const [compatibilityResults, setCompatibilityResults] = useState<CompatibilityResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  const demoSchoolId = 'demo-school-12345';

  useEffect(() => {
    setSchoolId(demoSchoolId);
    fetchSchoolData();
  }, []);

  const fetchSchoolData = async () => {
    if (!schoolId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from('school_profiles')
        .select('*')
        .eq('id', schoolId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      const { data: infraData, error: infraError } = await supabase
        .from('infrastructure_assessments')
        .select('*')
        .eq('schoolId', schoolId)
        .single();

      if (infraError && infraError.code !== 'PGRST116') throw infraError;

      const { data: teacherData, error: teacherError } = await supabase
        .from('teacher_readiness_assessments')
        .select('*')
        .eq('schoolId', schoolId)
        .single();

      if (teacherError && teacherError.code !== 'PGRST116') throw teacherError;

      const { data: managementData, error: managementError } = await supabase
        .from('school_management_assessments')
        .select('*')
        .eq('schoolId', schoolId)
        .single();

      if (managementError && managementError.code !== 'PGRST116') throw managementError;

      const { data: learningData, error: learningError } = await supabase
        .from('learning_requirements_assessments')
        .select('*')
        .eq('schoolId', schoolId)
        .single();

      if (learningError && learningError.code !== 'PGRST116') throw learningError;

      const { data: surveysData, error: surveysError } = await supabase
        .from('student_surveys')
        .select('*')
        .eq('schoolId', schoolId);

      if (surveysError && surveysError.code !== 'PGRST116') throw surveysError;

      setSchoolData({
        profile: profileData || null,
        infrastructure: infraData || null,
        teacherReadiness: teacherData || null,
        schoolManagement: managementData || null,
        learningRequirements: learningData || null,
        studentSurveys: surveysData || []
      });

    } catch (err: any) {
      console.error('Error fetching school data:', err);
      setError('Failed to load school data. Please make sure assessments have been submitted.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { profile, infrastructure, teacherReadiness, schoolManagement, learningRequirements, studentSurveys } = schoolData;

    if (profile && infrastructure && teacherReadiness && schoolManagement && learningRequirements) {
      const results = getAllToolCompatibility(
        profile,
        infrastructure,
        teacherReadiness,
        schoolManagement,
        learningRequirements,
        studentSurveys
      );
      setCompatibilityResults(results);
    }
  }, [schoolData]);

  if (isLoading && !schoolData.profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-160px)]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading your school's assessment data...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-4">Error Loading Data</h2>
              <p className="text-red-700">{error}</p>
              <p className="mt-4 text-gray-600">
                Make sure you have completed the school assessment and student surveys first.
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const { profile } = schoolData;

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">No Assessment Data Found</h2>
              <p className="text-gray-600 mb-6">
                Please complete the school assessment first to see personalized EdTech recommendations.
              </p>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Go to Assessment
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b bg-indigo-50">
              <h1 className="text-2xl font-bold text-indigo-800 flex items-center">
                <span className="mr-2">📊</span> EdTech Compatibility Results for {profile.name}
              </h1>
              <p className="text-sm text-indigo-600 mt-1">
                Based on your school's readiness assessment and student access survey
              </p>
            </div>

            <div className="p-6">
              {compatibilityResults.length > 0 ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tool Compatibility Scores</h2>
                    <div className="space-y-4">
                      {compatibilityResults.map((result, index) => {
                        const tool = edTechTools.find(t => t.id === result.toolId);
                        return (
                          <div key={result.toolId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-gray-900">{tool?.name}</h3>
                                <p className="text-sm text-gray-500">{tool?.description}</p>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="text-3xl font-bold text-indigo-600">
                                  {result.compatibilityScore}%
                                </div>
                                <p className="text-xs text-gray-500">Compatibility</p>
                              </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                              <div
                                className={`h-2.5 rounded-full ${result.compatibilityScore >= 80 ? 'bg-green-500' : result.compatibilityScore >= 60 ? 'bg-yellow-500' : result.compatibilityScore >= 40 ? 'bg-orange-500' : 'bg-red-500'} transition-all duration-500`}
                                style={{ width: `${result.compatibilityScore}%` }}
                              ></div>
                            </div>

                            {result.problems.length > 0 && (
                              <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                                <h4 className="font-medium text-yellow-800 mb-1">⚠️ Identified Challenges:</h4>
                                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                  {result.problems.map((problem, idx) => (
                                    <li key={idx}>{problem}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="pt-3 border-t border-gray-100">
                              <h4 className="font-medium text-gray-800 mb-2">💡 Recommendation:</h4>
                              <p className="text-gray-700">{result.recommendation}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary & Next Steps</h2>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p><strong>School:</strong> {profile.name}</p>
                        <p><strong>Location:</strong> {profile.location}</p>
                        <p><strong>Student Count:</strong> {profile.studentCount}</p>
                        <p><strong>Teacher Count:</strong> {profile.teacherCount}</p>
                      </div>

                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <h3 className="font-medium text-indigo-800 mb-2">AI-Powered Insights</h3>
                        <p className="text-gray-700">
                          Based on your school's readiness profile, the system recommends focusing on addressing the
                          {compatibilityResults[0]?.problems.length > 0 ? compatibilityResults[0]?.problems.join(', ') : 'key areas for improvement'}
                          before implementing technology solutions.
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          <em>Note: In a full implementation, this section would include personalized AI-generated explanations and implementation roadmaps.</em>
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-12">No EdTech tools available for comparison.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}