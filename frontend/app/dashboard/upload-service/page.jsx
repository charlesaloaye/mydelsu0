"use client";
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import AuthGuard from "../../../components/AuthGuard";
import DashboardHeader from "../../../components/DashboardHeader";
import { useToast } from "../../../contexts/ToastContext";

export default function OfferServicesPage() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const userSubscription = {
    tier: "basic",
    servicesUploaded: 1,
    maxServices: 3,
    businessName: "",
    contactNumber: "08012345678",
  };

  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    price: "",
    pricingType: "",
    serviceLocation: "",
    availability: [],
    experience: "",
    portfolioLink: "",
    turnaroundTime: "",
    description: "",
    businessName: userSubscription.businessName,
  });

  const notifications = [
    {
      id: 1,
      message: 'Your service "Graphic Design" was approved!',
      time: "2 hours ago",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const canUploadMore =
    userSubscription.servicesUploaded < userSubscription.maxServices ||
    userSubscription.tier === "premium";

  const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Flexible"];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...imageUrls]);
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleAvailability = (option) => {
    const availability = formData.availability.includes(option)
      ? formData.availability.filter((a) => a !== option)
      : [...formData.availability, option];
    setFormData({ ...formData, availability });
  };

  const handleSubmit = () => {
    if (!canUploadMore) {
      alert(
        "You have reached your subscription limit. Please upgrade to list more services."
      );
      return;
    }

    if (uploadedImages.length === 0) {
      alert("Please upload at least one portfolio image showing your work");
      return;
    }

    if (
      !formData.serviceName ||
      !formData.category ||
      !formData.price ||
      !formData.pricingType ||
      !formData.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!userSubscription.businessName && !formData.businessName) {
      alert("Please enter your business/professional name");
      return;
    }

    showSuccess("Service uploaded successfully!");
    setShowSuccessModal(true);
    setUploadedImages([]);
    setFormData({
      serviceName: "",
      category: "",
      price: "",
      pricingType: "",
      serviceLocation: "",
      availability: [],
      experience: "",
      portfolioLink: "",
      turnaroundTime: "",
      description: "",
      businessName: userSubscription.businessName || formData.businessName,
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <DashboardHeader currentPath="/upload-service" />

        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Offer Your Services 💼
            </h1>
            <p className="text-gray-600">
              Monetize your skills - Tutoring, Design, Programming, and more!
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
                  Services: {userSubscription.servicesUploaded} /{" "}
                  {userSubscription.tier === "premium"
                    ? "∞"
                    : userSubscription.maxServices}
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
              Service Information
            </h3>

            <div className="space-y-6">
              {/* Portfolio Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio/Work Samples <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">
                    (Show your best work)
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
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Click to upload portfolio images
                    </p>
                    <p className="text-sm text-gray-500">
                      Examples of your previous work
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

              {/* Business Name (First Time Only) */}
              {!userSubscription.businessName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Professional/Business Name{" "}
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs ml-2">
                      (Cannot be changed later)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    placeholder="e.g., Victor Graphics Studio"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-blue-600 mt-2">
                    ⚠️ This will be your permanent name on all service listings
                  </p>
                </div>
              )}

              {userSubscription.businessName && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Professional Name:</strong>{" "}
                    {userSubscription.businessName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Contact admin to change name
                  </p>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Service Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.serviceName}
                      onChange={(e) =>
                        handleInputChange("serviceName", e.target.value)
                      }
                      placeholder="e.g., Professional Logo Design"
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
                      <option value="tutoring">
                        📚 Tutoring/Academic Help
                      </option>
                      <option value="design">🎨 Graphic Design</option>
                      <option value="typing">
                        ⌨️ Typing/Document Services
                      </option>
                      <option value="programming">💻 Programming/Tech</option>
                      <option value="photography">📸 Photography</option>
                      <option value="videography">🎥 Videography</option>
                      <option value="hairstyling">💇 Hair Styling</option>
                      <option value="makeup">💄 Makeup</option>
                      <option value="laundry">🧺 Laundry Services</option>
                      <option value="mc">🎤 MC/Host Services</option>
                      <option value="writing">✍️ Content Writing</option>
                      <option value="social-media">
                        📱 Social Media Management
                      </option>
                      <option value="music">🎵 Music/DJ Services</option>
                      <option value="fashion">
                        👗 Fashion Design/Tailoring
                      </option>
                      <option value="repairs">
                        🔧 Repairs (Phone, Laptop, etc.)
                      </option>
                      <option value="fitness">🏋️ Fitness Training</option>
                      <option value="others">💼 Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₦) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="e.g., 5000"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pricing Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.pricingType}
                      onChange={(e) =>
                        handleInputChange("pricingType", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="per-hour">Per Hour</option>
                      <option value="per-day">Per Day</option>
                      <option value="per-project">Per Project</option>
                      <option value="fixed">Fixed Price</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Location
                    </label>
                    <select
                      value={formData.serviceLocation}
                      onChange={(e) =>
                        handleInputChange("serviceLocation", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Location</option>
                      <option value="on-campus">On Campus</option>
                      <option value="off-campus">Off Campus</option>
                      <option value="online">Online/Remote</option>
                      <option value="any">Any Location</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience/Qualification
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="e.g., 3 years experience, Certified..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio/Work Link
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioLink}
                      onChange={(e) =>
                        handleInputChange("portfolioLink", e.target.value)
                      }
                      placeholder="e.g., https://behance.net/yourportfolio"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Turnaround Time
                    </label>
                    <input
                      type="text"
                      value={formData.turnaroundTime}
                      onChange={(e) =>
                        handleInputChange("turnaroundTime", e.target.value)
                      }
                      placeholder="e.g., 2-3 days, Same day"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleAvailability(option)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        formData.availability.includes(option)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="6"
                  placeholder="Describe your service in detail... Include what you offer, your process, what makes you unique, any special offers, etc."
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Your Contact Number:</strong>{" "}
                  {userSubscription.contactNumber}
                </p>
                <p className="text-xs text-gray-500">
                  Clients will contact you via WhatsApp or Call on this number
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
                {canUploadMore ? "List Service →" : "Upgrade to List More"}
              </button>
            </div>
          </div>

          {/* Subscription Plans Info */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Service Marketplace Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-bold text-green-600 mb-2">🌟 Basic</h4>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  ₦500<span className="text-sm font-normal">/month</span>
                </p>
                <p className="text-sm text-gray-600">List up to 3 services</p>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <h4 className="font-bold text-blue-600 mb-2">⭐ Standard</h4>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  ₦1,500<span className="text-sm font-normal">/month</span>
                </p>
                <p className="text-sm text-gray-600">List up to 10 services</p>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <h4 className="font-bold text-purple-600 mb-2">💎 Premium</h4>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  ₦3,000<span className="text-sm font-normal">/month</span>
                </p>
                <p className="text-sm text-gray-600">Unlimited services</p>
              </div>
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
                Service Listed!
              </h3>
              <p className="text-gray-600 mb-6">
                Your service is now live on the marketplace. Clients can view
                your portfolio and contact you directly via WhatsApp or Call.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 rounded-lg font-semibold text-white transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                View My Services
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
