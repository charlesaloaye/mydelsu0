"use client";
import React, { useState } from "react";

export default function MyDocumentsPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newDocumentName, setNewDocumentName] = useState("");
  const [newDocumentCategory, setNewDocumentCategory] =
    useState("Academic Documents");
  const [renameValue, setRenameValue] = useState("");

  const notifications = [
    {
      id: 1,
      message: "Admin uploaded your Course Registration Form",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 2,
      message: "Your School Fees Receipt was uploaded successfully",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Storage info
  const storageUsed = 32.5; // MB
  const storageLimit = 50; // MB
  const storagePercentage = (storageUsed / storageLimit) * 100;
  const isStorageLow = storagePercentage >= 80;
  const isStorageFull = storagePercentage >= 100;

  // Document categories
  const categories = [
    "All Documents",
    "Academic Documents",
    "Financial Documents",
    "Personal Documents",
    "Certificates",
    "Other",
  ];

  // Sample documents data
  const allDocuments = [
    {
      id: 1,
      name: "School Fees Receipt - 2024/2025 Session",
      category: "Financial Documents",
      fileType: "PDF",
      fileSize: 2.3,
      uploadDate: "2024-10-20",
      uploadedBy: "student",
      fileUrl: "https://example.com/doc1.pdf",
    },
    {
      id: 2,
      name: "JAMB Admission Letter",
      category: "Academic Documents",
      fileType: "PDF",
      fileSize: 1.8,
      uploadDate: "2024-10-15",
      uploadedBy: "admin",
      fileUrl: "https://example.com/doc2.pdf",
    },
    {
      id: 3,
      name: "JAMB UTME Result Slip 2024",
      category: "Academic Documents",
      fileType: "PDF",
      fileSize: 1.2,
      uploadDate: "2024-09-30",
      uploadedBy: "student",
      fileUrl: "https://example.com/doc3.pdf",
    },
    {
      id: 4,
      name: "O-Level Result (WAEC)",
      category: "Certificates",
      fileType: "PDF",
      fileSize: 3.5,
      uploadDate: "2024-09-25",
      uploadedBy: "student",
      fileUrl: "https://example.com/doc4.pdf",
    },
    {
      id: 5,
      name: "Proof of Acceptance Payment",
      category: "Financial Documents",
      fileType: "PDF",
      fileSize: 0.9,
      uploadDate: "2024-10-28",
      uploadedBy: "admin",
      fileUrl: "https://example.com/doc5.pdf",
    },
    {
      id: 6,
      name: "Passport Photograph",
      category: "Personal Documents",
      fileType: "JPG",
      fileSize: 0.5,
      uploadDate: "2024-10-10",
      uploadedBy: "student",
      fileUrl: "https://example.com/doc6.jpg",
    },
    {
      id: 7,
      name: "Course Registration Form - First Semester",
      category: "Academic Documents",
      fileType: "PDF",
      fileSize: 2.1,
      uploadDate: "2024-10-29",
      uploadedBy: "admin",
      fileUrl: "https://example.com/doc7.pdf",
    },
    {
      id: 8,
      name: "Birth Certificate",
      category: "Personal Documents",
      fileType: "PDF",
      fileSize: 1.7,
      uploadDate: "2024-09-15",
      uploadedBy: "student",
      fileUrl: "https://example.com/doc8.pdf",
    },
  ];

  // Filter documents
  const filteredDocuments = allDocuments.filter((doc) => {
    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "All Documents" ||
      doc.category === selectedCategory;
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Stats
  const stats = {
    total: allDocuments.length,
    byStudent: allDocuments.filter((d) => d.uploadedBy === "student").length,
    byAdmin: allDocuments.filter((d) => d.uploadedBy === "admin").length,
  };

  const handleUpload = () => {
    if (isStorageFull) {
      alert(
        "Storage full! Please upgrade to premium or delete some documents to free up space."
      );
      return;
    }
    setShowUploadModal(true);
  };

  const confirmUpload = () => {
    if (!newDocumentName.trim()) {
      alert("Please enter a document name!");
      return;
    }
    alert(
      `Uploading document: ${newDocumentName}\nCategory: ${newDocumentCategory}\n\nDocument uploaded successfully!`
    );
    setShowUploadModal(false);
    setNewDocumentName("");
    setNewDocumentCategory("Academic Documents");
  };

  const handleView = (doc) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  const handleDownload = (doc) => {
    alert(`Downloading: ${doc.name}\n\nYour download will start shortly...`);
  };

  const handleRename = (doc) => {
    setSelectedDocument(doc);
    setRenameValue(doc.name);
    setShowRenameModal(true);
  };

  const confirmRename = () => {
    if (!renameValue.trim()) {
      alert("Please enter a new name!");
      return;
    }
    alert(
      `Document renamed from:\n"${selectedDocument.name}"\nto:\n"${renameValue}"`
    );
    setShowRenameModal(false);
    setSelectedDocument(null);
    setRenameValue("");
  };

  const handleDelete = (doc) => {
    setSelectedDocument(doc);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    alert(
      `"${selectedDocument.name}" has been deleted!\n\nStorage freed: ${selectedDocument.fileSize} MB`
    );
    setShowDeleteModal(false);
    setSelectedDocument(null);
  };

  const getFileIcon = (fileType) => {
    const icons = {
      PDF: (
        <svg
          className="w-8 h-8 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
      JPG: (
        <svg
          className="w-8 h-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      PNG: (
        <svg
          className="w-8 h-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      DOCX: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
    return icons[fileType] || icons.PDF;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header
        style={{ backgroundColor: "#488bbf" }}
        className="shadow-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
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
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-white">my</span>
              <span
                style={{ backgroundColor: "#ffffff", color: "#488bbf" }}
                className="px-2 py-1 rounded font-bold text-xl"
              >
                DELSU
              </span>
            </div>
          </div>

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
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-4 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
                  notif.unread ? "bg-blue-50" : ""
                }`}
              >
                <p className="text-sm text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Hamburger Menu */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ backgroundColor: "#488bbf" }} className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">myDELSU</h2>
              <p className="text-white text-sm opacity-90">Student Platform</p>
            </div>
            <nav className="p-4">
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
              >
                <span>🏠 Dashboard</span>
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
              >
                <span>🛍️ Marketplace</span>
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
              >
                <span>📦 My Products</span>
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
              >
                <span>💼 My Services</span>
              </a>
              <a
                href="#"
                style={{ backgroundColor: "#e8f3f9" }}
                className="flex items-center px-4 py-3 rounded-lg mb-1"
              >
                <span style={{ color: "#488bbf" }} className="font-semibold">
                  📁 My Documents
                </span>
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
              >
                <span>💰 My Wallet</span>
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
              >
                <span>👤 Profile</span>
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-sm text-gray-600 mt-1">
            Securely store and manage all your important documents
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Storage Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Storage Usage</h3>
              <p className="text-sm text-gray-600">
                {storageUsed.toFixed(1)} MB / {storageLimit} MB used
              </p>
            </div>
            {isStorageLow && (
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition">
                ⭐ Upgrade Storage
              </button>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                storagePercentage >= 100
                  ? "bg-red-500"
                  : storagePercentage >= 80
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            />
          </div>
          {isStorageFull && (
            <p className="text-sm text-red-600 font-semibold mt-2">
              ⚠️ Storage full! Delete documents or upgrade to continue
              uploading.
            </p>
          )}
          {isStorageLow && !isStorageFull && (
            <p className="text-sm text-amber-600 font-semibold mt-2">
              ⚠️ Storage is running low. Consider upgrading or deleting unused
              documents.
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Documents</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-3xl font-bold" style={{ color: "#488bbf" }}>
              {stats.byStudent}
            </div>
            <div className="text-sm text-gray-600 mt-1">My Uploads</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-3xl font-bold text-purple-600">
              {stats.byAdmin}
            </div>
            <div className="text-sm text-gray-600 mt-1">Admin Uploads</div>
          </div>
        </div>

        {/* Search and Category Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat === "All Documents" ? "all" : cat}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length > 0 ? (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>

                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                            {doc.category}
                          </span>
                          <span>{doc.fileType}</span>
                          <span>•</span>
                          <span>{doc.fileSize} MB</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploadDate)}</span>
                        </div>
                      </div>

                      {/* Upload Badge */}
                      {doc.uploadedBy === "admin" && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex-shrink-0">
                          Uploaded by Admin
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => handleView(doc)}
                        className="px-4 py-2 text-sm font-semibold rounded-lg transition"
                        style={{ backgroundColor: "#488bbf", color: "white" }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 transition"
                      >
                        ⬇️ Download
                      </button>
                      <button
                        onClick={() => handleRename(doc)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-200 transition"
                      >
                        ✏️ Rename
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No documents match "${searchQuery}". Try a different search term.`
                : "Start uploading your important documents for safe storage and easy access anytime!"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleUpload}
                className="px-6 py-3 rounded-lg font-semibold text-white transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Upload Document
              </button>
            )}
          </div>
        )}

        {/* Security Notice */}
        {filteredDocuments.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              🔒 Security & Privacy
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your documents are encrypted and securely stored</li>
              <li>• Only you can access your documents</li>
              <li>• We never share your documents with third parties</li>
              <li>
                • Allowed file types: PDF, JPG, PNG, DOCX (max 10MB per file)
              </li>
              <li>
                • Need more storage? Upgrade to Premium for unlimited storage!
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Upload Document
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document Name
              </label>
              <input
                type="text"
                placeholder="e.g., School Fees Receipt 2024"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newDocumentCategory}
                onChange={(e) => setNewDocumentCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories
                  .filter((c) => c !== "All Documents")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG, DOCX (max 10MB)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewDocumentName("");
                  setNewDocumentCategory("Academic Documents");
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {showViewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedDocument.name}
              </h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDocument(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
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

            {/* Document Preview Area */}
            <div className="bg-gray-100 rounded-lg p-8 mb-4 min-h-96 flex items-center justify-center">
              {selectedDocument.fileType === "PDF" ? (
                <div className="text-center">
                  <svg
                    className="w-24 h-24 text-red-500 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-600 mb-4">PDF Document</p>
                  <p className="text-sm text-gray-500">
                    Preview will be displayed here
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="w-24 h-24 text-blue-500 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-600 mb-4">Image Document</p>
                  <p className="text-sm text-gray-500">
                    Image preview will be displayed here
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(selectedDocument)}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rename Document
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Name
              </label>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setSelectedDocument(null);
                  setRenameValue("");
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmRename}
                className="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Delete Document?
            </h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete{" "}
              <strong>{selectedDocument.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This will free up {selectedDocument.fileSize} MB of storage. This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDocument(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Upload Button */}
      <button
        onClick={handleUpload}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition hover:scale-110 z-40"
        style={{ backgroundColor: isStorageFull ? "#9ca3af" : "#488bbf" }}
        disabled={isStorageFull}
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
  );
}
