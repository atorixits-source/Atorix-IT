"use client"

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { 
  BarChart3, Users, FileText, TrendingUp, Activity, 
  History, Shield, Settings, LogOut, Briefcase, 
  Building, UserCheck, DollarSign, Home 
} from "lucide-react";

// Navigation items configuration
const NAVIGATION_ITEMS = {
  super_admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "HR Dashboard", href: "/admin/hr-dashboard", icon: UserCheck },
    { name: "Business Dashboard", href: "/admin/business-dashboard", icon: DollarSign },
    { name: "User Management", href: "/admin/user-management", icon: Users },
    { name: "Lead Management", href: "/admin/lead-management", icon: FileText },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Admin Activity", href: "/admin/admin-activity", icon: Activity },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
    { name: "Role Permissions", href: "/admin/role-permissions", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
  hr_mode: [
    { name: "HR Dashboard", href: "/admin/hr-dashboard", icon: UserCheck },
    { name: "Employee Directory", href: "/admin/employees", icon: Users },
    { name: "Recruitment", href: "/admin/recruitment", icon: Briefcase },
    { name: "Leave Management", href: "/admin/leave", icon: FileText },
  ],
  business_mode: [
    { name: "Business Dashboard", href: "/admin/business-dashboard", icon: DollarSign },
    { name: "Leads", href: "/admin/leads", icon: FileText },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  ]
};

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState([]);

  // Set user role on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      setUserRole(user?.role || null);
    }
    setLoading(false);
  }, []);

  const toggleItem = (itemName) => {
    setExpandedItems(prev => 
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  // Auto-expand Lead Management if user is on a subcategory page
  React.useEffect(() => {
    if (pathname.includes('/lead-management/') && !expandedItems.includes('Lead Management')) {
      setExpandedItems(prev => [...prev, 'Lead Management']);
    }
  }, [pathname]);

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName) => {
    // Always expand if it's in the expanded state or if it's Lead Management on a subpage
    return expandedItems.includes(itemName) || 
           (itemName === 'Lead Management' && pathname.includes('/lead-management/'));
  };

  const handleLogout = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    try {
      // Clear client-side storage first
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Force a full page reload to clear all application state
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login even if logout API fails
      window.location.href = '/admin/login';
    }
  };

  if (loading) {
    return <div className="h-full bg-gray-800 w-64 flex-shrink-0" />;
  }

  const navigationItems = NAVIGATION_ITEMS[userRole] || [];

  return (
    <div className="w-64 bg-slate-900 dark:bg-slate-950 min-h-screen">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <Image
            src="/atorix-logo.png"
            alt="Atorix IT Logo"
            width={120}
            height={40}
            priority
          />
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
