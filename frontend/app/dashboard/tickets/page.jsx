"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient, { getBackendBaseUrl } from "../../../lib/api";
import DashboardLayout from "../../../components/DashboardLayout";
import Swal from "sweetalert2";

export default function TicketsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, confirmed, cancelled, refunded
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadNotifications = async () => {
      try {
        const [notificationsResponse, unreadResponse] = await Promise.all([
          apiClient.getNotifications(),
          apiClient.getUnreadCount(),
        ]);

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
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    loadNotifications();

    // Refresh notifications every minute
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Load purchased tickets
  useEffect(() => {
    if (!isAuthenticated) return;

    loadTickets();
  }, [isAuthenticated, filter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filter !== "all") {
        params.status = filter;
      }

      const response = await apiClient.getPurchasedTickets(params);

      if (response.success) {
        setTickets(response.data || []);
      } else {
        setError(response.message || "Failed to load tickets");
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError(err.message || "Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatPrice = (price) => {
    if (price === 0 || price === "0") return "FREE";
    return `₦${parseFloat(price).toLocaleString()}`;
  };

  const getEventImage = (event) => {
    if (!event?.images || event.images.length === 0) {
      return "https://via.placeholder.com/400x300/488bbf/ffffff?text=Event+Image";
    }

    const images = Array.isArray(event.images) ? event.images : [event.images];
    const firstImage = images[0];

    if (firstImage.startsWith("http")) {
      return firstImage;
    }

    const backendBaseUrl = getBackendBaseUrl();
    return `${backendBaseUrl}/storage/${firstImage}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewEvent = (eventId) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const response = await apiClient.getPurchasedTicket(ticketId);
      if (response.success) {
        const ticket = response.data;
        await Swal.fire({
          icon: "info",
          title: "Ticket Details",
          html: `<div style="text-align: left; margin-top: 1rem;">
            <p><strong>Ticket Code:</strong> ${ticket.ticket_code}</p>
            <p><strong>Event:</strong> ${ticket.event?.title || "N/A"}</p>
            <p><strong>Ticket Type:</strong> ${ticket.ticket?.name || "N/A"}</p>
            <p><strong>Date:</strong> ${formatDate(ticket.event?.date)}</p>
            <p><strong>Time:</strong> ${ticket.event?.time || "N/A"}</p>
            <p><strong>Location:</strong> ${ticket.event?.location || "N/A"}</p>
            <p><strong>Quantity:</strong> ${ticket.quantity}</p>
            <p><strong>Amount Paid:</strong> ${formatPrice(
              ticket.total_amount
            )}</p>
            <p><strong>Status:</strong> <span class="badge">${
              ticket.status
            }</span></p>
          </div>`,
          confirmButtonText: "View Event",
          confirmButtonColor: "#488bbf",
          showCancelButton: true,
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed && ticket.event?.id) {
            router.push(`/dashboard/events/${ticket.event.id}`);
          }
        });
      }
    } catch (err) {
      console.error("Failed to load ticket details:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load ticket details",
        confirmButtonColor: "#488bbf",
      });
    }
  };

  const filteredTickets =
    filter === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter);

  if (loading) {
    return (
      <DashboardLayout
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => {}}
      >
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your tickets...</p>
            </div>
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
      onNotificationClick={() => {}}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">View all your purchased event tickets</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All Tickets" },
              { value: "confirmed", label: "Confirmed" },
              { value: "pending", label: "Pending" },
              { value: "cancelled", label: "Cancelled" },
              { value: "refunded", label: "Refunded" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === tab.value
                    ? "text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor:
                    filter === tab.value ? "#488bbf" : "transparent",
                }}
              >
                {tab.label}
                {tab.value !== "all" && (
                  <span className="ml-2 text-xs">
                    ({tickets.filter((t) => t.status === tab.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Tickets Found
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't purchased any tickets yet."
                : `You don't have any ${filter} tickets.`}
            </p>
            <button
              onClick={() => router.push("/dashboard/events")}
              className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: "#488bbf" }}
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-48 h-48 shrink-0">
                    <img
                      src={getEventImage(ticket.event)}
                      alt={ticket.event?.title || "Event"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300/488bbf/ffffff?text=Event+Image";
                      }}
                    />
                  </div>

                  {/* Ticket Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {ticket.event?.title || "Event"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {ticket.ticket?.name || "Ticket"}
                        </p>
                        {ticket.event?.date && (
                          <p className="text-sm text-gray-500">
                            {formatDate(ticket.event.date)} •{" "}
                            {ticket.event.time || "Time TBA"}
                          </p>
                        )}
                        {ticket.event?.location && (
                          <p className="text-sm text-gray-500 mt-1">
                            📍 {ticket.event.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Ticket Code
                        </div>
                        <div className="font-semibold text-gray-900">
                          {ticket.ticket_code}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Quantity
                        </div>
                        <div className="font-semibold text-gray-900">
                          {ticket.quantity}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Amount Paid
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatPrice(ticket.total_amount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Purchased
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewEvent(ticket.event?.id)}
                        className="px-4 py-2 rounded-lg font-medium text-white transition hover:opacity-90"
                        style={{ backgroundColor: "#488bbf" }}
                      >
                        View Event
                      </button>
                      <button
                        onClick={() => handleViewTicket(ticket.id)}
                        className="px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
