"use client";
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import AuthGuard from "../../../components/AuthGuard";
import DashboardLayout from "../../../components/DashboardLayout";

function AggregateCheckerPage() {
  const { user, logout } = useAuth();

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
            Check your aggregate scores and admission requirements for DELSU
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
