"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function AuthGuard({ children, requireAuth = true }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // Redirect to login if authentication is required but user is not authenticated
        router.push("/auth/login");
      }
      // Note: Removed the redirect for authenticated users when requireAuth=false
      // This allows authenticated users to access public pages like marketplace
    }
  }, [isAuthenticated, loading, requireAuth, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488bbf] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if authentication state doesn't match requirements
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect to login
  }

  // Allow both authenticated and unauthenticated users to access public pages
  return children;
}
