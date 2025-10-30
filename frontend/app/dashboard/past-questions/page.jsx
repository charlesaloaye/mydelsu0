"use client";
import React, { useEffect, useState } from "react";
import apiClient from "../../../lib/api";
import Sidebar from "../../../components/Sidebar";

export default function PastQuestionsPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  // User subscription status (hook up to real auth/profile later)
  const isPremiumUser = false;

  // Filter options (if you want dynamic, extract from data, else use static)
  const levels = [
    "All Levels",
    "100 Level",
    "200 Level",
    "300 Level",
    "400 Level",
    "500 Level",
  ];
  const semesters = ["All Semesters", "First Semester", "Second Semester"];

  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");

  // Fetch backend data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await apiClient.getPastQuestions();
        let arr = Array.isArray(resp.data) ? resp.data : [];
        // Map backend fields to your FE format for easy rendering
        arr = arr.map((q) => ({
          id: q.id,
          courseCode: q.course_code || "",
          courseTitle: q.course_title || "",
          level: q.level ? `${q.level} Level` : "",
          semester:
            q.semester === 1 || q.semester === "1"
              ? "First Semester"
              : q.semester === 2 || q.semester === "2"
              ? "Second Semester"
              : "",
          pages: q.pages ?? "", // fallback if present
          uploadDate: q.upload_date || q.created_at || "",
          sponsored: q.sponsored || false,
          hasSolutions: q.has_solutions || false,
        }));
        setQuestions(arr);
      } catch (e) {
        setError(e.message || "Failed to load past questions");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // Dummy notifications: you can later call apiClient.getNotifications()
    setNotifications([
      {
        id: 1,
        message: "New past question added: MTH 201",
        time: "30 mins ago",
        unread: true,
      },
      {
        id: 2,
        message: "Solutions updated for CHM 101",
        time: "2 hours ago",
        unread: false,
      },
    ]);
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => n.unread).length);
  }, [notifications]);

  // Filter past questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "All Levels" || q.level === selectedLevel;
    const matchesSemester =
      selectedSemester === "All Semesters" || q.semester === selectedSemester;
    return matchesSearch && matchesLevel && matchesSemester;
  });

  // Separate sponsored and regular
  const sponsoredQuestions = filteredQuestions.filter((q) => q.sponsored);
  const regularQuestions = filteredQuestions.filter((q) => !q.sponsored);

  const handleViewQuestion = (question) => {
    if (question.id) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const url = `${apiUrl}/past-questions/${question.id}/download`;
      window.open(url, "_blank");
    } else {
      alert(
        `Opening detail page for:\n${question.courseCode} - ${question.courseTitle}\n\nThis will show:\n• Watermarked question images\n• Download button\n• View solutions (Premium)\n• Course summary link\n• Course outline link`
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (sticky, hidden on small by default) */}
      <Sidebar
        currentPath="/dashboard/past-questions"
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Header */}
          <header
            style={{ backgroundColor: "#488bbf" }}
            className="shadow-sm sticky top-0 z-50"
          >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition lg:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-semibold text-white">my</span>
                  <span
                    style={{ backgroundColor: "#ffffff", color: "#488bbf" }}
                    className="px-2 py-1 rounded font-bold text-xl"
                  >
                    DELSU
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-white/10 rounded-full transition relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-4 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
                      notif.unread ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
                <a
                  href="/dashboard/notifications"
                  className="block text-center py-3 text-blue-600 font-semibold hover:bg-gray-50 w-full"
                >
                  View all notifications
                </a>
              </div>
            )}
          </header>

          {/* Hamburger Menu for custom menu (optional, if you want to keep) */}
          {/* ...existing hamburger logic here, unchanged... */}

          {/* Page Title */}
          <div className="bg-white border-b border-gray-200 py-4">
            <div className="container mx-auto px-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Past Questions
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Access verified past questions and solutions
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Premium Banner (if not subscribed) */}
            {!isPremiumUser && (
              <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      🔓 Unlock ALL Solutions with Premium!
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        <span>Access ALL solutions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        <span>Downloadable PDFs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        <span>Course summaries</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        <span>Ad-free experience</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition text-lg whitespace-nowrap"
                  >
                    Upgrade - ₦2,500/semester
                  </button>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Search */}
                <div className="md:col-span-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search course code or title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#488bbf" }}
                    />
                    <svg
                      className="absolute left-3 top-3.5 h-6 w-6 text-gray-400"
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
                </div>

                {/* Level Filter */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: "#488bbf" }}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>

                {/* Semester Filter */}
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: "#488bbf" }}
                >
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sponsored Past Questions */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#488bbf]" />
              </div>
            ) : (
              sponsoredQuestions.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 px-1 flex items-center gap-2">
                    <span>⭐</span>
                    <span>Sponsored Past Questions</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {sponsoredQuestions.map((question) => (
                      <div
                        key={question.id}
                        onClick={() => handleViewQuestion(question)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
                      >
                        {/* Brand color header */}
                        <div
                          className="p-4 text-white relative"
                          style={{ backgroundColor: "#488bbf" }}
                        >
                          <div className="text-2xl font-bold mb-1">
                            {question.courseCode}
                          </div>
                          <div className="text-sm opacity-90 line-clamp-2 h-10">
                            {question.courseTitle}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                              {question.level}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                              {question.pages ? `${question.pages} pages` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Recently Added */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 px-1 flex items-center gap-2">
                <span>🆕</span>
                <span>Recently Added</span>
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf]" />
                </div>
              ) : regularQuestions.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {regularQuestions.map((question) => (
                    <div
                      key={question.id}
                      onClick={() => handleViewQuestion(question)}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
                    >
                      {/* Brand color header */}
                      <div
                        className="p-4 text-white relative"
                        style={{ backgroundColor: "#488bbf" }}
                      >
                        <div className="text-2xl font-bold mb-1">
                          {question.courseCode}
                        </div>
                        <div className="text-sm opacity-90 line-clamp-2 h-10">
                          {question.courseTitle}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                            {question.level}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                            {question.pages ? `${question.pages} pages` : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No past questions found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try a different search term.`
                      : "No past questions match your current filters. Try adjusting your filters."}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLevel("All Levels");
                      setSelectedSemester("All Semesters");
                    }}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: "#488bbf" }}
                  >
                    View All Past Questions
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            {(sponsoredQuestions.length > 0 || regularQuestions.length > 0) && (
              <div
                className="mt-6 rounded-xl p-4"
                style={{
                  backgroundColor: "#e8f3f9",
                  borderColor: "#488bbf",
                  borderWidth: "1px",
                }}
              >
                <h4 className="font-semibold mb-2" style={{ color: "#488bbf" }}>
                  💡 How It Works
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    • Click any past question to view details and download
                  </li>
                  <li>• All questions are watermarked with myDELSU branding</li>
                  <li>
                    • Upgrade to Premium to access solutions and summaries
                  </li>
                  <li>• Share with friends to help them prepare for exams!</li>
                  <li>• Upload your own past questions and earn rewards</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Premium Feature
              </h3>
              <p className="text-gray-600">
                Upgrade to Premium to access solutions and all exclusive
                features!
              </p>
            </div>
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">
                Premium Benefits:
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Access to ALL past question solutions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Downloadable solution PDFs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Course summaries & outlines</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Ad-free experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Priority customer support</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Early access to new content</span>
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
                  alert(
                    "Redirecting to Premium subscription page...\n\n✨ Upgrade to Premium for ₦2,500/semester"
                  );
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
    </div>
  );
}
