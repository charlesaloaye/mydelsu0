"use client";
import React, { useState, useEffect } from "react";
import AuthGuard from "../../../components/AuthGuard";
import apiClient from "../../../lib/api";
import Navbar from "../../../components/Navbar";
import Link from "next/link";

function ReferralsPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [referralTab, setReferralTab] = useState("all");
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Live data from backend
  const [userData, setUserData] = useState({
    referralCode: "",
    referralLink: "",
    weeklyRank: 0,
    totalEarned: 0,
    totalReferred: 0,
    pendingEarnings: 0,
  });
  const [myReferrals, setMyReferrals] = useState([]);

  const filteredReferrals =
    referralTab === "pending"
      ? myReferrals.filter((ref) => ref.status === "pending")
      : myReferrals;

  const notifications = [
    {
      id: 1,
      message: "John Doe just activated their account! ₦500 added",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      message: "You moved up to #3 on the leaderboard!",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      message: "Jane Smith verified! ₦500 earned",
      time: "1 day ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Fetch referrals + stats periodically for near-realtime updates
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setError("");
        const [statsRes, refsRes] = await Promise.all([
          apiClient.getReferralStats(),
          apiClient.getReferrals(),
        ]);

        if (!isMounted) return;

        // Debug: Log the API response structure
        console.log("Stats response:", statsRes);
        console.log("Referrals response:", refsRes);

        setUserData({
          referralCode: statsRes.data?.referral_code || "",
          referralLink: statsRes.data?.referral_link || "",
          weeklyRank: statsRes.data?.weekly_rank || 0,
          totalEarned: statsRes.data?.total_earned || 0,
          totalReferred: statsRes.data?.total_referred || 0,
          pendingEarnings: statsRes.data?.pending_earnings || 0,
        });

        // Ensure refsRes.data is an array before mapping
        const referralsData = Array.isArray(refsRes.data)
          ? refsRes.data
          : Array.isArray(refsRes)
          ? refsRes
          : [];

        try {
          const mapped = referralsData.map((r) => ({
            id: r.id,
            name: r.name || r.full_name || r.email || "Unknown",
            phone: r.phone || r.whatsapp || "",
            status: r.status || (r.verified ? "verified" : "pending"),
            date: r.created_at
              ? new Date(r.created_at).toISOString().slice(0, 10)
              : "",
            earnings: r.earnings || r.reward_amount || 0,
          }));
          setMyReferrals(mapped);
        } catch (mapError) {
          console.error("Error mapping referrals data:", mapError);
          console.error("Referrals data structure:", referralsData);
          setMyReferrals([]);
        }
      } catch (e) {
        setError(e?.message || "Failed to load referrals");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // 10s poll
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const copyReferralLink = () => {
    if (!userData.referralLink) return;
    navigator.clipboard.writeText(userData.referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareWhatsApp = () => {
    const message = `Hey! Join myDelsu and get access to past questions, CGPA calculator, and more student resources. Use my link: ${
      userData.referralLink || "https://mydelsu.com/register"
    }`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const ensureReferralLink = async () => {
    try {
      if (!userData.referralLink) {
        const res = await apiClient.generateReferralLink();
        if (res?.data?.referral_link) {
          setUserData((prev) => ({
            ...prev,
            referralCode: res.data.referral_code || prev.referralCode,
            referralLink: res.data.referral_link,
          }));
        }
      }
    } catch (e) {
      // no-op
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
        currentPath="/dashboard/referrals"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Referrals
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Invite friends and earn rewards! 🎁
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Weekly Rank */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🏆</span>
              <p className="text-sm text-gray-600">Weekly Rank</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: "#488bbf" }}>
              #{userData.weeklyRank}
            </p>
          </div>

          {/* Total Earned */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">💰</span>
              <p className="text-sm text-gray-600">Total Earned</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₦{Number(userData.totalEarned).toLocaleString()}
            </p>
          </div>

          {/* Total Referrals */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">👥</span>
              <p className="text-sm text-gray-600">Total Referrals</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: "#488bbf" }}>
              {userData.totalReferred}
            </p>
          </div>

          {/* Pending */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">⏳</span>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <p className="text-3xl font-bold text-amber-600">
              ₦{Number(userData.pendingEarnings).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              style={{ color: "#488bbf" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Your Referral Link
          </h3>

          {/* Link display with leaderboard button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <input
                type="text"
                value={userData.referralLink}
                readOnly
                className="flex-1 bg-transparent text-gray-700 text-sm outline-none"
              />
              <button
                onClick={() => {
                  ensureReferralLink();
                  copyReferralLink();
                }}
                className="ml-2 px-4 py-2 rounded-lg font-medium text-sm transition-all text-white"
                style={{ backgroundColor: copiedLink ? "#22c55e" : "#488bbf" }}
              >
                {copiedLink ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={() => (window.location.href = "/leaderboard")}
              className="px-6 py-3 bg-white border-2 rounded-lg font-medium hover:text-white transition-all"
              style={{ borderColor: "#488bbf", color: "#488bbf" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#488bbf")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
            >
              🏆 View Leaderboard
            </button>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={shareWhatsApp}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>WhatsApp</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              <span>Twitter</span>
            </button>
          </div>
        </div>

        {/* My Referrals */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">My Referrals</h3>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setReferralTab("all")}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                referralTab === "all"
                  ? "text-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={
                referralTab === "all"
                  ? { borderColor: "#488bbf", color: "#488bbf" }
                  : {}
              }
            >
              All Referrals ({myReferrals.length})
            </button>
            <button
              onClick={() => setReferralTab("pending")}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                referralTab === "pending"
                  ? "text-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={
                referralTab === "pending"
                  ? { borderColor: "#488bbf", color: "#488bbf" }
                  : {}
              }
            >
              Pending (
              {myReferrals.filter((r) => r.status === "pending").length})
            </button>
          </div>

          {/* Referrals Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReferrals.map((referral) => (
              <div
                key={referral.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {referral.name}
                    </p>
                    <p className="text-sm text-gray-500">{referral.phone}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      referral.status === "verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {referral.status === "verified"
                      ? "✓ Verified"
                      : "⏳ Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{referral.date}</p>
                  {referral.status === "verified" && (
                    <p className="text-sm font-semibold text-green-600">
                      +₦{referral.earnings}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredReferrals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">
                No {referralTab === "pending" ? "pending" : ""} referrals yet
              </p>
              <p className="text-sm">
                Share your referral link to start earning!
              </p>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            How Referrals Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: "#488bbf20" }}
              >
                <span className="text-2xl">1️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Share Your Link
              </h4>
              <p className="text-sm text-gray-600">
                Copy your unique referral link and share it with friends via
                WhatsApp, Facebook, or any platform.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">They Sign Up</h4>
              <p className="text-sm text-gray-600">
                When someone registers using your link, they become your
                referral and you earn rewards!
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Get Paid ₦500
              </h4>
              <p className="text-sm text-gray-600">
                Once they activate their account, ₦500 is instantly added to
                your wallet balance!
              </p>
            </div>
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

export default function ProtectedReferralsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ReferralsPage />
    </AuthGuard>
  );
}
