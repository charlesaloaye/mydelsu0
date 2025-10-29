"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import AuthGuard from "../../../components/AuthGuard";
import Navbar from "../../../components/Navbar";
import Link from "next/link";

function AggregateCheckerPage() {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    jambScore: "",
    olevelGrades: {
      english: "",
      mathematics: "",
      physics: "",
      chemistry: "",
      biology: "",
      economics: "",
      government: "",
      literature: "",
      geography: "",
      history: "",
      commerce: "",
      accounting: "",
      crs: "",
      irs: "",
      agriculture: "",
      technicalDrawing: "",
      foodAndNutrition: "",
      homeEconomics: "",
      fineArt: "",
      music: "",
      french: "",
      hausa: "",
      igbo: "",
      yoruba: "",
    },
    department: "",
    faculty: "",
    utmeSubjects: {
      subject1: "",
      subject2: "",
      subject3: "",
    },
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);

  const departments = {
    "Faculty of Engineering": [
      "Computer Engineering",
      "Electrical/Electronic Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Petroleum Engineering",
      "Agricultural Engineering",
      "Marine Engineering",
      "Aerospace Engineering",
    ],
    "Faculty of Sciences": [
      "Computer Science",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Biochemistry",
      "Microbiology",
      "Geology",
      "Statistics",
      "Environmental Science",
    ],
    "Faculty of Agriculture": [
      "Agricultural Economics",
      "Agricultural Extension",
      "Animal Science",
      "Crop Science",
      "Fisheries",
      "Forestry",
      "Soil Science",
      "Food Science",
    ],
    "Faculty of Arts": [
      "English Language",
      "History",
      "Philosophy",
      "Religious Studies",
      "Theatre Arts",
      "Fine Arts",
      "Music",
      "French",
      "Linguistics",
    ],
    "Faculty of Education": [
      "Educational Administration",
      "Guidance and Counseling",
      "Educational Psychology",
      "Curriculum Studies",
      "Educational Technology",
      "Adult Education",
    ],
    "Faculty of Social Sciences": [
      "Economics",
      "Political Science",
      "Sociology",
      "Psychology",
      "Geography",
      "International Relations",
      "Public Administration",
      "Mass Communication",
    ],
    "Faculty of Management Sciences": [
      "Business Administration",
      "Accounting",
      "Banking and Finance",
      "Marketing",
      "Management",
      "Insurance",
    ],
    "Faculty of Law": ["Law"],
    "Faculty of Medicine": [
      "Medicine and Surgery",
      "Nursing",
      "Pharmacy",
      "Medical Laboratory Science",
      "Radiography",
      "Physiotherapy",
    ],
  };

  const gradePoints = {
    A1: 8,
    A2: 7,
    A3: 6,
    B2: 5,
    B3: 4,
    B4: 3,
    B5: 2,
    B6: 1,
    C1: 0,
    C2: 0,
    C3: 0,
    C4: 0,
    C5: 0,
    C6: 0,
    D7: 0,
    E8: 0,
    F9: 0,
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

  const handleOLevelChange = (subject, grade) => {
    setFormData((prev) => ({
      ...prev,
      olevelGrades: {
        ...prev.olevelGrades,
        [subject]: grade,
      },
    }));
  };

  const handleUtmeSubjectChange = (subject, value) => {
    setFormData((prev) => ({
      ...prev,
      utmeSubjects: {
        ...prev.utmeSubjects,
        [subject]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jambScore) {
      newErrors.jambScore = "JAMB score is required";
    } else if (formData.jambScore < 0 || formData.jambScore > 400) {
      newErrors.jambScore = "JAMB score must be between 0 and 400";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.faculty) {
      newErrors.faculty = "Faculty is required";
    }

    // Check if at least 5 O'Level subjects are selected
    const selectedOLevelSubjects = Object.values(formData.olevelGrades).filter(
      (grade) => grade !== ""
    );
    if (selectedOLevelSubjects.length < 5) {
      newErrors.olevelGrades = "At least 5 O'Level subjects are required";
    }

    // Check if all UTME subjects are selected
    const selectedUtmeSubjects = Object.values(formData.utmeSubjects).filter(
      (subject) => subject !== ""
    );
    if (selectedUtmeSubjects.length < 3) {
      newErrors.utmeSubjects = "All 3 UTME subjects are required";
    }

    return newErrors;
  };

  const calculateAggregate = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Calculate O'Level aggregate (best 5 subjects)
    const olevelScores = Object.entries(formData.olevelGrades)
      .filter(([_, grade]) => grade !== "")
      .map(([_, grade]) => gradePoints[grade] || 0)
      .sort((a, b) => b - a)
      .slice(0, 5);

    const olevelAggregate = olevelScores.reduce((sum, score) => sum + score, 0);

    // Calculate UTME aggregate (JAMB score / 8)
    const utmeAggregate = formData.jambScore / 8;

    // Calculate total aggregate
    const totalAggregate = olevelAggregate + utmeAggregate;

    // Determine admission status based on department requirements
    const departmentRequirements = getDepartmentRequirements(
      formData.department
    );
    const isEligible =
      totalAggregate >= departmentRequirements.minimumAggregate;

    setResults({
      olevelAggregate: olevelAggregate.toFixed(2),
      utmeAggregate: utmeAggregate.toFixed(2),
      totalAggregate: totalAggregate.toFixed(2),
      isEligible,
      departmentRequirements,
      olevelScores,
    });

    setSuccessMessage("Aggregate calculated successfully!");
    setTimeout(() => setSuccessMessage(""), 5000);
    setHasCalculated(true);
  };

  const getDepartmentRequirements = (department) => {
    const requirements = {
      "Computer Science": {
        minimumAggregate: 15,
        description: "High demand course",
      },
      "Medicine and Surgery": {
        minimumAggregate: 20,
        description: "Highly competitive",
      },
      Law: { minimumAggregate: 18, description: "Highly competitive" },
      Engineering: { minimumAggregate: 16, description: "Technical course" },
      "Business Administration": {
        minimumAggregate: 12,
        description: "Popular course",
      },
      Economics: { minimumAggregate: 14, description: "Social science" },
      Accounting: { minimumAggregate: 13, description: "Professional course" },
      "Mass Communication": {
        minimumAggregate: 12,
        description: "Media course",
      },
      "Political Science": {
        minimumAggregate: 11,
        description: "Social science",
      },
      Sociology: { minimumAggregate: 10, description: "Social science" },
    };

    return (
      requirements[department] || {
        minimumAggregate: 12,
        description: "General requirement",
      }
    );
  };

  const getGradeColor = (grade) => {
    if (["A1", "A2", "A3"].includes(grade))
      return "text-green-600 bg-green-100";
    if (["B2", "B3", "B4", "B5", "B6"].includes(grade))
      return "text-blue-600 bg-blue-100";
    if (["C1", "C2", "C3", "C4", "C5", "C6"].includes(grade))
      return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getAggregateColor = (aggregate, minimum) => {
    if (aggregate >= minimum) return "text-green-600 bg-green-100";
    if (aggregate >= minimum - 2) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar
        variant="dashboard"
        showNotifications={false}
        notifications={[]}
        unreadCount={0}
        onNotificationClick={() => {}}
        currentPath="/dashboard/aggregate-checker"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Aggregate Checker
              </h1>
              <p className="text-gray-600">
                Check your aggregate scores and admission requirements for DELSU
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={calculateAggregate}
                style={{ backgroundColor: "#488bbf" }}
                className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Calculate Aggregate
              </button>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          {!hasCalculated && (
            <div className="space-y-6">
              {/* JAMB Score */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  JAMB Score
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter your JAMB score (0-400)
                  </label>
                  <input
                    type="number"
                    name="jambScore"
                    value={formData.jambScore}
                    onChange={handleInputChange}
                    min="0"
                    max="400"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                    placeholder="Enter JAMB score"
                  />
                  {errors.jambScore && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jambScore}
                    </p>
                  )}
                </div>
              </div>

              {/* Faculty and Department */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Faculty & Department
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Faculty
                    </label>
                    <select
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                    >
                      <option value="">Select Faculty</option>
                      {Object.keys(departments).map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                    {errors.faculty && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.faculty}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                      disabled={!formData.faculty}
                    >
                      <option value="">Select Department</option>
                      {formData.faculty &&
                        departments[formData.faculty]?.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                    </select>
                    {errors.department && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* UTME Subjects */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  UTME Subjects
                </h3>
                <div className="space-y-4">
                  {["subject1", "subject2", "subject3"].map(
                    (subject, index) => (
                      <div key={subject}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject {index + 1}
                        </label>
                        <select
                          value={formData.utmeSubjects[subject]}
                          onChange={(e) =>
                            handleUtmeSubjectChange(subject, e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                        >
                          <option value="">Select Subject</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="English">English</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Biology">Biology</option>
                          <option value="Economics">Economics</option>
                          <option value="Government">Government</option>
                          <option value="Literature">Literature</option>
                          <option value="Geography">Geography</option>
                          <option value="History">History</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Accounting">Accounting</option>
                          <option value="CRS">CRS</option>
                          <option value="IRS">IRS</option>
                          <option value="French">French</option>
                        </select>
                      </div>
                    )
                  )}
                  {errors.utmeSubjects && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.utmeSubjects}
                    </p>
                  )}
                </div>
              </div>

              {/* O'Level Grades */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  O'Level Grades
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select your best 5 subjects and their grades
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.olevelGrades).map(
                    ([subject, grade]) => (
                      <div
                        key={subject}
                        className="flex items-center space-x-2"
                      >
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {subject.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          <select
                            value={grade}
                            onChange={(e) =>
                              handleOLevelChange(subject, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white text-sm"
                          >
                            <option value="">Select Grade</option>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="A3">A3</option>
                            <option value="B2">B2</option>
                            <option value="B3">B3</option>
                            <option value="B4">B4</option>
                            <option value="B5">B5</option>
                            <option value="B6">B6</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                            <option value="C3">C3</option>
                            <option value="C4">C4</option>
                            <option value="C5">C5</option>
                            <option value="C6">C6</option>
                            <option value="D7">D7</option>
                            <option value="E8">E8</option>
                            <option value="F9">F9</option>
                          </select>
                        </div>
                        {grade && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${getGradeColor(
                              grade
                            )}`}
                          >
                            {grade}
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
                {errors.olevelGrades && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.olevelGrades}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Actions */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      setResults(null);
                      setHasCalculated(false);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Calculate Again
                  </button>
                </div>
                {/* Aggregate Results */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Aggregate Results
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        O'Level Aggregate:
                      </span>
                      <span className="font-bold text-xl text-gray-900">
                        {results.olevelAggregate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        UTME Aggregate:
                      </span>
                      <span className="font-bold text-xl text-gray-900">
                        {results.utmeAggregate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <span className="font-medium text-gray-700">
                        Total Aggregate:
                      </span>
                      <span className="font-bold text-xl text-blue-600">
                        {results.totalAggregate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admission Status */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Admission Status
                  </h3>
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-6 py-3 rounded-lg text-lg font-bold ${
                        results.isEligible
                          ? "text-green-600 bg-green-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {results.isEligible ? "✅ ELIGIBLE" : "❌ NOT ELIGIBLE"}
                    </div>
                    <p className="mt-4 text-gray-600">
                      {results.isEligible
                        ? `Congratulations! You meet the requirements for ${formData.department}`
                        : `You need at least ${results.departmentRequirements.minimumAggregate} aggregate points for ${formData.department}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {results.departmentRequirements.description}
                    </p>
                  </div>
                </div>

                {/* Department Requirements */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Department Requirements
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Aggregate:</span>
                      <span className="font-semibold">
                        {results.departmentRequirements.minimumAggregate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Aggregate:</span>
                      <span
                        className={`font-semibold ${getAggregateColor(
                          parseFloat(results.totalAggregate),
                          results.departmentRequirements.minimumAggregate
                        )}`}
                      >
                        {results.totalAggregate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difference:</span>
                      <span
                        className={`font-semibold ${
                          parseFloat(results.totalAggregate) >=
                          results.departmentRequirements.minimumAggregate
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {parseFloat(results.totalAggregate) >=
                        results.departmentRequirements.minimumAggregate
                          ? `+${(
                              parseFloat(results.totalAggregate) -
                              results.departmentRequirements.minimumAggregate
                            ).toFixed(2)}`
                          : `${(
                              parseFloat(results.totalAggregate) -
                              results.departmentRequirements.minimumAggregate
                            ).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* O'Level Breakdown */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    O'Level Breakdown
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(formData.olevelGrades)
                      .filter(([_, grade]) => grade !== "")
                      .map(([subject, grade]) => (
                        <div
                          key={subject}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-600 capitalize">
                            {subject.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-sm font-semibold ${getGradeColor(
                                grade
                              )}`}
                            >
                              {grade}
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                              ({gradePoints[grade]} pts)
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}

            {/* Instructions */}
            {!results && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  How to Use
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">1.</span>
                    <span>Enter your JAMB score (0-400)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">2.</span>
                    <span>Select your desired faculty and department</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">3.</span>
                    <span>Choose your 3 UTME subjects</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">4.</span>
                    <span>Select your best 5 O'Level subjects and grades</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">5.</span>
                    <span>Click "Calculate Aggregate" to see your results</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedAggregateCheckerPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AggregateCheckerPage />
    </AuthGuard>
  );
}
