"use client";

import React, { useEffect, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";

function HostelsMarketplacePage() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Banner ads data
  const bannerAds = [
    {
      id: 1,
      image:
        "https://via.placeholder.com/800x300/4CAF50/ffffff?text=Luxury+Hostels+Near+Campus+-+Contact+Now!",
      whatsappNumber: "2348012345678",
      message: "Hi! I saw your luxury hostel ad on myDelsu marketplace.",
    },
    {
      id: 2,
      image:
        "https://via.placeholder.com/800x300/2196F3/ffffff?text=Affordable+Self+Contain+-+Move+In+Today!",
      whatsappNumber: "2348087654321",
      message:
        "Hi! I want to inquire about the self contain from your myDelsu ad.",
    },
    {
      id: 3,
      image:
        "https://via.placeholder.com/800x300/FF9800/ffffff?text=Premium+Student+Accommodation+-+Book+Now",
      whatsappNumber: "2348023456789",
      message: "Hi! I want to book accommodation from your myDelsu ad.",
    },
  ];

  // Categories
  const categories = [
    { id: "all", name: "All", emoji: "🏠" },
    { id: "on-campus", name: "On Campus", emoji: "🏫" },
    { id: "off-campus", name: "Off Campus", emoji: "🏘️" },
    { id: "self-contain", name: "Self Contain", emoji: "🚪" },
    { id: "flat", name: "Flat", emoji: "🏢" },
    { id: "bedsitter", name: "Bedsitter", emoji: "🛏️" },
    { id: "room-parlour", name: "Room & Parlour", emoji: "🏡" },
    { id: "single-room", name: "Single Room", emoji: "🚪" },
  ];

  // Sample sponsored hostels
  const sponsoredHostels = [
    {
      id: 1,
      name: "Victory Lodge",
      price: 120000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Victory+Lodge",
    },
    {
      id: 2,
      name: "Peace Hostel",
      price: 60000,
      oldPrice: 70000,
      priceType: "per semester",
      image: "https://via.placeholder.com/200x200?text=Peace+Hostel",
    },
    {
      id: 3,
      name: "Winners Apartment",
      price: 150000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Winners+Apartment",
    },
    {
      id: 4,
      name: "Grace Lodge",
      price: 55000,
      priceType: "per semester",
      image: "https://via.placeholder.com/200x200?text=Grace+Lodge",
    },
  ];

  // Sample recently added hostels
  const recentHostels = [
    {
      id: 5,
      name: "Hostel A",
      price: 100000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Hostel+A",
    },
    {
      id: 6,
      name: "Student Lodge",
      price: 50000,
      priceType: "per semester",
      image: "https://via.placeholder.com/200x200?text=Student+Lodge",
    },
    {
      id: 7,
      name: "Campus View",
      price: 140000,
      oldPrice: 160000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Campus+View",
    },
    {
      id: 8,
      name: "Royal Hostel",
      price: 65000,
      priceType: "per semester",
      image: "https://via.placeholder.com/200x200?text=Royal+Hostel",
    },
    {
      id: 9,
      name: "Elite Apartment",
      price: 180000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Elite+Apartment",
    },
    {
      id: 10,
      name: "Comfort Lodge",
      price: 48000,
      priceType: "per semester",
      image: "https://via.placeholder.com/200x200?text=Comfort+Lodge",
    },
    {
      id: 11,
      name: "Kings Palace",
      price: 200000,
      priceType: "per year",
      image: "https://via.placeholder.com/200x200?text=Kings+Palace",
    },
    {
      id: 12,
      name: "Budget Hostel",
      price: 40000,
      oldPrice: 50000,
      priceType: "per semester",
      image: "https://via.placeholder.com/200x200?text=Budget+Hostel",
    },
  ];

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleBannerClick = (ad) => {
    window.open(
      `https://wa.me/${ad.whatsappNumber}?text=${encodeURIComponent(
        ad.message
      )}`,
      "_blank"
    );
  };

  const handleHostelClick = (hostel) => {
    // Will open individual hostel detail page
    alert(`Opening ${hostel.name} details page...`);
  };

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerAds.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex(
      (prev) => (prev - 1 + bannerAds.length) % bannerAds.length
    );
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerAds.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <DashboardLayout
      showNotifications={false}
      notifications={[]}
      unreadCount={0}
      onNotificationClick={() => {}}
    >
      {/* Banner Ads */}
      <div className="bg-white">
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
            >
              {bannerAds.map((ad) => (
                <div key={ad.id} className="w-full shrink-0">
                  <img
                    src={ad.image}
                    alt="Banner Ad"
                    className="w-full h-40 object-cover cursor-pointer"
                    onClick={() => handleBannerClick(ad)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Banner Navigation */}
          <button
            onClick={prevBanner}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
          >
            <svg
              className="w-5 h-5 text-gray-800"
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
            onClick={nextBanner}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
          >
            <svg
              className="w-5 h-5 text-gray-800"
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

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {bannerAds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentBannerIndex ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Hostels & Accommodation 🏠
          </h1>
          <p className="text-gray-600 text-sm">
            Find your perfect student accommodation
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Categories</h3>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-xl border-2 transition flex flex-col items-center justify-center ${
                  selectedCategory === category.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-2xl mb-1">{category.emoji}</span>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sponsored Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">⭐</span>
            <h3 className="font-bold text-gray-900 text-lg">Sponsored</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {sponsoredHostels.map((hostel) => (
              <div
                key={hostel.id}
                onClick={() => handleHostelClick(hostel)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
              >
                <div className="relative">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 rounded-full flex items-center space-x-1">
                    <span className="text-xs font-bold text-gray-900">
                      ★ Sponsored
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
                    {hostel.name}
                  </h4>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      {hostel.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(hostel.oldPrice)}
                        </span>
                      )}
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#488bbf" }}
                      >
                        {formatPrice(hostel.price)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {hostel.priceType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">🆕</span>
            <h3 className="font-bold text-gray-900 text-lg">Recently Added</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {recentHostels.map((hostel) => (
              <div
                key={hostel.id}
                onClick={() => handleHostelClick(hostel)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
              >
                <img
                  src={hostel.image}
                  alt={hostel.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
                    {hostel.name}
                  </h4>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      {hostel.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(hostel.oldPrice)}
                        </span>
                      )}
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#488bbf" }}
                      >
                        {formatPrice(hostel.price)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {hostel.priceType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-6 text-center">
            <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
              Load More
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default function PublicHostelsPage() {
  return (
    <AuthGuard requireAuth={false}>
      <HostelsMarketplacePage />
    </AuthGuard>
  );
}
