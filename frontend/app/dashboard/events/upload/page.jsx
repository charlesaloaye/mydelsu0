"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import { useToast } from "../../../../contexts/ToastContext";
import apiClient from "../../../../lib/api";
import DashboardLayout from "../../../../components/DashboardLayout";
import Swal from "sweetalert2";

export default function UploadEventPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Form state
  const [eventData, setEventData] = useState({
    title: "",
    category: "",
    description: "",
    date: "",
    time: "",
    location: "",
    images: [],
    tags: [],
    sponsored: false,
  });

  const [imageFiles, setImageFiles] = useState([]); // Store actual File objects
  const [currentTag, setCurrentTag] = useState("");
  const [tickets, setTickets] = useState([
    {
      id: 1,
      name: "",
      price: "",
      description: "",
      benefits: [""],
      limited: false,
      slotsLeft: "",
    },
  ]);

  // Load notifications
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

    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      showError("Maximum 5 images allowed");
      return;
    }

    const validFiles = files.slice(0, 5 - imageFiles.length);
    setImageFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
    setEventData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  const removeImage = (index) => {
    // Revoke the object URL to prevent memory leaks
    if (eventData.images[index]) {
      URL.revokeObjectURL(eventData.images[index]);
    }

    setEventData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && eventData.tags.length < 5) {
      setEventData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (index) => {
    setEventData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // Ticket Management
  const addTicket = () => {
    setTickets([
      ...tickets,
      {
        id: Date.now(),
        name: "",
        price: "",
        description: "",
        benefits: [""],
        limited: false,
        slotsLeft: "",
      },
    ]);
  };

  const removeTicket = (id) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter((t) => t.id !== id));
    }
  };

  const updateTicket = (id, field, value) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const addBenefit = (ticketId) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, benefits: [...ticket.benefits, ""] }
          : ticket
      )
    );
  };

  const updateBenefit = (ticketId, benefitIndex, value) => {
    setTickets(
      tickets.map((ticket) =>
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

  const removeBenefit = (ticketId, benefitIndex) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              benefits: ticket.benefits.filter((_, i) => i !== benefitIndex),
            }
          : ticket
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (
      !eventData.title ||
      !eventData.category ||
      !eventData.date ||
      !eventData.time ||
      !eventData.location ||
      !eventData.description
    ) {
      showError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (imageFiles.length === 0) {
      showError("Please upload at least one event image");
      setIsSubmitting(false);
      return;
    }

    // Check if at least one ticket has a name
    const hasValidTicket = tickets.some((t) => t.name.trim());
    if (!hasValidTicket) {
      showError("Please add at least one ticket tier with a name");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare ticket data - filter out tickets without names
      const ticketData = tickets
        .filter((ticket) => ticket.name && ticket.name.trim()) // Only include tickets with valid names
        .map((ticket) => ({
          name: ticket.name.trim(),
          price: ticket.price ? parseFloat(ticket.price) : 0,
          description: ticket.description || "",
          benefits: ticket.benefits.filter((b) => b.trim()),
          limited: ticket.limited,
          slots_left: ticket.limited
            ? parseInt(ticket.slotsLeft) || null
            : null,
        }));

      // Double-check we have at least one valid ticket after filtering
      if (ticketData.length === 0) {
        await Swal.fire({
          icon: "warning",
          title: "No Valid Tickets",
          text: "Please add at least one ticket tier with a name",
          confirmButtonColor: "#488bbf",
        });
        setIsSubmitting(false);
        return;
      }

      // Debug: Log what we're sending
      console.log("Event data being sent:", {
        title: eventData.title,
        category: eventData.category,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        sponsored: eventData.sponsored,
        tags: eventData.tags,
        tickets: ticketData,
        ticketsCount: ticketData.length,
        imagesCount: imageFiles.length,
      });

      // Validate tickets before sending
      if (!ticketData || ticketData.length === 0) {
        await Swal.fire({
          icon: "error",
          title: "No Tickets",
          text: "Please add at least one valid ticket tier before submitting",
          confirmButtonColor: "#488bbf",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit to API using apiClient.createEvent which handles FormData properly
      const response = await apiClient.createEvent({
        title: eventData.title,
        category: eventData.category,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        sponsored:
          eventData.sponsored === true ||
          eventData.sponsored === "true" ||
          eventData.sponsored === 1 ||
          eventData.sponsored === "1",
        tags: eventData.tags || [],
        tickets: ticketData,
        images: imageFiles,
      });

      if (response.success) {
        showSuccess("Event created successfully! 🎉");
        setShowSuccessModal(true);

        // Reset form
        setEventData({
          title: "",
          category: "",
          description: "",
          date: "",
          time: "",
          location: "",
          images: [],
          tags: [],
          sponsored: false,
        });
        setImageFiles([]);
        setCurrentTag("");
        setTickets([
          {
            id: Date.now(),
            name: "",
            price: "",
            description: "",
            benefits: [""],
            limited: false,
            slotsLeft: "",
          },
        ]);
      } else {
        // This shouldn't happen - successful requests should have response.success = true
        // But handle it just in case
        const errorMessage = response.message || "Failed to create event";
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#488bbf",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);

      // Show validation errors if present
      // The api.js throws errors with error.response containing the backend response
      const validationErrors = error.response?.errors || {};
      const errorMessage =
        error.response?.message ||
        error.message ||
        "Failed to create event. Please try again.";

      if (Object.keys(validationErrors).length > 0) {
        // Format validation errors for display
        const errorDetails = Object.entries(validationErrors)
          .map(([field, messages]) => {
            const fieldName = field
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            const messagesList = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `<strong>${fieldName}:</strong> ${messagesList}`;
          })
          .join("<br>");

        await Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: `<div style="text-align: left;">${errorMessage}<br><br>${errorDetails}</div>`,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => {}}
    >
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Title */}
        <div className="bg-white border-b border-gray-200 py-4 mb-6 -mx-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
          <p className="text-sm text-gray-600 mt-1">
            Share your event with DELSU students
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Basic Information
            </h2>

            {/* Event Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                placeholder="e.g., DELSU Tech Summit 2025"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={eventData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={eventData.description}
                onChange={handleInputChange}
                placeholder="Describe your event, what attendees can expect, benefits, etc."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be detailed! Good descriptions attract more attendees.
              </p>
            </div>
          </div>

          {/* Date, Time & Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Date, Time & Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  value={eventData.time}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={eventData.location}
                onChange={handleInputChange}
                placeholder="e.g., Main Auditorium, DELSU Abraka Campus"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Event Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Event Images
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Images <span className="text-red-500">*</span> (Max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Portrait images work best (9:16 ratio recommended)
              </p>
            </div>

            {/* Image Preview */}
            {eventData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {eventData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Event ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
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
                ))}
              </div>
            )}
          </div>

          {/* Tickets */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Ticket Tiers</h2>
              <button
                type="button"
                onClick={addTicket}
                className="px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition text-sm"
                style={{ backgroundColor: "#488bbf" }}
              >
                + Add Ticket
              </button>
            </div>

            <div className="space-y-6">
              {tickets.map((ticket, ticketIndex) => (
                <div
                  key={ticket.id}
                  className="border-2 border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Ticket {ticketIndex + 1}
                    </h3>
                    {tickets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicket(ticket.id)}
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
                          updateTicket(ticket.id, "name", e.target.value)
                        }
                        placeholder="e.g., Free Entry, VIP Pass"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          updateTicket(ticket.id, "price", e.target.value)
                        }
                        placeholder="0 for free"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        updateTicket(ticket.id, "description", e.target.value)
                      }
                      placeholder="Brief description of this ticket"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        onClick={() => addBenefit(ticket.id)}
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
                              updateBenefit(
                                ticket.id,
                                benefitIndex,
                                e.target.value
                              )
                            }
                            placeholder="e.g., Access to all sessions"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {ticket.benefits.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeBenefit(ticket.id, benefitIndex)
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
                          updateTicket(ticket.id, "limited", e.target.checked)
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
                          updateTicket(ticket.id, "slotsLeft", e.target.value)
                        }
                        placeholder="Number of slots"
                        min="1"
                        className="w-32 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Tags (Optional)
            </h2>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add tags (e.g., Technology, Networking)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Add
              </button>
            </div>

            {eventData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {eventData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium text-white flex items-center space-x-1"
                    style={{ backgroundColor: "#488bbf" }}
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
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
            <p className="text-xs text-gray-500 mt-2">Maximum 5 tags</p>
          </div>

          {/* Sponsored Option */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="sponsored"
                checked={eventData.sponsored}
                onChange={handleInputChange}
                className="mt-1"
              />
              <div>
                <span className="font-semibold text-gray-900">
                  Mark as Sponsored Event
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Sponsored events get premium placement with a ⭐ badge and
                  appear at the top of event listings. Cost: ₦5,000
                </p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-lg font-bold text-white text-lg hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#488bbf" }}
          >
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-50">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Event Created! 🎉
            </h3>
            <p className="text-gray-600 mb-6">
              Your event has been published successfully. Students can now view
              and register for it!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Reset form
                  setEventData({
                    title: "",
                    category: "",
                    description: "",
                    date: "",
                    time: "",
                    location: "",
                    images: [],
                    tags: [],
                    sponsored: false,
                  });
                  setImageFiles([]);
                  setCurrentTag("");
                  setTickets([
                    {
                      id: Date.now(),
                      name: "",
                      price: "",
                      description: "",
                      benefits: [""],
                      limited: false,
                      slotsLeft: "",
                    },
                  ]);
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Create Another
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/dashboard/events");
                }}
                className="flex-1 px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                View Events
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
