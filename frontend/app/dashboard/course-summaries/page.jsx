"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";
import Link from "next/link";
import apiClient from "../../../lib/api";

function CourseSummariesPage() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("notes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadData, setUploadData] = useState({
    title: "",
    subject: "",
    level: "",
    type: "notes",
    description: "",
    file: null,
  });

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Economics",
    "Government",
    "Literature",
    "Geography",
    "History",
    "Commerce",
    "Accounting",
    "Computer Science",
    "Agricultural Science",
    "Technical Drawing",
    "French",
  ];

  const levels = [
    "100 Level",
    "200 Level",
    "300 Level",
    "400 Level",
    "500 Level",
  ];

  // Load course summaries on component mount
  useEffect(() => {
    loadCourseSummaries();
  }, [activeTab, selectedSubject, selectedLevel, searchQuery]);

  const loadCourseSummaries = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        type: activeTab,
        ...(selectedSubject && { subject: selectedSubject }),
        ...(selectedLevel && { level: selectedLevel }),
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await apiClient.getCourseSummaries(params);

      if (response.success) {
        setNotes(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.message || "Failed to load course summaries");
        // Fallback to empty array
        setNotes([]);
      }
    } catch (error) {
      console.error("Error loading course summaries:", error);

      // Check if it's a backend connection error
      if (
        error.message.includes("Server returned HTML instead of JSON") ||
        error.message.includes("Failed to fetch")
      ) {
        setError(
          "Backend server is not running. Course summaries feature will be available once the backend is set up."
        );
        // Use sample data as fallback for development
        setNotes(getSampleData());
      } else {
        setError("Failed to load course summaries. Please try again.");
        setNotes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sample data fallback for when backend is not available
  const getSampleData = () => {
    return [
      {
        id: 1,
        title: "Calculus Fundamentals",
        subject: "Mathematics",
        level: "100 Level",
        type: "notes",
        description:
          "Complete guide to differential and integral calculus with examples",
        author: "Dr. John Smith",
        uploadDate: "2024-01-15",
        downloads: 245,
        rating: 4.8,
        tags: ["calculus", "derivatives", "integrals", "limits"],
        fileSize: "2.3 MB",
        fileType: "PDF",
      },
      {
        id: 2,
        title: "Organic Chemistry Reactions",
        subject: "Chemistry",
        level: "200 Level",
        type: "notes",
        description:
          "Comprehensive overview of organic reactions and mechanisms",
        author: "Prof. Sarah Johnson",
        uploadDate: "2024-01-10",
        downloads: 189,
        rating: 4.6,
        tags: ["organic chemistry", "reactions", "mechanisms", "synthesis"],
        fileSize: "3.1 MB",
        fileType: "PDF",
      },
      {
        id: 3,
        title: "Physics Laws and Formulas",
        subject: "Physics",
        level: "100 Level",
        type: "quick-reference",
        description:
          "Quick reference sheet for all major physics laws and formulas",
        author: "Dr. Michael Brown",
        uploadDate: "2024-01-08",
        downloads: 312,
        rating: 4.9,
        tags: ["formulas", "laws", "equations", "reference"],
        fileSize: "1.2 MB",
        fileType: "PDF",
      },
      {
        id: 4,
        title: "Biology Study Guide - Cell Biology",
        subject: "Biology",
        level: "100 Level",
        type: "study-guide",
        description:
          "Detailed study guide covering cell structure, function, and processes",
        author: "Dr. Emily Davis",
        uploadDate: "2024-01-05",
        downloads: 156,
        rating: 4.7,
        tags: [
          "cell biology",
          "study guide",
          "cellular processes",
          "structure",
        ],
        fileSize: "4.5 MB",
        fileType: "PDF",
      },
      {
        id: 5,
        title: "Economics Principles Summary",
        subject: "Economics",
        level: "200 Level",
        type: "notes",
        description:
          "Key economic principles and theories with practical examples",
        author: "Prof. Robert Wilson",
        uploadDate: "2024-01-03",
        downloads: 98,
        rating: 4.4,
        tags: ["economics", "principles", "theories", "microeconomics"],
        fileSize: "2.8 MB",
        fileType: "PDF",
      },
      {
        id: 6,
        title: "Computer Science Algorithms",
        subject: "Computer Science",
        level: "300 Level",
        type: "study-guide",
        description:
          "Algorithm design and analysis study guide with code examples",
        author: "Dr. Lisa Chen",
        uploadDate: "2024-01-01",
        downloads: 203,
        rating: 4.8,
        tags: [
          "algorithms",
          "programming",
          "data structures",
          "computer science",
        ],
        fileSize: "5.2 MB",
        fileType: "PDF",
      },
    ];
  };

  // Debug log to help identify the issue
  console.log(
    "Notes state:",
    notes,
    "Type:",
    typeof notes,
    "Is Array:",
    Array.isArray(notes)
  );

  const filteredNotes = Array.isArray(notes)
    ? notes.filter((note) => {
        const matchesSearch =
          !searchQuery ||
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (note.tags &&
            note.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        const matchesSubject =
          !selectedSubject || note.subject === selectedSubject;
        const matchesLevel = !selectedLevel || note.level === selectedLevel;
        const matchesType = note.type === activeTab;

        return matchesSearch && matchesSubject && matchesLevel && matchesType;
      })
    : [];

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadData.file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", uploadData.title);
      formData.append("subject", uploadData.subject);
      formData.append("level", uploadData.level);
      formData.append("type", uploadData.type);
      formData.append("description", uploadData.description);
      formData.append("file", uploadData.file);

      const response = await apiClient.uploadCourseSummary(formData);

      if (response.success) {
        setSuccessMessage("File uploaded successfully!");
        setShowUploadModal(false);
        setUploadData({
          title: "",
          subject: "",
          level: "",
          type: "notes",
          description: "",
          file: null,
        });
        // Reload the course summaries
        loadCourseSummaries();
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setError(response.message || "Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);

      // Check if it's a backend connection error
      if (
        error.message.includes("Server returned HTML instead of JSON") ||
        error.message.includes("Failed to fetch")
      ) {
        setError(
          "Backend server is not running. Upload functionality will be available once the backend is set up."
        );
      } else {
        setError("Failed to upload file. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleDownload = async (noteId) => {
    try {
      const response = await apiClient.downloadCourseSummary(noteId);
      if (response.success) {
        // Create a blob and download the file
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = response.filename || "course-summary.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);

      // Check if it's a backend connection error
      if (
        error.message.includes("Server returned HTML instead of JSON") ||
        error.message.includes("Failed to fetch")
      ) {
        setError(
          "Backend server is not running. Download functionality will be available once the backend is set up."
        );
      } else {
        setError("Failed to download file. Please try again.");
      }
    }
  };

  const handleDelete = async (noteId) => {
    if (
      !window.confirm("Are you sure you want to delete this course summary?")
    ) {
      return;
    }

    try {
      const response = await apiClient.deleteCourseSummary(noteId);
      if (response.success) {
        setSuccessMessage("Course summary deleted successfully!");
        loadCourseSummaries();
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setError("Failed to delete course summary");
      }
    } catch (error) {
      console.error("Error deleting course summary:", error);

      // Check if it's a backend connection error
      if (
        error.message.includes("Server returned HTML instead of JSON") ||
        error.message.includes("Failed to fetch")
      ) {
        setError(
          "Backend server is not running. Delete functionality will be available once the backend is set up."
        );
      } else {
        setError("Failed to delete course summary. Please try again.");
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "notes":
        return "📝";
      case "study-guide":
        return "📚";
      case "quick-reference":
        return "⚡";
      default:
        return "📄";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "notes":
        return "bg-blue-100 text-blue-800";
      case "study-guide":
        return "bg-green-100 text-green-800";
      case "quick-reference":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                Course Summaries & Notes
              </h1>
              <p className="text-gray-600">
                Access comprehensive study materials and course summaries
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{ backgroundColor: "#488bbf" }}
              className="mt-4 sm:mt-0 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Upload Notes
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
        {error && (
          <div
            className={`px-4 py-3 rounded mb-6 ${
              error.includes("Backend server is not running")
                ? "bg-yellow-100 border border-yellow-400 text-yellow-800"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            <div className="flex items-center">
              <div className="shrink-0">
                {error.includes("Backend server is not running") ? (
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {error.includes("Backend server is not running")
                    ? "Development Mode"
                    : "Error"}
                </p>
                <p className="text-sm mt-1">{error}</p>
                {error.includes("Backend server is not running") && (
                  <p className="text-xs mt-2 text-yellow-700">
                    The page is currently showing sample data. To enable full
                    functionality, please set up the backend server with the
                    course-summaries API endpoints.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "notes", label: "Subject Notes", icon: "📝" },
              { id: "study-guide", label: "Study Guides", icon: "📚" },
              { id: "quick-reference", label: "Quick References", icon: "⚡" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Notes
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                placeholder="Search by title, description, or tags..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course summaries...</p>
            </div>
          ) : Array.isArray(filteredNotes) && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{getTypeIcon(note.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {note.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(
                              note.type
                            )}`}
                          >
                            {note.type.replace("-", " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{note.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center space-x-1">
                            <span>👤</span>
                            <span>{note.author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>📅</span>
                            <span>
                              {new Date(note.uploadDate).toLocaleDateString()}
                            </span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>📥</span>
                            <span>{note.downloads} downloads</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>⭐</span>
                            <span>{note.rating}/5.0</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>📄</span>
                            <span>
                              {note.fileSize} • {note.fileType}
                            </span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => handleDownload(note.id)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Preview
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Share
                    </button>
                    {note.author === user?.email && (
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="px-6 py-3 border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
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
                No {activeTab.replace("-", " ")} found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or upload some notes
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{ backgroundColor: "#488bbf" }}
                className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Upload Notes
              </button>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Upload Study Material
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
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

                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={uploadData.title}
                      onChange={(e) =>
                        setUploadData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      placeholder="Enter title of your study material"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        value={uploadData.subject}
                        onChange={(e) =>
                          setUploadData((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        value={uploadData.level}
                        onChange={(e) =>
                          setUploadData((prev) => ({
                            ...prev,
                            level: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                        required
                      >
                        <option value="">Select Level</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={uploadData.type}
                      onChange={(e) =>
                        setUploadData((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                      required
                    >
                      <option value="notes">Subject Notes</option>
                      <option value="study-guide">Study Guide</option>
                      <option value="quick-reference">Quick Reference</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={uploadData.description}
                      onChange={(e) =>
                        setUploadData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium bg-white"
                      placeholder="Describe your study material..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      File
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent text-gray-900 font-medium bg-white"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(false);
                        setError("");
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ backgroundColor: "#488bbf" }}
                      className="flex-1 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload Material"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default function ProtectedCourseSummariesPage() {
  return (
    <AuthGuard requireAuth={true}>
      <CourseSummariesPage />
    </AuthGuard>
  );
}
