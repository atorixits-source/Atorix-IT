"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FaSpinner, FaShieldAlt } from "react-icons/fa";

/**
 * @typedef {Object} ProtectedPageProps
 * @property {React.ReactNode} children
 * @property {string|null} [requiredRole]
 * @property {string[]|null} [requiredRoles]
 * @property {string|null} [requiredPermission]
 * @property {string} [pageTitle]
 * @property {React.ReactNode|null} [fallback]
 * @property {boolean} [validateWithBackend]
 * @property {boolean} [showLoading]
 */

/**
 * @param {ProtectedPageProps} props
 */
const ProtectedPage = ({
  children,
  requiredRole = null,
  requiredRoles = null,
  requiredPermission = null,
  pageTitle = "this page",
  fallback = null,
  validateWithBackend = true,
  showLoading = true
}) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  const ranRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mapPermissionToRoles = useCallback((permission) => {
    if (!permission) return null;
    const permissionRoleMap = {
      dashboard: ["user", "admin", "superadmin"],
      posts: ["admin", "superadmin"],
      users: ["superadmin"],
      settings: ["superadmin"],
      create: ["admin", "superadmin"],
      edit: ["admin", "superadmin"],
      delete: ["admin", "superadmin"],
      moderate: ["admin", "superadmin"]
    };
    return permissionRoleMap[permission] || ["admin", "superadmin"];
  }, []);

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return "";
    return (
      (localStorage.getItem("adminToken") || localStorage.getItem("blogToken") || "")
    )
      .toString()
      .trim()
      .replace(/^Bearer\s*/i, "");
  }, []);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const validateAccess = async () => {
      try {
        setIsValidating(true);
        setValidationError(null);
        setHasAccess(false);

        if (loading) return;

        if (!isAuthenticated() || !user) {
          setValidationError("You must be logged in to access this page.");
          return;
        }

        if (user.isActive === false) {
          setValidationError("Your account has been deactivated. Please contact an administrator.");
          return;
        }

        let roles = requiredRoles || (requiredRole ? [requiredRole] : null);
        if (requiredPermission && !roles) {
          roles = mapPermissionToRoles(requiredPermission);
        }

        if (roles) {
          const ok = hasRole(roles);
          if (!ok) {
            setValidationError(
              `You don't have permission to access ${pageTitle}. Required role: ${roles.join(" or ")}`
            );
            return;
          }
        }

        if (validateWithBackend && roles && (roles.includes("admin") || roles.includes("superadmin"))) {
          const token = getToken();
          if (token) {
            try {
              const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5002"}/api/auth/validate-token`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                cache: "no-store"
              });

              if (!resp.ok) {
                setValidationError("Your session has expired. Please log in again.");
                return;
              }

              const backendUser = await resp.json();
              if (roles && !roles.includes(backendUser.role?.toLowerCase())) {
                setValidationError(
                  `Access denied. Backend validation failed for required role: ${roles.join(" or ")}`
                );
                return;
              }
            } catch {
              if (process.env.NODE_ENV === "production") {
                setValidationError("Unable to verify permissions. Please try again.");
                return;
              } else {
                console.warn("ProtectedPage: Continuing with frontend validation only (development mode)");
              }
            }
          }
        }

        if (mountedRef.current) {
          setHasAccess(true);
        }
      } catch (err) {
        if (mountedRef.current) {
          setValidationError("An error occurred while validating access permissions.");
        }
      } finally {
        if (mountedRef.current) {
          setIsValidating(false);
        }
      }
    };

    void validateAccess();
  }, [
    loading,
    isAuthenticated,
    user,
    hasRole,
    requiredRole,
    requiredRoles,
    requiredPermission,
    validateWithBackend,
    pageTitle,
    getToken,
    mapPermissionToRoles
  ]);

  if ((loading || isValidating) && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Validating Access</h2>
          <p className="text-gray-600">Please wait while we verify your permissions...</p>
        </div>
      </div>
    );
  }

  if (validationError || !hasAccess) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FaShieldAlt className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-2">
            {validationError || `You don't have permission to access ${pageTitle}.`}
          </p>
          {user && (
            <p className="text-sm text-gray-500 mb-6">
              Current role: <span className="font-medium capitalize">{user.role}</span>
            </p>
          )}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => (typeof window !== "undefined" ? window.history.back() : router.push("/"))}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push("/blog-admin")}
              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => router.push("/AdminLogin")}
              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedPage;
