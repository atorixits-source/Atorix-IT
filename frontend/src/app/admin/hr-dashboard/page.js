"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, TrendingUp, Calendar, Briefcase, Award, Clock, Target, Search, Filter, Download, Mail, Phone, Plus, RefreshCw } from "lucide-react";
import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    applied: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-purple-100 text-purple-800',
    interview: 'bg-yellow-100 text-yellow-800',
    offered: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    onboarding: 'bg-indigo-100 text-indigo-800',
    active: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// Skeleton Loader Component
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="ml-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-100 rounded w-24"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-40"></div>
        <div className="h-3 bg-gray-100 rounded w-20"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </td>
  </tr>
);

export default function HRDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hiringData, setHiringData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 1
  });

  // Fetch hiring data
  const fetchHiringData = async () => {
    try {
      setLoading(true);
      const url = `https://atorix-backend-server.onrender.com/api/job-applications?page=${pagination.page}&limit=${pagination.pageSize}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setHiringData(data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
          totalPages: Math.ceil((data.total || 0) / pagination.pageSize)
        }));
      } else {
        console.error('Error fetching hiring data:', data.message);
        setHiringData([]);
      }
    } catch (error) {
      console.error('Error in fetchHiringData:', error);
      setHiringData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHiringData();
  }, [pagination.page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mock data for demonstration
  const hrStats = {
    totalEmployees: 156,
    newHires: 12,
    openPositions: 8,
    avgRetention: "92%",
    trainingSessions: 24,
    performanceReviews: 45
  };

  return (
    <RoleBasedRoute allowedRoles={["hr_mode", "super_admin"]}>
      <AdminLayout 
        title="HR Dashboard" 
        description="Manage employees, recruitment, performance, and HR operations."
      >
        {/* HR Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8" />
              <span className="text-2xl font-bold">{hrStats.totalEmployees}</span>
            </div>
            <p className="text-blue-100">Total Employees</p>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-8 h-8" />
              <span className="text-2xl font-bold">{hrStats.newHires}</span>
            </div>
            <p className="text-emerald-100">New Hires (This Month)</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8" />
              <span className="text-2xl font-bold">{hrStats.openPositions}</span>
            </div>
            <p className="text-purple-100">Open Positions</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8" />
              <span className="text-2xl font-bold">{hrStats.avgRetention}</span>
            </div>
            <p className="text-orange-100">Retention Rate</p>
          </div>
        </div>

        {/* Hiring Pipeline */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Hiring Pipeline
              </h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchHiringData()}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchHiringData}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applied
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array(5).fill().map((_, index) => <SkeletonRow key={`skeleton-${index}`} />)
                ) : hiringData.length > 0 ? (
                  hiringData.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200 font-medium">
                            {application.name?.charAt(0) || 'A'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{application.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{application.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">{application.position || 'N/A'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{application.department || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={application.status || 'applied'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {application.appliedAt ? formatDate(application.appliedAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Overview */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Department Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Engineering</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Marketing</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">51</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Operations</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RoleBasedRoute>
  );
}