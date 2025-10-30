"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

export default function MarketplacePage() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'services'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Banner ads sourced from backend public/banners
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const BACKEND_BASE = API_BASE.replace(/\/api$/, "");
  const bannerFiles = [
    "2021-07-18_40_20-27-JulyLME GAS-2.jpg",
    "2021-07-18_42_45-27-JulyTop games.jpg",
    "2021-08-10_06_18-2-Augustbanner-id19_07_32-broker-1.jpg",
    "banner-id00_35_30-8e9ux3zq761hxjd829b2t3xyff3x58lf.png",
    "banner-id00_41_43-PLACE YOUR AD.jpg",
    "banner-id09_44_23-DELSU (1).jpg",
    "banner-id11_50_20-66DFBAE5-6471-4846-86DD-E4B3C9E63D66.jpeg",
    "banner-id16_18_32-paypal.jpg",
    "banner-id16_22_10-ELECTRICAL.jpg",
    "banner-id16_49_00-LME1.jpg",
    "banner-id18_14_34-GiftCArd.jpg",
    "banner-id18_42_34-GiftCArd.jpg",
    "banner-id22_38_13-LOGO BANNER.jpg",
    "Get-Your-Electronic-Supplies-At-Home (1).jpg",
    "Screenshot_20200512-090526.png",
    "Screenshot_20200512-090543.png",
    "Screenshot_20200512-090616.png",
  ];
  const bannerAds = bannerFiles.map((file, idx) => ({
    id: idx + 1,
    image: `${BACKEND_BASE}/banners/${encodeURIComponent(file)}`,
    whatsappNumber: "2348012345678",
    message: "Hi! I saw your banner on myDelsu marketplace.",
  }));

  // Categories
  const productCategories = [
    { id: "all", name: "All", emoji: "🛍️" },
    { id: "food", name: "Food", emoji: "🍔" },
    { id: "electronics", name: "Electronics", emoji: "📱" },
    { id: "fashion", name: "Fashion", emoji: "👕" },
    { id: "books", name: "Books", emoji: "📚" },
    { id: "home", name: "Home", emoji: "🏠" },
    { id: "sports", name: "Sports", emoji: "⚽" },
    { id: "others", name: "Others", emoji: "🎨" },
  ];

  const serviceCategories = [
    { id: "all", name: "All", emoji: "💼" },
    { id: "tutoring", name: "Tutoring", emoji: "📚" },
    { id: "design", name: "Design", emoji: "🎨" },
    { id: "programming", name: "Programming", emoji: "💻" },
    { id: "photography", name: "Photography", emoji: "📸" },
    { id: "hair-beauty", name: "Hair/Beauty", emoji: "💇" },
    { id: "laundry", name: "Laundry", emoji: "🧺" },
    { id: "typing", name: "Typing", emoji: "⌨️" },
    { id: "repairs", name: "Repairs", emoji: "🔧" },
  ];

  // Sample sponsored products
  const sponsoredProducts = [
    {
      id: 1,
      name: "iPhone 14 Pro",
      price: 650000,
      oldPrice: 750000,
      image: "https://via.placeholder.com/200x200?text=iPhone+14",
    },
    {
      id: 2,
      name: "Jollof Rice (Per plate)",
      price: 1500,
      image: "https://via.placeholder.com/200x200?text=Jollof+Rice",
    },
    {
      id: 3,
      name: "Nike Sneakers",
      price: 45000,
      oldPrice: 55000,
      image: "https://via.placeholder.com/200x200?text=Nike+Shoes",
    },
    {
      id: 4,
      name: "MacBook Air M2",
      price: 850000,
      image: "https://via.placeholder.com/200x200?text=MacBook+Air",
    },
  ];

  // Sample sponsored services
  const sponsoredServices = [
    {
      id: 1,
      name: "Mathematics Tutoring",
      price: 5000,
      oldPrice: 7000,
      image: "https://via.placeholder.com/200x200?text=Math+Tutor",
    },
    {
      id: 2,
      name: "Logo Design",
      price: 10000,
      image: "https://via.placeholder.com/200x200?text=Logo+Design",
    },
    {
      id: 3,
      name: "Professional Photography",
      price: 15000,
      oldPrice: 20000,
      image: "https://via.placeholder.com/200x200?text=Photography",
    },
    {
      id: 4,
      name: "Hair Styling",
      price: 3500,
      image: "https://via.placeholder.com/200x200?text=Hair+Style",
    },
  ];

  // Sample recently added products
  const recentProducts = [
    {
      id: 5,
      name: "Samsung Galaxy S23",
      price: 380000,
      image: "https://via.placeholder.com/200x200?text=Samsung+S23",
    },
    {
      id: 6,
      name: "Fried Rice & Chicken",
      price: 2000,
      image: "https://via.placeholder.com/200x200?text=Fried+Rice",
    },
    {
      id: 7,
      name: "Study Desk",
      price: 25000,
      oldPrice: 30000,
      image: "https://via.placeholder.com/200x200?text=Study+Desk",
    },
    {
      id: 8,
      name: "Engineering Textbooks",
      price: 12000,
      image: "https://via.placeholder.com/200x200?text=Textbooks",
    },
    {
      id: 9,
      name: "HP Laptop",
      price: 180000,
      image: "https://via.placeholder.com/200x200?text=HP+Laptop",
    },
    {
      id: 10,
      name: "Adidas Tracksuit",
      price: 28000,
      image: "https://via.placeholder.com/200x200?text=Tracksuit",
    },
    {
      id: 11,
      name: "Bean Cake (10pcs)",
      price: 500,
      image: "https://via.placeholder.com/200x200?text=Bean+Cake",
    },
    {
      id: 12,
      name: "PlayStation 4",
      price: 120000,
      oldPrice: 150000,
      image: "https://via.placeholder.com/200x200?text=PS4",
    },
  ];

  // Sample recently added services
  const recentServices = [
    {
      id: 5,
      name: "Physics Tutoring",
      price: 4500,
      image: "https://via.placeholder.com/200x200?text=Physics+Tutor",
    },
    {
      id: 6,
      name: "Graphic Design",
      price: 8000,
      image: "https://via.placeholder.com/200x200?text=Graphics",
    },
    {
      id: 7,
      name: "Laptop Repair",
      price: 5000,
      oldPrice: 7000,
      image: "https://via.placeholder.com/200x200?text=Laptop+Repair",
    },
    {
      id: 8,
      name: "Content Writing",
      price: 3000,
      image: "https://via.placeholder.com/200x200?text=Writing",
    },
    {
      id: 9,
      name: "Web Development",
      price: 50000,
      image: "https://via.placeholder.com/200x200?text=Web+Dev",
    },
    {
      id: 10,
      name: "Makeup Artist",
      price: 5000,
      image: "https://via.placeholder.com/200x200?text=Makeup",
    },
    {
      id: 11,
      name: "Document Typing",
      price: 500,
      image: "https://via.placeholder.com/200x200?text=Typing",
    },
    {
      id: 12,
      name: "Video Editing",
      price: 15000,
      oldPrice: 20000,
      image: "https://via.placeholder.com/200x200?text=Video+Edit",
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

  const handleProductClick = (item) => {
    // Will open individual product/service detail page (to be built later)
    alert(`Opening ${item.name} details page...`);
  };

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerAds.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex(
      (prev) => (prev - 1 + bannerAds.length) % bannerAds.length
    );
  };

  const categories =
    activeTab === "products" ? productCategories : serviceCategories;
  const sponsoredItems =
    activeTab === "products" ? sponsoredProducts : sponsoredServices;
  const recentItems =
    activeTab === "products" ? recentProducts : recentServices;

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

      {/* Products/Services Toggle Tabs */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("products");
                setSelectedCategory("all");
              }}
              className={`flex-1 py-4 font-semibold text-center transition relative ${
                activeTab === "products" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Products
              {activeTab === "products" && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-lg"
                  style={{ backgroundColor: "#488bbf" }}
                />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("services");
                setSelectedCategory("all");
              }}
              className={`flex-1 py-4 font-semibold text-center transition relative ${
                activeTab === "services" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Services
              {activeTab === "services" && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-lg"
                  style={{ backgroundColor: "#488bbf" }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
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
            {sponsoredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleProductClick(item)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 rounded-full flex items-center space-x-1">
                    <span className="text-xs font-bold text-gray-900">
                      ★ Sponsored
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h4>
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
            {recentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleProductClick(item)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h4>
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
                </div>
              </div>
            ))}
          </div>

          {/* Load More and Upload Product */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
              Load More
            </button>
            <a
              href="/dashboard/marketplace/upload-product"
              className="px-8 py-3 rounded-lg font-semibold text-white transition hover:shadow-lg text-center"
              style={{ backgroundColor: "#488bbf" }}
            >
              List Your Product 🛍️
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
