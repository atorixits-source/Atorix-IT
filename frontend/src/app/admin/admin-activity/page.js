"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Search, Filter, Eye } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminActivity() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ProtectedRoute>
      <AdminLayout 
        title="Admin Activity" 
        description="Monitor and track all administrative activities and system changes."
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            </div>
            
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No recent activity</h3>
              <p className="text-gray-600 dark:text-gray-400">Admin activities will be logged here as they occur.</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
