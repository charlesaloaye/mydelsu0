"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import apiClient from "../../../../lib/api";
import AuthGuard from "../../../../components/AuthGuard";
import Navbar from "../../../../components/Navbar";
import Link from "next/link";

function HostelsPage() {
  const { user, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);

  // Load hostels data
  useEffect(() => {
    if (isAuthenticated) {
      loadHostels();
      loadNotifications();
    }
  }, [isAuthenticated]);

  // Load hostels when filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadHostels();
    }
  }, [isAuthenticated, searchQuery, priceRange, sortBy]);

  const loadHostels = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("category", "hostels");

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (priceRange.min) {
        params.append("min_price", priceRange.min);
      }
      if (priceRange.max) {
        params.append("max_price", priceRange.max);
      }
      if (sortBy) {
        params.append("sort_by", sortBy);
      }

      const response = await apiClient.get(`/marketplace?${params.toString()}`);

      if (response.data.success) {
        setHostels(response.data.data);
        setFilteredHostels(response.data.data);
      } else {
        console.error("Failed to load hostels:", response.data.message);
        setHostels([]);
        setFilteredHostels([]);
      }
    } catch (error) {
      console.error("Error loading hostels:", error);
      setHostels([]);
      setFilteredHostels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await apiClient.get("/notifications");
      setNotifications(response.data.data);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getHostelType = (title, description) => {
    const text = (title + " " + description).toLowerCase();
    if (text.includes("self-contained") || text.includes("private")) {
      return { type: "Self-Contained", color: "bg-blue-100 text-blue-800" };
    } else if (text.includes("roommate") || text.includes("shared")) {
      return { type: "Shared", color: "bg-green-100 text-green-800" };
    } else if (text.includes("hostel") || text.includes("room")) {
      return { type: "Hostel", color: "bg-orange-100 text-orange-800" };
    } else {
      return { type: "Accommodation", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getAmenities = (description) => {
    const amenities = [];
    const text = description.toLowerCase();

    if (text.includes("wifi") || text.includes("internet"))
      amenities.push("WiFi");
    if (text.includes("generator") || text.includes("light"))
      amenities.push("Generator");
    if (text.includes("security")) amenities.push("Security");
    if (text.includes("kitchen")) amenities.push("Kitchen");
    if (text.includes("bathroom") || text.includes("toilet"))
      amenities.push("Bathroom");
    if (text.includes("furnished")) amenities.push("Furnished");
    if (text.includes("fan") || text.includes("ac")) amenities.push("Fan/AC");

    return amenities.slice(0, 3); // Show max 3 amenities
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Navbar
          variant="dashboard"
          showNotifications={true}
          notifications={notifications}
          unreadCount={unreadCount}
          onNotificationClick={() => setShowNotifications(!showNotifications)}
          currentPath="/dashboard/marketplace/hostels"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Hostels & Accommodation
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect place to stay near DELSU campus. From shared
              rooms to self-contained apartments, discover accommodation options
              that fit your budget and lifestyle.
            </p>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
              {filteredHostels.length} accommodations available
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search Accommodations
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  <input
                    type="text"
                    placeholder="Search for rooms, apartments, hostels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Min Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="₦10,000"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Max Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="₦100,000"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Sort and Clear Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange({ min: "", max: "" });
                    setSortBy("newest");
                  }}
                  className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Hostels Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredHostels.map((hostel) => {
                const hostelType = getHostelType(
                  hostel.title,
                  hostel.description
                );
                const amenities = getAmenities(hostel.description);

                return (
                  <Link
                    key={hostel.id}
                    href={`/dashboard/marketplace/${hostel.id}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group block"
                  >
                    <div className="relative">
                      <img
                        src={
                          hostel.images && hostel.images.length > 0
                            ? hostel.images[0].startsWith("http")
                              ? hostel.images[0]
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000"}${hostel.images[0]}`
                            : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop"
                        }
                        alt={hostel.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop";
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${hostelType.color}`}
                        >
                          {hostelType.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition line-clamp-2">
                        {hostel.title}
                      </h3>

                      <div className="text-2xl font-bold text-orange-600 mb-3">
                        {formatPrice(hostel.price)}
                        <span className="text-sm font-normal text-gray-500">
                          /month
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {hostel.description}
                      </p>

                      {/* Amenities */}
                      {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
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
                          {hostel.location}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(hostel.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={
                              hostel.user?.avatar || "/api/placeholder/40/40"
                            }
                            alt={hostel.user?.name || "User"}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {hostel.user?.first_name} {hostel.user?.last_name}
                          </span>
                        </div>
                        <div className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl font-semibold text-center group-hover:bg-orange-600 transition">
                          View Details
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && filteredHostels.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
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
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No accommodations found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or check back later for new
                listings.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPriceRange({ min: "", max: "" });
                  setSortBy("newest");
                }}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

export default HostelsPage;
