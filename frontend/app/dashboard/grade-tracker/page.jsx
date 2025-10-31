"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";
import { useToast } from "../../../contexts/ToastContext";
import Link from "next/link";
import apiClient from "../../../lib/api";

function GradeTrackerPage() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cgpa, setCgpa] = useState(0);
  const [totalCreditHours, setTotalCreditHours] = useState(0);
  const [stats, setStats] = useState({
    totalSemesters: 0,
    averageGpa: 0,
    highestGpa: 0,
    lowestGpa: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadCalculations();
    }
  }, [isAuthenticated]);

  const loadCalculations = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.getGpaCalculations();

      if (response.success) {
        const data = response.data || [];
        setCalculations(data);

        // Calculate CGPA
        calculateCGPA(data);

        // Calculate stats
        if (data.length > 0) {
          const gpas = data.map((calc) => parseFloat(calc.gpa || 0));
          setStats({
            totalSemesters: data.length,
            averageGpa: (
              gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length
            ).toFixed(2),
            highestGpa: Math.max(...gpas).toFixed(2),
            lowestGpa: Math.min(...gpas).toFixed(2),
          });
        }
      } else {
        setError(response.message || "Failed to load grade history");
      }
    } catch (error) {
      console.error("Error loading calculations:", error);
      setError(
        error.message || "Failed to load grade history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateCGPA = (data) => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    data.forEach((calc) => {
      const credits = parseFloat(calc.total_credit_hours || 0);
      const gpa = parseFloat(calc.gpa || 0);
      totalCredits += credits;
      totalGradePoints += credits * gpa;
    });

    const calculatedCgpa =
      totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    setCgpa(calculatedCgpa);
    setTotalCreditHours(totalCredits.toFixed(2));
  };

  const formatSemester = (semester, academicYear) => {
    return `${semester} - ${academicYear}`;
  };

  const getGradeColor = (gpa) => {
    const numGpa = parseFloat(gpa);
    if (numGpa >= 4.5) return "text-green-600";
    if (numGpa >= 3.5) return "text-blue-600";
    if (numGpa >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeBadgeColor = (gpa) => {
    const numGpa = parseFloat(gpa);
    if (numGpa >= 4.5) return "bg-green-100 text-green-800";
    if (numGpa >= 3.5) return "bg-blue-100 text-blue-800";
    if (numGpa >= 2.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const viewDetails = (calculation) => {
    setSelectedCalculation(calculation);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout
          showNotifications={false}
          notifications={[]}
          unreadCount={0}
        >
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderColor: "#488bbf" }}
              ></div>
              <p className="text-gray-600">Loading grade history...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout
        showNotifications={false}
        notifications={[]}
        unreadCount={0}
      >
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Grade Tracker 📊
                  </h1>
                  <p className="text-gray-600">
                    Track your academic performance across all semesters
                  </p>
                </div>
                <Link
                  href="/dashboard/cgpa-calculator"
                  className="px-4 py-2 rounded-lg font-semibold text-white transition"
                  style={{ backgroundColor: "#488bbf" }}
                >
                  Add Semester
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
                <button
                  onClick={loadCalculations}
                  className="ml-4 text-red-800 underline hover:text-red-900"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Overview Stats */}
            {calculations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">CGPA</div>
                  <div className={`text-3xl font-bold ${getGradeColor(cgpa)}`}>
                    {cgpa}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Cumulative GPA
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">
                    Total Credit Hours
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {totalCreditHours}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Credits</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">
                    Total Semesters
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalSemesters}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Semesters</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-1">Average GPA</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.averageGpa}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Across all semesters
                  </div>
                </div>
              </div>
            )}

            {/* Additional Stats */}
            {calculations.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Performance Range
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Highest GPA</div>
                      <div className="text-lg font-bold text-green-600">
                        {stats.highestGpa}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Lowest GPA</div>
                      <div className="text-lg font-bold text-red-600">
                        {stats.lowestGpa}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-sm text-gray-600 mb-2">Progress</div>
                  <div className="text-xs text-gray-500 mb-1">
                    {parseFloat(cgpa) >= 4.5
                      ? "Excellent"
                      : parseFloat(cgpa) >= 3.5
                      ? "Very Good"
                      : parseFloat(cgpa) >= 2.5
                      ? "Good"
                      : "Needs Improvement"}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="rounded-full h-2 transition-all"
                      style={{
                        width: `${(parseFloat(cgpa) / 5.0) * 100}%`,
                        backgroundColor:
                          parseFloat(cgpa) >= 4.5
                            ? "#10b981"
                            : parseFloat(cgpa) >= 3.5
                            ? "#3b82f6"
                            : parseFloat(cgpa) >= 2.5
                            ? "#eab308"
                            : "#ef4444",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Grade History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Grade History
                </h2>
                {calculations.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {calculations.length} semester
                    {calculations.length !== 1 ? "s" : ""} recorded
                  </span>
                )}
              </div>

              {calculations.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No grade records yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start tracking your grades by adding a semester
                  </p>
                  <Link
                    href="/dashboard/cgpa-calculator"
                    className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition"
                    style={{ backgroundColor: "#488bbf" }}
                  >
                    Add First Semester
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {calculations.map((calculation) => (
                    <div
                      key={calculation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {formatSemester(
                                calculation.semester,
                                calculation.academic_year
                              )}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getGradeBadgeColor(
                                calculation.gpa
                              )}`}
                            >
                              {calculation.grade_scale || "4.0"} Scale
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {calculation.courses?.length || 0} course
                              {(calculation.courses?.length || 0) !== 1
                                ? "s"
                                : ""}
                            </span>
                            <span>
                              {calculation.total_credit_hours} credit hours
                            </span>
                            <span>{formatDate(calculation.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              GPA
                            </div>
                            <div
                              className={`text-2xl font-bold ${getGradeColor(
                                calculation.gpa
                              )}`}
                            >
                              {calculation.gpa}
                            </div>
                          </div>
                          <button
                            onClick={() => viewDetails(calculation)}
                            className="px-4 py-2 text-sm font-semibold rounded-lg transition"
                            style={{
                              backgroundColor: "#488bbf",
                              color: "white",
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details Modal */}
          {showDetailsModal && selectedCalculation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {formatSemester(
                      selectedCalculation.semester,
                      selectedCalculation.academic_year
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedCalculation(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">GPA</div>
                    <div
                      className={`text-2xl font-bold ${getGradeColor(
                        selectedCalculation.gpa
                      )}`}
                    >
                      {selectedCalculation.gpa}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Credit Hours
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedCalculation.total_credit_hours}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Grade Scale
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedCalculation.grade_scale || "4.0"}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Courses ({selectedCalculation.courses?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {selectedCalculation.courses?.map((course, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {course.course_code} - {course.course_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {course.credit_hours} credit hours
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">
                            Grade
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {course.grade}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

export default GradeTrackerPage;
