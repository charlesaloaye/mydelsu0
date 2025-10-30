"use client";
import React, { useState } from "react";
import apiClient from "../../../lib/api";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardLayout from "../../../components/DashboardLayout";
import AuthGuard from "../../../components/AuthGuard";

export default function FindRoommatePage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [roomSituation, setRoomSituation] = useState("");
  const [roomImages, setRoomImages] = useState([]);
  const [roomImageFiles, setRoomImageFiles] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [wantsBoost, setWantsBoost] = useState(false);
  const { user } = (typeof useAuth === "function" ? useAuth() : {}) || {};

  // Verified user data (auto-filled from registration/verification)
  const verifiedUser = {
    profilePhoto: "https://via.placeholder.com/150", // This would come from their verified profile
    fullName: "John Doe",
    gender: "Male",
    level: "300L",
    department: "Computer Science",
    age: "21",
    phoneNumber: "08012345678",
    isVerified: true,
  };

  const [formData, setFormData] = useState({
    // Room details (for "I have room")
    hostelName: "",
    fullAddress: "",
    availableSpace: "",
    rentPerPerson: "",
    utilities: [],
    amenities: [],
    currentOccupants: "",
    moveInDate: "",

    // Looking together (for "no room yet")
    placeType: "",
    preferredLocations: [],
    budgetPerPerson: "",
    mustHaveAmenities: [],
    moveInTimeline: "",

    // Common fields
    roommateGender: "",
    numberOfRoommates: "",
    studentLevelPreference: "",

    // Lifestyle
    studyHabits: [],
    cleanliness: "",
    socialLife: "",
    lifestyle: [],

    // About
    introduction: "",
    hobbies: "",
    whatYouBring: "",
    dealBreakers: "",

    // Contact & Safety
    contactMethod: "",
    contactTime: "",
    emergencyContact: "",
    agreedToSafety: false,
  });

  const notifications = [
    {
      id: 1,
      message: "Your roommate listing has 12 views!",
      time: "3 hours ago",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setRoomImages([...roomImages, ...imageUrls]);
    setRoomImageFiles([...roomImageFiles, ...files]);
  };

  const removeRoomImage = (index) => {
    setRoomImages(roomImages.filter((_, i) => i !== index));
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleArrayField = (field, value) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async () => {
    // Validation
    if (!roomSituation) {
      alert("Please select your room situation");
      return;
    }

    if (roomSituation === "have-room") {
      if (roomImages.length < 3) {
        alert("Please upload at least 3 photos of your room/apartment");
        return;
      }
      if (
        !formData.hostelName ||
        !formData.fullAddress ||
        !formData.rentPerPerson ||
        !formData.availableSpace
      ) {
        alert("Please fill in all required room details");
        return;
      }
    }

    if (roomSituation === "no-room") {
      if (
        !formData.budgetPerPerson ||
        formData.preferredLocations.length === 0
      ) {
        alert("Please specify your budget and preferred locations");
        return;
      }
    }

    if (
      !formData.roommateGender ||
      !formData.numberOfRoommates ||
      !formData.introduction ||
      !formData.contactMethod ||
      !formData.cleanliness ||
      !formData.socialLife
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.introduction.length < 100) {
      alert("Introduction must be at least 100 characters");
      return;
    }

    if (!formData.emergencyContact) {
      alert("Please provide an emergency contact for your safety");
      return;
    }

    if (!formData.agreedToSafety) {
      alert("Please agree to follow the safety guidelines");
      return;
    }

    // Submit to backend API
    try {
      const title =
        roomSituation === "have-room"
          ? `${formData.hostelName || "Room"} - Roommate Needed (${
              formData.availableSpace || "1+"
            })`
          : `Looking for Roommates - ${formData.placeType || "Shared Place"}`;

      const price =
        roomSituation === "have-room"
          ? formData.rentPerPerson || ""
          : formData.budgetPerPerson || "";

      const location =
        roomSituation === "have-room"
          ? formData.fullAddress || formData.hostelName || ""
          : (formData.preferredLocations || []).join(", ");

      const descriptionPayload = {
        roomSituation,
        ...formData,
        postedBy:
          user && (user.first_name || user.last_name)
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
            : undefined,
      };

      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", JSON.stringify(descriptionPayload));
      if (price !== "") fd.append("price", String(price));
      if (location) fd.append("location", location);
      if (roomImageFiles && roomImageFiles.length > 0) {
        roomImageFiles.forEach((file, index) => {
          fd.append(`images[${index}]`, file);
        });
      }

      await apiClient.post("/roommates", fd);
      setShowSuccessModal(true);
    } catch (error) {
      alert(error?.message || "Failed to submit roommate listing");
    }
  };

  const totalCost = wantsBoost ? 700 : 500;

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => setShowNotifications(!showNotifications)}
    >
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find Roommate 🤝
          </h1>
          <p className="text-gray-600">
            Connect with verified DELSU students - Safe & Secure!
          </p>
        </div>

        {/* Verified User Warning */}
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-900 mb-1">
                ✅ Verified Student Only
              </h3>
              <p className="text-sm text-green-800">
                Only verified DELSU students can post roommate listings. Your
                verified information will be displayed to ensure trust and
                safety.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                💰 Listing Fee: ₦500
              </h3>
              <p className="text-sm text-gray-600">
                Active for 60 days • +₦200 to boost (pin at top for 7 days)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Admin Reviewed
              </span>
            </div>
          </div>
        </div>

        {/* STEP 1: Room Situation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            What's Your Situation? <span className="text-red-500">*</span>
          </h3>

          <select
            value={roomSituation}
            onChange={(e) => setRoomSituation(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            required
          >
            <option value="">-- Select your situation --</option>
            <option value="have-room">
              🏠 I have a room/apartment - Looking for roommate(s)
            </option>
            <option value="no-room">
              🤝 I don't have a room yet - Looking to find place together
            </option>
          </select>
        </div>

        {/* CONDITIONAL: I HAVE ROOM */}
        {roomSituation === "have-room" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">
              Your Accommodation Details
            </h3>

            <div className="space-y-6">
              {/* Room Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room/Apartment Photos <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">
                    (At least 3 photos required)
                  </span>
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="room-upload"
                  />
                  <label htmlFor="room-upload" className="cursor-pointer">
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
                      Click to upload room photos
                    </p>
                    <p className="text-sm text-gray-500">
                      Show the room, bathroom, kitchen, building exterior
                    </p>
                  </label>
                </div>

                {roomImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roomImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Room ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeRoomImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel/Building Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hostelName}
                    onChange={(e) =>
                      handleInputChange("hostelName", e.target.value)
                    }
                    placeholder="e.g., Peace Lodge, Victory Hostel"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address/Location{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.fullAddress}
                    onChange={(e) =>
                      handleInputChange("fullAddress", e.target.value)
                    }
                    rows="3"
                    placeholder="Include street, landmarks, distance from campus..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Space <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.availableSpace}
                    onChange={(e) =>
                      handleInputChange("availableSpace", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select space type --</option>
                    <option value="bed-space">Bed space in shared room</option>
                    <option value="private-room">
                      Private room in shared apartment
                    </option>
                    <option value="shared-room">
                      Shared room (multiple beds available)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Per Person (₦/month){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.rentPerPerson}
                    onChange={(e) =>
                      handleInputChange("rentPerPerson", e.target.value)
                    }
                    placeholder="e.g., 35000"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Occupants
                  </label>
                  <select
                    value={formData.currentOccupants}
                    onChange={(e) =>
                      handleInputChange("currentOccupants", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="alone">
                      I live alone (need 1st roommate)
                    </option>
                    <option value="one">1 person already (need 1 more)</option>
                    <option value="two">2 people already (need 1 more)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Utilities - Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Utilities Included (Check all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Electricity",
                    "Water",
                    "Wi-Fi",
                    "Generator",
                    "Waste disposal",
                    "Security",
                  ].map((utility) => (
                    <label
                      key={utility}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.utilities.includes(utility)}
                        onChange={() => toggleArrayField("utilities", utility)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{utility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities - Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities Available (Check all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Kitchen",
                    "Private bathroom",
                    "Shared bathroom",
                    "Wardrobe",
                    "Study desk",
                    "Fan/AC",
                    "Fridge",
                    "TV",
                  ].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleArrayField("amenities", amenity)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Move-in Date
                </label>
                <select
                  value={formData.moveInDate}
                  onChange={(e) =>
                    handleInputChange("moveInDate", e.target.value)
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option value="immediately">Immediately available</option>
                  <option value="specific">
                    Specific date (mention in description)
                  </option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONAL: NO ROOM YET */}
        {roomSituation === "no-room" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">
              What We're Looking For Together
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What type of place?
                </label>
                <select
                  value={formData.placeType}
                  onChange={(e) =>
                    handleInputChange("placeType", e.target.value)
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option value="self-contain">
                    Self-contain (1 room apartment)
                  </option>
                  <option value="2-bedroom">2 bedroom flat</option>
                  <option value="3-bedroom">3 bedroom flat</option>
                  <option value="room-in-apartment">
                    Room in larger apartment
                  </option>
                  <option value="flexible">Flexible/Open to options</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Location(s) <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">
                    (Check all that apply)
                  </span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "On Campus",
                    "Abraka Town",
                    "Around Campus (walking distance)",
                    "Off Campus (any area)",
                  ].map((location) => (
                    <label
                      key={location}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferredLocations.includes(location)}
                        onChange={() =>
                          toggleArrayField("preferredLocations", location)
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Budget Per Person (₦/month){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.budgetPerPerson}
                  onChange={(e) =>
                    handleInputChange("budgetPerPerson", e.target.value)
                  }
                  placeholder="e.g., 40000"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is what YOU can afford monthly
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Must-Have Amenities (Check all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Kitchen",
                    "Private bathroom",
                    "Good water supply",
                    "Constant electricity",
                    "Security/Gate",
                    "Wi-Fi ready",
                    "Parking space",
                  ].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.mustHaveAmenities.includes(amenity)}
                        onChange={() =>
                          toggleArrayField("mustHaveAmenities", amenity)
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Move-in Timeline
                </label>
                <select
                  value={formData.moveInTimeline}
                  onChange={(e) =>
                    handleInputChange("moveInTimeline", e.target.value)
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option value="immediately">
                    Immediately (start searching now)
                  </option>
                  <option value="next-month">Next month</option>
                  <option value="next-semester">Next semester</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* WHO YOU'RE LOOKING FOR (Common for both) */}
        {roomSituation && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">
                Who You're Looking For 🎯
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roommate Gender Preference{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.roommateGender}
                    onChange={(e) =>
                      handleInputChange("roommateGender", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="male">👨 Male roommate only</option>
                    <option value="female">👩 Female roommate only</option>
                    <option value="no-preference">
                      🤝 No gender preference
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Roommates Needed{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.numberOfRoommates}
                      onChange={(e) =>
                        handleInputChange("numberOfRoommates", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Select --</option>
                      <option value="1">1 person</option>
                      <option value="2">2 people</option>
                      <option value="3+">3+ people</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Status Preference
                    </label>
                    <select
                      value={formData.studentLevelPreference}
                      onChange={(e) =>
                        handleInputChange(
                          "studentLevelPreference",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any level welcome</option>
                      <option value="same">Same level preferred</option>
                      <option value="serious">Serious students only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* YOUR VERIFIED PROFILE (Read-Only) */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-green-200 p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="font-bold text-gray-900 text-lg">
                  Your Verified Profile 👤
                </h3>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  <strong>
                    🔒 This information is from your verified DELSU profile and
                    will be shown to potential roommates for safety and trust.
                  </strong>
                </p>
              </div>

              <div className="space-y-4">
                {/* Profile Photo */}
                <div className="flex items-center space-x-4 pb-4 border-b">
                  <img
                    src={verifiedUser.profilePhoto}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Profile Photo
                    </p>
                    <p className="text-xs text-gray-500">
                      From your verified account
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                  </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {verifiedUser.fullName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Gender</p>
                    <p className="font-semibold text-gray-900">
                      {verifiedUser.gender}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Level</p>
                    <p className="font-semibold text-gray-900">
                      {verifiedUser.level}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="font-semibold text-gray-900">
                      {verifiedUser.department}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Age</p>
                    <p className="font-semibold text-gray-900">
                      {verifiedUser.age} years
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="font-semibold text-gray-900">
                      {verifiedUser.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIFESTYLE & PREFERENCES */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">
                Lifestyle & Preferences 🏡
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Study Habits (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Night owl 🦉",
                      "Early bird 🌅",
                      "Need quiet environment 📚",
                      "Okay with background noise",
                    ].map((habit) => (
                      <label
                        key={habit}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.studyHabits.includes(habit)}
                          onChange={() =>
                            toggleArrayField("studyHabits", habit)
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{habit}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleanliness Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.cleanliness}
                    onChange={(e) =>
                      handleInputChange("cleanliness", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="very-neat">Very organized & neat ✨</option>
                    <option value="moderate">Moderately neat</option>
                    <option value="laid-back">Laid back/relaxed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Life <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.socialLife}
                    onChange={(e) =>
                      handleInputChange("socialLife", e.target.value)
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="homebody">
                      Homebody (prefer staying in)
                    </option>
                    <option value="social">Social (friends over often)</option>
                    <option value="balanced">
                      Balanced (occasional visitors)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Lifestyle (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Cook regularly 🍳",
                      "Early sleeper (by 10pm) 😴",
                      "Night person (after midnight) 🌙",
                      "Non-smoker 🚭",
                      "Religious/spiritual 🙏",
                      "Quiet person",
                      "Love music 🎵",
                    ].map((life) => (
                      <label
                        key={life}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.lifestyle.includes(life)}
                          onChange={() => toggleArrayField("lifestyle", life)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{life}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ABOUT YOU */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">
                About You ✍️
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Introduce Yourself <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs ml-2">
                      (Minimum 100 characters)
                    </span>
                  </label>
                  <textarea
                    value={formData.introduction}
                    onChange={(e) =>
                      handleInputChange("introduction", e.target.value)
                    }
                    rows="6"
                    placeholder="Tell potential roommates about your personality, habits, what you're looking for, deal-breakers, what you offer as a roommate, etc."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.introduction.length} / 100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Hobbies/Interests
                  </label>
                  <input
                    type="text"
                    value={formData.hobbies}
                    onChange={(e) =>
                      handleInputChange("hobbies", e.target.value)
                    }
                    placeholder="e.g., Reading, Gaming, Sports, Cooking, Music"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What You Bring to the Table
                  </label>
                  <input
                    type="text"
                    value={formData.whatYouBring}
                    onChange={(e) =>
                      handleInputChange("whatYouBring", e.target.value)
                    }
                    placeholder="e.g., I have kitchen utensils, Good cook, Very organized"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deal Breakers
                  </label>
                  <input
                    type="text"
                    value={formData.dealBreakers}
                    onChange={(e) =>
                      handleInputChange("dealBreakers", e.target.value)
                    }
                    placeholder="What you absolutely can't tolerate"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* CONTACT & SAFETY */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">
                Contact & Safety 📞
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.contactMethod}
                      onChange={(e) =>
                        handleInputChange("contactMethod", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Select --</option>
                      <option value="whatsapp">WhatsApp only</option>
                      <option value="call">Call only</option>
                      <option value="both">Both WhatsApp & Call</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Best Time to Contact
                    </label>
                    <select
                      value={formData.contactTime}
                      onChange={(e) =>
                        handleInputChange("contactTime", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Anytime</option>
                      <option value="morning">Morning (8am-12pm)</option>
                      <option value="afternoon">Afternoon (12pm-5pm)</option>
                      <option value="evening">Evening (5pm-9pm)</option>
                    </select>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    🚨 Emergency Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                    placeholder="Name and phone number of someone who knows you're looking for roommate"
                    className="w-full px-4 py-3 border-2 border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                  <p className="text-xs text-yellow-800 mt-2">
                    <strong>For your safety:</strong> Someone should know you're
                    looking for a roommate and meeting potential matches.
                  </p>
                </div>

                {/* Boost Option */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="boost"
                      checked={wantsBoost}
                      onChange={(e) => setWantsBoost(e.target.checked)}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="boost"
                        className="font-semibold text-gray-900 cursor-pointer"
                      >
                        🚀 Boost My Listing (+₦200)
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Pin your listing at the top for 7 days for maximum
                        visibility!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Listing Fee (60 days)</span>
                    <span className="font-bold text-gray-900">₦500</span>
                  </div>
                  {wantsBoost && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">
                        Boost (7 days at top)
                      </span>
                      <span className="font-bold text-gray-900">₦200</span>
                    </div>
                  )}
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span
                        className="font-bold text-xl"
                        style={{ color: "#488bbf" }}
                      >
                        ₦{totalCost}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ENHANCED SAFETY GUIDELINES */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-red-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">🚨</span>
                CRITICAL Safety Guidelines - READ CAREFULLY
              </h3>

              <div className="space-y-3 mb-6">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    🔒 Before Meeting:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>
                      • Video call first - verify they match their profile
                    </li>
                    <li>• Tell emergency contact where you're going & when</li>
                    <li>
                      • Share their profile details with someone you trust
                    </li>
                    <li>
                      • Check their student ID - ensure they're DELSU student
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    👥 During Meeting:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>
                      • Meet in PUBLIC PLACES ONLY (campus, popular spots)
                    </li>
                    <li>• Bring a trusted friend with you</li>
                    <li>• Meet during DAYLIGHT HOURS</li>
                    <li>• Keep your phone charged and accessible</li>
                    <li>• Trust your gut - if something feels wrong, LEAVE</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    💰 Financial Safety:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• NEVER send money before meeting in person</li>
                    <li>• NEVER share bank details or sensitive info online</li>
                    <li>• Verify landlord/property legitimacy before paying</li>
                    <li>• Get receipts for all payments</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    🚩 Red Flags - Report Immediately:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Refusing to video call or meet in public</li>
                    <li>• Asking for money before meeting</li>
                    <li>• Pressure to make quick decisions</li>
                    <li>• Can't verify student status</li>
                    <li>• Makes you feel uncomfortable or unsafe</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    📞 Emergency Support:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Report suspicious listings to myDelsu Admin</li>
                    <li>• Block users who make you uncomfortable</li>
                    <li>• Campus Security: [Number]</li>
                    <li>• Police Emergency: 112</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white rounded-lg p-4 border-2 border-red-300">
                <input
                  type="checkbox"
                  id="safety-agree"
                  checked={formData.agreedToSafety}
                  onChange={(e) =>
                    handleInputChange("agreedToSafety", e.target.checked)
                  }
                  className="mt-1 w-4 h-4"
                  required
                />
                <label
                  htmlFor="safety-agree"
                  className="text-sm font-semibold text-gray-900 cursor-pointer"
                >
                  <span className="text-red-500">*</span> I have READ and
                  UNDERSTAND all safety guidelines. I agree to follow them and
                  take responsibility for my personal safety when meeting
                  potential roommates.
                </label>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:shadow-lg text-lg"
              style={{ backgroundColor: "#488bbf" }}
            >
              Post Listing - Pay ₦{totalCost} →
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              Your listing will be reviewed by admin within 24 hours for safety
              compliance
            </p>
          </>
        )}

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
                Listing Submitted! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                Your roommate listing is under admin review and will be live
                within 24 hours. You'll be notified once approved.
              </p>
              {wantsBoost && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-purple-700">
                    🚀 Your listing will be pinned at the top for 7 days after
                    approval!
                  </p>
                </div>
              )}
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-6">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  🔒 Safety Reminders:
                </p>
                <ul className="text-xs text-yellow-800 text-left space-y-1">
                  <li>• Always meet in public places</li>
                  <li>• Tell someone where you're going</li>
                  <li>• Video call before meeting in person</li>
                  <li>• Never send money before meeting</li>
                  <li>• Trust your instincts!</li>
                </ul>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 rounded-lg font-semibold text-white transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
