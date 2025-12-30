"use client";

import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

/**
 * Layout for admin-related pages
 * Simple layout that checks if we're on the login page
 * Login page doesn't need header/footer/etc.
 */
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className={`min-h-screen ${inter.className}`}>
      {/* No wrapper for login page */}
      {isLoginPage ? (
        <>{children}</>
      ) : (
        // Wrapper for dashboard pages (will be protected by ProtectedRoute)
        <>{children}</>
      )}
    </div>
  );
}