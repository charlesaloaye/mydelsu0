"use client";
import React from "react";
import Link from "next/link";

const AnnouncementCard = ({ announcement, showFullContent = false }) => {
  const getTypeColor = (type) => {
    const colors = {
      info: "bg-blue-100 text-blue-800 border-blue-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      important: "bg-red-100 text-red-800 border-red-200",
      success: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[type] || colors.info;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      urgent: "🔴",
      high: "🟠",
      medium: "🔵",
      low: "⚪",
    };
    return icons[priority] || icons.medium;
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {announcement.is_pinned && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  📌 Pinned
                </span>
              )}
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                  announcement.type
                )}`}
              >
                {announcement.type.charAt(0).toUpperCase() +
                  announcement.type.slice(1)}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  announcement.priority
                )}`}
              >
                {getPriorityIcon(announcement.priority)}{" "}
                {announcement.priority.charAt(0).toUpperCase() +
                  announcement.priority.slice(1)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {announcement.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {showFullContent
                ? announcement.content
                : truncateContent(announcement.content)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              By{" "}
              {announcement.creator
                ? `${announcement.creator.first_name} ${announcement.creator.last_name}`
                : "Admin"}
            </span>
            <span>•</span>
            <span>{announcement.date}</span>
          </div>
          {!showFullContent && (
            <Link
              href="/dashboard/announcement"
              className="text-[#488bbf] hover:text-[#3a7ba8] font-medium"
            >
              View All
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
