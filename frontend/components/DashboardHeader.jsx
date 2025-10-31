"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../lib/api";

export default function DashboardHeader({ currentPath = "" }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      try {
        const [notificationsResponse, unreadResponse] = await Promise.all([
          apiClient.getNotifications(),
          apiClient.getUnreadCount(),
        ]);

        if (notificationsResponse?.success) {
          setNotifications(notificationsResponse.data.data || []);
        } else {
          setNotifications([]);
        }

        if (unreadResponse?.success) {
          setUnreadCount(unreadResponse.data.unread_count || 0);
        } else {
          setUnreadCount(0);
        }
      } catch (e) {
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    load();

    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <Navbar
      variant="dashboard"
      showNotifications={true}
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={() => {}}
      currentPath={currentPath}
    />
  );
}
