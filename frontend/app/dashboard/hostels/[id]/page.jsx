"use client";

import React, { useState, useEffect } from "react";

export default function HostelDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [vacancyResult, setVacancyResult] = useState(null); // 'available' or 'not-available'
  const [showPersonalizedSearchForm, setShowPersonalizedSearchForm] =
    useState(false);

  const [searchFormData, setSearchFormData] = useState({
    maxRent: "",
    paymentPeriod: "",
    locationPreference: "",
    specificArea: "",
    walkingDistance: "",
    accommodationType: "",
    bedrooms: "",
    kitchenType: "",
    bathroomType: "",
    generator: false,
    water247: false,
    security: false,
    parking: false,
    moveInDate: "",
    additionalNotes: "",
    whatsappNumber: "",
    preferredContactTime: "",
  });

  // Sample hostel data
  const hostel = {
    id: 1,
    name: "Victory Lodge",
    price: 120000,
    oldPrice: 140000,
    priceType: "per year",
    location: "Off Campus - Stadium Road, Abraka",
    distanceFromCampus: "5 minutes walk",
    hostelType: "Self Contain",
    numberOfBedrooms: 1,
    bathroomType: "Ensuite",
    numberOfToilets: 1,
    furnishingStatus: "Furnished",
    kitchen: "Private",
    generator: true,
    electricity: "Prepaid Meter",
    waterSupply: "Borehole (24/7)",
    security: "Fence & Gate",
    genderRestriction: "Mixed (Male & Female)",
    parkingSpace: true,
    description: `Spacious and well-maintained self-contain apartment perfect for students. The room is fully furnished with a comfortable bed, wardrobe, study desk, and chair.

Key Features:
• Private bathroom with water heater
• Well-equipped kitchen with gas cooker
• 24/7 water supply from borehole
• Prepaid electricity meter (pay as you use)
• Generator backup during power outages
• Secure compound with fence and gate
• Quiet environment perfect for studies
• Close to campus (5 minutes walk)
• Close to shops and restaurants

The landlord is very responsive and maintains the property well. Rent includes waste management. You only pay for your electricity usage via prepaid meter.

Available for immediate move-in. Contact myDelsu to schedule viewing.`,
    images: [
      "https://via.placeholder.com/400x400?text=Room+View",
      "https://via.placeholder.com/400x400?text=Bathroom",
      "https://via.placeholder.com/400x400?text=Kitchen",
      "https://via.placeholder.com/400x400?text=Building+Exterior",
      "https://via.placeholder.com/400x400?text=Compound",
    ],
    lastVacancyCheck: 5, // days ago
    enquiriesThisWeek: 23,
    views: 342,
  };

  // Similar hostels
  const similarHostels = [
    {
      id: 2,
      name: "Peace Hostel",
      price: 110000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Peace+Hostel",
    },
    {
      id: 3,
      name: "Grace Lodge",
      price: 115000,
      oldPrice: 130000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Grace+Lodge",
    },
    {
      id: 4,
      name: "Winners Apartment",
      price: 125000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Winners+Apt",
    },
    {
      id: 5,
      name: "Royal Hostel",
      price: 105000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Royal+Hostel",
    },
  ];

  const loadingMessages = [
    "🔍 Checking our database...",
    "🏠 Looking for vacancy in this hostel...",
    "📊 Analyzing current availability...",
    "✅ Verifying hostel information...",
    "📞 Confirming with our agents...",
    "🗂️ Pulling latest vacancy records...",
    "⚡ Almost there...",
    "🎯 Finalizing results...",
  ];

  const getVacancyStatusBadge = () => {
    const days = hostel.lastVacancyCheck;
    if (days <= 7) {
      return {
        emoji: "🟢",
        text: "Vacancy confirmed",
        color: "bg-green-100 text-green-700 border-green-300",
      };
    } else {
      return {
        emoji: "🟡",
        text: "Check vacancy",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      };
    }
  };

  const status = getVacancyStatusBadge();

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleCheckVacancy = () => {
    // In real app: Check wallet balance, deduct ₦30
    if (
      confirm("Check vacancy for ₦30? This will be deducted from your wallet.")
    ) {
      // Start loading animation
      setShowLoadingModal(true);

      let messageIndex = 0;
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[messageIndex]);
        messageIndex++;
        if (messageIndex >= loadingMessages.length) {
          clearInterval(interval);
          // Simulate checking complete
          setTimeout(() => {
            setShowLoadingModal(false);
            // Randomly show available or not available (in real app, this comes from admin update)
            const isAvailable = Math.random() > 0.5; // 50/50 for demo
            setVacancyResult(isAvailable ? "available" : "not-available");
            setShowResultModal(true);
          }, 500);
        }
      }, 600);
    }
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ${hostel.name} (${formatPrice(hostel.price)} ${
        hostel.priceType
      }). I confirmed there's vacancy. I'd like to schedule a viewing.`
    );
    window.open(`https://wa.me/2348100879906?text=${message}`, "_blank");
  };

  const handleCallContact = () => {
    window.open("tel:+2348100879906", "_self");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: hostel.name,
          text: `Check out ${hostel.name} on myDelsu Marketplace`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleHostelClick = (item) => {
    alert(`Opening ${item.name} details...`);
  };

  const handlePersonalizedSearchSubmit = () => {
    if (!searchFormData.maxRent || !searchFormData.whatsappNumber) {
      alert("Please fill in all required fields");
      return;
    }

    // In real app: Deduct ₦5,000 from wallet and submit form
    alert(
      "Personalized search request submitted! Our team will contact you within 24 hours with options."
    );
    setShowPersonalizedSearchForm(false);
    setShowResultModal(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hostel.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + hostel.images.length) % hostel.images.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        style={{ backgroundColor: "#488bbf" }}
        className="shadow-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h1 className="text-lg font-semibold text-white">Hostel Details</h1>

          <button
            onClick={handleShare}
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {hostel.images.map((image, index) => (
                <div key={index} className="w-full shrink-0">
                  <img
                    src={image}
                    alt={`${hostel.name} ${index + 1}`}
                    className="w-full h-80 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Navigation */}
          {hostel.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 text-white text-sm font-medium rounded-full">
                {currentImageIndex + 1} / {hostel.images.length}
              </div>
            </>
          )}

          {/* Dots Indicator */}
          {hostel.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {hostel.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl pb-28">
        {/* Price & Title */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {hostel.name}
          </h2>

          <div className="flex items-center space-x-2 mb-4">
            {hostel.oldPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(hostel.oldPrice)}
              </span>
            )}
            <span className="text-3xl font-bold" style={{ color: "#488bbf" }}>
              {formatPrice(hostel.price)}
            </span>
          </div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {hostel.priceType}
          </span>

          {/* Vacancy Status & Stats */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <div
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${status.color}`}
            >
              <span>{status.emoji}</span>
              <span className="font-semibold text-sm">{status.text}</span>
              <span className="text-xs">
                • {hostel.lastVacancyCheck} days ago
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>
                  {hostel.enquiriesThisWeek} students enquired this week
                </span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{hostel.views} people are interested in this</span>
            </div>
          </div>
        </div>

        {/* Check Vacancy Button */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
          <div className="text-center mb-3">
            <h3 className="font-bold text-gray-900 mb-1">
              Want to rent this hostel?
            </h3>
            <p className="text-sm text-gray-600">
              Check current vacancy status for just ₦30
            </p>
          </div>
          <button
            onClick={handleCheckVacancy}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
            style={{ backgroundColor: "#488bbf" }}
          >
            Check Vacancy - ₦30
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Instant verification • Get contacted within 24 hours
          </p>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Location</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-gray-500 mt-0.5 shrink-0"
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
              <div>
                <p className="font-medium text-gray-900">{hostel.location}</p>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {hostel.distanceFromCampus} from campus
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hostel Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Hostel Details</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.hostelType}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Bedrooms</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.numberOfBedrooms}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Bathroom</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.bathroomType}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Toilets</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.numberOfToilets}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Furnishing</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.furnishingStatus}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Kitchen</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.kitchen}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Generator</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.generator ? "✅ Yes" : "❌ No"}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Electricity</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.electricity}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Water Supply</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.waterSupply}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Security</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.security}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Gender</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.genderRestriction}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-xs text-gray-500">Parking</p>
              <p className="text-sm font-semibold text-gray-900">
                {hostel.parkingSpace ? "✅ Available" : "❌ No"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {hostel.description}
          </p>
        </div>

        {/* Safety Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0"
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
              <h4 className="font-semibold text-yellow-900 mb-1">
                Safety Tips for Accommodation
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Always inspect the room before making any payment</li>
                <li>• Verify landlord ownership with proper documentation</li>
                <li>• Never pay full rent without signed agreement</li>
                <li>• Get receipts for all payments made</li>
                <li>• Visit during daytime to check the environment</li>
                <li>• Ask current tenants about their experience</li>
                <li>• Verify all utilities work (water, electricity, etc.)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Report Button */}
        <button
          onClick={() => setShowReportModal(true)}
          className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition mb-6"
        >
          🚩 Report this listing
        </button>

        {/* Similar Hostels */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            Similar Hostels
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {similarHostels.map((item) => (
              <div
                key={item.id}
                onClick={() => handleHostelClick(item)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      {item.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.oldPrice)}
                        </span>
                      )}
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#488bbf" }}
                      >
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {item.priceType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      {showLoadingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {loadingMessage}
            </p>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && !showPersonalizedSearchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            {vacancyResult === "available" ? (
              <>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  🎉 Great News!
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  <strong>{hostel.name}</strong> has vacancy available!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Next Step:</strong> Contact myDelsu to arrange
                    viewing & rental process
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(hostel.price)} {hostel.priceType}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsAppContact}
                    className="py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.51 3.488" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCallContact}
                    className="py-3 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center space-x-2"
                    style={{ backgroundColor: "#488bbf" }}
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>Call</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  myDelsu Agent: +234 810 087 9906
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  😔 Sorry!
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  <strong>{hostel.name}</strong> is currently full. No vacancy
                  available at the moment.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    ← Continue Browsing
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <div className="bg-linear-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      🎯 Let us find for you!
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Our team will search and secure your perfect hostel for
                      just <strong>₦5,000</strong>
                    </p>
                    <button
                      onClick={() => setShowPersonalizedSearchForm(true)}
                      className="w-full py-3 text-white rounded-lg font-semibold transition"
                      style={{ backgroundColor: "#488bbf" }}
                    >
                      Start Personalized Search - ₦5,000
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Personalized Search Form Modal */}
      {showPersonalizedSearchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                🎯 Personalized Hostel Search
              </h3>
              <button
                onClick={() => setShowPersonalizedSearchForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
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

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-800">
                <strong>What you get:</strong> Our team will search, verify, and
                secure your perfect hostel. We'll send you 3-5 options within 24
                hours!
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Rent <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={searchFormData.maxRent}
                    onChange={(e) =>
                      setSearchFormData({
                        ...searchFormData,
                        maxRent: e.target.value,
                      })
                    }
                    placeholder="e.g., 120000"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Period
                  </label>
                  <select
                    value={searchFormData.paymentPeriod}
                    onChange={(e) =>
                      setSearchFormData({
                        ...searchFormData,
                        paymentPeriod: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="per-year">Per Year</option>
                    <option value="per-semester">Per Semester</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Preference
                  </label>
                  <select
                    value={searchFormData.locationPreference}
                    onChange={(e) =>
                      setSearchFormData({
                        ...searchFormData,
                        locationPreference: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="on-campus">On Campus</option>
                    <option value="off-campus">Off Campus</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Area
                  </label>
                  <input
                    type="text"
                    value={searchFormData.specificArea}
                    onChange={(e) =>
                      setSearchFormData({
                        ...searchFormData,
                        specificArea: e.target.value,
                      })
                    }
                    placeholder="e.g., Stadium Road, Near SUB"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accommodation Type
                  </label>
                  <select
                    value={searchFormData.accommodationType}
                    onChange={(e) =>
                      setSearchFormData({
                        ...searchFormData,
                        accommodationType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="self-contain">Self Contain</option>
                    <option value="flat">Flat</option>
                    <option value="bedsitter">Bedsitter</option>
                    <option value="room-parlour">Room & Parlour</option>
                    <option value="any">Any Type</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Move-in Date
                  </label>
                  <input
                    type="date"
                    value={searchFormData.moveInDate}
                    onChange={(e) =>
                      setSearchFormData({
                        ...searchFormData,
                        moveInDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Must-Have Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Generator", "24/7 Water", "Security", "Parking"].map(
                    (feature) => (
                      <label
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{feature}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={searchFormData.additionalNotes}
                  onChange={(e) =>
                    setSearchFormData({
                      ...searchFormData,
                      additionalNotes: e.target.value,
                    })
                  }
                  rows="3"
                  placeholder="Any other specific requirements..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={searchFormData.whatsappNumber}
                  onChange={(e) =>
                    setSearchFormData({
                      ...searchFormData,
                      whatsappNumber: e.target.value,
                    })
                  }
                  placeholder="08012345678"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    Service Fee
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "#488bbf" }}
                  >
                    ₦5,000
                  </span>
                </div>
              </div>

              <button
                onClick={handlePersonalizedSearchSubmit}
                className="w-full py-3 text-white rounded-lg font-semibold transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Submit Request - Pay ₦5,000
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Report this listing
            </h3>

            <div className="space-y-3 mb-6">
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition border">
                🚫 Spam or misleading
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition border">
                💰 Suspected scam
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition border">
                📸 Inappropriate images
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition border">
                ❌ Already rented
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition border">
                🔧 Other issue
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Thank you! We will review this listing.");
                  setShowReportModal(false);
                }}
                className="py-3 text-white rounded-lg font-medium hover:opacity-90 transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
