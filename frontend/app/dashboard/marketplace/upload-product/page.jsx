"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import apiClient from "../../../../lib/api";
import AuthGuard from "../../../../components/AuthGuard";
import Navbar from "../../../../components/Navbar";
import { useToast } from "../../../../contexts/ToastContext";

function UploadProductPage() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  // User subscription info - this would come from the backend
  const userSubscription = {
    tier: "basic", // basic, standard, premium
    productsUploaded: 2,
    maxProducts: 3,
    businessName: "", // Empty if first time, filled if already set
    contactNumber: user?.phone || "08012345678", // From user profile
  };

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    condition: "",
    location: "",
    priceNegotiable: false,
    specifications: "",
    description: "",
    businessName: userSubscription.businessName,
  });

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      loadUserSubscription();
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

  const loadUserSubscription = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUserSubscription();
      if (response.success) {
        // Update userSubscription with real data from backend
        // For now, keeping mock data structure
      }
    } catch (error) {
      console.error("Error loading subscription info:", error);
      // Fallback to mock data if API fails
    } finally {
      setLoading(false);
    }
  };

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

  const canUploadMore =
    userSubscription.productsUploaded < userSubscription.maxProducts ||
    userSubscription.tier === "premium";

  const handleSubmit = async () => {
    setError("");

    // Check subscription limit
    if (!canUploadMore) {
      setShowSubscriptionModal(true);
      return;
    }

    // Validation
    if (uploadedImages.length < 2) {
      setError("Please upload at least 2 images of your product");
      return;
    }
    if (
      !formData.productName ||
      !formData.category ||
      !formData.price ||
      !formData.condition ||
      !formData.location ||
      !formData.description
    ) {
      setError("Please fill in all required fields");
      return;
    }
    if (!userSubscription.businessName && !formData.businessName) {
      setError("Please enter your business name");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare form data for API
      const submitData = {
        ...formData,
        images: uploadedImages
          .map((_, index) => {
            // Get the actual file from the input
            const fileInput = document.getElementById("image-upload");
            return fileInput.files[index];
          })
          .filter(Boolean),
      };

      // Use the dedicated upload product API endpoint
      const response = await apiClient.uploadProduct(submitData);

      if (response.success) {
        showSuccess(response.message || "Product uploaded successfully!");
        setShowSuccessModal(true);
        setUploadedImages([]);
        setFormData({
          productName: "",
          category: "",
          price: "",
          condition: "",
          location: "",
          priceNegotiable: false,
          specifications: "",
          description: "",
          businessName: userSubscription.businessName || formData.businessName,
        });
      } else {
        setError(response.message || "Failed to upload product");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      setError(error.message || "An error occurred while uploading");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <Navbar
        variant="dashboard"
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => {}}
        currentPath="/dashboard/marketplace/upload-product"
      />

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            List Your Product 🛍️
          </h1>
          <p className="text-gray-600">
            Sell anything - Tech, Books, Fashion, and more!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-red-400 mr-3 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Status */}
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
                Products: {userSubscription.productsUploaded} /{" "}
                {userSubscription.tier === "premium"
                  ? "∞"
                  : userSubscription.maxProducts}
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

        {!canUploadMore && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-amber-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">
                  Upload Limit Reached
                </h3>
                <p className="text-sm text-amber-700">
                  You've reached your {userSubscription.tier} plan limit.
                  Upgrade to list more products.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-6 text-lg">
            Product Information
          </h3>

          <div className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">
                  (Min. 2 images)
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
                    Click to upload product images
                  </p>
                  <p className="text-sm text-gray-500">
                    Multiple angles, clear quality
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
                  Your Business Name <span className="text-red-500">*</span>
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
                  placeholder="e.g., Victor's Tech Store"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-blue-600 mt-2">
                  ⚠️ This will be your permanent business name on all listings
                </p>
              </div>
            )}

            {userSubscription.businessName && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Business Name:</strong>{" "}
                  {userSubscription.businessName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Contact admin to change business name
                </p>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                  placeholder="e.g., iPhone 13 Pro Max"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
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
                  <option value="electronics">📱 Electronics & Tech</option>
                  <option value="fashion">👕 Fashion & Accessories</option>
                  <option value="books">📚 Books & Study Materials</option>
                  <option value="home">🏠 Home & Living</option>
                  <option value="sports">⚽ Sports & Fitness</option>
                  <option value="others">🎨 Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    handleInputChange("condition", e.target.value)
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Condition</option>
                  <option value="new">Brand New</option>
                  <option value="like-new">Used (Like New)</option>
                  <option value="good">Used (Good)</option>
                  <option value="fair">Used (Fair)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="e.g., 150000"
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
                  placeholder="e.g., Abraka, Delta State"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Price Negotiable */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.priceNegotiable}
                onChange={(e) =>
                  handleInputChange("priceNegotiable", e.target.checked)
                }
                className="w-4 h-4 rounded"
                style={{ accentColor: "#488bbf" }}
              />
              <label
                htmlFor="negotiable"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                Price is negotiable
              </label>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Specifications
                <span className="text-gray-500 text-xs ml-2">
                  (Optional - e.g., Color, Size, Brand, Model)
                </span>
              </label>
              <input
                type="text"
                value={formData.specifications}
                onChange={(e) =>
                  handleInputChange("specifications", e.target.value)
                }
                placeholder="e.g., Black, 128GB, Apple"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows="5"
                placeholder="Describe your product in detail... Include important information about the condition, usage, reason for selling, etc."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            {/* Contact Info Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Your Contact Number:</strong>{" "}
                {userSubscription.contactNumber}
              </p>
              <p className="text-xs text-gray-500">
                Buyers will contact you via WhatsApp or Call on this number
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canUploadMore || submitting}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                canUploadMore && !submitting
                  ? "hover:shadow-lg"
                  : "opacity-50 cursor-not-allowed"
              }`}
              style={{ backgroundColor: "#488bbf" }}
            >
              {submitting
                ? "Uploading..."
                : canUploadMore
                ? "List Product →"
                : "Upgrade to List More"}
            </button>
          </div>
        </div>

        {/* Subscription Plans Info */}
        <div className="bg-linear-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Marketplace Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <h4 className="font-bold text-green-600 mb-2">🌟 Basic</h4>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                ₦500<span className="text-sm font-normal">/month</span>
              </p>
              <p className="text-sm text-gray-600">List up to 3 products</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <h4 className="font-bold text-blue-600 mb-2">⭐ Standard</h4>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                ₦1,500<span className="text-sm font-normal">/month</span>
              </p>
              <p className="text-sm text-gray-600">List up to 10 products</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
              <h4 className="font-bold text-purple-600 mb-2">💎 Premium</h4>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                ₦3,000<span className="text-sm font-normal">/month</span>
              </p>
              <p className="text-sm text-gray-600">Unlimited products</p>
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
                Product Listed!
              </h3>
              <p className="text-gray-600 mb-6">
                Your product is now live on the marketplace. Buyers can contact
                you directly via WhatsApp or Call.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 rounded-lg font-semibold text-white transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                View My Products
              </button>
            </div>
          </div>
        )}

        {/* Subscription Limit Modal */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Upgrade Required
              </h3>
              <p className="text-gray-600 mb-6">
                You've reached your {userSubscription.tier} plan limit. Upgrade
                to Standard or Premium to list more products.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition"
                  style={{ backgroundColor: "#488bbf" }}
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function ProtectedUploadProductPage() {
  return (
    <AuthGuard requireAuth={true}>
      <UploadProductPage />
    </AuthGuard>
  );
}
