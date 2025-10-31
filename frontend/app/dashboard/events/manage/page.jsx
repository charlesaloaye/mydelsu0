"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../../contexts/AuthContext";
import apiClient from "../../../../lib/api";
import DashboardLayout from "../../../../components/DashboardLayout";
import Swal from "sweetalert2";

export default function EventManagementPage() {
  const { isAuthenticated } = useAuth();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [currentTag, setCurrentTag] = useState("");
  const [editTickets, setEditTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendeesEventId, setAttendeesEventId] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Load notifications if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    let intervalId = null;

    const loadNotifications = async () => {
      try {
        const [notificationsResponse, unreadResponse] = await Promise.all([
          apiClient.getNotifications(),
          apiClient.getUnreadCount(),
        ]);

        if (!isMounted) return;

        if (notificationsResponse?.success) {
          setNotifications(notificationsResponse.data.data || []);
        } else {
          setNotifications([]);
        }

        if (unreadResponse?.success) {
          setUnreadCount(unreadResponse.data.unread_count || 0);
        } else {
          setUnreadCount(0);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
        if (!isMounted) return;
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    loadNotifications();

    // Refresh notifications every minute
    intervalId = setInterval(loadNotifications, 60000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  // Categories
  const categories = [
    "Academic",
    "Social/Parties",
    "Sports",
    "Career",
    "Religious",
    "Cultural",
    "Entertainment",
    "Workshop",
    "Other",
  ];

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState({
    tier: "Standard",
    eventsCreated: 0,
    eventsLimit: 10,
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      console.log(
        "Loading events with params:",
        params,
        "filterStatus:",
        filterStatus
      );

      const response = await apiClient.getMyEvents(params);

      if (response && response.success) {
        console.log("Events loaded:", response.data?.length || 0, "events");
        setEvents(response.data || []);
        // Update subscription info
        setUserSubscription((prev) => ({
          ...prev,
          eventsCreated: response.data?.length || 0,
        }));
      } else {
        console.error(
          "Failed to load events:",
          response?.message || "Unknown error",
          response
        );
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load events
  useEffect(() => {
    if (!isAuthenticated) return;
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, filterStatus]);

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-700",
      ongoing: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
      upcoming: "📅 Upcoming",
      ongoing: "⚡ Ongoing",
      completed: "✅ Completed",
      cancelled: "❌ Cancelled",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  // Search effect - reload events when search query changes
  useEffect(() => {
    if (!isAuthenticated) return;
    const timeoutId = setTimeout(() => {
      loadEvents();
    }, 500); // Debounce search
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Filter events by search query (status filtering is done by the API)
  const filteredEvents = events.filter((event) => {
    if (searchQuery) {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }
    return true;
  });

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await apiClient.deleteEvent(eventId);
      if (response && response.success) {
        await loadEvents();
        setShowDeleteModal(false);
        setSelectedEvent(null);
        await Swal.fire({
          icon: "success",
          title: "Event Deleted",
          text: "The event has been deleted successfully.",
          confirmButtonColor: "#488bbf",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed to Delete Event",
          text:
            response?.message ||
            response?.response?.message ||
            "Failed to delete event",
          confirmButtonColor: "#488bbf",
        });
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      const errorMessage =
        error?.response?.message ||
        error?.message ||
        "Failed to delete event. Please try again.";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#488bbf",
      });
    }
  };

  const handleCancelEvent = async (eventId) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Event not found",
        confirmButtonColor: "#488bbf",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Event?",
      html: `<div style="text-align: left;">
        <p>Are you sure you want to cancel <strong>${event.title}</strong>?</p>
        ${
          event.ticketsSold > 0
            ? `<p class="text-red-600 font-semibold mt-2">⚠️ Warning: ${event.ticketsSold} tickets have been sold for this event!</p>`
            : ""
        }
      </div>`,
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel Event",
      cancelButtonText: "No, Keep It",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    try {
      console.log("Cancelling event:", eventId);
      console.log("Event data to send:", { status: "cancelled" });

      const response = await apiClient.updateEvent(eventId, {
        status: "cancelled",
      });

      console.log("Cancel response:", response);

      if (response && response.success) {
        // Close the details modal if open
        setShowDetailsModal(false);
        setSelectedEvent(null);

        // Switch to cancelled tab if not already there
        // The useEffect will automatically reload events when filterStatus changes
        if (filterStatus !== "cancelled") {
          setFilterStatus("cancelled");
        } else {
          // If already on cancelled tab, reload events manually
          await loadEvents();
        }

        await Swal.fire({
          icon: "success",
          title: "Event Cancelled",
          text: "The event has been cancelled successfully. You can view it in the Cancelled tab.",
          confirmButtonColor: "#488bbf",
        });
      } else {
        const errorMessage =
          response?.message ||
          response?.response?.data?.message ||
          response?.response?.message ||
          "Failed to cancel event";

        await Swal.fire({
          icon: "error",
          title: "Failed to Cancel Event",
          text: errorMessage,
          confirmButtonColor: "#488bbf",
        });
      }
    } catch (error) {
      console.error("Failed to cancel event:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        "Failed to cancel event. Please try again.";

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#488bbf",
      });
    }
  };

  const handleViewAttendees = async (eventId) => {
    setAttendeesEventId(eventId);
    setShowAttendeesModal(true);
    setLoadingAttendees(true);
    setAttendees([]);

    try {
      const response = await apiClient.getEventAttendees(eventId);
      if (response && response.success) {
        setAttendees(response.data || []);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed to Load Attendees",
          text: response?.message || "Failed to load attendees",
          confirmButtonColor: "#488bbf",
        });
        setShowAttendeesModal(false);
      }
    } catch (error) {
      console.error("Failed to load attendees:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Failed to load attendees. Please try again.",
        confirmButtonColor: "#488bbf",
      });
      setShowAttendeesModal(false);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  // Edit Event Functions
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditFormData({
      title: event.title,
      category: event.category,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      images: event.images,
      tags: event.tags,
      sponsored: event.sponsored,
    });
    setEditTickets(event.tickets.map((t) => ({ ...t })));
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const existingCount = editFormData.images.length;
    const newFiles = files.slice(0, 5 - existingCount);
    // Keep existing images (URLs) and add new File objects
    setEditFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles].slice(0, 5),
    }));
  };

  const removeEditImage = (index) => {
    setEditFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addEditTag = () => {
    if (currentTag.trim() && editFormData.tags.length < 5) {
      setEditFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeEditTag = (index) => {
    setEditFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // Edit Ticket Management
  const addEditTicket = () => {
    setEditTickets([
      ...editTickets,
      {
        id: Date.now(),
        name: "",
        price: "",
        description: "",
        benefits: [""],
        limited: false,
        slotsLeft: "",
        sold: 0,
      },
    ]);
  };

  const removeEditTicket = (id) => {
    if (editTickets.length > 1) {
      setEditTickets(editTickets.filter((t) => t.id !== id));
    }
  };

  const updateEditTicket = (id, field, value) => {
    setEditTickets(
      editTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const addEditBenefit = (ticketId) => {
    setEditTickets(
      editTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, benefits: [...ticket.benefits, ""] }
          : ticket
      )
    );
  };

  const updateEditBenefit = (ticketId, benefitIndex, value) => {
    setEditTickets(
      editTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              benefits: ticket.benefits.map((b, i) =>
                i === benefitIndex ? value : b
              ),
            }
          : ticket
      )
    );
  };

  const removeEditBenefit = (ticketId, benefitIndex) => {
    setEditTickets(
      editTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              benefits: ticket.benefits.filter((_, i) => i !== benefitIndex),
            }
          : ticket
      )
    );
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !editFormData.title ||
      !editFormData.category ||
      !editFormData.date ||
      !editFormData.time ||
      !editFormData.location
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields",
        confirmButtonColor: "#488bbf",
      });
      return;
    }

    if (editFormData.images.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Images",
        text: "Please have at least one event image",
        confirmButtonColor: "#488bbf",
      });
      return;
    }

    const hasValidTicket = editTickets.some((t) => t.name.trim());
    if (!hasValidTicket) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Tickets",
        text: "Please have at least one ticket tier",
        confirmButtonColor: "#488bbf",
      });
      return;
    }

    try {
      // Prepare ticket data
      const ticketData = editTickets.map((ticket) => ({
        name: ticket.name,
        price: ticket.price ? parseFloat(ticket.price) : 0,
        description: ticket.description || "",
        benefits: ticket.benefits.filter((b) => b.trim()),
        limited: ticket.limited,
        slots_left: ticket.limited ? parseInt(ticket.slotsLeft) || null : null,
        sold: ticket.sold || 0, // Preserve sold count
      }));

      // Prepare event data - use apiClient.updateEvent which handles FormData
      const formData = {
        title: editFormData.title,
        category: editFormData.category,
        description: editFormData.description,
        date: editFormData.date,
        time: editFormData.time,
        location: editFormData.location,
        sponsored: editFormData.sponsored,
        tags: editFormData.tags || [],
        tickets: ticketData,
      };

      // Separate existing images (URLs) from new image files
      const existingImageUrls = editFormData.images.filter(
        (img) => typeof img === "string" || img instanceof String
      );
      const newImageFiles = editFormData.images.filter(
        (img) => img instanceof File
      );

      // Always send existing_images (even if empty) to replace the entire image set
      // This ensures that removed images are properly deleted
      formData.existing_images = existingImageUrls;

      // Add new image files if any
      if (newImageFiles.length > 0) {
        formData.images = newImageFiles;
      }

      const response = await apiClient.updateEvent(selectedEvent.id, formData);

      if (response && response.success) {
        await loadEvents();
        setShowEditModal(false);
        setSelectedEvent(null);
        setEditFormData(null);
        setEditTickets([]);
        await Swal.fire({
          icon: "success",
          title: "Event Updated!",
          text: "Event updated successfully! 🎉",
          confirmButtonColor: "#488bbf",
        });
      } else {
        const errorMsg =
          response?.message ||
          response?.response?.message ||
          "Failed to update event";
        const validationErrors = response?.response?.errors;
        if (validationErrors) {
          const errorDetails = Object.values(validationErrors)
            .flat()
            .join(", ");
          await Swal.fire({
            icon: "error",
            title: "Update Failed",
            html: `${errorMsg}<br><br>${errorDetails}`,
            confirmButtonColor: "#488bbf",
          });
        } else {
          await Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: errorMsg,
            confirmButtonColor: "#488bbf",
          });
        }
      }
    } catch (error) {
      console.error("Failed to update event:", error);
      const errorMessage =
        error?.response?.message ||
        error?.message ||
        "Failed to update event. Please try again.";
      const validationErrors = error?.response?.errors;
      if (validationErrors) {
        const errorDetails = Object.values(validationErrors).flat().join(", ");
        await Swal.fire({
          icon: "error",
          title: "Error",
          html: `${errorMessage}<br><br>${errorDetails}`,
          confirmButtonColor: "#488bbf",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#488bbf",
        });
      }
    }
  };

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => {}}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 py-4 mb-4 rounded-lg">
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and track your events
                </p>
              </div>
              <Link
                href="/dashboard/events/upload"
                className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition shadow-sm"
                style={{ backgroundColor: "#488bbf" }}
              >
                + Create Event
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription Info Banner */}
        <div className="mb-4">
          <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#488bbf" }}
                >
                  <span className="text-white font-bold text-lg">
                    {userSubscription.tier === "Premium"
                      ? "💎"
                      : userSubscription.tier === "Standard"
                      ? "⭐"
                      : "🌟"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {userSubscription.tier} Plan
                  </h3>
                  <p className="text-sm text-gray-600">
                    {userSubscription.eventsLimit
                      ? `${userSubscription.eventsCreated} / ${userSubscription.eventsLimit} events used`
                      : `${userSubscription.eventsCreated} events created`}
                  </p>
                </div>
              </div>
              {userSubscription.tier !== "Premium" && (
                <button className="px-4 py-2 bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:opacity-90 transition">
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#488bbf" }}
                  />
                  <svg
                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
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

              {/* Status Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {["all", "upcoming", "ongoing", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                        filterStatus === status
                          ? "text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={
                        filterStatus === status
                          ? { backgroundColor: "#488bbf" }
                          : {}
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="pb-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Start by creating your first event"}
              </p>
              <Link
                href="/dashboard/events/upload"
                className="inline-block px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
                >
                  {/* Event Image */}
                  <div className="relative h-48">
                    <img
                      src={
                        event.images?.[0] ||
                        "https://via.placeholder.com/400x300?text=Event"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {event.sponsored && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        ⭐ Sponsored
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">
                        {event.title}
                      </h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
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
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        {event.category}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {event.date} • {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {event.location}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-gray-200">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {event.views}
                        </div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                      <div className="text-center border-l border-r border-gray-200">
                        <div
                          className="text-lg font-bold"
                          style={{ color: "#488bbf" }}
                        >
                          {event.interested}
                        </div>
                        <div className="text-xs text-gray-600">Interested</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {event.ticketsSold}
                        </div>
                        <div className="text-xs text-gray-600">Sold</div>
                      </div>
                    </div>

                    {/* Revenue */}
                    {event.revenue > 0 && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Total Revenue
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ₦{event.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(event)}
                        className="flex-1 px-4 py-2 border-2 font-semibold rounded-lg hover:bg-gray-50 transition"
                        style={{ borderColor: "#488bbf", color: "#488bbf" }}
                      >
                        View Details
                      </button>
                      {/* <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedEvent.status)}
                    {selectedEvent.sponsored && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ Sponsored
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
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
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Event Image */}
              {selectedEvent.images?.[0] && (
                <img
                  src={selectedEvent.images[0]}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedEvent.views}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Views</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#488bbf" }}
                  >
                    {selectedEvent.interested}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Interested</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedEvent.ticketsSold}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Tickets Sold</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    ₦{(selectedEvent.revenue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Revenue</div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  <p className="text-gray-900">{selectedEvent.category}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Date & Time
                  </label>
                  <p className="text-gray-900">
                    {selectedEvent.date} • {selectedEvent.time}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Location
                  </label>
                  <p className="text-gray-900">{selectedEvent.location}</p>
                </div>
              </div>

              {/* Ticket Breakdown */}
              {selectedEvent.tickets.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Ticket Sales Breakdown
                  </h3>
                  <div className="space-y-2">
                    {selectedEvent.tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">
                            {ticket.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {ticket.price === 0
                              ? "Free"
                              : `₦${ticket.price.toLocaleString()}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {ticket.sold} sold
                          </div>
                          {ticket.price > 0 && (
                            <div className="text-sm text-green-600">
                              ₦{(ticket.price * ticket.sold).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleEditEvent(selectedEvent)}
                  className="px-4 py-3 border-2 font-semibold rounded-lg hover:bg-gray-50 transition"
                  style={{ borderColor: "#488bbf", color: "#488bbf" }}
                >
                  ✏️ Edit Event
                </button>
                <button
                  onClick={() => handleViewAttendees(selectedEvent.id)}
                  className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  👥 View Attendees ({selectedEvent.ticketsSold || 0})
                </button>
                {selectedEvent.status === "upcoming" && (
                  <>
                    <button
                      onClick={async () => {
                        await handleCancelEvent(selectedEvent.id);
                      }}
                      className="px-4 py-3 border-2 border-orange-300 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition"
                    >
                      ❌ Cancel Event
                    </button>
                    {!selectedEvent.sponsored && (
                      <button
                        onClick={() =>
                          alert(
                            "Promote event for ₦5,000 to get premium placement"
                          )
                        }
                        className="px-4 py-3 bg-linear-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
                      >
                        ⭐ Promote Event
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedEvent(selectedEvent);
                    setShowDeleteModal(true);
                  }}
                  className="px-4 py-3 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition col-span-2"
                >
                  🗑️ Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Event?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedEvent.title}"? This
                action cannot be undone.
                {selectedEvent.ticketsSold > 0 && (
                  <span className="block mt-2 text-red-600 font-semibold">
                    Warning: {selectedEvent.ticketsSold} tickets have been sold
                    for this event!
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEvent(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEvent(null);
                    setEditFormData(null);
                    setEditTickets([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
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
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <form onSubmit={handleSaveEdit}>
                {/* Basic Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Basic Information
                  </h3>

                  {/* Event Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#488bbf" }}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#488bbf" }}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#488bbf" }}
                      required
                    />
                  </div>
                </div>

                {/* Date, Time & Location */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Date, Time & Location
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={editFormData.date}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ focusRingColor: "#488bbf" }}
                        required
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="time"
                        value={editFormData.time}
                        onChange={handleEditInputChange}
                        placeholder="e.g., 9:00 AM - 5:00 PM"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ focusRingColor: "#488bbf" }}
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#488bbf" }}
                      required
                    />
                  </div>
                </div>

                {/* Event Images */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Event Images
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Images <span className="text-red-500">*</span> (Max
                      5)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditImageUpload}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#488bbf" }}
                    />
                  </div>

                  {/* Image Preview */}
                  {editFormData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {editFormData.images.map((img, index) => {
                        const imageUrl =
                          img instanceof File ? URL.createObjectURL(img) : img;
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Event ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeEditImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Tickets */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Ticket Tiers
                    </h3>
                    <button
                      type="button"
                      onClick={addEditTicket}
                      className="px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition text-sm"
                      style={{ backgroundColor: "#488bbf" }}
                    >
                      + Add Ticket
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editTickets.map((ticket, ticketIndex) => (
                      <div
                        key={ticket.id}
                        className="border-2 border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">
                            Ticket {ticketIndex + 1}
                          </h4>
                          {editTickets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEditTicket(ticket.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Ticket Name */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Ticket Name
                            </label>
                            <input
                              type="text"
                              value={ticket.name}
                              onChange={(e) =>
                                updateEditTicket(
                                  ticket.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Free Entry, VIP Pass"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ focusRingColor: "#488bbf" }}
                            />
                          </div>

                          {/* Price */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Price (₦)
                            </label>
                            <input
                              type="number"
                              value={ticket.price}
                              onChange={(e) =>
                                updateEditTicket(
                                  ticket.id,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="0 for free"
                              min="0"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ focusRingColor: "#488bbf" }}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                          </label>
                          <input
                            type="text"
                            value={ticket.description}
                            onChange={(e) =>
                              updateEditTicket(
                                ticket.id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Brief description of this ticket"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ focusRingColor: "#488bbf" }}
                          />
                        </div>

                        {/* Benefits */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Benefits
                            </label>
                            <button
                              type="button"
                              onClick={() => addEditBenefit(ticket.id)}
                              className="text-sm font-medium hover:underline"
                              style={{ color: "#488bbf" }}
                            >
                              + Add Benefit
                            </button>
                          </div>
                          <div className="space-y-2">
                            {ticket.benefits.map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={benefit}
                                  onChange={(e) =>
                                    updateEditBenefit(
                                      ticket.id,
                                      benefitIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g., Access to all sessions"
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                                  style={{ focusRingColor: "#488bbf" }}
                                />
                                {ticket.benefits.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeEditBenefit(ticket.id, benefitIndex)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Limited Slots */}
                        <div className="flex items-start space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={ticket.limited}
                              onChange={(e) =>
                                updateEditTicket(
                                  ticket.id,
                                  "limited",
                                  e.target.checked
                                )
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              Limited slots
                            </span>
                          </label>
                          {ticket.limited && (
                            <input
                              type="number"
                              value={ticket.slotsLeft}
                              onChange={(e) =>
                                updateEditTicket(
                                  ticket.id,
                                  "slotsLeft",
                                  e.target.value
                                )
                              }
                              placeholder="Number of slots"
                              min="1"
                              className="w-32 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                            />
                          )}
                        </div>

                        {/* Show Sold Count (Read-only) */}
                        {ticket.sold > 0 && (
                          <div className="mt-3 p-2 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-green-700">
                              Already Sold: {ticket.sold} tickets
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Tags (Optional)
                  </h3>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addEditTag())
                      }
                      placeholder="Add tags (e.g., Technology, Networking)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#488bbf" }}
                    />
                    <button
                      type="button"
                      onClick={addEditTag}
                      className="px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition"
                      style={{ backgroundColor: "#488bbf" }}
                    >
                      Add
                    </button>
                  </div>

                  {editFormData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editFormData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm font-medium text-white flex items-center space-x-1"
                          style={{ backgroundColor: "#488bbf" }}
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeEditTag(index)}
                            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sponsored Option */}
                <div className="mb-6">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="sponsored"
                      checked={editFormData.sponsored}
                      onChange={handleEditInputChange}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">
                        Mark as Sponsored Event
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        Sponsored events get premium placement with a ⭐ badge.
                        Cost: ₦5,000
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedEvent(null);
                      setEditFormData(null);
                      setEditTickets([]);
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition"
                    style={{ backgroundColor: "#488bbf" }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {showAttendeesModal && attendeesEventId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Event Attendees
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {attendees.length}{" "}
                    {attendees.length === 1 ? "attendee" : "attendees"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAttendeesModal(false);
                    setAttendeesEventId(null);
                    setAttendees([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
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
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingAttendees ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading attendees...</p>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Attendees Yet
                  </h3>
                  <p className="text-gray-600">
                    No tickets have been purchased for this event yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#488bbf] to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {attendee.user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase() || "??"}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {attendee.user?.name || "Unknown User"}
                              </h3>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                                {attendee.user?.email && (
                                  <span>📧 {attendee.user.email}</span>
                                )}
                                {attendee.user?.phone && (
                                  <span>📞 {attendee.user.phone}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Ticket:</span>{" "}
                              <span className="font-semibold text-gray-900">
                                {attendee.ticket?.name || "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Code:</span>{" "}
                              <span className="font-mono font-semibold text-gray-900">
                                {attendee.ticket_code}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Quantity:</span>{" "}
                              <span className="font-semibold text-gray-900">
                                {attendee.quantity}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Amount:</span>{" "}
                              <span className="font-semibold text-green-600">
                                ₦
                                {parseFloat(
                                  attendee.total_amount
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Purchased:</span>{" "}
                              <span className="font-semibold text-gray-900">
                                {new Date(
                                  attendee.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {attendee.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
