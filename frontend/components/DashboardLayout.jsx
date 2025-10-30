"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({
  children,
  showNotifications = false,
  notifications = [],
  unreadCount = 0,
  onNotificationClick = () => {},
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentPath={pathname}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64 transition-all duration-300 min-h-screen">
        {/* Header */}
        <Navbar
          variant="dashboard"
          showNotifications={showNotifications}
          notifications={notifications}
          unreadCount={unreadCount}
          onNotificationClick={onNotificationClick}
          currentPath={pathname}
          onMenuToggle={handleSidebarToggle}
        />
        {/* Page Content */}
        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
