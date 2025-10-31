"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";

function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState(""); // 'profile' or 'studentId'
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    dob: "",
    matric_num: "",
    student_id: "",
    type: "aspirant",
    role: "user",
    user_status: "current_student",
    referral_code: "",
    referral_number: "",
    referrer_id: null,
    how_did_you_hear: "",
    social_media: "",
    is_verified: false,
    profile_complete: 0,
    balance: 0,
    wallet_balance: 0,
    picture: null,
    avatar: null,
    verification_status: "not_submitted",
    verification_submitted_at: null,
    student_id_image: null,
    additional_documents: null,
    created_at: "",
    updated_at: "",
    last_login_at: null,
  });

  const [editData, setEditData] = useState({ ...profileData });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProfileData();
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getProfile();

      if (response.success) {
        setProfileData(response.data);
        setEditData(response.data);
      } else {
        setError("Failed to load profile data");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile data");
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset edit data to current profile data
      setEditData({ ...profileData });
      setPasswordData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData = {
        first_name: editData.first_name,
        last_name: editData.last_name,
        email: editData.email,
        phone: editData.phone,
        whatsapp: editData.whatsapp,
        dob: editData.dob,
        matric_num: editData.matric_num,
        student_id: editData.student_id,
        type: editData.type,
        user_status: editData.user_status,
        how_did_you_hear: editData.how_did_you_hear,
        social_media: editData.social_media,
      };

      // Add password data if provided
      if (passwordData.password) {
        updateData.current_password = passwordData.current_password;
        updateData.password = passwordData.password;
        updateData.password_confirmation = passwordData.password_confirmation;
      }

      const response = await apiClient.updateProfile(updateData);

      if (response.success) {
        setProfileData(response.data.user);
        setEditData(response.data.user);
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
        setPasswordData({
          current_password: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, JPG, or GIF)");
      return;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 2MB");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();
      formData.append(type === "profile" ? "avatar" : "student_id_image", file);

      const response = await apiClient.request(
        `/profile/${type === "profile" ? "upload-avatar" : "verify"}`,
        {
          method: "POST",
          headers: {
            // Don't set Content-Type, let browser set it with boundary
          },
          body: formData,
        }
      );

      if (response.success) {
        setSuccess(
          `${
            type === "profile" ? "Avatar" : "Student ID"
          } uploaded successfully!`
        );
        await loadProfileData(); // Reload profile data
      } else {
        // Handle validation errors more specifically
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat();
          setError(errorMessages.join(", "));
        } else {
          setError(response.message || `Failed to upload ${type}`);
        }
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      // Provide more specific error messages
      if (err.message.includes("Validation failed")) {
        setError(
          "Please check the file format and size. Supported formats: JPEG, PNG, JPG, GIF (max 2MB)"
        );
      } else if (err.message.includes("422")) {
        setError(
          "Invalid file format or size. Please use JPEG, PNG, JPG, or GIF files under 2MB."
        );
      } else {
        setError(`Failed to upload ${type}. Please try again.`);
      }
    } finally {
      setSaving(false);
      setShowUploadModal(false);
    }
  };

  const getInitials = () => {
    return `${profileData.first_name?.charAt(0) || ""}${
      profileData.last_name?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getProfileCompletionColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Verified";
      case "pending":
        return "Pending Review";
      case "rejected":
        return "Rejected";
      default:
        return "Not Submitted";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf]"></div>
      </div>
    );
  }

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => setShowNotifications(!showNotifications)}
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your personal information and account settings
              </p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2 bg-[#488bbf] text-white rounded-lg hover:bg-[#3a7ba8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="px-6 py-2 bg-[#488bbf] text-white rounded-lg hover:bg-[#3a7ba8] transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Header Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg"
                      style={{ backgroundColor: "#488bbf" }}
                    >
                      {getInitials()}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setUploadType("profile");
                      setShowUploadModal(true);
                    }}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center shadow-lg hover:shadow-xl transition"
                    style={{ borderColor: "#488bbf" }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#488bbf" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {profileData.first_name} {profileData.last_name}
                </h2>
                <p className="text-gray-600 mb-1">{profileData.email}</p>
                {profileData.matric_num && (
                  <p className="text-gray-600 mb-1">{profileData.matric_num}</p>
                )}
                {profileData.student_id && (
                  <p className="text-gray-600 mb-4">
                    ID: {profileData.student_id}
                  </p>
                )}
                {!profileData.matric_num && !profileData.student_id && (
                  <p className="text-gray-600 mb-4">Student Information</p>
                )}

                {/* Verification Status */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVerificationStatusColor(
                      profileData.verification_status
                    )}`}
                  >
                    {profileData.is_verified
                      ? "✓ Verified"
                      : getVerificationStatusText(
                          profileData.verification_status
                        )}
                  </span>
                </div>

                {/* Profile Completion */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Profile Completion
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {profileData.profile_complete}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProfileCompletionColor(
                        profileData.profile_complete
                      )}`}
                      style={{ width: `${profileData.profile_complete}%` }}
                    ></div>
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Wallet Balance
                    </span>
                    <span className="text-lg font-bold text-[#488bbf]">
                      ₦{profileData.wallet_balance?.toLocaleString() || "0.00"}
                    </span>
                  </div>
                </div>

                {/* Member Since */}
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(profileData.created_at).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setUploadType("studentId");
                    setShowUploadModal(true);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
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
                    <div>
                      <p className="font-medium text-gray-900">
                        Upload Student ID
                      </p>
                      <p className="text-sm text-gray-500">
                        Verify your student status
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/dashboard/wallet")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">View Wallet</p>
                      <p className="text-sm text-gray-500">
                        Check your balance and transactions
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/dashboard/referrals")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Referrals</p>
                      <p className="text-sm text-gray-500">
                        Manage your referrals and earnings
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-6">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.first_name || ""}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.first_name || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.last_name || ""}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.last_name || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.email || "Not provided"}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.whatsapp || ""}
                      onChange={(e) =>
                        handleInputChange("whatsapp", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="Enter your WhatsApp number"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.whatsapp || "Not provided"}
                    </p>
                  )}
                </div>

                {/* User Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Status *
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.user_status || "current_student"}
                      onChange={(e) =>
                        handleInputChange("user_status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                    >
                      <option value="aspirant">Aspirant</option>
                      <option value="current_student">Current Student</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2 capitalize">
                      {profileData.user_status?.replace("_", " ") ||
                        "Not specified"}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.dob || ""}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.dob || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Matric Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matric Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.matric_num || ""}
                      onChange={(e) =>
                        handleInputChange("matric_num", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="Enter your matric number"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.matric_num || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Student ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.student_id || ""}
                      onChange={(e) =>
                        handleInputChange("student_id", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="Enter your student ID"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.student_id || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.type || "aspirant"}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                    >
                      <option value="aspirant">Aspirant</option>
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2 capitalize">
                      {profileData.type || "Not specified"}
                    </p>
                  )}
                </div>

                {/* How did you hear about us */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about us?
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.how_did_you_hear || ""}
                      onChange={(e) =>
                        handleInputChange("how_did_you_hear", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="How did you hear about us?"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.how_did_you_hear || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Social Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.social_media || ""}
                      onChange={(e) =>
                        handleInputChange("social_media", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      placeholder="Your social media handle"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profileData.social_media || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Code
                  </label>
                  <p className="text-gray-900 py-2 font-mono">
                    {profileData.referral_code || "Not generated"}
                  </p>
                </div>
              </div>

              {/* Password Section */}
              {isEditing && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">
                    Change Password
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) =>
                          handlePasswordChange(
                            "current_password",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.password}
                        onChange={(e) =>
                          handlePasswordChange("password", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.password_confirmation}
                        onChange={(e) =>
                          handlePasswordChange(
                            "password_confirmation",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Leave password fields empty if you don't want to change your
                    password.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="font-bold text-gray-900 mb-4">
              {uploadType === "profile"
                ? "Upload Profile Picture"
                : "Upload Student ID"}
            </h3>
            <p className="text-gray-600 mb-4">
              {uploadType === "profile"
                ? "Choose a clear profile picture for your account."
                : "Upload a clear image of your student ID for verification."}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, uploadType)}
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function ProtectedProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfilePage />
    </AuthGuard>
  );
}
