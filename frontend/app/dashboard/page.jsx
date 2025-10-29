"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../lib/api";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/Navbar";
import AnnouncementCard from "../../components/AnnouncementCard";
import DashboardMenu from "../../components/DashboardMenu";
import { useToast } from "../../contexts/ToastContext";

function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(10);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dailyRewardStatus, setDailyRewardStatus] = useState(null);
  const [dailyRewardStats, setDailyRewardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);

  // Load dashboard data
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
      loadAnnouncements();
      loadDailyRewardData();
    }
  }, [isAuthenticated, user]);

  // Set up real-time fetching for announcements
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Load announcements immediately
    loadAnnouncements();

    // Set up interval for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      loadAnnouncements();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // Show welcome popup only on first login
  useEffect(() => {
    if (isAuthenticated && user) {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcomePopup");
      if (!hasSeenWelcome) {
        setShowAdPopup(true);
        localStorage.setItem("hasSeenWelcomePopup", "true");
      }
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, notificationsResponse, unreadResponse] =
        await Promise.all([
          apiClient.getDashboard(),
          apiClient.getNotifications(),
          apiClient.getUnreadCount(),
        ]);

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      }

      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data.data || []);
      }

      if (unreadResponse.success) {
        setUnreadCount(unreadResponse.data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set default data to prevent UI breaking
      setDashboardData({
        wallet: { available_balance: 0 },
        user: { first_name: user?.first_name || "User" },
      });
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      const response = await apiClient.getRecentAnnouncements(5);

      if (response.success) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      console.error("Error loading announcements:", error);
      // Set empty array to prevent UI breaking
      setAnnouncements([]);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  const loadDailyRewardData = async () => {
    try {
      const [statusResponse, statsResponse] = await Promise.all([
        apiClient.getDailyRewardStatus(),
        apiClient.getDailyRewardStreakStats(),
      ]);

      if (statusResponse.success) {
        setDailyRewardStatus(statusResponse.data);
      }

      if (statsResponse.success) {
        setDailyRewardStats(statsResponse.data);
      }
    } catch (error) {
      console.error("Error loading daily reward data:", error);
    }
  };

  // Get wallet stats from dashboard data
  const walletStats = dashboardData?.wallet || { available_balance: 0 };

  const handleClaimReward = () => {
    setShowRewardModal(true);
  };

  const handleLogout = async () => {
    try {
      // Clear the welcome popup flag so it shows on next login
      localStorage.removeItem("hasSeenWelcomePopup");
      await logout();
      // The AuthContext will handle the redirect
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleWatchAd = async () => {
    setWatchingAd(true);
    const interval = setInterval(async () => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setWatchingAd(false);
          setRewardClaimed(true);

          // Claim daily reward
          claimDailyReward();

          setTimeout(() => {
            setShowRewardModal(false);
            setRewardClaimed(false);
            setAdCountdown(10);
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const claimDailyReward = async () => {
    try {
      const response = await apiClient.claimDailyReward();
      if (response.success) {
        showSuccess(response.message || "Daily reward claimed successfully!");
        // Reload dashboard data to update wallet balance
        loadDashboardData();
        // Reload daily reward data to update status and stats
        loadDailyRewardData();
      }
    } catch (error) {
      console.error("Error claiming daily reward:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <Navbar
        variant="dashboard"
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
        currentPath="/dashboard"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || "User"}! 👋
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Your gateway to academic success
          </p>
        </div>

        {/* Verification Alert */}
        {!user?.is_verified && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-amber-400 mr-3 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">
                    Account Not Verified
                  </h3>
                  <p className="text-sm text-amber-700">
                    Complete your profile ({user?.profile_complete || 0}%) and
                    upload your student ID to get verified.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/profile"
                className="ml-4 px-4 py-2 text-white rounded-lg font-medium hover:shadow-md transition whitespace-nowrap"
                style={{ backgroundColor: "#488bbf" }}
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats & Daily Reward */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Wallet Balance */}
          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm opacity-90 mb-1">Wallet Balance</p>
                <p className="text-4xl font-bold">
                  ₦{walletStats.available_balance?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs opacity-75">Available for withdrawal</p>
          </div>

          {/* Daily Reward */}
          <div
            onClick={
              dailyRewardStatus?.has_claimed_today
                ? undefined
                : handleClaimReward
            }
            className={`bg-linear-to-br from-amber-400 to-orange-500 rounded-xl p-6 shadow-lg text-white transition-all transform ${
              dailyRewardStatus?.has_claimed_today
                ? "opacity-75 cursor-not-allowed"
                : "cursor-pointer hover:shadow-xl hover:scale-105"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm opacity-90 mb-1">
                  Daily Reward
                  {dailyRewardStatus?.current_streak > 0 && (
                    <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                      {dailyRewardStatus.current_streak} day streak
                    </span>
                  )}
                </p>
                <p className="text-3xl font-bold">
                  +₦{dailyRewardStatus?.next_reward_amount || 10}
                </p>
              </div>
              <div
                className={`w-16 h-16 rounded-full bg-white/20 flex items-center justify-center ${
                  dailyRewardStatus?.has_claimed_today ? "" : "animate-pulse"
                }`}
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs opacity-90 font-medium">
              {dailyRewardStatus?.has_claimed_today
                ? "🎁 Already claimed today - come back tomorrow!"
                : "🎁 Click to claim your reward!"}
            </p>
            {dailyRewardStats && (
              <div className="mt-2 text-xs opacity-75">
                Total earned: ₦{dailyRewardStats.total_amount_earned} (
                {dailyRewardStats.total_rewards_claimed} rewards)
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/past-questions"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition"
                style={{ backgroundColor: "#488bbf20" }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: "#488bbf" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">
                Past Questions
              </p>
            </Link>

            <Link
              href="/dashboard/cgpa-calculator"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">
                CGPA Calculator
              </p>
            </Link>

            <Link
              href="/dashboard/course-outlines"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">
                Course Outlines
              </p>
            </Link>

            <Link
              href="/dashboard/referrals"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">
                Earn & Refer
              </p>
            </Link>
          </div>
        </div>

        {/* Browse Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-3"
              style={{ color: "#488bbf" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2H7zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            Browse & Discover
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Browse Products */}
            <Link
              href="/dashboard/marketplace"
              className="group bg-linear-to-br from-blue-50 to-indigo-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    Browse Products
                  </h4>
                  <p className="text-sm text-gray-600">
                    Discover items for sale
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Find textbooks, electronics, clothing, and more from fellow
                students
              </p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Explore Products
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Browse Services */}
            <Link
              href="/dashboard/services"
              className="group bg-linear-to-br from-green-50 to-emerald-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition">
                    Browse Services
                  </h4>
                  <p className="text-sm text-gray-600">
                    Find service providers
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Connect with tutors, freelancers, and service providers
              </p>
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                Explore Services
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Browse Hostels */}
            <Link
              href="/dashboard/hostels"
              className="group bg-linear-to-br from-orange-50 to-amber-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition">
                    Browse Hostels
                  </h4>
                  <p className="text-sm text-gray-600">
                    Search for accommodation
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Find available hostels, rooms, and accommodation options
              </p>
              <div className="mt-4 flex items-center text-orange-600 text-sm font-medium group-hover:text-orange-700">
                Find Hostels
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Browse Events */}
            <Link
              href="/dashboard/events"
              className="group bg-linear-to-br from-purple-50 to-violet-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition">
                    Browse Events
                  </h4>
                  <p className="text-sm text-gray-600">Discover events</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Find campus events, parties, workshops, and social gatherings
              </p>
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
                Explore Events
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Browse Roommates */}
            <Link
              href="/dashboard/roommates"
              className="group bg-linear-to-br from-pink-50 to-rose-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition">
                    Browse Roommates
                  </h4>
                  <p className="text-sm text-gray-600">Find roommates</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Connect with potential roommates and find compatible living
                partners
              </p>
              <div className="mt-4 flex items-center text-pink-600 text-sm font-medium group-hover:text-pink-700">
                Find Roommates
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Academic Tools */}
            <Link
              href="/dashboard/tools"
              className="group bg-linear-to-br from-indigo-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                    Academic Tools
                  </h4>
                  <p className="text-sm text-gray-600">Essential tools</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                CGPA calculator, past questions, course summaries, and more
                academic resources
              </p>
              <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                Explore Tools
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Browse All */}
            {/* <Link
              href="/dashboard/browse"
              className="group bg-linear-to-br from-gray-50 to-slate-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition">
                    Browse All
                  </h4>
                  <p className="text-sm text-gray-600">Explore everything</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Access all categories in one place for comprehensive browsing
              </p>
              <div className="mt-4 flex items-center text-gray-600 text-sm font-medium group-hover:text-gray-700">
                View All Categories
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  style={{ color: "#488bbf" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
                Announcements
              </h3>
              <Link
                href="/dashboard/announcement"
                className="text-sm font-medium hover:underline"
                style={{ color: "#488bbf" }}
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {announcementsLoading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#488bbf]"></div>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No announcements available</p>
                </div>
              ) : (
                Array.isArray(announcements) &&
                announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    showFullContent={false}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ad Popup on Login */}
      {showAdPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full relative">
            <button
              onClick={() => setShowAdPopup(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="p-8 text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: "#488bbf20" }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: "#488bbf" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to myDelsu!
              </h3>
              <p className="text-gray-600 mb-6">
                Your one-stop platform for all DELSU resources. Explore past
                questions, calculate your CGPA, and earn rewards!
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 italic">
                  "Advertisement space - Partner with us to reach DELSU
                  students"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {!watchingAd && !rewardClaimed && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-amber-100 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Daily Reward!
                </h3>
                <p className="text-gray-600 mb-2">
                  Watch a 10-second ad and earn ₦
                  {dailyRewardStatus?.next_reward_amount || 10} instantly!
                </p>
                {dailyRewardStatus?.current_streak > 0 && (
                  <p className="text-sm text-amber-600 font-medium mb-4">
                    🔥 {dailyRewardStatus.current_streak} day streak! Keep it
                    up!
                  </p>
                )}
                {dailyRewardStatus?.streak_bonus && (
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Streak bonuses:</p>
                    <p>• 3+ days: 50% bonus</p>
                    <p>• 7+ days: 100% bonus (double reward)</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRewardModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWatchAd}
                    className="flex-1 px-4 py-3 text-white rounded-lg font-medium transition"
                    style={{ backgroundColor: "#488bbf" }}
                  >
                    Watch Ad
                  </button>
                </div>
              </div>
            )}

            {watchingAd && (
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-lg p-8 mb-4">
                  <p
                    className="text-4xl font-bold"
                    style={{ color: "#488bbf" }}
                  >
                    {adCountdown}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Watching advertisement...
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 italic">
                    "Ad content would appear here"
                  </p>
                </div>
              </div>
            )}

            {rewardClaimed && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-500"
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
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  ₦10 Added!
                </h3>
                <p className="text-gray-600">
                  Your reward has been credited to your wallet
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function ProtectedDashboard() {
  return (
    <AuthGuard requireAuth={true}>
      <Dashboard />
    </AuthGuard>
  );
}
