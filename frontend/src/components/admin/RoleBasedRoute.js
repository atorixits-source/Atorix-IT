// src/components/admin/RoleBasedRoute.js
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";

// Define dashboard paths for each role
const ROLE_DASHBOARDS = {
  hr_mode: "/admin/hr-dashboard",
  business_mode: "/admin/business-dashboard",
  super_admin: "/admin/dashboard"
};

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/admin/login", "/admin/unauthorized"];

export default function RoleBasedRoute({ 
  children, 
  allowedRoles = ["super_admin", "hr_mode", "business_mode"],
  redirectPath = "/admin/unauthorized"
}) {
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const [apiError, setApiError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthAndAccess = async () => {
      // Skip auth check for public paths
      if (PUBLIC_PATHS.includes(pathname)) {
        setAccessGranted(true);
        setLoading(false);
        return;
      }

      // Redirect to login if not authenticated
      if (!isAuthenticated()) {
        router.push("/admin/login");
        return;
      }

      const user = getCurrentUser();
      
      // If user data is missing, redirect to login
      if (!user || !user.role) {
        setApiError("User data not found. Please log in again.");
        router.push("/admin/login");
        return;
      }

      // Check if current path is allowed for user's role
      const isPathAllowed = (path, role) => {
        if (role === 'super_admin') return true; // Super admin has access to all paths
        const roleDashboard = ROLE_DASHBOARDS[role] || '';
        return path.startsWith(roleDashboard);
      };

      // If user tries to access a route not allowed for their role, redirect to their dashboard
      if (!isPathAllowed(pathname, user.role)) {
        const redirectTo = ROLE_DASHBOARDS[user.role] || redirectPath;
        router.push(redirectTo);
        return;
      }

      // Check if user has permission to access the current route
      if (allowedRoles.includes(user.role)) {
        setAccessGranted(true);
      } else {
        const redirectTo = ROLE_DASHBOARDS[user.role] || redirectPath;
        router.push(redirectTo);
      }
      
      setLoading(false);
    };

    checkAuthAndAccess().catch(error => {
      console.error('Error in checkAuthAndAccess:', error);
      setApiError(error.message || 'An error occurred while checking permissions');
      setLoading(false);
    });
  }, [router, allowedRoles, redirectPath, pathname]);

  if (apiError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{apiError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return accessGranted ? children : null;
}