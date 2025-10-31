"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import apiClient from "../../../../../lib/api";
import AuthGuard from "../../../../../components/AuthGuard";
import DashboardLayout from "../../../../../components/DashboardLayout";
import { useToast } from "../../../../../contexts/ToastContext";

function UploadSolutionPage() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [pastQuestions, setPastQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [formData, setFormData] = useState({
    pastQuestionId: "",
    courseCode: "",
    courseTitle: "",
    level: "",
    semester: "",
    session: "",
    description: "",
  });

  // Load notifications, past questions, and submissions
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      loadPastQuestions();
      loadSubmissions();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const response = await apiClient.get("/notifications");
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadPastQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const response = await apiClient.getPastQuestions();
      if (response.data) {
        const questions = Array.isArray(response.data) ? response.data : [];
        setPastQuestions(questions);
      }
    } catch (error) {
      console.error("Error loading past questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const response = await apiClient.getMySolutions();

      if (response.success) {
        const submissions = (response.data || []).map((submission) => ({
          id: submission.id,
          courseCode: submission.course_code,
          courseTitle: submission.course_title,
          level: submission.level,
          semester: submission.semester,
          session: submission.session,
          status: submission.status,
          date: submission.created_at,
          reason: submission.admin_notes || null,
          file_name: submission.file_name,
        }));
        setPreviousSubmissions(submissions);
      } else {
        setPreviousSubmissions([]);
      }
    } catch (error) {
      console.error("Error loading submissions:", error);
      setPreviousSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const clearSelectedFile = () => {
    setUploadedFiles([]);
  };

  const handleInputChange = (field, value) => {
    if (field === "pastQuestionId" && value) {
      const selectedQuestion = pastQuestions.find(
        (q) => q.id === parseInt(value)
      );
      if (selectedQuestion) {
        setFormData({
          ...formData,
          pastQuestionId: value,
          courseCode: selectedQuestion.course_code || "",
          courseTitle: selectedQuestion.course_title || "",
          level: selectedQuestion.level ? `${selectedQuestion.level}` : "",
          semester: selectedQuestion.semester || "",
          session: selectedQuestion.session || "",
        });
        return;
      }
    }
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one file");
      return;
    }
    if (
      !formData.courseCode ||
      !formData.courseTitle ||
      !formData.level ||
      !formData.semester ||
      !formData.session
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Prepare form data for API
      // Clean the level value - remove " Level" suffix if present
      let levelValue = formData.level;
      if (levelValue && levelValue.includes(" Level")) {
        levelValue = levelValue.replace(" Level", "").trim();
      }
      levelValue = levelValue.trim();

      const submitData = {
        course_code: formData.courseCode.trim(),
        course_title: formData.courseTitle.trim(),
        level: levelValue,
        semester: formData.semester.trim(),
        session: formData.session.trim(),
        file: uploadedFiles[0],
      };

      // Only add optional fields if they have values
      if (formData.description && formData.description.trim() !== "") {
        submitData.description = formData.description.trim();
      }

      // Only add past_question_id if it's not empty
      if (formData.pastQuestionId && formData.pastQuestionId !== "") {
        submitData.past_question_id = formData.pastQuestionId;
      }

      const response = await apiClient.uploadSolution(submitData);

      if (response.success) {
        const message = response.message || "Solution uploaded successfully!";
        showSuccess(message);
        setSuccessMessage(message);
        setUploadedFileUrl(response.data?.file_url || "");
        setShowSuccessModal(true);

        // Reload submissions to show the new one
        await loadSubmissions();

        // Clear form
        setUploadedFiles([]);
        setFormData({
          pastQuestionId: "",
          courseCode: "",
          courseTitle: "",
          level: "",
          semester: "",
          session: "",
          description: "",
        });
      } else {
        const errorMessage =
          response.message || response.errors || "Failed to upload solution";
        setError(
          typeof errorMessage === "string"
            ? errorMessage
            : "Failed to upload solution"
        );
        showError(
          typeof errorMessage === "string"
            ? errorMessage
            : "Failed to upload solution"
        );
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      console.error("Error details:", error.response?.data);

      // Extract validation errors
      let errorMessage = "Error submitting solution. Please try again.";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorList = Object.entries(errors)
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(", ") : messages
              }`
          )
          .join("\n");
        errorMessage = `Validation failed:\n${errorList}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => setShowNotifications(!showNotifications)}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Error Display */}
        {error && (
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-2 text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Upload Solution 📝
            </h1>
            <p className="text-gray-600">
              Share solutions to past questions and help fellow students
            </p>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-blue-400 mr-3 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">
                  Upload Guidelines
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • Upload a single PDF, DOC, or DOCX file with the solution
                  </li>
                  <li>
                    • Ensure the solution is clear, complete, and accurate
                  </li>
                  <li>• Optionally link to an existing past question</li>
                  <li>• Your submission will be reviewed within 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">
              Upload New Solution
            </h3>

            <div>
              {/* Link to Past Question (Optional) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Past Question (Optional)
                </label>
                <select
                  value={formData.pastQuestionId}
                  onChange={(e) =>
                    handleInputChange("pastQuestionId", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a past question (optional)</option>
                  {loadingQuestions ? (
                    <option disabled>Loading past questions...</option>
                  ) : (
                    pastQuestions.map((question) => (
                      <option key={question.id} value={question.id}>
                        {question.course_code} - {question.course_title} (
                        {question.session})
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Selecting a past question will auto-fill the course details
                  below
                </p>
              </div>

              {/* File Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Solution File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="solution-file-upload"
                  />
                  <label
                    htmlFor="solution-file-upload"
                    className="cursor-pointer block"
                  >
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: "#488bbf20" }}
                    >
                      <svg
                        className="w-8 h-8"
                        style={{ color: "#488bbf" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Click to select a file
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, or DOCX. Max 10MB
                    </p>
                  </label>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {uploadedFiles[0].name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFiles[0].size / (1024 * 1024)).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={clearSelectedFile}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) =>
                      handleInputChange("courseCode", e.target.value)
                    }
                    placeholder="e.g., MTH 401"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.courseTitle}
                    onChange={(e) =>
                      handleInputChange("courseTitle", e.target.value)
                    }
                    placeholder="e.g., Real Analysis"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      handleInputChange("semester", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">First Semester</option>
                    <option value="2">Second Semester</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Session <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.session}
                    onChange={(e) =>
                      handleInputChange("session", e.target.value)
                    }
                    placeholder="e.g., 2019/2020"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Add any additional notes about this solution..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#488bbf" }}
              >
                {loading ? "Submitting..." : "Submit Solution for Review →"}
              </button>
            </div>
          </div>

          {/* Previous Submissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">
              Your Submissions
            </h3>

            {loadingSubmissions ? (
              <div className="text-center py-8 text-gray-500">
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading submissions...
                </div>
              </div>
            ) : previousSubmissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-3 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-lg font-medium">No submissions yet</p>
                <p className="text-sm">
                  Upload your first solution to help fellow students!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {previousSubmissions.map((submission) => {
                  const formatDate = (dateString) => {
                    if (!dateString) return "Recently";
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );

                    if (diffDays === 1) return "Today";
                    if (diffDays === 2) return "Yesterday";
                    if (diffDays <= 7) return `${diffDays} days ago`;
                    return `${Math.floor(diffDays / 30)} months ago`;
                  };

                  return (
                    <div
                      key={submission.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {submission.courseCode}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {submission.courseTitle}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Level {submission.level} • Semester{" "}
                            {submission.semester} • {submission.session}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              submission.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : submission.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {submission.status === "approved"
                              ? "✓ Approved"
                              : submission.status === "pending"
                              ? "⏳ Pending"
                              : "✗ Rejected"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-500">
                          {formatDate(submission.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Submission Successful!
                </h3>
                <p className="text-gray-600 mb-4">
                  {successMessage ||
                    "Your solution has been submitted for review. You'll be notified within 24-48 hours."}
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 rounded-lg font-semibold text-white transition"
                  style={{ backgroundColor: "#488bbf" }}
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ProtectedUploadSolutionPage() {
  return (
    <AuthGuard requireAuth={true}>
      <UploadSolutionPage />
    </AuthGuard>
  );
}
