'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import type { StudentSurvey } from '@/lib/types';

export default function StudentSurveyPage() {
  const [schoolCode, setSchoolCode] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [surveyData, setSurveyData] = useState<Partial<StudentSurvey>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'schoolCode') setSchoolCode(value);
    if (name === 'studentId') setStudentId(value);
  };

  const handleSurveyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSurveyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAuthenticate = async () => {
    if (!schoolCode.trim() || !studentId.trim()) {
      setErrorMessage('Please enter both school code and student ID');
      return;
    }

    setIsAuthenticated(true);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setErrorMessage('Please authenticate first');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const schoolId = 'school-' + schoolCode.toLowerCase().replace(/\s+/g, '-');

      const surveyDataToSave: StudentSurvey = {
        id: 'survey-' + Date.now(),
        schoolId,
        studentId,
        deviceOwnership: surveyData.deviceOwnership || 'none',
        internetAvailability: surveyData.internetAvailability || 'never',
        learningPreferences: surveyData.learningPreferences || '',
        digitalConfidence: surveyData.digitalConfidence || 'poor',
        accessLimitations: surveyData.accessLimitations || '',
        createdAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('student_surveys')
        .upsert(surveyDataToSave);

      if (error) throw error;

      setSuccessMessage('Survey submitted successfully! Thank you for helping improve EdTech recommendations for your school.');
      setSurveyData({});
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      setErrorMessage('Failed to submit survey. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Student Access Survey</h2>
            <p className="text-gray-600 mb-6 text-center">
              Help us understand your technology access to improve EdTech recommendations for your school.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Code</label>
                <input
                  type="text"
                  name="schoolCode"
                  value={schoolCode}
                  onChange={handleAuthChange}
                  placeholder="Enter your school code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={studentId}
                  onChange={handleAuthChange}
                  placeholder="Enter your student ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAuthenticate}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Access Survey</h2>
          <p className="text-gray-600 mb-6">
            Share information about your technology access to help your school make better EdTech decisions.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device Ownership</label>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deviceOwnership"
                      value="laptop"
                      checked={surveyData.deviceOwnership === 'laptop'}
                      onChange={handleSurveyChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">Laptop</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deviceOwnership"
                      value="phone"
                      checked={surveyData.deviceOwnership === 'phone'}
                      onChange={handleSurveyChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">Smartphone</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deviceOwnership"
                      value="shared"
                      checked={surveyData.deviceOwnership === 'shared'}
                      onChange={handleSurveyChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">Shared Device</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deviceOwnership"
                      value="none"
                      checked={surveyData.deviceOwnership === 'none'}
                      onChange={handleSurveyChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">No Personal Device</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internet Availability at Home</label>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="internetAvailability"
                      value="always"
                      checked={surveyData.internetAvailability === 'always'}
                      onChange={handleSurveyChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">Always</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="internetAvailability"
                      value="sometimes"
                      checked={surveyData.internetAvailability === 'sometimes'}
                      onChange={handleSurveyChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">Sometimes</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="internetAvailability"
                      value="never"
                      checked={surveyData.internetAvailability === 'never'}
                      onChange={handleSurveyChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2">Never</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Survey'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}