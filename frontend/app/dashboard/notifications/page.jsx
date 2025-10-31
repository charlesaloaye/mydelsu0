"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import apiClient from "../../../lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await apiClient.getNotifications();
        setNotifications(result.data?.data ? result.data.data.reverse() : []);
      } catch (e) {
        setError(e.message || "Could not fetch notifications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Optionally mark notifications as read
  const markAsRead = async (notif) => {
    if (!notif.unread) return;
    try {
      await apiClient.markAsRead(notif.id);
      setNotifications((old) =>
        old.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
      );
    } catch {}
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPath="/dashboard/notifications"
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
      <main className="flex-1 lg:ml-64 py-0 transition-all duration-300 bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 py-6 px-4 shadow-sm sticky top-0 z-40">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <div className="max-w-2xl mx-auto py-8 px-4">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf]" />
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
              {error}
            </div>
          )}
          {!loading && notifications.length === 0 && (
            <div className="text-center py-24 text-gray-500 font-medium text-lg">
              No notifications yet.
            </div>
          )}
          <ul className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-100 transition cursor-pointer ${
                  notif.unread ? "bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(notif)}
              >
                <div>
                  <div className="text-gray-900 font-medium">
                    {notif.message || notif.body || ""}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {notif.time || notif.created_at || ""}
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end">
                  {notif.unread && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Unread
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
