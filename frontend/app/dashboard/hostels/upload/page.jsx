"use client";

import React, { useState } from "react";

export default function UploadHostelPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    hostelName: "",
    location: "",
    specificAddress: "",
    distanceFromCampus: "",
    hostelType: "",
    numberOfBedrooms: "",
    bathroomType: "",
    numberOfToilets: "",
    furnishingStatus: "",
    kitchen: "",
    generator: "",
    electricity: "",
    waterSupply: "",
    security: "",
    genderRestriction: "",
    parkingSpace: "",
    rentPrice: "",
    paymentPeriod: "",
    contactNumber: "",
    description: "",
  });

  const notifications = [
    {
      id: 1,
      message: "Your hostel upload was approved! ₦300 added",
      time: "3 hours ago",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const previousSubmissions = [
    {
      id: 1,
      hostelName: "Winners Lodge",
      location: "Off Campus",
      status: "approved",
      earnings: 300,
      date: "2 days ago",
    },
    {
      id: 2,
      hostelName: "Peace Hostel",
      location: "Inside Campus",
      status: "pending",
      earnings: 0,
      date: "1 day ago",
    },
    {
      id: 3,
      hostelName: "Grace Lodge",
      location: "Off Campus",
      status: "rejected",
      earnings: 0,
      date: "3 days ago",
      reason: "Images not clear enough. Upload better quality pictures",
    },
  ];

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

  const handleSubmit = () => {
    if (uploadedImages.length < 3) {
      alert("Please upload at least 3 images (bedroom, bathroom, exterior)");
      return;
    }
    if (
      !formData.hostelName ||
      !formData.location ||
      !formData.specificAddress ||
      !formData.hostelType ||
      !formData.rentPrice ||
      !formData.contactNumber
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setShowSuccessModal(true);
    setUploadedImages([]);
    setFormData({
      hostelName: "",
      location: "",
      specificAddress: "",
      distanceFromCampus: "",
      hostelType: "",
      numberOfBedrooms: "",
      bathroomType: "",
      numberOfToilets: "",
      furnishingStatus: "",
      kitchen: "",
      generator: "",
      electricity: "",
      waterSupply: "",
      security: "",
      genderRestriction: "",
      parkingSpace: "",
      rentPrice: "",
      paymentPeriod: "",
      contactNumber: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
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
                    Earn Money
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
              className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0"
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
                    value={formData.hostelName}
                    onChange={(e) =>
                      handleInputChange("hostelName", e.target.value)
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
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="inside">Inside Campus</option>
                    <option value="off">Off Campus</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Address/Area{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.specificAddress}
                    onChange={(e) =>
                      handleInputChange("specificAddress", e.target.value)
                    }
                    placeholder="e.g., Stadium Road, Abraka"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance from Campus
                  </label>
                  <input
                    type="text"
                    value={formData.distanceFromCampus}
                    onChange={(e) =>
                      handleInputChange("distanceFromCampus", e.target.value)
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
                    value={formData.hostelType}
                    onChange={(e) =>
                      handleInputChange("hostelType", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="flat">Flat</option>
                    <option value="bedsitter">Bedsitter</option>
                    <option value="selfcontain">Self Contain</option>
                    <option value="room-parlour">Room & Parlour</option>
                    <option value="single">Single Room</option>
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
                    value={formData.numberOfBedrooms}
                    onChange={(e) =>
                      handleInputChange("numberOfBedrooms", e.target.value)
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
                    value={formData.bathroomType}
                    onChange={(e) =>
                      handleInputChange("bathroomType", e.target.value)
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
                    value={formData.numberOfToilets}
                    onChange={(e) =>
                      handleInputChange("numberOfToilets", e.target.value)
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
                    value={formData.furnishingStatus}
                    onChange={(e) =>
                      handleInputChange("furnishingStatus", e.target.value)
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
                    value={formData.waterSupply}
                    onChange={(e) =>
                      handleInputChange("waterSupply", e.target.value)
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
                    value={formData.genderRestriction}
                    onChange={(e) =>
                      handleInputChange("genderRestriction", e.target.value)
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
                    value={formData.parkingSpace}
                    onChange={(e) =>
                      handleInputChange("parkingSpace", e.target.value)
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
                    Rent Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) =>
                      handleInputChange("rentPrice", e.target.value)
                    }
                    placeholder="e.g., 80000"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Period
                  </label>
                  <select
                    value={formData.paymentPeriod}
                    onChange={(e) =>
                      handleInputChange("paymentPeriod", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="year">Per Year</option>
                    <option value="semester">Per Semester</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caretaker/Landlord Number{" "}
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs ml-2">
                      (For verification purposes)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
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
              className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: "#488bbf" }}
            >
              Submit for Review →
            </button>
          </div>
        </div>

        {/* Previous Submissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            Your Submissions
          </h3>

          {previousSubmissions.length === 0 ? (
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
                        {submission.hostelName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {submission.location}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : submission.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {submission.status === "approved"
                        ? "✓ Approved"
                        : submission.status === "pending"
                        ? "⏳ Pending"
                        : "✗ Rejected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-500">{submission.date}</p>
                    {submission.status === "approved" && (
                      <p className="font-semibold text-green-600">
                        +₦{submission.earnings}
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
              Submission Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Your hostel information has been submitted. We'll verify the
              contact number and review within 24-48 hours.
            </p>
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
  );
}