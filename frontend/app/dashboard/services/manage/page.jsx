"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import apiClient from "../../../../lib/api";
import AuthGuard from "../../../../components/AuthGuard";
import DashboardLayout from "../../../../components/DashboardLayout";

export default function ManageServicesPage() {
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load services from backend
  useEffect(() => {
    if (isAuthenticated) {
      loadServices();
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMyServices();

      if (response.success) {
        // Map backend data to frontend format
        const mappedServices = response.data.map((service) => {
          // Parse images if it's a string
          let images = [];
          try {
            if (typeof service.images === "string") {
              images = JSON.parse(service.images);
            } else if (Array.isArray(service.images)) {
              images = service.images;
            }
          } catch (e) {
            images = [];
          }

          // Get first image or placeholder
          const imageUrl =
            images.length > 0
              ? images[0]
              : "https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=400";

          // Map backend status to frontend status
          // Backend: 'active', 'inactive', 'sold'
          // Frontend: 'active', 'paused', 'completed'
          let frontendStatus = service.status || "active";
          if (frontendStatus === "inactive") {
            frontendStatus = "paused";
          } else if (frontendStatus === "sold") {
            frontendStatus = "completed";
          }

          return {
            id: service.id,
            name: service.title,
            title: service.title,
            price: parseFloat(service.price) || 0,
            priceType: "per service", // Default since backend doesn't have this
            image: imageUrl,
            images: images,
            category: service.category || "services",
            status: frontendStatus,
            backendStatus: service.status || "active", // Keep original for API calls
            description: service.description || "",
            location: service.location || "",
            contact: service.contact || "",
            availability: service.availability || "",
            experience: service.experience || "",
            datePosted: service.created_at || new Date().toISOString(),
            views: 0, // Backend doesn't track views yet
            interested: 0, // Backend doesn't track interested yet
          };
        });
        setServices(mappedServices);
      } else {
        setError(response.message || "Failed to load services");
      }
    } catch (err) {
      console.error("Error loading services:", err);
      setError(err.message || "Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await apiClient.getNotifications();
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const filteredServices =
    activeFilter === "all"
      ? services
      : services.filter((s) => s.status === activeFilter);

  const stats = {
    total: services.length,
    active: services.filter((s) => s.status === "active").length,
    pending: 0, // Backend doesn't support pending status for marketplace items
    completed: services.filter((s) => s.status === "completed").length,
    paused: services.filter((s) => s.status === "paused").length,
    totalViews: services.reduce((sum, s) => sum + (s.views || 0), 0),
    totalInterested: services.reduce((sum, s) => sum + (s.interested || 0), 0),
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: {
        text: "Active",
        bg: "bg-green-100",
        textColor: "text-green-800",
      },
      pending: {
        text: "Pending Approval",
        bg: "bg-amber-100",
        textColor: "text-amber-800",
      },
      completed: {
        text: "Completed",
        bg: "bg-blue-100",
        textColor: "text-blue-800",
      },
      sold: {
        text: "Completed",
        bg: "bg-blue-100",
        textColor: "text-blue-800",
      },
      paused: {
        text: "Paused",
        bg: "bg-gray-100",
        textColor: "text-gray-800",
      },
      inactive: {
        text: "Paused",
        bg: "bg-gray-100",
        textColor: "text-gray-800",
      },
    };
    return badges[status] || badges.active;
  };

  const handleEdit = (service) => {
    // Navigate to edit page or open edit modal
    window.location.href = `/dashboard/services/${service.id}/edit`;
  };

  const handlePause = (service) => {
    setSelectedService(service);
    setShowPauseModal(true);
  };

  const confirmPause = async () => {
    if (!selectedService) return;

    try {
      setActionLoading("pause");
      // Backend expects 'inactive' status
      await apiClient.updateService(selectedService.id, {
        status: "inactive",
      });

      // Reload services
      await loadServices();
      setShowPauseModal(false);
      setSelectedService(null);
    } catch (err) {
      console.error("Error pausing service:", err);
      alert(err.message || "Failed to pause service. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (service) => {
    try {
      setActionLoading(`resume-${service.id}`);
      await apiClient.updateService(service.id, {
        status: "active",
      });

      // Reload services
      await loadServices();
    } catch (err) {
      console.error("Error resuming service:", err);
      alert(err.message || "Failed to resume service. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkCompleted = async (service) => {
    try {
      setActionLoading(`complete-${service.id}`);
      // Backend expects 'sold' status for completed services
      await apiClient.updateService(service.id, {
        status: "sold",
      });

      // Reload services
      await loadServices();
    } catch (err) {
      console.error("Error marking service as completed:", err);
      alert(err.message || "Failed to update service. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;

    try {
      setActionLoading("delete");
      await apiClient.deleteService(selectedService.id);

      // Remove from local state immediately
      setServices(services.filter((s) => s.id !== selectedService.id));
      setShowDeleteModal(false);
      setSelectedService(null);
    } catch (err) {
      console.error("Error deleting service:", err);
      alert(err.message || "Failed to delete service. Please try again.");
      // Reload services on error
      await loadServices();
    } finally {
      setActionLoading(null);
    }
  };

  const handleRepost = async (service) => {
    try {
      setActionLoading(`repost-${service.id}`);
      await apiClient.updateService(service.id, {
        status: "active",
      });

      // Reload services
      await loadServices();
    } catch (err) {
      console.error("Error reposting service:", err);
      alert(err.message || "Failed to repost service. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBoost = (service) => {
    alert(
      `Boost ${service.name} for ₦500?\n\nThis will feature your service for 7 days at the top of search results!`
    );
  };

  const formatPrice = (price, priceType) => {
    const formatted = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
    return `${formatted} ${priceType}`;
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
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <AuthGuard>
      <DashboardLayout
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
      >
        {/* Page Title */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Manage My Services
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage all your service offerings
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
              <button
                onClick={loadServices}
                className="ml-4 text-red-800 underline hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Services</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-green-600">
                {stats.active}
              </div>
              <div className="text-sm text-gray-600 mt-1">Active</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold" style={{ color: "#488bbf" }}>
                {stats.totalViews}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Views</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalInterested}
              </div>
              <div className="text-sm text-gray-600 mt-1">Interested</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-x-auto">
            <div className="flex">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "all"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "all"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "active"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "active"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setActiveFilter("completed")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "completed"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "completed"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                Completed ({stats.completed})
              </button>
              <button
                onClick={() => setActiveFilter("paused")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "paused"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "paused"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                Paused ({stats.paused})
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredServices.length > 0 ? (
            /* Services List */
            <div className="space-y-4">
              {filteredServices.map((service) => {
                const badge = getStatusBadge(service.status);
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                  >
                    <div className="p-4">
                      <div className="flex gap-4">
                        {/* Service Image */}
                        <div className="relative shrink-0">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/200?text=No+Image";
                            }}
                          />
                          <span
                            className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${badge.bg} ${badge.textColor}`}
                          >
                            {badge.text}
                          </span>
                        </div>

                        {/* Service Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {service.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <span>{service.category}</span>
                                {service.experience && (
                                  <>
                                    <span>•</span>
                                    <span>{service.experience}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                  {formatPrice(
                                    service.price,
                                    service.priceType
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span>{service.views || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1">
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
                                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                />
                              </svg>
                              <span>{service.interested || 0} interested</span>
                            </div>
                            <div className="flex items-center gap-1">
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{formatDate(service.datePosted)}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {service.status === "active" && (
                              <>
                                <button
                                  onClick={() => handleEdit(service)}
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition"
                                  style={{
                                    backgroundColor: "#488bbf",
                                    color: "white",
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handlePause(service)}
                                  disabled={actionLoading === "pause"}
                                  className="px-4 py-2 bg-amber-100 text-amber-700 text-sm font-semibold rounded-lg hover:bg-amber-200 transition disabled:opacity-50"
                                >
                                  {actionLoading === "pause"
                                    ? "Loading..."
                                    : "Pause"}
                                </button>
                                <button
                                  onClick={() => handleMarkCompleted(service)}
                                  disabled={
                                    actionLoading === `complete-${service.id}`
                                  }
                                  className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-200 transition disabled:opacity-50"
                                >
                                  {actionLoading === `complete-${service.id}`
                                    ? "Loading..."
                                    : "Mark Completed"}
                                </button>
                                <button
                                  onClick={() => handleBoost(service)}
                                  className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-lg hover:bg-purple-200 transition"
                                >
                                  🚀 Boost (₦500)
                                </button>
                                <button
                                  onClick={() => handleDelete(service)}
                                  disabled={actionLoading === "delete"}
                                  className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                                >
                                  {actionLoading === "delete"
                                    ? "Loading..."
                                    : "Delete"}
                                </button>
                              </>
                            )}

                            {service.status === "completed" && (
                              <>
                                <button
                                  onClick={() => handleRepost(service)}
                                  disabled={
                                    actionLoading === `repost-${service.id}`
                                  }
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition disabled:opacity-50"
                                  style={{
                                    backgroundColor: "#488bbf",
                                    color: "white",
                                  }}
                                >
                                  {actionLoading === `repost-${service.id}`
                                    ? "Loading..."
                                    : "Repost"}
                                </button>
                                <button
                                  onClick={() => handleDelete(service)}
                                  disabled={actionLoading === "delete"}
                                  className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                                >
                                  {actionLoading === "delete"
                                    ? "Loading..."
                                    : "Delete"}
                                </button>
                                <div className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center gap-2">
                                  <span>✓ Completed</span>
                                </div>
                              </>
                            )}

                            {(service.status === "paused" ||
                              service.status === "inactive") && (
                              <>
                                <button
                                  onClick={() => handleResume(service)}
                                  disabled={
                                    actionLoading === `resume-${service.id}`
                                  }
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition disabled:opacity-50"
                                  style={{
                                    backgroundColor: "#488bbf",
                                    color: "white",
                                  }}
                                >
                                  {actionLoading === `resume-${service.id}`
                                    ? "Loading..."
                                    : "Resume"}
                                </button>
                                <button
                                  onClick={() => handleEdit(service)}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(service)}
                                  disabled={actionLoading === "delete"}
                                  className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                                >
                                  {actionLoading === "delete"
                                    ? "Loading..."
                                    : "Delete"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No {activeFilter === "all" ? "" : activeFilter} services yet
              </h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === "all"
                  ? "Start offering your skills! Create your first service and connect with students who need your expertise."
                  : `You don't have any ${activeFilter} services at the moment.`}
              </p>
              {activeFilter === "all" && (
                <button
                  onClick={() => (window.location.href = "/dashboard/services")}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition"
                  style={{ backgroundColor: "#488bbf" }}
                >
                  Offer Service
                </button>
              )}
            </div>
          )}

          {/* Tips Section */}
          {filteredServices.length > 0 && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 Tips for More Clients
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Show your portfolio or past work to build trust</li>
                <li>
                  • Write clear descriptions of what you offer and your
                  experience
                </li>
                <li>• Price competitively while valuing your skills</li>
                <li>• Respond quickly to interested clients</li>
                <li>• Collect testimonials from satisfied clients</li>
                <li>
                  • Keep your service active - pause only when truly unavailable
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Pause Service Modal */}
        {showPauseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pause Service?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to pause{" "}
                <strong>{selectedService?.name}</strong>? Your service won't
                accept new requests until you resume it.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPauseModal(false);
                    setSelectedService(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPause}
                  disabled={actionLoading === "pause"}
                  className="flex-1 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                >
                  {actionLoading === "pause" ? "Pausing..." : "Pause Service"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Delete Service?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{selectedService?.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedService(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={actionLoading === "delete"}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {actionLoading === "delete" ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        <button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition hover:scale-110 z-40"
          style={{ backgroundColor: "#488bbf" }}
          onClick={() => (window.location.href = "/dashboard/services")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </DashboardLayout>
    </AuthGuard>
  );
}
