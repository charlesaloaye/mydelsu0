"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ currentPath, isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      ),
    },
    {
      href: "/dashboard/wallet",
      label: "My Wallet",
      icon: (
        <>
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </>
      ),
    },
    {
      href: "/dashboard/referrals",
      label: "Referrals",
      icon: (
        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
      ),
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      ),
    },
    {
      href: "/dashboard/documents",
      label: "My Documents",
      icon: (
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      ),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          isCollapsed ? "w-16" : "w-64"
        } lg:block overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-gray-900">my</span>
              <span
                style={{ backgroundColor: "#488bbf", color: "#ffffff" }}
                className="px-2 py-1 rounded font-bold text-xl"
              >
                DELSU
              </span>
              {/* Verification badge */}
              {user && (
                <span
                  className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user?.is_verified
                      ? "bg-green-100 text-green-700"
                      : user?.verification_status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  title={
                    user?.is_verified
                      ? "Verified user"
                      : user?.verification_status === "pending"
                      ? "Verification pending"
                      : "Not verified"
                  }
                >
                  {user?.is_verified
                    ? "Verified"
                    : user?.verification_status === "pending"
                    ? "Pending"
                    : "Not verified"}
                </span>
              )}
            </div>
          )}

          {/* Collapse/Expand Button - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Close Button - Mobile Only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <svg
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {item.icon}
                </svg>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}

          <SidebarGroup
            title="Academic Tools"
            icon={<path d="M9 2h2v3h3v2h-3v3H9V7H6V5h3V2z" />}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
            onClose={onClose}
            items={[
              { label: "CGPA Calculator", href: "/dashboard/cgpa-calculator" },
              {
                label: "Aggregate Checker",
                href: "/dashboard/aggregate-checker",
              },
              { label: "GPA Calculator", href: "/dashboard/gpa-calculator" },
              {
                label: "Course Summaries & Notes",
                href: "/dashboard/course-summaries",
              },
              { label: "Grade Tracker", href: "/dashboard/grade-tracker" },
            ]}
          />

          {/* Groups */}
          {(() => {
            const isVerified = !!user?.is_verified;
            const isStudent =
              user?.type === "student" ||
              user?.user_status === "current_student";
            if (!(isVerified && isStudent)) return null;
            return (
              <SidebarGroup
                title="Marketplace"
                icon={
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                }
                isCollapsed={isCollapsed}
                currentPath={currentPath}
                onClose={onClose}
                items={(() => {
                  const items = [
                    {
                      label: "Browse Products",
                      href: "/dashboard/marketplace",
                    },
                    {
                      label: "My Products",
                      href: "/dashboard/marketplace/my-products",
                    },
                  ];
                  if (isVerified && isStudent) {
                    items.push({
                      label: "Upload Product",
                      href: "/dashboard/upload-product",
                    });
                  }
                  return items;
                })()}
              />
            );
          })()}

          {(() => {
            const isVerified = !!user?.is_verified;
            const isStudent =
              user?.type === "student" ||
              user?.user_status === "current_student";
            if (!(isVerified && isStudent)) return null;
            return (
              <SidebarGroup
                title="Services"
                icon={<path d="M4 4h12v3H4zM4 9h12v7H4z" />}
                isCollapsed={isCollapsed}
                currentPath={currentPath}
                onClose={onClose}
                items={(() => {
                  const items = [
                    { label: "Browse Services", href: "/dashboard/services" },
                    {
                      label: "My Services",
                      href: "/dashboard/services/my-services",
                    },
                  ];
                  if (isVerified && isStudent) {
                    items.push({
                      label: "Upload Service",
                      href: "/dashboard/upload-service",
                    });
                  }
                  return items;
                })()}
              />
            );
          })()}

          {(() => {
            const isVerified = !!user?.is_verified;
            const isStudent =
              user?.type === "student" ||
              user?.user_status === "current_student";
            if (!(isVerified && isStudent)) return null;
            return (
              <SidebarGroup
                title="Events"
                icon={<path d="M5 4h10v2H5zM4 8h12v8H4z" />}
                isCollapsed={isCollapsed}
                currentPath={currentPath}
                onClose={onClose}
                items={(() => {
                  const items = [
                    { label: "Browse Events", href: "/dashboard/events" },
                    { label: "My Events", href: "/dashboard/events/my-events" },
                  ];
                  if (isVerified && isStudent) {
                    items.push({
                      label: "Upload Events",
                      href: "/dashboard/upload-event",
                    });
                  }
                  return items;
                })()}
              />
            );
          })()}

          <SidebarGroup
            title="Hostels"
            icon={<path d="M4 10l6-6 6 6v6H4z" />}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
            onClose={onClose}
            items={[
              { label: "Browse Hostel", href: "/dashboard/hostels" },
              {
                label: "Hostels posted by me",
                href: "/dashboard/hostels/my-hostels",
              },
              { label: "Upload Hostel", href: "/dashboard/upload-hostel" },
            ]}
          />

          {(() => {
            const items = [];
            const isVerified = !!user?.is_verified;
            const isStudent =
              user?.type === "student" ||
              user?.user_status === "current_student";
            if (isVerified && isStudent) {
              items.push({
                label: "Find Roommate",
                href: "/dashboard/roommates",
              });
            }
            if (items.length === 0) return null;
            return (
              <SidebarGroup
                title="Roommates"
                icon={
                  <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14a4 4 0 014-4h4a4 4 0 014 4v2H4v-2z" />
                }
                isCollapsed={isCollapsed}
                currentPath={currentPath}
                onClose={onClose}
                items={items}
              />
            );
          })()}

          <SidebarGroup
            title="Past questions"
            icon={<path d="M5 4h10v12H5z" />}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
            onClose={onClose}
            items={[
              { label: "Browse questions", href: "/dashboard/past-questions" },
              {
                label: "My Past questions",
                href: "/dashboard/past-questions/my-questions",
              },
              {
                label: "Upload Past question",
                href: "/dashboard/upload-question",
              },
            ]}
          />

          {/* New Group: Academic Tools */}

          {/* Moved: My Profile */}
          {(() => {
            const item = {
              href: "/dashboard/profile",
              label: "My Profile",
              icon: (
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              ),
            };
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <svg
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {item.icon}
                </svg>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })()}

          {/* Moved: Settings */}
          {(() => {
            const item = {
              href: "/dashboard/settings",
              label: "Settings",
              icon: (
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              ),
            };
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <svg
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {item.icon}
                </svg>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })()}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 px-3 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

const SidebarGroup = ({
  title,
  icon,
  items,
  isCollapsed,
  currentPath,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(title === "Marketplace");

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition text-gray-700 hover:bg-gray-100 ${
          isCollapsed ? "justify-center" : ""
        }`}
        title={isCollapsed ? title : ""}
      >
        <span className="flex items-center space-x-3">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {icon}
          </svg>
          {!isCollapsed && <span className="font-semibold">{title}</span>}
        </span>
        {!isCollapsed && (
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className={`mt-1 space-y-1 ${isCollapsed ? "hidden" : ""}`}>
          {items.map((link) => {
            const active = currentPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`block ml-8 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-blue-100 text-blue-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
