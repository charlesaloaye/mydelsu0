"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import apiClient from "../../../lib/api";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";

function SubscriptionPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscription();
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.getUserSubscription();

      if (response.success) {
        setSubscription(response.data);
      } else {
        setError("Failed to load subscription information");
      }
    } catch (err) {
      console.error("Error loading subscription:", err);
      setError("Failed to load subscription information");
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const [notificationsResponse, unreadResponse] = await Promise.all([
        apiClient.getNotifications(),
        apiClient.getUnreadCount(),
      ]);

      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }
      if (unreadResponse.success) {
        setUnreadCount(unreadResponse.data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleUpgrade = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      // Initialize Paystack payment for premium subscription
      const response = await apiClient.initializePaystackPayment({
        amount: 2500, // ₦2,500 per semester
        email: user?.email,
        metadata: {
          type: "subscription_upgrade",
          plan: "premium",
        },
      });

      if (response.success) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        setError(response.message || "Failed to initialize payment");
      }
    } catch (err) {
      console.error("Error upgrading subscription:", err);
      setError(err.message || "Failed to initialize payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf]"></div>
        </div>
      </DashboardLayout>
    );
  }

  const isPremium = subscription?.plan === "premium" && subscription?.valid;
  const isExpired = subscription?.plan === "premium" && !subscription?.valid;

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => setShowNotifications(!showNotifications)}
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Subscription Plans
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your subscription and upgrade to premium
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Subscription Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              style={{ color: "#488bbf" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            Current Subscription
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isPremium
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {subscription?.plan === "premium" ? "Premium" : "Free"} Plan
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscription?.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {subscription?.status === "active" ? "Active" : "Expired"}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {isPremium
                  ? "You have access to all premium features"
                  : "Upgrade to premium to unlock all features"}
              </p>
              {subscription?.expires_at && (
                <p className="text-gray-500 text-xs mt-1">
                  {subscription?.renews
                    ? `Renews on ${formatDate(subscription.expires_at)}`
                    : `Expires on ${formatDate(subscription.expires_at)}`}
                </p>
              )}
            </div>
            {!isPremium && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Free Plan */}
          <div
            className={`bg-white rounded-2xl shadow-sm border-2 p-6 ${
              !isPremium ? "border-[#488bbf]" : "border-gray-200"
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Free Plan
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">₦0</span>
                <span className="text-gray-600">/forever</span>
              </div>
              {!isPremium && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Current Plan
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm">
                  Access to basic features
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm">
                  Limited past questions access
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-400 text-sm line-through">
                  Solutions and reviews
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-400 text-sm line-through">
                  Priority support
                </span>
              </li>
            </ul>

            {!isPremium && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Current Plan
              </button>
            )}
          </div>

          {/* Premium Plan */}
          <div
            className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 p-6 ${
              isPremium ? "border-purple-400" : "border-purple-300"
            } relative`}
          >
            {isPremium && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                  Active
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Premium Plan
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-purple-600">
                  ₦2,500
                </span>
                <span className="text-gray-600">/semester</span>
              </div>
              {isPremium && (
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  Current Plan
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm font-medium">
                  Everything in Free Plan
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm">
                  Unlimited past questions access
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm">
                  View solutions and reviews
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm">
                  Comment and rate solutions
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm">
                  Priority customer support
                </span>
              </li>
            </ul>

            {!isPremium ? (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-md"
              >
                Upgrade to Premium
              </button>
            ) : (
              <button
                disabled
                className="w-full px-4 py-3 bg-gray-300 text-gray-600 font-semibold rounded-lg cursor-not-allowed"
              >
                Active Subscription
              </button>
            )}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Premium Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">
                  Past Questions Solutions
                </h4>
                <p className="text-sm text-gray-600">
                  Access detailed solutions for all past questions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Solution Reviews</h4>
                <p className="text-sm text-gray-600">
                  Read reviews and ratings from other students
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">
                  Interact with Solutions
                </h4>
                <p className="text-sm text-gray-600">
                  Comment on solutions and share your insights
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Priority Support</h4>
                <p className="text-sm text-gray-600">
                  Get faster response times for your queries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Upgrade to Premium</h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-500 hover:text-gray-700"
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

            <div className="mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600 mb-1">
                    ₦2,500
                  </p>
                  <p className="text-gray-600 text-sm">per semester</p>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">
                    Access to all past question solutions
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">
                    View and interact with solution reviews
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">
                    Priority customer support
                  </span>
                </li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-blue-800">
                    You'll be redirected to Paystack to complete your payment
                    securely. Your subscription will be activated immediately
                    after payment.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgrade}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Pay ₦2,500"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function ProtectedSubscriptionPage() {
  return (
    <AuthGuard requireAuth={true}>
      <SubscriptionPage />
    </AuthGuard>
  );
}
