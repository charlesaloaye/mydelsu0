"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";
import { useToast } from "../../../contexts/ToastContext";

function UploadHostelPage() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    hostel_name: "",
    location: "",
    specific_address: "",
    distance_from_campus: "",
    hostel_type: "",
    number_of_bedrooms: "",
    bathroom_type: "",
    number_of_toilets: "",
    furnishing_status: "",
    kitchen: "",
    generator: "",
    electricity: "",
    water_supply: "",
    security: "",
    gender_restriction: "",
    parking_space: "",
    price_range: "",
    payment_period: "",
    contact_phone: "",
    description: "",
    amenities: [],
    availability: "available",
  });

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      loadPreviousSubmissions();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const response = await apiClient.getNotifications();
      if (response.success) {
        const notifications = response.data.data || response.data || [];
        setNotifications(notifications);
        const unread = notifications.filter((n) => !n.read_at);
        setUnreadCount(unread.length);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadPreviousSubmissions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUserUploads({ type: "hostel" });
      if (response.success) {
        setPreviousSubmissions(response.data.hostels || []);
      }
    } catch (error) {
      console.error("Error loading previous submissions:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (uploadedFiles.length < 1) {
      setError("Please upload at least 1 image");
      return;
    }
    if (
      !formData.hostel_name ||
      !formData.location ||
      !formData.hostel_type ||
      !formData.price_range ||
      !formData.contact_phone
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare form data for API
      const submitData = {
        ...formData,
        images: uploadedFiles,
      };

      const response = await apiClient.uploadHostel(submitData);

      if (response.success) {
        const message = response.message || "Hostel uploaded successfully!";
        showSuccess(message);
        setSuccessMessage(message);
        setUploadedImageUrls(response.data?.image_urls || []);
        setShowSuccessModal(true);

        // Clear form
        setUploadedImages([]);
        setUploadedFiles([]);
        setFormData({
          hostel_name: "",
          location: "",
          specific_address: "",
          distance_from_campus: "",
          hostel_type: "",
          number_of_bedrooms: "",
          bathroom_type: "",
          number_of_toilets: "",
          furnishing_status: "",
          kitchen: "",
          generator: "",
          electricity: "",
          water_supply: "",
          security: "",
          gender_restriction: "",
          parking_space: "",
          price_range: "",
          payment_period: "",
          contact_phone: "",
          description: "",
          amenities: [],
          availability: "available",
        });

        // Reload previous submissions
        loadPreviousSubmissions();
      } else {
        setError(response.message || "Failed to upload hostel information");
      }
    } catch (error) {
      console.error("Error uploading hostel:", error);
      setError(error.message || "An error occurred while uploading");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => {}}
    >
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Upload Hostel Information 🏠
          </h1>
          <p className="text-gray-600">
            Share hostel details and earn ₦100-500 per upload
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-blue-400 mr-3 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">
                Upload Guidelines
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Upload at least 3 clear pictures (bedroom, bathroom,
                  exterior)
                </li>
                <li>• Provide accurate contact number for verification</li>
                <li>• Fill all required fields with correct information</li>
                <li>• Review time: 24-48 hours</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-6 text-lg">
            Upload New Hostel
          </h3>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">
                  (Min. 3 images required)
                </span>
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
                    Click to upload hostel images
                  </p>
                  <p className="text-sm text-gray-500">
                    Bedroom, Bathroom, Kitchen, Exterior
                  </p>
                </label>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hostel_name}
                    onChange={(e) =>
                      handleInputChange("hostel_name", e.target.value)
                    }
                    placeholder="e.g., Winners Lodge"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="e.g., Stadium Road, Abraka"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Address/Area
                  </label>
                  <input
                    type="text"
                    value={formData.specific_address}
                    onChange={(e) =>
                      handleInputChange("specific_address", e.target.value)
                    }
                    placeholder="e.g., Stadium Road, Abraka"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance from Campus
                  </label>
                  <input
                    type="text"
                    value={formData.distance_from_campus}
                    onChange={(e) =>
                      handleInputChange("distance_from_campus", e.target.value)
                    }
                    placeholder="e.g., 5 minutes walk"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hostel_type}
                    onChange={(e) =>
                      handleInputChange("hostel_type", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Room Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bedrooms
                  </label>
                  <select
                    value={formData.number_of_bedrooms}
                    onChange={(e) =>
                      handleInputChange("number_of_bedrooms", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathroom Type
                  </label>
                  <select
                    value={formData.bathroom_type}
                    onChange={(e) =>
                      handleInputChange("bathroom_type", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="ensuite">Ensuite (Private)</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Toilets
                  </label>
                  <select
                    value={formData.number_of_toilets}
                    onChange={(e) =>
                      handleInputChange("number_of_toilets", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnishing Status
                  </label>
                  <select
                    value={formData.furnishing_status}
                    onChange={(e) =>
                      handleInputChange("furnishing_status", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="furnished">Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Utilities */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Utilities & Facilities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kitchen
                  </label>
                  <select
                    value={formData.kitchen}
                    onChange={(e) =>
                      handleInputChange("kitchen", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="private">Private Kitchen</option>
                    <option value="shared">Shared Kitchen</option>
                    <option value="none">No Kitchen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generator
                  </label>
                  <select
                    value={formData.generator}
                    onChange={(e) =>
                      handleInputChange("generator", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Electricity
                  </label>
                  <select
                    value={formData.electricity}
                    onChange={(e) =>
                      handleInputChange("electricity", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="phcn">PHCN</option>
                    <option value="prepaid">Prepaid Meter</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Supply
                  </label>
                  <select
                    value={formData.water_supply}
                    onChange={(e) =>
                      handleInputChange("water_supply", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="borehole">Borehole</option>
                    <option value="well">Well</option>
                    <option value="public">Public Water</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Additional Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security
                  </label>
                  <select
                    value={formData.security}
                    onChange={(e) =>
                      handleInputChange("security", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="fence-gate">Fence & Gate</option>
                    <option value="security-guard">Security Guard</option>
                    <option value="both">Both</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender Restriction
                  </label>
                  <select
                    value={formData.gender_restriction}
                    onChange={(e) =>
                      handleInputChange("gender_restriction", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Space
                  </label>
                  <select
                    value={formData.parking_space}
                    onChange={(e) =>
                      handleInputChange("parking_space", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="available">Available</option>
                    <option value="not-available">Not Available</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Pricing & Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.price_range}
                    onChange={(e) =>
                      handleInputChange("price_range", e.target.value)
                    }
                    placeholder="e.g., ₦80,000 - ₦120,000"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      handleInputChange("availability", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="not_available">Not Available</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs ml-2">
                      (For verification purposes)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      handleInputChange("contact_phone", e.target.value)
                    }
                    placeholder="e.g., 08012345678"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows="4"
                placeholder="Any other important details about the hostel..."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#488bbf" }}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                "Submit for Review →"
              )}
            </button>
          </div>
        </div>

        {/* Previous Submissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            Your Submissions
          </h3>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading submissions...
              </div>
            </div>
          ) : previousSubmissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-medium">No submissions yet</p>
              <p className="text-sm">
                Upload your first hostel to start earning!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {previousSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {submission.hostel_name || submission.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {submission.location}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === "approved" ||
                        submission.status === "published"
                          ? "bg-green-100 text-green-700"
                          : submission.status === "pending" ||
                            submission.status === "pending_review"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {submission.status === "approved" ||
                      submission.status === "published"
                        ? "✓ Approved"
                        : submission.status === "pending" ||
                          submission.status === "pending_review"
                        ? "⏳ Pending"
                        : "✗ Rejected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-500">
                      {submission.created_at
                        ? new Date(submission.created_at).toLocaleDateString()
                        : submission.date}
                    </p>
                    {submission.price && (
                      <p className="font-semibold text-green-600">
                        ₦{submission.price}
                      </p>
                    )}
                  </div>

                  {submission.status === "rejected" && submission.reason && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">
                        <strong>Reason:</strong> {submission.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full text-center">
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
                Submission Successful!
              </h3>
              <p className="text-gray-600 mb-4">
                {successMessage ||
                  "Your hostel information has been submitted. We'll verify the contact number and review within 24-48 hours."}
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
                            e.currentTarget.onerror = null; // prevent loop
                            e.currentTarget.src = "/next.svg"; // existing static fallback
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
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default function ProtectedUploadHostelPage() {
  return (
    <AuthGuard requireAuth={true}>
      <UploadHostelPage />
    </AuthGuard>
  );
}
