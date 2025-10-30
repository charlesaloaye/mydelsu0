"use client";
import React, { useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";

function EarnMoneyPage() {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      message: "New earning opportunity available!",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 2,
      message: "Your referral earned you ₦500",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const earningMethods = [
    {
      id: 1,
      title: "Refer Friends",
      description:
        "Earn ₦500 for each friend you refer who signs up and verifies their account",
      icon: "👥",
      earnings: "₦500 per referral",
      action: "Get Referral Link",
    },
    {
      id: 2,
      title: "Upload Past Questions",
      description:
        "Upload past questions and earn ₦200 for each approved upload",
      icon: "📚",
      earnings: "₦200 per upload",
      action: "Upload Questions",
    },
    {
      id: 3,
      title: "Write Course Summaries",
      description:
        "Create comprehensive course summaries and earn ₦300 per approved summary",
      icon: "📝",
      earnings: "₦300 per summary",
      action: "Write Summary",
    },
    {
      id: 4,
      title: "Hostel Reviews",
      description:
        "Write detailed hostel reviews and earn ₦150 per approved review",
      icon: "🏠",
      earnings: "₦150 per review",
      action: "Write Review",
    },
    {
      id: 5,
      title: "Marketplace Sales",
      description: "Sell products and services on our marketplace",
      icon: "🛒",
      earnings: "Variable",
      action: "Start Selling",
    },
    {
      id: 6,
      title: "Content Creation",
      description: "Write articles and earn",
      icon: "✍️",
      earnings: "Variable",
      action: "Create Content",
    },
  ];

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => setShowNotifications(!showNotifications)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 mb-6 text-white text-center shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            💰 Earn Money on myDelsu
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Turn your knowledge and skills into income opportunities
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm opacity-90">Total Earnings</p>
            <p className="text-3xl font-bold">₦0.00</p>
          </div>
        </div>

        {/* Earning Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {earningMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{method.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 mb-4">{method.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-600 font-semibold">
                  {method.earnings}
                </span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">
                  {method.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No recent activity</p>
            <p className="text-sm">Start earning to see your activity here</p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl p-6 mt-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">
            💡 Earning Tips
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Complete your profile to increase trust and earnings</li>
            <li>• Upload high-quality content for better approval rates</li>
            <li>• Share your referral link on social media</li>
            <li>• Check back regularly for new earning opportunities</li>
          </ul>
        </div>
      </div>

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
    </DashboardLayout>
  );
}

export default function ProtectedEarnMoneyPage() {
  return (
    <AuthGuard requireAuth={true}>
      <EarnMoneyPage />
    </AuthGuard>
  );
}
