"use client";
import React from "react";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";

function AggregateCheckerPage() {
  return (
    <DashboardLayout
      showNotifications={false}
      notifications={[]}
      unreadCount={0}
      onNotificationClick={() => {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Aggregate Checker
              </h1>
              <p className="text-gray-600">
            This page is under maintenance. Please check back soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ProtectedAggregateCheckerPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AggregateCheckerPage />
    </AuthGuard>
  );
}
