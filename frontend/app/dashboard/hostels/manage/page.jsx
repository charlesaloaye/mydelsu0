"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/DashboardLayout";
import Link from "next/link";
import apiClient from "../../../../lib/api";

export default function MyHostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyHostels = async () => {
      try {
        const res = await apiClient.get("/hostels/manage");
        if (res && res.success) {
          setHostels(res.data || []);
        } else if (Array.isArray(res)) {
          setHostels(res);
        } else {
          setError("Failed to load hostels");
        }
      } catch (e) {
        setError(e?.message || "Failed to load hostels");
      } finally {
        setLoading(false);
      }
    };
    fetchMyHostels();
  }, []);

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Hostels posted by me</h1>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {!loading && !error && hostels.length === 0 && (
          <p className="text-gray-600">You haven't posted any hostels yet.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostels.map((h) => (
            <Link
              key={h.id || h.uuid || Math.random()}
              href={`/dashboard/hostels/${h.id}`}
              className="border rounded-lg p-3 hover:shadow transition block"
            >
              <div className="w-full h-40 bg-gray-100 rounded mb-3 overflow-hidden">
                {h.images && h.images.length > 0 ? (
                  <img
                    src={h.images[0]}
                    alt={h.title || "Hostel"}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <h2 className="font-semibold text-gray-900 truncate">
                {h.title || h.name || "Hostel"}
              </h2>
              {h.location && (
                <p className="text-sm text-gray-600 truncate">{h.location}</p>
              )}
              {h.price && (
                <p className="text-sm font-medium mt-1">₦{h.price}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Status: {h.status || "pending"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
