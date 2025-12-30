"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
import { 
  Users, BarChart3, TrendingUp, Calendar, 
  AlertCircle, X, CheckSquare, Database, Activity, History,
  FileText, Briefcase, Building, Settings, Shield,
  Search, RefreshCw, Filter, Download, UserPlus, Briefcase as BriefcaseIcon
} from "lucide-react";
import { format } from 'date-fns';

// Tab component for toggling between lead types
const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
      active 
        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/30' 
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
    }`}
  >
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </div>
  </button>
);

function AdminDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('business'); // 'business' or 'hiring'
  const [leads, setLeads] = useState({
    business: [],
    hiring: []
  });
  const [leadsLoading, setLeadsLoading] = useState({
    business: true,
    hiring: true
  });
  const [error, setError] = useState({
    business: null,
    hiring: null
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Stats state for both lead types
  const [stats, setStats] = useState({
    business: {
      totalLeads: 0,
      lastWeek: 0,
      lastMonth: 0,
      newLeads: 0,
    },
    hiring: {
      totalLeads: 0,
      lastWeek: 0,
      lastMonth: 0,
      newLeads: 0,
    },
    onlineAdmins: 0
  });

 // In c:\Users\lenov\OneDrive\Desktop\atorix new\atorix-new-main\frontend\src\app\admin\dashboard\page.js

const fetchLeads = async (type) => {
  try {
    setLeadsLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));
    
    // Use the correct endpoint based on the type
    const endpoint = type === 'business' 
      ? '/api/demo-requests' 
      : '/api/hiring-leads';  // Make sure this matches your API route
    
    console.log(`Fetching ${type} leads from:`, endpoint);
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      credentials: 'include',
    });

    const result = await response.json().catch(e => {
      console.error('Failed to parse JSON response:', e);
      return { success: false, message: 'Invalid response from server' };
    });

    if (!response.ok) {
      throw new Error(result.message || `Failed to fetch ${type} leads: ${response.status}`);
    }

    console.log('API Response:', result);
    
    // Handle different response formats
    let leadsData = [];
    if (result && result.success !== undefined) {
      // Handle { success: true, data: [] } or { success: true, leads: [] } format
      leadsData = Array.isArray(result.data) ? result.data : 
                 Array.isArray(result.leads) ? result.leads : 
                 Array.isArray(result) ? result : [];
    } else if (Array.isArray(result)) {
      // Handle direct array response
      leadsData = result;
    }
    
    console.log(`Processed ${leadsData.length} ${type} leads:`, leadsData);
    
    // Update leads state
    setLeads(prev => ({
      ...prev,
      [type]: leadsData
    }));

    // Update stats
    updateStats(leadsData, type);
    
    return leadsData;
  } catch (error) {
    console.error(`Error in fetchLeads for ${type}:`, error);
    setError(prev => ({
      ...prev,
      [type]: error.message || `Failed to load ${type} leads`
    }));
    return [];
  } finally {
    setLeadsLoading(prev => ({ ...prev, [type]: false }));
  }
};
  const updateStats = (leadsData, type) => {
  if (!leadsData || !Array.isArray(leadsData)) {
    console.error('Invalid leads data received:', leadsData);
    return;
  }

  const totalLeads = leadsData.length;
  const newLeads = leadsData.filter(lead => 
    lead && typeof lead === 'object' && lead.status === 'new'
  ).length;
  
  // Calculate last week and last month counts (example implementation)
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const lastWeekCount = leadsData.filter(lead => {
    if (!lead || !lead.createdAt) return false;
    const leadDate = new Date(lead.createdAt);
    return leadDate >= oneWeekAgo;
  }).length;
  
  const lastMonthCount = leadsData.filter(lead => {
    if (!lead || !lead.createdAt) return false;
    const leadDate = new Date(lead.createdAt);
    return leadDate >= oneMonthAgo;
  }).length;

  setStats(prev => ({
    ...prev,
    [type]: {
      totalLeads,
      lastWeek: lastWeekCount,
      lastMonth: lastMonthCount,
      newLeads,
    }
  }));
};

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    fetchLeads('business');
    fetchLeads('hiring');
  }, [router]);

  // Filter leads based on search and status
  const getFilteredLeads = (type) => {
    if (!leads[type]) return [];
    
    return leads[type].filter(lead => {
      if (!lead) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (lead.name?.toLowerCase().includes(searchLower) ||
         lead.email?.toLowerCase().includes(searchLower) ||
         lead.company?.toLowerCase().includes(searchLower) ||
         (lead.position && lead.position.toLowerCase().includes(searchLower)) ||
         (Array.isArray(lead.skills) && lead.skills.some(skill => 
           skill && skill.toLowerCase().includes(searchLower)
         ))) ?? false;
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredLeads = getFilteredLeads(activeTab) || [];
  const currentStats = stats[activeTab] || {};
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredLeads.length);
  const currentLeads = filteredLeads.slice(startItem - 1, endItem);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab]);

  // Stats cards data
  const statsCards = [
    { 
      title: "Total Leads", 
      value: currentStats.totalLeads, 
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: activeTab === 'business' ? 12 : 8,
      changeType: "increase"
    },
    { 
      title: "New This Week", 
      value: currentStats.lastWeek, 
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      change: activeTab === 'business' ? 5 : 3,
      changeType: "increase"
    },
    { 
      title: "New This Month", 
      value: currentStats.lastMonth, 
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      change: activeTab === 'business' ? 8 : 5,
      changeType: "increase"
    },
    { 
      title: "New Leads", 
      value: currentStats.newLeads, 
      icon: <FileText className="h-6 w-6 text-yellow-500" />,
      change: activeTab === 'business' ? 3 : 2,
      changeType: activeTab === 'business' ? "decrease" : "increase"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminLayout>
        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-start justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className={`text-sm mt-2 ${
                    stat.changeType === "increase" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {stat.changeType === "increase" ? "↑" : "↓"} {stat.change}% from last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Leads Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leads Overview</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage and track all your {activeTab === 'business' ? 'business' : 'hiring'} leads
                  </p>
                </div>
                
                {/* Lead Type Tabs */}
                <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 md:mb-0">
                  <TabButton 
                    active={activeTab === 'business'} 
                    onClick={() => setActiveTab('business')}
                    icon={BriefcaseIcon}
                  >
                    Business Leads
                  </TabButton>
                  <TabButton 
                    active={activeTab === 'hiring'} 
                    onClick={() => setActiveTab('hiring')}
                    icon={UserPlus}
                  >
                    Hiring Leads
                  </TabButton>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
                        <button
                          onClick={() => fetchLeads(activeTab)}
                          disabled={leadsLoading[activeTab]}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${leadsLoading[activeTab] ? 'animate-spin' : ''}`} />
                          Refresh {activeTab === 'business' ? 'Business' : 'Hiring'} Leads
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          {activeTab === 'hiring' ? 'Candidate' : 'Name'}
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          {activeTab === 'business' ? 'Company' : 'Position'}
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Email
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Phone
        </th>
        {activeTab === 'hiring' && (
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Skills
          </th>
        )}
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Status
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Date
        </th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {leadsLoading[activeTab] ? (
        <tr>
          <td colSpan={activeTab === 'hiring' ? 7 : 6} className="px-6 py-4 text-center">
            Loading {activeTab} leads...
          </td>
        </tr>
      ) : filteredLeads.length === 0 ? (
        <tr>
          <td colSpan={activeTab === 'hiring' ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
            No {activeTab} leads found.
          </td>
        </tr>
      ) : (
        currentLeads.map((lead, index) => (
          <tr key={lead?._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {lead?.name || 'N/A'}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 dark:text-white">
                {activeTab === 'business' ? (lead?.company || 'N/A') : (lead?.position || 'N/A')}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 dark:text-white">
                {lead?.email || 'N/A'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 dark:text-white">
                {lead?.phone || 'N/A'}
              </div>
            </td>
            {activeTab === 'hiring' && (
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {Array.isArray(lead?.skills) ? lead.skills.join(', ') : 'N/A'}
                </div>
              </td>
            )}
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                lead?.status === 'new' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                lead?.status === 'contacted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                lead?.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {lead?.status || 'unknown'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
              {/* Pagination */}
              <div className="bg-white dark:bg-gray-800 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">{startItem}</span> to{' '}
                      <span className="font-medium">{endItem}</span> of{' '}
                      <span className="font-medium">{filteredLeads.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                          currentPage === 1 
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        } border-gray-300 dark:border-gray-600 text-sm font-medium`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-300 z-10'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200">
                          ...
                        </span>
                      )}
                      <button
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <RoleBasedRoute allowedRoles={['super_admin', 'admin']}>
      <AdminDashboardContent />
    </RoleBasedRoute>
  );
}