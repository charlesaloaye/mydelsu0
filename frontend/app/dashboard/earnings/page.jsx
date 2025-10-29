"use client";
import React, { useState } from "react";
import AuthGuard from "../../../components/AuthGuard";

function EarnMoneyPage() {
  const [showMenu, setShowMenu] = useState(false);
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
        "Invite your friends to join myDelsu and earn for every successful referral",
      earnings: "₦500 per referral",
      icon: "👥",
      color: "from-blue-500 to-cyan-600",
      active: true,
      action: "Start Referring",
    },
    {
      id: 2,
      title: "Upload Past Questions",
      description:
        "Share past questions from your department and earn when students download them",
      earnings: "₦50-200 per upload",
      icon: "📚",
      color: "from-green-500 to-emerald-600",
      active: true,
      action: "Upload Now",
    },
    {
      id: 3,
      title: "Upload Hostel Pictures",
      description:
        "Help other students by uploading quality pictures of hostels around campus",
      earnings: "₦100-500 per hostel",
      icon: "🏠",
      color: "from-purple-500 to-indigo-600",
      active: true,
      action: "Upload Pictures",
    },
    {
      id: 4,
      title: "Sell Products",
      description:
        "List and sell your products (textbooks, gadgets, fashion items, etc.) in our marketplace",
      earnings: "Unlimited earnings",
      icon: "🛍️",
      color: "from-orange-500 to-red-600",
      active: true,
      action: "List Product",
    },
    {
      id: 5,
      title: "Offer Services",
      description:
        "Provide services like tutoring, graphic design, typing, programming, and more",
      earnings: "Set your own rates",
      icon: "💼",
      color: "from-pink-500 to-rose-600",
      active: true,
      action: "Create Service",
    },
  ];

  const comingSoon = [
    {
      title: "Complete Tasks",
      icon: "✅",
      description: "Earn by completing simple tasks",
    },
    {
      title: "Watch Ads",
      icon: "📺",
      description: "Earn daily by watching advertisements",
    },
    {
      title: "Campus Ambassador",
      icon: "🎓",
      description: "Become a myDelsu ambassador",
    },
    {
      title: "Content Creation",
      icon: "✍️",
      description: "Write articles and earn",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header
        style={{ backgroundColor: "#488bbf" }}
        className="shadow-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-white">my</span>
            <span
              style={{ backgroundColor: "#ffffff", color: "#488bbf" }}
              className="px-2 py-1 rounded font-bold text-xl"
            >
              DELSU
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Icon */}
            <div className="relative">
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

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  {notifications.map((notif) => (
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
                </div>
              )}
            </div>

            {/* Hamburger Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-white/10 rounded-full transition"
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

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 animate-[fadeIn_0.2s_ease-in]">
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#488bbf" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      <span className="font-medium">Dashboard</span>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#488bbf" }}
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
                      <span className="font-medium">My Wallet</span>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#488bbf" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">My Profile</span>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#488bbf" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Settings</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {(showMenu || showNotifications) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowMenu(false);
              setShowNotifications(false);
            }}
          ></div>
        )}
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 mb-6 text-white text-center shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            💰 Earn Money on myDelsu
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            Multiple ways to earn while helping other students succeed
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">5+</p>
              <p className="text-sm opacity-90">Earning Methods</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold">Fast</p>
              <p className="text-sm opacity-90">Withdrawals</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 col-span-2 md:col-span-1">
              <p className="text-3xl font-bold">∞</p>
              <p className="text-sm opacity-90">Unlimited Potential</p>
            </div>
          </div>
        </div>

        {/* Earning Methods */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Earning Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {earningMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${method.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="text-4xl mr-4">{method.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {method.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="bg-green-50 px-3 py-1 rounded-full">
                          <p className="text-sm font-semibold text-green-700">
                            💵 {method.earnings}
                          </p>
                        </div>
                        {method.active && (
                          <span className="text-xs font-medium text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: "#488bbf" }}
                  >
                    {method.action} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              style={{ color: "#488bbf" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: "#488bbf20" }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#488bbf" }}
                >
                  1
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Choose Method
              </h4>
              <p className="text-sm text-gray-600">
                Select how you want to earn from available options
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Complete Action
              </h4>
              <p className="text-sm text-gray-600">
                Refer friends, upload content, or list items
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Verified</h4>
              <p className="text-sm text-gray-600">
                Your contribution is reviewed and approved
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Earn Money</h4>
              <p className="text-sm text-gray-600">
                Money is added to your wallet automatically
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🚀</span>
            More Ways to Earn (Coming Soon)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {comingSoon.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center border border-gray-200"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-semibold text-gray-900 text-sm mb-1">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
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
    </div>
  );
}

export default function ProtectedEarnMoneyPage() {
  return (
    <AuthGuard requireAuth={true}>
      <EarnMoneyPage />
    </AuthGuard>
  );
}
