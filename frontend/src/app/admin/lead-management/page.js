"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Building, FileText } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
// Business leads are managed in the management directory

export default function LeadManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("hiring");

  // Navigation items
  const navItems = [
    {
      id: "hiring",
      title: "Hiring",
      icon: <Briefcase className="w-5 h-5" />,
      description: "Manage job applications and hiring leads"
    },
    {
      id: "business",
      title: "Business",
      icon: <Building className="w-5 h-5" />,
      description: "Manage business inquiries and partnerships"
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Lead Management"
        description="Manage all your leads in one place"
      >
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a category to view and manage leads
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.id}
                href={`/admin/lead-management/${item.id}`}
                className={`p-6 border rounded-lg transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    activeTab === item.id 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </AdminLayout>
    </ProtectedRoute>
  );
}