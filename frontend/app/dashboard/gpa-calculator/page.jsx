"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";
import Link from "next/link";
import apiClient from "../../../lib/api";

function GpaCalculatorPage() {
  const { user, logout } = useAuth();

  // Add styles for dark select options
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      select option {
        color: #111827 !important;
        background-color: white !important;
        font-weight: 500 !important;
      }
      select:focus option {
        color: #111827 !important;
        background-color: white !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    credit_unit: "",
    score: "",
  });

  const [editFormData, setEditFormData] = useState({
    course_code: "",
    course_name: "",
    credit_unit: "",
    score: "",
  });

  const [selectedSemester, setSelectedSemester] = useState({
    level: "",
    semester: 1,
    academicYear: "2024/2025",
  });

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getGpaCalculations();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSemesterChange = (e) => {
    const { name, value } = e.target;
    setSelectedSemester((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.course_code) newErrors.course_code = "Course code is required";
    if (!data.course_name) newErrors.course_name = "Course name is required";
    if (!data.credit_unit) newErrors.credit_unit = "Credit unit is required";
    if (!data.score) newErrors.score = "Score is required";

    if (data.score && (data.score < 0 || data.score > 100)) {
      newErrors.score = "Score must be between 0 and 100";
    }

    if (data.credit_unit && (data.credit_unit < 1 || data.credit_unit > 6)) {
      newErrors.credit_unit = "Credit unit must be between 1 and 6";
    }

    return newErrors;
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await apiClient.calculateGpa({
        semester: `${selectedSemester.level} Level - Semester ${selectedSemester.semester}`,
        academic_year: selectedSemester.academicYear,
        grade_scale: "5.0",
        courses: [
          {
            course_code: formData.course_code,
            course_name: formData.course_name,
            credit_hours: parseInt(formData.credit_unit),
            grade: convertScoreToGrade(parseInt(formData.score)),
          },
        ],
      });

      setSuccessMessage("Course added successfully!");
      setFormData({
        course_code: "",
        course_name: "",
        credit_unit: "",
        score: "",
      });
      setShowAddModal(false);
      loadCourses();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ general: error.message || "Failed to add course" });
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setEditFormData({
      course_code:
        course.courses[0]?.course_code || course.courses[0]?.name || "",
      course_name: course.courses[0]?.course_name || "",
      credit_unit: course.courses[0]?.credit_hours || "",
      score: getScoreFromGrade(course.courses[0]?.grade || ""),
    });
    setShowEditModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(editFormData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await apiClient.updateGpaCalculation(editingCourse.id, {
        semester: editingCourse.semester,
        academic_year: editingCourse.academic_year,
        grade_scale: editingCourse.grade_scale,
        courses: [
          {
            course_code: editFormData.course_code,
            course_name: editFormData.course_name,
            credit_hours: parseInt(editFormData.credit_unit),
            grade: convertScoreToGrade(parseInt(editFormData.score)),
          },
        ],
      });

      setSuccessMessage("Course updated successfully!");
      setShowEditModal(false);
      loadCourses();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ general: error.message || "Failed to update course" });
    }
  };

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.deleteGpaCalculation(courseToDelete.id);
      setSuccessMessage("Course deleted successfully!");
      setShowDeleteModal(false);
      loadCourses();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ general: error.message || "Failed to delete course" });
    }
  };

  const convertScoreToGrade = (score) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    return "F";
  };

  const getScoreFromGrade = (grade) => {
    const gradeToScore = {
      A: 70,
      B: 60,
      C: 50,
      D: 45,
      F: 30,
    };
    return gradeToScore[grade] || 0;
  };

  const getGradePoints = (grade) => {
    const gradePoints = {
      A: 5.0,
      B: 4.0,
      C: 3.0,
      D: 2.0,
      F: 0.0,
    };
    return gradePoints[grade] || 0.0;
  };

  const calculateGPA = () => {
    if (courses.length === 0) return 0.0;

    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      if (course.courses && Array.isArray(course.courses)) {
        course.courses.forEach((c) => {
          totalCredits += c.credit_hours || 0;
          totalPoints += (c.credit_hours || 0) * getGradePoints(c.grade);
        });
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0.0;
  };

  const getCurrentSemesterCourses = () => {
    if (!selectedSemester.level) return [];

    const semesterKey = `${selectedSemester.level} Level - Semester ${selectedSemester.semester}`;
    return courses.filter((course) => course.semester === semesterKey);
  };

  const currentSemesterCourses = getCurrentSemesterCourses();

  if (loading) {
    return (
      <DashboardLayout
        showNotifications={false}
        notifications={[]}
        unreadCount={0}
        onNotificationClick={() => {}}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      showNotifications={false}
      notifications={[]}
      unreadCount={0}
      onNotificationClick={() => {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                GPA Calculator
              </h1>
              <p className="text-gray-600">
                Calculate your semester GPA and track academic performance
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{ backgroundColor: "#488bbf" }}
              className="mt-4 sm:mt-0 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Add Course
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errors.general}
          </div>
        )}

        {/* Semester Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Select Semester
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={selectedSemester.level}
                onChange={handleSemesterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                style={{ color: "#111827" }}
              >
                <option value="">Select Level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Semester
              </label>
              <select
                name="semester"
                value={selectedSemester.semester}
                onChange={handleSemesterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                style={{ color: "#111827" }}
              >
                <option value="1">First Semester</option>
                <option value="2">Second Semester</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                name="academicYear"
                value={selectedSemester.academicYear}
                onChange={handleSemesterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                style={{ color: "#111827" }}
              >
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
                <option value="2022/2023">2022/2023</option>
              </select>
            </div>
          </div>
        </div>

        {/* GPA Summary */}
        <div className="bg-linear-to-r from-[#488bbf] to-[#3a6b8f] rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {selectedSemester.level
                ? `${selectedSemester.level} Level - Semester ${selectedSemester.semester}`
                : "Select a Semester"}
            </h2>
            <div className="text-6xl font-bold mb-4">{calculateGPA()}</div>
            <p className="text-lg opacity-90">
              {currentSemesterCourses.reduce(
                (total, course) => total + (course.courses?.length || 0),
                0
              )}{" "}
              course
              {currentSemesterCourses.reduce(
                (total, course) => total + (course.courses?.length || 0),
                0
              ) !== 1
                ? "s"
                : ""}{" "}
              calculated
            </p>
          </div>
        </div>

        {/* Current Semester Courses */}
        {selectedSemester.level ? (
          currentSemesterCourses.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedSemester.level} Level - Semester{" "}
                {selectedSemester.semester}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Course Code
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Course Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Credit Hours
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Grade
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Points
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSemesterCourses.map((course) =>
                      course.courses?.map((courseItem, index) => (
                        <tr
                          key={`${course.id}-${index}`}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-900 font-medium">
                            {courseItem?.course_code || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-gray-900 font-medium">
                            {courseItem?.course_name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-gray-900 font-medium">
                            {courseItem?.credit_hours || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-sm font-semibold ${
                                courseItem?.grade === "A"
                                  ? "bg-green-100 text-green-800"
                                  : courseItem?.grade === "B"
                                  ? "bg-blue-100 text-blue-800"
                                  : courseItem?.grade === "C"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : courseItem?.grade === "D"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {courseItem?.grade || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 font-medium">
                            {courseItem
                              ? (
                                  courseItem.credit_hours *
                                  getGradePoints(courseItem.grade)
                                ).toFixed(2)
                              : "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No courses added for this semester
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first course to calculate your GPA
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                style={{ backgroundColor: "#488bbf" }}
                className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Add Your First Course
              </button>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Select a semester to view courses
            </h3>
            <p className="text-gray-600">
              Choose a level and semester to start calculating your GPA
            </p>
          </div>
        )}

        {/* Add Course Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Add Course
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
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

                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      placeholder="e.g., CSC 101"
                      required
                    />
                    {errors.course_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.course_code}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Name
                    </label>
                    <input
                      type="text"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      placeholder="e.g., Introduction to Computer Science"
                      required
                    />
                    {errors.course_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.course_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Credit Unit
                    </label>
                    <select
                      name="credit_unit"
                      value={formData.credit_unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      style={{ color: "#111827" }}
                      required
                    >
                      <option value="">Select Credit Unit</option>
                      <option value="1">1 Credit</option>
                      <option value="2">2 Credits</option>
                      <option value="3">3 Credits</option>
                      <option value="4">4 Credits</option>
                      <option value="5">5 Credits</option>
                      <option value="6">6 Credits</option>
                    </select>
                    {errors.credit_unit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.credit_unit}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Score
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={formData.score}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      placeholder="Enter score (0-100)"
                      required
                    />
                    {errors.score && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.score}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ backgroundColor: "#488bbf" }}
                      className="flex-1 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Add Course
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {showEditModal && editingCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Edit Course
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
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

                <form onSubmit={handleUpdateCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      name="course_code"
                      value={editFormData.course_code}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Name
                    </label>
                    <input
                      type="text"
                      name="course_name"
                      value={editFormData.course_name}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Credit Unit
                    </label>
                    <select
                      name="credit_unit"
                      value={editFormData.credit_unit}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      style={{ color: "#111827" }}
                      required
                    >
                      <option value="1">1 Credit</option>
                      <option value="2">2 Credits</option>
                      <option value="3">3 Credits</option>
                      <option value="4">4 Credits</option>
                      <option value="5">5 Credits</option>
                      <option value="6">6 Credits</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Score
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={editFormData.score}
                      onChange={handleEditInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      required
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ backgroundColor: "#488bbf" }}
                      className="flex-1 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Update Course
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && courseToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Delete Course
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this course? This action
                    cannot be undone.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default function ProtectedGpaCalculatorPage() {
  return (
    <AuthGuard requireAuth={true}>
      <GpaCalculatorPage />
    </AuthGuard>
  );
}
