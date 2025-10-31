"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../../../lib/api";
import DashboardLayout from "../../../../components/DashboardLayout";
import Link from "next/link";
import { useAuth } from "../../../../contexts/AuthContext";

export default function SolutionsMarketplace() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("highest-rated");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // User subscription status (check from user profile or subscription API)
  const isPremiumUser = user?.subscription_status === "premium" || false;

  // Load notifications
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  // Load solutions
  useEffect(() => {
    loadSolutions();
  }, []);

  // Reload when filters change (for API filtering in the future)
  useEffect(() => {
    // Could implement API-side filtering here if needed
    // For now, filtering is done client-side
  }, [
    searchQuery,
    selectedLevel,
    selectedSemester,
    selectedRating,
    verifiedOnly,
  ]);

  const loadNotifications = async () => {
    try {
      const response = await apiClient.getNotifications();
      setNotifications(response.data?.data || []);
      setUnreadCount(response.data?.unread_count || 0);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadSolutions = async () => {
    setLoading(true);
    setError("");
    try {
      // Build query parameters for API filtering
      const params = {};

      // Apply level filter
      if (selectedLevel !== "All Levels") {
        const levelNum = selectedLevel.replace(" Level", "").trim();
        params.level = levelNum;
      }

      // Apply search filter
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await apiClient.getSolutions(params);

      // Handle paginated response or direct array
      let solutionsData = [];
      if (response.success) {
        // Check if response.data has a 'data' property (Laravel pagination)
        if (response.data?.data && Array.isArray(response.data.data)) {
          // Paginated response (Laravel pagination format)
          solutionsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // Direct array response
          solutionsData = response.data;
        } else if (response.data && typeof response.data === "object") {
          // Try to extract data from paginated response structure
          if (response.data.data && Array.isArray(response.data.data)) {
            solutionsData = response.data.data;
          }
        }
      }

      if (Array.isArray(solutionsData) && solutionsData.length > 0) {
        const mappedSolutions = solutionsData.map(mapSolutionData);
        setSolutions(mappedSolutions);
      } else {
        // No solutions found
        setSolutions([]);
      }
    } catch (e) {
      setError(e.message || "Failed to load solutions");
      console.error("Error loading solutions:", e);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  // Map backend solution data to frontend format
  const mapSolutionData = (solution) => {
    const userName = solution.user
      ? `${solution.user.first_name || ""} ${
          solution.user.last_name || ""
        }`.trim()
      : "Unknown";

    return {
      id: solution.id,
      courseCode: solution.course_code || "",
      courseTitle: solution.course_title || "",
      level: solution.level ? `${solution.level} Level` : "",
      semester:
        solution.semester === 1 || solution.semester === "1"
          ? "First Semester"
          : solution.semester === 2 || solution.semester === "2"
          ? "Second Semester"
          : "",
      session: solution.session || "",
      uploadedBy: userName,
      userInitials: getInitials(userName),
      userColor: generateColor(solution.id),
      rating: parseFloat(solution.rating || 0),
      totalRatings: solution.rating_count || 0,
      commentsCount: 0, // Will be added when comments feature is implemented
      format: solution.file_type?.includes("pdf") ? "PDF" : "DOC",
      pages: 0, // Can be calculated from file if needed
      verified: solution.status === "approved",
      uploadDate: solution.created_at || "",
    };
  };

  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper to generate consistent color from ID
  const generateColor = (id) => {
    const colors = [
      "#488bbf",
      "#8b5cf6",
      "#ec4899",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
      "#6366f1",
      "#84cc16",
      "#a855f7",
      "#14b8a6",
      "#f97316",
    ];
    return colors[id % colors.length];
  };

  // Filter solutions
  const filteredSolutions = solutions.filter((solution) => {
    const matchesSearch =
      solution.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "All Levels" || solution.level === selectedLevel;
    const matchesSemester =
      selectedSemester === "All Semesters" ||
      solution.semester === selectedSemester;
    const matchesVerified = !verifiedOnly || solution.verified;

    let matchesRating = true;
    if (selectedRating === "4.5+ Stars") matchesRating = solution.rating >= 4.5;
    else if (selectedRating === "4.0+ Stars")
      matchesRating = solution.rating >= 4.0;
    else if (selectedRating === "3.5+ Stars")
      matchesRating = solution.rating >= 3.5;

    return (
      matchesSearch &&
      matchesLevel &&
      matchesSemester &&
      matchesVerified &&
      matchesRating
    );
  });

  // Sort solutions
  const sortedSolutions = [...filteredSolutions].sort((a, b) => {
    if (sortBy === "highest-rated") return b.rating - a.rating;
    if (sortBy === "most-rated") return b.totalRatings - a.totalRatings;
    if (sortBy === "newest")
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    if (sortBy === "course-code")
      return a.courseCode.localeCompare(b.courseCode);
    return 0;
  });

  const handleViewSolution = (solution) => {
    if (!isPremiumUser) {
      setShowUpgradeModal(true);
      return;
    }
    router.push(`/dashboard/past-questions/solutions/${solution.id}`);
  };

  const handleUploadSolution = () => {
    router.push("/dashboard/past-questions/solutions/upload");
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-500">
          ⭐
        </span>
      );
    }
    if (rating % 1 !== 0) {
      stars.push(
        <span key="half" className="text-yellow-500">
          ⭐
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => setShowNotifications(!showNotifications)}
    >
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Solutions Marketplace
            </h1>
            <p className="text-gray-600">
              Browse student-uploaded solutions across all courses
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by course code or title... (e.g., MTH 101)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: "#488bbf" }}
                />
                {/* Filter Icon Button */}
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  title="Filter solutions"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleUploadSolution}
                className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition whitespace-nowrap flex items-center gap-2"
                style={{ backgroundColor: "#488bbf" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload Solution
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              {sortedSolutions.length === solutions.length ? (
                <span>
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {sortedSolutions.length}
                  </span>{" "}
                  solutions
                </span>
              ) : (
                <span>
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {sortedSolutions.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {solutions.length}
                  </span>{" "}
                  solutions
                </span>
              )}
            </p>
          </div>

          {/* Solutions Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#488bbf]" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : sortedSolutions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedSolutions.map((solution) => (
                <div
                  key={solution.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => handleViewSolution(solution)}
                >
                  {/* Blue Header with Course Code & Title */}
                  <div className="p-5" style={{ backgroundColor: "#488bbf" }}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        {solution.courseCode}
                      </h3>
                      {solution.verified && (
                        <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-semibold rounded flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/90 line-clamp-2">
                      {solution.courseTitle}
                    </p>
                  </div>

                  {/* White Content Area */}
                  <div className="p-5">
                    {/* Level & Semester */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                        {solution.level}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                        {solution.semester}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                        {solution.format}
                      </span>
                    </div>

                    {/* User Info with Avatar */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: solution.userColor }}
                      >
                        {solution.userInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {solution.uploadedBy}
                        </p>
                        <p className="text-xs text-gray-500">
                          {solution.pages} pages • {solution.format}
                        </p>
                      </div>
                    </div>

                    {/* Rating & Comments */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {renderStars(solution.rating)}
                        <span className="text-sm font-semibold text-gray-900 ml-1">
                          {solution.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({solution.totalRatings})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="text-xs font-semibold">
                          {solution.commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Solutions Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any solutions matching your filters. Try
                adjusting your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLevel("All Levels");
                  setSelectedSemester("All Semesters");
                  setSelectedRating("All Ratings");
                  setVerifiedOnly(false);
                }}
                className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Upload CTA */}
          {sortedSolutions.length > 0 && (
            <div className="mt-8 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-dashed border-green-300 text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Have Solutions to Share?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Upload your solutions and earn ₦500 per solution immediately!
                Help thousands of students while making money.
              </p>
              <button
                onClick={handleUploadSolution}
                className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-lg"
              >
                Upload Solution & Earn ₦500 →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Unlock This Solution
              </h3>
              <p className="text-gray-600">
                Upgrade to Premium to access all student solutions and study
                materials!
              </p>
            </div>

            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">
                Premium Benefits:
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Access ALL student solutions across all courses</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>View solutions from verified top students</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>See ratings & read comments from other students</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    Multiple solutions per course (different approaches)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Course summaries & outlines</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Ad-free experience</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₦2,500
              </div>
              <div className="text-sm text-gray-600">per semester</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  router.push("/dashboard/subscription");
                  setShowUpgradeModal(false);
                }}
                className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Filter Solutions
              </h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
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

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Levels</option>
                    <option>100 Level</option>
                    <option>200 Level</option>
                    <option>300 Level</option>
                    <option>400 Level</option>
                    <option>500 Level</option>
                  </select>
                </div>

                {/* Semester Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Semesters</option>
                    <option>First Semester</option>
                    <option>Second Semester</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Ratings</option>
                    <option>4.5+ Stars</option>
                    <option>4.0+ Stars</option>
                    <option>3.5+ Stars</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="highest-rated">Highest Rated</option>
                    <option value="most-rated">Most Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="course-code">Course Code</option>
                  </select>
                </div>

                {/* Verified Only Toggle */}
                <div className="flex items-end">
                  <label className="flex items-center gap-3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition w-full">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-500 bg-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-white font-medium">
                      Verified Only
                    </span>
                  </label>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery ||
                selectedLevel !== "All Levels" ||
                selectedSemester !== "All Semesters" ||
                selectedRating !== "All Ratings" ||
                verifiedOnly) && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-300 font-medium">
                      Active filters:
                    </span>
                    {searchQuery && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        "{searchQuery}"
                      </span>
                    )}
                    {selectedLevel !== "All Levels" && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {selectedLevel}
                      </span>
                    )}
                    {selectedSemester !== "All Semesters" && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {selectedSemester}
                      </span>
                    )}
                    {selectedRating !== "All Ratings" && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {selectedRating}
                      </span>
                    )}
                    {verifiedOnly && (
                      <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                        ✓ Verified Only
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedLevel("All Levels");
                        setSelectedSemester("All Semesters");
                        setSelectedRating("All Ratings");
                        setVerifiedOnly(false);
                      }}
                      className="text-sm text-gray-400 hover:text-white underline ml-auto"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLevel("All Levels");
                  setSelectedSemester("All Semesters");
                  setSelectedRating("All Ratings");
                  setVerifiedOnly(false);
                }}
                className="px-6 py-3 text-gray-300 hover:text-white font-semibold rounded-lg hover:bg-gray-700 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
