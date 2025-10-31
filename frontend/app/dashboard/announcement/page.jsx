"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "../../../components/DashboardHeader";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";
import AuthGuard from "../../../components/AuthGuard";

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadAnnouncements();
  }, [currentPage, selectedType, selectedPriority, searchQuery]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        per_page: 10,
        search: searchQuery || undefined,
        type: selectedType !== "all" ? selectedType : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
      };

      console.log("Loading announcements with params:", params);
      const response = await apiClient.getAnnouncements(params);
      console.log("Announcements API response:", response);

      if (response.success) {
        console.log("Setting announcements:", response.data);
        setAnnouncements(response.data);
        setPagination(response.pagination);
        setTotalPages(response.pagination.last_page);
      } else {
        console.error("API returned success: false", response);
        setError("Failed to load announcements");
      }
    } catch (err) {
      console.error("Error loading announcements:", err);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadAnnouncements();
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const getTypeColor = (type) => {
    const colors = {
      info: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      important: "bg-red-100 text-red-800",
      success: "bg-green-100 text-green-800",
    };
    return colors[type] || colors.info;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      urgent: "🔴",
      high: "🟠",
      medium: "🔵",
      low: "⚪",
    };
    return icons[priority] || icons.medium;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader currentPath="/announcement" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Announcements
              </h1>
              <p className="text-gray-600 mt-2">
                Stay updated with the latest news and important information
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-[#488bbf] text-white rounded-lg hover:bg-[#3a7ba8] transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  </div>
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-[#488bbf] text-white rounded-lg hover:bg-[#3a7ba8] transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">
                Type:
              </span>
              {["all", "info", "warning", "important", "success"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type
                        ? "bg-[#488bbf] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                )
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <span className="text-sm font-medium text-gray-700 self-center">
                Priority:
              </span>
              {["all", "low", "medium", "high", "urgent"].map((priority) => (
                <button
                  key={priority}
                  onClick={() => handlePriorityChange(priority)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedPriority === priority
                      ? "bg-[#488bbf] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#488bbf]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Announcements List */}
        {!loading && !error && (
          <>
            {announcements.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8M7 4h8"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No announcements found
                </h3>
                <p className="text-gray-600">
                  {searchQuery ||
                  selectedType !== "all" ||
                  selectedPriority !== "all"
                    ? "Try adjusting your search criteria"
                    : "Check back later for new announcements"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {announcement.is_pinned && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                📌 Pinned
                              </span>
                            )}
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                announcement.type
                              )}`}
                            >
                              {announcement.type.charAt(0).toUpperCase() +
                                announcement.type.slice(1)}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                announcement.priority
                              )}`}
                            >
                              {getPriorityIcon(announcement.priority)}{" "}
                              {announcement.priority.charAt(0).toUpperCase() +
                                announcement.priority.slice(1)}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {announcement.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>
                            By{" "}
                            {announcement.creator
                              ? `${announcement.creator.first_name} ${announcement.creator.last_name}`
                              : "Admin"}
                          </span>
                          <span>•</span>
                          <span>{announcement.date}</span>
                        </div>
                        <button className="text-[#488bbf] hover:text-[#3a7ba8] font-medium">
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === page
                            ? "bg-[#488bbf] text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function ProtectedAnnouncementsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AnnouncementsPage />
    </AuthGuard>
  );
}
