"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth(WrappedComponent, options = {}) {
  const { requireAuth = true, redirectTo = "/auth/login" } = options;

  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (requireAuth && !isAuthenticated) {
          router.push(redirectTo);
        } else if (!requireAuth && isAuthenticated) {
          router.push("/dashboard");
        }
      }
    }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

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

    if (requireAuth && !isAuthenticated) {
      return null;
    }

    if (!requireAuth && isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
