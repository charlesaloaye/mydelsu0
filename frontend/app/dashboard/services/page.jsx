"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";
import AuthGuard from "../../../components/AuthGuard";
import DashboardHeader from "../../../components/DashboardHeader";
import Link from "next/link";

function ServicesPage() {
  const { user, isAuthenticated } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  });
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Banners from backend public/banners
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const BACKEND_BASE = API_BASE.replace(/\/api$/, "");
  const bannerFiles = [
    "2021-07-18_40_20-27-JulyLME GAS-2.jpg",
    "2021-07-18_42_45-27-JulyTop games.jpg",
    "banner-id16_22_10-ELECTRICAL.jpg",
    "banner-id22_38_13-LOGO BANNER.jpg",
  ];
  const serviceBanners = bannerFiles.map(
    (f) => `${BACKEND_BASE}/banners/${encodeURIComponent(f)}`
  );

  // Create service form state
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "tutoring",
    location: "",
    contact: "",
    availability: "",
    experience: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Load services data
  useEffect(() => {
    loadServicesData();
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  // Reload services when search or filters change
  useEffect(() => {
    loadServicesData();
  }, [searchQuery, priceRange, sortBy, activeTab]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (hasMore && !loadingMore && !loading) {
          loadMoreServices();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, loading]);

  const loadServicesData = async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "12",
        sort_by: sortBy,
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (priceRange.min) {
        params.append("min_price", priceRange.min);
      }
      if (priceRange.max) {
        params.append("max_price", priceRange.max);
      }

      console.log("Making API call to:", `/services?${params.toString()}`);
      const response = await apiClient.get(`/services?${params.toString()}`);
      console.log("API response:", response);

      if (response.success) {
        if (append) {
          setServices((prev) => {
            const existingIds = new Set(prev.map((service) => service.id));
            const newServices = response.data.filter(
              (service) => !existingIds.has(service.id)
            );
            return [...prev, ...newServices];
          });
        } else {
          setServices(response.data);
        }
        setPagination(response.pagination);
        setHasMore(
          response.pagination.current_page < response.pagination.last_page
        );
        // Update filtered services after loading
        if (append) {
          setFilteredServices((prev) => {
            const existingIds = new Set(prev.map((service) => service.id));
            const newServices = response.data.filter(
              (service) => !existingIds.has(service.id)
            );
            return [...prev, ...newServices];
          });
        } else {
          setFilteredServices(response.data);
        }
      } else {
        console.error(
          "Failed to load services:",
          response?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "Failed to load services:",
        error?.response?.data?.message || error?.message || "Unknown error"
      );
      console.error("Full error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
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

  const loadMoreServices = () => {
    if (hasMore && !loadingMore) {
      loadServicesData(pagination.current_page + 1, true);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form
      const newErrors = {};
      if (!createForm.title) newErrors.title = "Title is required";
      if (!createForm.description)
        newErrors.description = "Description is required";
      if (!createForm.price) newErrors.price = "Price is required";
      if (!createForm.contact) newErrors.contact = "Contact is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Here you would make an API call to create the service
      console.log("Creating service:", createForm);

      // Reset form
      setCreateForm({
        title: "",
        description: "",
        price: "",
        category: "tutoring",
        location: "",
        contact: "",
        availability: "",
        experience: "",
        images: [],
      });
      setShowCreateModal(false);

      // Reload services
      loadServicesData();
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    // Validate file count
    if (createForm.images.length + files.length > maxFiles) {
      alert(
        `You can only upload up to ${maxFiles} images. You currently have ${createForm.images.length} images.`
      );
      return;
    }

    // Validate each file
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(
          `${file.name} is not a supported image format. Please use JPEG, PNG, or WebP.`
        );
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Please use images smaller than 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingImages(true);

    // Convert files to base64 for preview (in a real app, you'd upload to a server)
    const imagePromises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file: file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((newImages) => {
      setCreateForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      setUploadingImages(false);
    });
  };

  const removeImage = (index) => {
    setCreateForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const categories = [
    { id: "all", name: "All Services", count: services.length },
    {
      id: "tutoring",
      name: "Tutoring",
      count: services.filter((s) => s.category === "tutoring").length,
    },
    {
      id: "design",
      name: "Design",
      count: services.filter((s) => s.category === "design").length,
    },
    {
      id: "academic",
      name: "Academic",
      count: services.filter((s) => s.category === "academic").length,
    },
    {
      id: "photography",
      name: "Photography",
      count: services.filter((s) => s.category === "photography").length,
    },
    {
      id: "tech",
      name: "Technology",
      count: services.filter((s) => s.category === "tech").length,
    },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      tutoring: <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />,
      design: (
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      ),
      academic: (
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      ),
      photography: (
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
      ),
      tech: (
        <path
          fillRule="evenodd"
          d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
          clipRule="evenodd"
        />
      ),
    };
    return icons[category] || icons.tutoring;
  };

  const getCategoryColor = (category) => {
    const colors = {
      tutoring: "bg-blue-100 text-blue-800",
      design: "bg-purple-100 text-purple-800",
      academic: "bg-green-100 text-green-800",
      photography: "bg-pink-100 text-pink-800",
      tech: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || colors.tutoring;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <DashboardHeader currentPath="/services" />

        {/* Top Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <img
              src={serviceBanners[0]}
              alt="Services banner"
              className="w-full h-40 object-cover"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Services Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with skilled service providers. Find tutoring, design,
              academic help, and more from fellow students and professionals.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                placeholder="Search by title, description, or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-16 py-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-400 text-white"
              />
              <button
                onClick={() => setShowFilterModal(true)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  activeTab === category.id
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Create Service Button */}
          <div className="mb-8 text-center">
            <Link
              href="/dashboard/upload-service"
              className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Offer Your Service
            </Link>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/dashboard/services/${service.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group block"
                >
                  {/* Service Image */}
                  {(() => {
                    let imageUrl = null;
                    try {
                      if (service.images) {
                        // Check if images is already an array or needs parsing
                        if (Array.isArray(service.images)) {
                          imageUrl = service.images[0];
                        } else if (typeof service.images === "string") {
                          // Try to parse as JSON
                          const parsed = JSON.parse(service.images);
                          if (Array.isArray(parsed) && parsed.length > 0) {
                            imageUrl = parsed[0];
                          } else if (typeof parsed === "string") {
                            imageUrl = parsed;
                          }
                        }
                      }
                    } catch (e) {
                      // If parsing fails, treat as a single URL string
                      imageUrl = service.images;
                    }

                    return imageUrl ? (
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="w-full h-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center"
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
                            <p className="text-lg font-medium">Service Image</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <svg
                            className="w-16 h-16 mx-auto mb-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-lg font-medium">Service Image</p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              service.category
                            )}`}
                          >
                            {service.category.charAt(0).toUpperCase() +
                              service.category.slice(1)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
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
                        {service.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {service.availability}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {service.user
                          ? `${service.user.first_name} ${service.user.last_name}`
                          : "Unknown Provider"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">
                        ₦{service.price.toLocaleString()}
                      </div>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm">
                        Contact Now
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-3"></div>
                Loading more services...
              </div>
            </div>
          )}

          {/* Pagination Info */}
          {!loading && pagination.total > 0 && (
            <div className="text-center mt-6 text-gray-600">
              <p>
                Showing {filteredServices.length} of {pagination.total} services
                {hasMore && <span> • Scroll down to load more</span>}
                {!hasMore && pagination.total > 12 && (
                  <span> • All services loaded</span>
                )}
              </p>
            </div>
          )}

          {!loading && filteredServices.length === 0 && (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or be the first to offer a
                service!
              </p>
              <Link
                href="/dashboard/upload-service"
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                Offer Your Service
              </Link>
            </div>
          )}
        </div>

        {/* Create Service Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Offer Your Service
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreateService} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        value={createForm.title}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Mathematics Tutoring"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={createForm.category}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="tutoring">Tutoring</option>
                        <option value="design">Design</option>
                        <option value="academic">Academic</option>
                        <option value="photography">Photography</option>
                        <option value="tech">Technology</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe your service in detail..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (₦) *
                      </label>
                      <input
                        type="number"
                        value={createForm.price}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            price: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="5000"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={createForm.location}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Campus, Online, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Info *
                      </label>
                      <input
                        type="text"
                        value={createForm.contact}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            contact: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Phone number or email"
                      />
                      {errors.contact && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contact}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Availability
                      </label>
                      <input
                        type="text"
                        value={createForm.availability}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            availability: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Weekends, 24/7, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={createForm.experience}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          experience: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 3 years experience"
                    />
                  </div>

                  {/* Photo Upload Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Photos (Optional)
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload up to 5 photos to showcase your service. Supported
                      formats: JPEG, PNG, WebP (max 5MB each)
                    </p>

                    {/* Upload Button */}
                    <div className="mb-4">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={
                          createForm.images.length >= 5 || uploadingImages
                        }
                      />
                      <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors ${
                          createForm.images.length >= 5 || uploadingImages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        {uploadingImages ? "Uploading..." : "Choose Photos"}
                        {createForm.images.length > 0 && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({createForm.images.length}/5)
                          </span>
                        )}
                      </label>
                    </div>

                    {/* Image Previews */}
                    {createForm.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {createForm.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                              <div className="truncate">{image.name}</div>
                              <div>
                                {(image.size / 1024 / 1024).toFixed(1)}MB
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating..." : "Create Service"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Filter Services
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

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Price Range (₦)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, min: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-700"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, max: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-700"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder-gray-700"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Category
                    </label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveTab(category.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                            activeTab === category.id
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category.name} ({category.count})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={() => {
                      setPriceRange({ min: "", max: "" });
                      setSortBy("newest");
                      setActiveTab("all");
                      setSearchQuery("");
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition font-medium"
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

export default ServicesPage;
