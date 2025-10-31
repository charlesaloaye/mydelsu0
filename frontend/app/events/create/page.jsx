"use client";
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";

export default function UploadEventPage() {
  const { user, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const userSubscription = {
    tier: "standard",
    eventsUploaded: 5,
    maxEvents: 10,
    businessName: "Victor Events",
    contactNumber: "08012345678",
  };

  const [formData, setFormData] = useState({
    eventName: "",
    category: "",
    eventType: "one-time",
    eventDate: "",
    startTime: "",
    endTime: "",
    recurringPattern: "",
    recurringDays: [],
    recurringStartDate: "",
    recurringEndDate: "",
    recurringTime: "",
    eventFormat: "physical",
    venue: "",
    onlineLink: "",
    ticketPrice: "",
    isFree: false,
    specialGuests: "",
    dressCode: "",
    ageRestriction: "",
    capacity: "",
    description: "",
    businessName: userSubscription.businessName,
  });

  const notifications = [
    {
      id: 1,
      message: 'Your event "Tech Conference 2025" was approved!',
      time: "1 hour ago",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const canUploadMore =
    userSubscription.eventsUploaded < userSubscription.maxEvents ||
    userSubscription.tier === "premium";

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...imageUrls]);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleRecurringDay = (day) => {
    const days = formData.recurringDays.includes(day)
      ? formData.recurringDays.filter((d) => d !== day)
      : [...formData.recurringDays, day];
    setFormData({ ...formData, recurringDays: days });
  };

  const handleSubmit = async () => {
    setError("");

    if (!canUploadMore) {
      setError(
        "You have reached your subscription limit. Please upgrade to post more events."
      );
      return;
    }

    if (uploadedFiles.length === 0) {
      setError("Please upload at least one event poster/flyer");
      return;
    }

    if (!formData.eventName || !formData.category || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    if (
      formData.eventType === "one-time" &&
      (!formData.eventDate || !formData.startTime)
    ) {
      setError("Please provide event date and start time");
      return;
    }

    if (
      formData.eventType === "recurring" &&
      (!formData.recurringPattern ||
        !formData.recurringStartDate ||
        !formData.recurringTime)
    ) {
      setError("Please fill in recurring event details");
      return;
    }

    if (formData.eventFormat === "physical" && !formData.venue) {
      setError("Please provide venue location");
      return;
    }

    if (formData.eventFormat === "online" && !formData.onlineLink) {
      setError("Please provide online event link");
      return;
    }

    if (!formData.isFree && !formData.ticketPrice) {
      setError("Please provide ticket price or mark event as free");
      return;
    }

    try {
      setLoading(true);

      // Prepare form data for API
      const submitData = {
        title: formData.eventName,
        description: formData.description,
        price: formData.isFree ? 0 : formData.ticketPrice || 0,
        location:
          formData.eventFormat === "physical"
            ? formData.venue
            : formData.onlineLink,
        images: uploadedFiles,
        // Additional event-specific fields can be added to the description or as custom fields
        event_details: {
          category: formData.category,
          eventType: formData.eventType,
          eventDate: formData.eventDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          eventFormat: formData.eventFormat,
          specialGuests: formData.specialGuests,
          dressCode: formData.dressCode,
          ageRestriction: formData.ageRestriction,
          capacity: formData.capacity,
          businessName: formData.businessName,
          recurringPattern: formData.recurringPattern,
          recurringDays: formData.recurringDays,
          recurringStartDate: formData.recurringStartDate,
          recurringEndDate: formData.recurringEndDate,
          recurringTime: formData.recurringTime,
        },
      };

      const response = await apiClient.createMarketplaceItem(submitData);

      if (response.success) {
        setSuccessMessage(response.message || "Event created successfully!");
        setUploadedImageUrls(response.data?.images || []);
        setShowSuccessModal(true);
        setShowToast(true);

        // Clear form
        setUploadedImages([]);
        setUploadedFiles([]);
        setFormData({
          eventName: "",
          category: "",
          eventType: "one-time",
          eventDate: "",
          startTime: "",
          endTime: "",
          recurringPattern: "",
          recurringDays: [],
          recurringStartDate: "",
          recurringEndDate: "",
          recurringTime: "",
          eventFormat: "physical",
          venue: "",
          onlineLink: "",
          ticketPrice: "",
          isFree: false,
          specialGuests: "",
          dressCode: "",
          ageRestriction: "",
          capacity: "",
          description: "",
          businessName: userSubscription.businessName,
        });

        // Auto-hide toast after 5 seconds
        setTimeout(() => setShowToast(false), 5000);
      } else {
        setError(response.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setError(error.message || "Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{successMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-2 text-white hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-gray-50 ${
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    My Events
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    Browse Events
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

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Create Event 📅
          </h1>
          <p className="text-gray-600">
            Promote your events, workshops, parties, and more!
          </p>
        </div>

        <div
          className={`border-l-4 p-4 mb-6 rounded-r-lg ${
            userSubscription.tier === "premium"
              ? "bg-purple-50 border-purple-400"
              : userSubscription.tier === "standard"
              ? "bg-blue-50 border-blue-400"
              : "bg-green-50 border-green-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {userSubscription.tier === "premium"
                  ? "💎 Premium Plan"
                  : userSubscription.tier === "standard"
                  ? "⭐ Standard Plan"
                  : "🌟 Basic Plan"}
              </h3>
              <p className="text-sm text-gray-700">
                Events: {userSubscription.eventsUploaded} /{" "}
                {userSubscription.tier === "premium"
                  ? "∞"
                  : userSubscription.maxEvents}
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg font-medium text-white transition"
              style={{ backgroundColor: "#488bbf" }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-6 text-lg">
            Event Details
          </h3>

          <div className="space-y-6">
            {/* Event Poster/Flyer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Poster/Flyer <span className="text-red-500">*</span>
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: "#488bbf20" }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: "#488bbf" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">
                    Click to upload event flyer
                  </p>
                  <p className="text-sm text-gray-500">
                    High quality poster or promotional image
                  </p>
                </label>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) =>
                      handleInputChange("eventName", e.target.value)
                    }
                    placeholder="e.g., Tech Conference 2025"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="party">🎉 Party/Club Night</option>
                    <option value="workshop">📚 Workshop/Seminar</option>
                    <option value="concert">🎵 Concert/Show</option>
                    <option value="religious">🙏 Religious Program</option>
                    <option value="sports">⚽ Sports Event</option>
                    <option value="business">💼 Business/Networking</option>
                    <option value="entertainment">🎭 Entertainment</option>
                    <option value="food">🍔 Food Festival</option>
                    <option value="others">🎨 Others</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Event Type */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Event Schedule
              </h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="one-time"
                      checked={formData.eventType === "one-time"}
                      onChange={(e) =>
                        handleInputChange("eventType", e.target.value)
                      }
                      className="mr-2"
                      style={{ accentColor: "#488bbf" }}
                    />
                    <span className="text-sm">One-time Event</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="recurring"
                      checked={formData.eventType === "recurring"}
                      onChange={(e) =>
                        handleInputChange("eventType", e.target.value)
                      }
                      className="mr-2"
                      style={{ accentColor: "#488bbf" }}
                    />
                    <span className="text-sm">Recurring Event</span>
                  </label>
                </div>
              </div>

              {formData.eventType === "one-time" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) =>
                        handleInputChange("eventDate", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        handleInputChange("startTime", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        handleInputChange("endTime", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recurring Pattern <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.recurringPattern}
                      onChange={(e) =>
                        handleInputChange("recurringPattern", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Pattern</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  {formData.recurringPattern === "weekly" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                          (day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleRecurringDay(day)}
                              className={`px-4 py-2 rounded-lg border-2 transition ${
                                formData.recurringDays.includes(day)
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-300 text-gray-700"
                              }`}
                            >
                              {day}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.recurringStartDate}
                        onChange={(e) =>
                          handleInputChange(
                            "recurringStartDate",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.recurringEndDate}
                        onChange={(e) =>
                          handleInputChange("recurringEndDate", e.target.value)
                        }
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.recurringTime}
                        onChange={(e) =>
                          handleInputChange("recurringTime", e.target.value)
                        }
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Location</h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Format <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="physical"
                      checked={formData.eventFormat === "physical"}
                      onChange={(e) =>
                        handleInputChange("eventFormat", e.target.value)
                      }
                      className="mr-2"
                      style={{ accentColor: "#488bbf" }}
                    />
                    <span className="text-sm">Physical Event</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="online"
                      checked={formData.eventFormat === "online"}
                      onChange={(e) =>
                        handleInputChange("eventFormat", e.target.value)
                      }
                      className="mr-2"
                      style={{ accentColor: "#488bbf" }}
                    />
                    <span className="text-sm">Online Event</span>
                  </label>
                </div>
              </div>

              {formData.eventFormat === "physical" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue/Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    placeholder="e.g., DELSU Main Auditorium, Abraka"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Online Event Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.onlineLink}
                    onChange={(e) =>
                      handleInputChange("onlineLink", e.target.value)
                    }
                    placeholder="e.g., https://zoom.us/j/123456789"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Additional Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Guests/Performers
                  </label>
                  <input
                    type="text"
                    value={formData.specialGuests}
                    onChange={(e) =>
                      handleInputChange("specialGuests", e.target.value)
                    }
                    placeholder="e.g., DJ Cuppy, Prof. John Doe"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dress Code
                  </label>
                  <input
                    type="text"
                    value={formData.dressCode}
                    onChange={(e) =>
                      handleInputChange("dressCode", e.target.value)
                    }
                    placeholder="e.g., Casual, Formal, All White"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Restriction
                  </label>
                  <select
                    value={formData.ageRestriction}
                    onChange={(e) =>
                      handleInputChange("ageRestriction", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="all">All Ages</option>
                    <option value="18+">18+</option>
                    <option value="21+">21+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      handleInputChange("capacity", e.target.value)
                    }
                    placeholder="e.g., 500"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Pricing</h4>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="free"
                  checked={formData.isFree}
                  onChange={(e) =>
                    handleInputChange("isFree", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "#488bbf" }}
                />
                <label
                  htmlFor="free"
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  This is a FREE event
                </label>
              </div>

              {!formData.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) =>
                      handleInputChange("ticketPrice", e.target.value)
                    }
                    placeholder="e.g., 2000"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows="5"
                placeholder="Describe your event in detail... Include what attendees should expect, agenda, special features, etc."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Organizer:</strong> {userSubscription.businessName}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Contact Number:</strong>{" "}
                {userSubscription.contactNumber}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Attendees will contact you via WhatsApp or Call
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canUploadMore}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                canUploadMore
                  ? "hover:shadow-lg"
                  : "opacity-50 cursor-not-allowed"
              }`}
              style={{ backgroundColor: "#488bbf" }}
            >
              {canUploadMore ? "Publish Event →" : "Upgrade to Post More"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Event Published!
            </h3>
            <p className="text-gray-600 mb-4">
              {successMessage ||
                "Your event is now live. People can view details and contact you directly."}
            </p>

            {/* Display uploaded image URLs */}
            {uploadedImageUrls.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Uploaded Images:
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {uploadedImageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/100/80";
                        }}
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {uploadedImageUrls.length} image
                  {uploadedImageUrls.length !== 1 ? "s" : ""} uploaded
                  successfully
                </p>
              </div>
            )}

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 rounded-lg font-semibold text-white transition"
              style={{ backgroundColor: "#488bbf" }}
            >
              View My Events
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
