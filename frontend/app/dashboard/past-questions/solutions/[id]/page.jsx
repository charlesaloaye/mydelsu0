"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient, { getBackendBaseUrl } from "../../../../../lib/api";
import DashboardLayout from "../../../../../components/DashboardLayout";
import { useAuth } from "../../../../../contexts/AuthContext";
import Link from "next/link";

export default function SolutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const solutionId = params?.id;

  const [showNotifications, setShowNotifications] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [commentsData, setCommentsData] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);

  // Load notifications
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  // Check premium status
  useEffect(() => {
    if (isAuthenticated) {
      checkPremiumStatus();
    } else {
      setCheckingPremium(false);
    }
  }, [isAuthenticated, user]);

  // Load solution data
  useEffect(() => {
    if (solutionId && isAuthenticated) {
      if (!checkingPremium) {
        loadSolution();
      }
    }
  }, [solutionId, isAuthenticated, checkingPremium]);

  // Load comments when solution is loaded
  useEffect(() => {
    if (solution && solution.id) {
      loadComments();
    }
  }, [solution?.id]);

  const loadNotifications = async () => {
    try {
      const response = await apiClient.getNotifications();
      setNotifications(response.data?.data || []);
      setUnreadCount(response.data?.unread_count || 0);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const checkPremiumStatus = async () => {
    setCheckingPremium(true);
    try {
      const response = await apiClient.getUserSubscription();
      if (response.success && response.data) {
        const subscription = response.data;
        // Check if user has premium subscription
        const premium =
          subscription.plan === "premium" || subscription.plan === "Premium";
        setIsPremium(premium);
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error("Error checking premium status:", error);
      setIsPremium(false);
    } finally {
      setCheckingPremium(false);
    }
  };

  const loadSolution = async () => {
    if (!isPremium) {
      setError("Premium subscription required to view solutions");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiClient.getSolution(solutionId);

      if (response.success && response.data) {
        const solutionData = mapSolutionData(response.data);
        setSolution(solutionData);

        // Load images from file URL - for now using placeholder
        // In future, you might want to extract images from PDF or use file preview
        if (solutionData.fileUrl) {
          // If it's a PDF or document, you'd need to convert to images
          // For now, use placeholder images
          solutionData.images = [
            solutionData.fileUrl,
            solutionData.fileUrl,
            solutionData.fileUrl,
            solutionData.fileUrl,
          ];
        } else {
          solutionData.images = [
            "/images/placeholder.png",
            "/images/placeholder.png",
            "/images/placeholder.png",
            "/images/placeholder.png",
          ];
        }

        // Load comments from API
        if (response.data.comments) {
          const comments = response.data.comments.map(mapCommentData);
          setCommentsData(comments);
        }
      } else {
        setError(response.message || "Solution not found");
      }
    } catch (e) {
      if (e.status === 403) {
        setError("Premium subscription required to view solutions");
      } else {
        setError(e.message || "Failed to load solution");
      }
      console.error("Error loading solution:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    if (!solution?.id) return;

    try {
      const response = await apiClient.getSolutionComments(solution.id);
      if (response.success && response.data) {
        const comments = response.data.map(mapCommentData);
        setCommentsData(comments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const mapCommentData = (comment) => {
    const userName = comment.user
      ? `${comment.user.first_name || ""} ${
          comment.user.last_name || ""
        }`.trim()
      : "Unknown";

    const getInitials = (name) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const generateColor = (id) => {
      const colors = [
        "#488bbf",
        "#ec4899",
        "#10b981",
        "#8b5cf6",
        "#f59e0b",
        "#06b6d4",
      ];
      return colors[id % colors.length];
    };

    return {
      id: comment.id,
      userName: userName,
      userInitials: getInitials(userName),
      userColor: generateColor(comment.user_id || comment.id),
      rating: comment.rating || 0,
      comment: comment.comment || "",
      timestamp:
        comment.created_at || comment.timestamp || new Date().toISOString(),
      helpful: comment.helpful_count || comment.helpful || 0,
    };
  };

  // Map backend solution data to frontend format
  const mapSolutionData = (solutionData) => {
    const userName = solutionData.user
      ? `${solutionData.user.first_name || ""} ${
          solutionData.user.last_name || ""
        }`.trim()
      : "Unknown";

    const getInitials = (name) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const generateColor = (id) => {
      const colors = [
        "#488bbf",
        "#ec4899",
        "#10b981",
        "#8b5cf6",
        "#f59e0b",
        "#06b6d4",
      ];
      return colors[id % colors.length];
    };

    // Get file URL
    const fileUrl = solutionData.file_path
      ? `${getBackendBaseUrl()}/storage/${solutionData.file_path}`
      : null;

    return {
      id: solutionData.id,
      courseCode: solutionData.course_code || "",
      courseTitle: solutionData.course_title || "",
      level: solutionData.level ? `${solutionData.level} Level` : "",
      semester:
        solutionData.semester === 1 || solutionData.semester === "1"
          ? "First Semester"
          : solutionData.semester === 2 || solutionData.semester === "2"
          ? "Second Semester"
          : "",
      session: solutionData.session || "",
      uploadedBy: userName,
      userInitials: getInitials(userName),
      userColor: generateColor(solutionData.id),
      rating: parseFloat(solutionData.rating || 0),
      totalRatings: solutionData.rating_count || 0,
      format: solutionData.file_type?.includes("pdf") ? "PDF" : "DOC",
      pages: 0, // Can be calculated from file if needed
      verified: solutionData.status === "approved",
      uploadDate: solutionData.created_at || "",
      fileUrl: fileUrl,
      description: solutionData.description || "",
    };
  };

  const displayedComments = showAllComments
    ? commentsData
    : commentsData.slice(0, 3);

  const nextImage = () => {
    if (solution && solution.images) {
      setCurrentImageIndex((prev) => (prev + 1) % solution.images.length);
      setZoomLevel(1);
    }
  };

  const prevImage = () => {
    if (solution && solution.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + solution.images.length) % solution.images.length
      );
      setZoomLevel(1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const toggleZoom = () => {
    if (zoomLevel === 1) {
      setZoomLevel(2);
    } else {
      setZoomLevel(1);
    }
  };

  const handleRatingClick = async (rating) => {
    if (!solution || !isAuthenticated) {
      alert("Please login to rate this solution");
      return;
    }

    if (!isPremium) {
      alert("Premium subscription required to rate solutions");
      return;
    }

    try {
      const response = await apiClient.addSolutionReview(solution.id, rating);
      if (response.success) {
        setUserRating(rating);
        // Reload solution to get updated rating and reviews
        await loadSolution();
        alert(
          `You rated this solution ${rating} stars! Thank you for your feedback.`
        );
      } else {
        alert(response.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error rating solution:", error);
      if (error.status === 403) {
        alert("Premium subscription required to rate solutions");
      } else {
        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to submit rating"
        );
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      return;
    }

    if (!isAuthenticated) {
      alert("Please login to comment on solutions");
      return;
    }

    if (!isPremium) {
      alert("Premium subscription required to comment on solutions");
      return;
    }

    if (!solution?.id) {
      return;
    }

    try {
      const response = await apiClient.addSolutionComment(
        solution.id,
        commentText.trim()
      );
      if (response.success) {
        setCommentText("");
        // Reload comments
        await loadComments();
        alert("Comment added successfully!");
      } else {
        alert(response.message || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      if (error.status === 403) {
        alert("Premium subscription required to comment on solutions");
      } else {
        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to submit comment"
        );
      }
    }
  };

  const handleMarkHelpful = async (commentId) => {
    try {
      await apiClient.markCommentHelpful(commentId);
      // Reload comments to get updated helpful count
      await loadComments();
    } catch (error) {
      console.error("Error marking comment as helpful:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
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

  const renderStars = (rating, interactive = false, size = "normal") => {
    const stars = [];
    const sizeClass = size === "small" ? "text-sm" : "text-xl";

    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive
        ? hoverRating >= i || (hoverRating === 0 && userRating >= i)
        : i <= rating;
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && handleRatingClick(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${
            interactive ? "cursor-pointer hover:scale-110 transition" : ""
          } ${isFilled ? "text-yellow-500" : "text-gray-300"} ${sizeClass}`}
          disabled={!interactive}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  if (checkingPremium || loading) {
    return (
      <DashboardLayout
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf] mx-auto mb-4"></div>
            <p className="text-gray-600">
              {checkingPremium
                ? "Checking subscription..."
                : "Loading solution..."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isPremium) {
    return (
      <DashboardLayout
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Premium Subscription Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need a premium subscription to view solutions. Upgrade now to
              access all premium features including solutions, advanced
              features, and more!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() =>
                  router.push("/dashboard/past-questions/solutions")
                }
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Back to Solutions
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-[#488bbf] text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !solution) {
    return (
      <DashboardLayout
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Solution Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "The solution you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => router.push("/dashboard/past-questions/solutions")}
              className="px-6 py-3 bg-[#488bbf] text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Back to Solutions
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => setShowNotifications(!showNotifications)}
    >
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-semibold">Back to Solutions</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Solution Viewer (2/3 width) */}
            <div className="lg:col-span-2">
              {/* Course Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Course Information
                  </h2>
                  {solution.verified && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
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

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">
                      Course Code:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {solution.courseCode}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">
                      Course Title:
                    </span>
                    <span className="text-gray-900">
                      {solution.courseTitle}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">
                      Level:
                    </span>
                    <span className="text-gray-900">{solution.level}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">
                      Semester:
                    </span>
                    <span className="text-gray-900">{solution.semester}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">
                      Session:
                    </span>
                    <span className="text-gray-900">{solution.session}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">
                      Format:
                    </span>
                    <span className="text-gray-900">{solution.format}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">
                      Total Pages:
                    </span>
                    <span className="text-gray-900">
                      {solution.pages} pages
                    </span>
                  </div>
                </div>

                {/* Uploader Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: solution.userColor }}
                  >
                    {solution.userInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Solution by {solution.uploadedBy}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(solution.rating)}</div>
                      <span className="text-sm font-semibold text-gray-900">
                        {solution.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({solution.totalRatings} ratings)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution Image Viewer */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div
                  className="relative bg-gray-100 rounded-lg overflow-hidden"
                  style={{ minHeight: "500px" }}
                >
                  <div
                    className="w-full h-full overflow-auto cursor-zoom-in"
                    onClick={toggleZoom}
                    style={{ maxHeight: "600px" }}
                  >
                    <img
                      src={solution.images[currentImageIndex]}
                      alt={`Solution page ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain transition-transform duration-200"
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: "center center",
                        cursor: zoomLevel > 1 ? "zoom-out" : "zoom-in",
                      }}
                    />
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-gray-300 text-5xl font-bold opacity-15 rotate-[-30deg]">
                        myDELSU Premium
                      </div>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoomIn();
                      }}
                      className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition"
                      title="Zoom In"
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoomOut();
                      }}
                      className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition"
                      title="Zoom Out"
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetZoom();
                      }}
                      className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition"
                      title="Reset Zoom"
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Zoom Indicator */}
                  {zoomLevel !== 1 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-gray-700 text-sm font-semibold rounded-lg shadow-lg">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {solution.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Page Counter */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded">
                    Page {currentImageIndex + 1} of {solution.images.length}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {solution.images.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-4">
                    {solution.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setZoomLevel(1);
                        }}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                          currentImageIndex === index
                            ? "border-2"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={
                          currentImageIndex === index
                            ? { borderColor: "#488bbf" }
                            : {}
                        }
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <span className="text-xs text-white font-bold drop-shadow">
                            {index + 1}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Ratings & Comments (1/3 width) */}
            <div className="lg:col-span-1">
              {/* Rate This Solution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Rate This Solution
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  How helpful was this solution?
                </p>
                <div className="flex justify-center gap-1 mb-3">
                  {renderStars(userRating, true)}
                </div>
                {userRating > 0 && (
                  <p className="text-center text-sm text-green-600 font-semibold">
                    Thank you for rating!
                  </p>
                )}
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Comments ({commentsData.length})
                </h3>

                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts about this solution..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none text-sm"
                    style={{ focusRing: "#488bbf" }}
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="mt-2 w-full px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition"
                    style={{ backgroundColor: "#488bbf" }}
                  >
                    Post Comment
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {displayedComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-gray-200 pb-4 last:border-0"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                          style={{ backgroundColor: comment.userColor }}
                        >
                          {comment.userInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {comment.userName}
                            </p>
                            <div className="flex">
                              {renderStars(comment.rating, false, "small")}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {comment.comment}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(comment.timestamp)}
                            </span>
                            <button
                              onClick={() => handleMarkHelpful(comment.id)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                              </svg>
                              <span>{comment.helpful}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {commentsData.length > 3 && (
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm"
                  >
                    {showAllComments
                      ? "Show Less"
                      : `Show All ${commentsData.length} Comments`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
