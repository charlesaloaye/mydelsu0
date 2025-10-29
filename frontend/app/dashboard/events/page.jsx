"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";
import AuthGuard from "../../../components/AuthGuard";
import DashboardHeader from "../../../components/DashboardHeader";
import Link from "next/link";

function EventsPage() {
  const { user, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  });
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    min_price: "",
    max_price: "",
    sort_by: "newest",
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load events data
  useEffect(() => {
    loadEventsData();
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  // Reload events when filters change
  useEffect(() => {
    loadEventsData();
  }, [filters]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loadingMore
      ) {
        loadMoreEvents();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore]);

  const loadEventsData = async () => {
    try {
      setLoading(true);
      setEvents([]);
      setFilteredEvents([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
      });
      setHasMore(true);

      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("per_page", "12");
      if (filters.search) params.append("search", filters.search);
      if (filters.min_price) params.append("min_price", filters.min_price);
      if (filters.max_price) params.append("max_price", filters.max_price);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);

      console.log("Making API call to: /events?" + params.toString());
      const response = await apiClient.get(`/events?${params.toString()}`);
      console.log("API response:", response);

      if (response.success) {
        setEvents(response.data);
        setFilteredEvents(response.data);
        setPagination(response.pagination);
        setHasMore(
          response.pagination.current_page < response.pagination.last_page
        );
      } else {
        console.error("Failed to load events:", response.message);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreEvents = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = pagination.current_page + 1;

      const params = new URLSearchParams();
      params.append("page", nextPage.toString());
      params.append("per_page", "12");
      if (filters.search) params.append("search", filters.search);
      if (filters.min_price) params.append("min_price", filters.min_price);
      if (filters.max_price) params.append("max_price", filters.max_price);
      if (filters.sort_by) params.append("sort_by", filters.sort_by);

      const response = await apiClient.get(`/events?${params.toString()}`);

      if (response.success) {
        setEvents((prev) => {
          const existingIds = new Set(prev.map((event) => event.id));
          const newEvents = response.data.filter(
            (event) => !existingIds.has(event.id)
          );
          return [...prev, ...newEvents];
        });
        setFilteredEvents((prev) => {
          const existingIds = new Set(prev.map((event) => event.id));
          const newEvents = response.data.filter(
            (event) => !existingIds.has(event.id)
          );
          return [...prev, ...newEvents];
        });
        setPagination(response.pagination);
        setHasMore(
          response.pagination.current_page < response.pagination.last_page
        );
      }
    } catch (error) {
      console.error("Failed to load more events:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await apiClient.getNotifications();
      if (response.success) {
        const notifications = response.data.data || [];
        setNotifications(notifications);
        setUnreadCount(notifications.filter((n) => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: e.target.value });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    loadEventsData();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      min_price: "",
      max_price: "",
      sort_by: "newest",
    });
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPath="/dashboard/events" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">
              Discover and join exciting events happening around campus
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-800 rounded-2xl px-4 py-3 shadow-lg">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  placeholder="Search events..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowFilterModal(true)}
                  className="ml-3 p-2 text-gray-400 hover:text-white transition-colors duration-200"
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
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex items-center text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#488bbf] mr-3"></div>
                Loading events...
              </div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <Link
                    key={`${event.id}-${index}`}
                    href={`/dashboard/events/${event.id}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group block"
                  >
                    {/* Event Image */}
                    {(() => {
                      let imageUrl = null;
                      try {
                        if (event.images) {
                          if (Array.isArray(event.images)) {
                            imageUrl = event.images[0];
                          } else if (typeof event.images === "string") {
                            const parsed = JSON.parse(event.images);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                              imageUrl = parsed[0];
                            } else if (typeof parsed === "string") {
                              imageUrl = parsed;
                            }
                          }
                        }
                      } catch (e) {
                        imageUrl = event.images;
                      }

                      return imageUrl ? (
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center"
                            style={{ display: "none" }}
                          >
                            <div className="text-center text-white">
                              <svg
                                className="w-16 h-16 mx-auto mb-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-lg font-medium">Event Image</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg
                              className="w-16 h-16 mx-auto mb-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg font-medium">Event Image</p>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {event.category?.charAt(0).toUpperCase() +
                                event.category?.slice(1) || "Event"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(event.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#488bbf] transition-colors duration-200">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{event.location}</span>
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{event.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-[#488bbf]">
                          {parseFloat(event.price) > 0 ? (
                            <>₦{parseFloat(event.price).toLocaleString()}</>
                          ) : (
                            <span className="text-green-600">Free</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {event.user?.first_name} {event.user?.last_name}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Infinite Scroll Loading */}
              {loadingMore && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#488bbf] mr-3"></div>
                    Loading more events...
                  </div>
                </div>
              )}

              {/* Pagination Info */}
              {!loading && filteredEvents.length > 0 && (
                <div className="flex justify-center items-center mt-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      Showing {filteredEvents.length} of {pagination.total}{" "}
                      events
                    </span>
                    {hasMore && (
                      <>
                        <span>•</span>
                        <span>Scroll down to load more</span>
                      </>
                    )}
                    {!hasMore && pagination.total > 12 && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 font-medium">
                          All events loaded
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-24 h-24 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Filter Events
                  </h3>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-400 hover:text-gray-600"
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min price"
                        value={filters.min_price}
                        onChange={(e) =>
                          handleFilterChange("min_price", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      />
                      <input
                        type="number"
                        placeholder="Max price"
                        value={filters.max_price}
                        onChange={(e) =>
                          handleFilterChange("max_price", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sort_by}
                      onChange={(e) =>
                        handleFilterChange("sort_by", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent placeholder-gray-700"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 bg-[#488bbf] text-white rounded-lg hover:bg-[#3a7bb8] transition-colors duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

export default EventsPage;
