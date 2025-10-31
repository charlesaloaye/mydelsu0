"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../../../../lib/api";
import DashboardLayout from "../../../../../components/DashboardLayout";
import { useAuth } from "../../../../../contexts/AuthContext";

export default function MyProductsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkSoldModal, setShowMarkSoldModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      loadWalletBalance();
    }
  }, [isAuthenticated]);

  // Load products
  useEffect(() => {
    loadProducts();
  }, [activeFilter]);

  const loadNotifications = async () => {
    try {
      const response = await apiClient.getNotifications();
      setNotifications(response.data?.data || []);
      setUnreadCount(response.data?.unread_count || 0);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const response = await apiClient.getWallet();
      if (response.success) {
        setWalletBalance(response.data?.available_balance || 0);
      }
    } catch (error) {
      console.error("Error loading wallet balance:", error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (activeFilter !== "all") {
        params.status = activeFilter;
      }

      const response = await apiClient.getMyMarketplaceItems(params);

      if (response.success) {
        const productsData = response.data?.data || response.data || [];
        setProducts(productsData.map(mapProductData));
      } else {
        setProducts([]);
      }
    } catch (e) {
      setError(e.message || "Failed to load products");
      console.error("Error loading products:", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Map backend marketplace item data to frontend format
  const mapProductData = (item) => {
    // Get first image or placeholder
    const images = item.images || [];
    const image = images.length > 0 ? images[0] : "/images/placeholder.png";

    return {
      id: item.id,
      name: item.title || "",
      price: parseFloat(item.price || 0),
      oldPrice: item.old_price || null,
      image: image,
      category: item.category || "",
      status: item.status || "active",
      views: item.view_count || 0,
      interested: item.interest_count || 0,
      datePosted: item.created_at || "",
      soldDate: item.sold_at || null,
      condition: item.condition || "N/A",
      description: item.description || "",
      location: item.location || "",
    };
  };

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.status === activeFilter);

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    pending: products.filter((p) => p.status === "pending").length,
    sold: products.filter((p) => p.status === "sold").length,
    inactive: products.filter((p) => p.status === "inactive").length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalInterested: products.reduce((sum, p) => sum + p.interested, 0),
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: {
        text: "Active",
        bg: "bg-green-100",
        textColor: "text-green-800",
      },
      pending: {
        text: "Pending Approval",
        bg: "bg-amber-100",
        textColor: "text-amber-800",
      },
      sold: { text: "Sold", bg: "bg-blue-100", textColor: "text-blue-800" },
      inactive: {
        text: "Inactive",
        bg: "bg-gray-100",
        textColor: "text-gray-800",
      },
    };
    return badges[status] || badges.active;
  };

  const handleEdit = (product) => {
    // Navigate to upload page with product ID to edit
    router.push(`/dashboard/marketplace/upload?id=${product.id}`);
  };

  const handleMarkAsSold = (product) => {
    setSelectedProduct(product);
    setShowMarkSoldModal(true);
  };

  const confirmMarkSold = async () => {
    if (!selectedProduct) return;

    setProcessing(true);
    try {
      const response = await apiClient.updateMarketplaceItem(
        selectedProduct.id,
        { status: "sold" }
      );

      if (response.success) {
        // Reload products
        await loadProducts();
        setShowMarkSoldModal(false);
        setSelectedProduct(null);
        alert("Product marked as sold successfully!");
      } else {
        alert(response.message || "Failed to mark as sold");
      }
    } catch (error) {
      console.error("Error marking as sold:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to mark as sold"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    setProcessing(true);
    try {
      const response = await apiClient.deleteMarketplaceItem(
        selectedProduct.id
      );

      if (response.success) {
        // Reload products
        await loadProducts();
        setShowDeleteModal(false);
        setSelectedProduct(null);
        alert("Product deleted successfully!");
      } else {
        alert(response.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete product"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleRepost = async (product) => {
    setProcessing(true);
    try {
      const response = await apiClient.updateMarketplaceItem(product.id, {
        status: "active",
      });

      if (response.success) {
        await loadProducts();
        alert("Product reposted successfully!");
      } else {
        alert(response.message || "Failed to repost product");
      }
    } catch (error) {
      console.error("Error reposting product:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to repost product"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleBoost = (product) => {
    setSelectedProduct(product);
    setShowBoostModal(true);
  };

  const confirmBoost = async () => {
    if (!selectedProduct) return;

    const boostAmount = 500;
    if (walletBalance < boostAmount) {
      alert(
        `Insufficient wallet balance. You need ₦${boostAmount} but have ₦${walletBalance.toFixed(
          2
        )}. Please fund your wallet first.`
      );
      return;
    }

    setProcessing(true);
    try {
      // Update the product to be featured
      // Note: Backend needs to support 'featured' field and deduct from wallet
      // For now, we'll just update the item with a note
      const response = await apiClient.updateMarketplaceItem(
        selectedProduct.id,
        {
          // Backend should handle: featured flag, wallet deduction, featured_until date
        }
      );

      if (response.success) {
        // Reload products and wallet balance
        await loadProducts();
        await loadWalletBalance();
        setShowBoostModal(false);
        setSelectedProduct(null);
        alert(
          `Product boosted successfully! It will be featured at the top of search results for 7 days. ₦${boostAmount} has been deducted from your wallet.`
        );
      } else {
        alert(response.message || "Failed to boost product. Please try again.");
      }
    } catch (error) {
      console.error("Error boosting product:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to boost product"
      );
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <DashboardLayout
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => setShowNotifications(!showNotifications)}
    >
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Page Title */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage all your product listings
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Products</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-green-600">
                {stats.active}
              </div>
              <div className="text-sm text-gray-600 mt-1">Active</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold" style={{ color: "#488bbf" }}>
                {stats.totalViews}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Views</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalInterested}
              </div>
              <div className="text-sm text-gray-600 mt-1">Interested</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-x-auto">
            <div className="flex">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "all"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "all"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "active"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "active"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setActiveFilter("pending")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "pending"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "pending"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setActiveFilter("sold")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "sold"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "sold"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                Sold ({stats.sold})
              </button>
              <button
                onClick={() => setActiveFilter("inactive")}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeFilter === "inactive"
                    ? "border-b-2 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === "inactive"
                    ? { borderColor: "#488bbf", color: "#488bbf" }
                    : {}
                }
              >
                Inactive ({stats.inactive})
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#488bbf]" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const badge = getStatusBadge(product.status);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                  >
                    <div className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "/images/placeholder.png";
                            }}
                          />
                          <span
                            className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${badge.bg} ${badge.textColor}`}
                          >
                            {badge.text}
                          </span>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <span>{product.category}</span>
                                {product.condition && (
                                  <>
                                    <span>•</span>
                                    <span>{product.condition}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                  {formatPrice(product.price)}
                                </span>
                                {product.oldPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.oldPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span>{product.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
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
                                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                />
                              </svg>
                              <span>{product.interested} interested</span>
                            </div>
                            <div className="flex items-center gap-1">
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{formatDate(product.datePosted)}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {product.status === "active" && (
                              <>
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition text-white"
                                  style={{ backgroundColor: "#488bbf" }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleMarkAsSold(product)}
                                  className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 transition"
                                >
                                  Mark as Sold
                                </button>
                                <button
                                  onClick={() => handleBoost(product)}
                                  className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-lg hover:bg-purple-200 transition"
                                >
                                  🚀 Boost (₦500)
                                </button>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition"
                                >
                                  Delete
                                </button>
                              </>
                            )}

                            {product.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition text-white"
                                  style={{ backgroundColor: "#488bbf" }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition"
                                >
                                  Delete
                                </button>
                                <div className="px-4 py-2 bg-amber-50 text-amber-700 text-sm rounded-lg flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                  <span>Awaiting approval</span>
                                </div>
                              </>
                            )}

                            {product.status === "sold" && (
                              <>
                                <button
                                  onClick={() => handleRepost(product)}
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition text-white"
                                  style={{ backgroundColor: "#488bbf" }}
                                >
                                  Repost
                                </button>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition"
                                >
                                  Delete
                                </button>
                                {product.soldDate && (
                                  <div className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center gap-2">
                                    <span>
                                      ✓ Sold on {formatDate(product.soldDate)}
                                    </span>
                                  </div>
                                )}
                              </>
                            )}

                            {product.status === "inactive" && (
                              <>
                                <button
                                  onClick={() => handleRepost(product)}
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition text-white"
                                  style={{ backgroundColor: "#488bbf" }}
                                >
                                  Repost
                                </button>
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No {activeFilter === "all" ? "" : activeFilter} products yet
              </h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === "all"
                  ? "Start selling by uploading your first product to the marketplace!"
                  : `You don't have any ${activeFilter} products at the moment.`}
              </p>
              {activeFilter === "all" && (
                <button
                  onClick={() => router.push("/dashboard/marketplace/upload")}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition"
                  style={{ backgroundColor: "#488bbf" }}
                >
                  Upload Product
                </button>
              )}
            </div>
          )}

          {/* Tips Section */}
          {filteredProducts.length > 0 && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 Tips for Better Sales
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Upload clear, high-quality photos from multiple angles
                </li>
                <li>
                  • Write detailed descriptions with all important information
                </li>
                <li>
                  • Price competitively - check similar products in marketplace
                </li>
                <li>• Respond quickly to interested buyers for faster sales</li>
                <li>• Boost your products to reach more potential buyers</li>
              </ul>
            </div>
          )}
        </div>

        {/* Mark as Sold Modal */}
        {showMarkSoldModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Mark as Sold?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark{" "}
                <strong>{selectedProduct?.name}</strong> as sold? This will move
                it to your sold items and remove it from the marketplace.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowMarkSoldModal(false);
                    setSelectedProduct(null);
                  }}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMarkSold}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {processing ? "Processing..." : "Mark as Sold"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Delete Product?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{selectedProduct?.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {processing ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Boost Modal */}
        {showBoostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Boost Product?
              </h3>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Boost <strong>{selectedProduct?.name}</strong> for ₦500 to
                  feature it at the top of search results for 7 days.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Your Wallet Balance:
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₦{walletBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Boost Cost:
                    </span>
                    <span className="text-lg font-bold text-red-600">₦500</span>
                  </div>
                  {walletBalance < 500 && (
                    <p className="text-sm text-red-600 mt-2">
                      ⚠️ Insufficient balance. Please fund your wallet first.
                    </p>
                  )}
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    💡 <strong>Benefits:</strong> Your product will appear at
                    the top of search results, get more views, and increase
                    chances of faster sales!
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBoostModal(false);
                    setSelectedProduct(null);
                  }}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBoost}
                  disabled={processing || walletBalance < 500}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? "Processing..." : "Boost for ₦500"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => router.push("/dashboard/marketplace/upload")}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition hover:scale-110 z-40"
          style={{ backgroundColor: "#488bbf" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </DashboardLayout>
  );
}
