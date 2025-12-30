"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Trash2,
  Building,
  MapPin,
  DollarSign,
  Globe,
  Target,
  Mail,
  Phone,
  RefreshCw,
  Loader2,
  AlertCircle
} from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { API_ENDPOINTS, apiRequest } from "@/lib/api";

export default function BusinessManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [counts, setCounts] = useState({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    qualifiedCount: 0
  });

  // Toggle all leads selection with null check
  const toggleSelectAll = () => {
    if (!Array.isArray(leads)) {
      setSelectedLeads([]);
      return;
    }
    
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.filter(lead => !!lead)); // Filter out any null/undefined leads
    }
  };

  // Fetch counts from backend using apiRequest
  const fetchCounts = async () => {
    try {
      // Use apiRequest with proper endpoint
      const data = await apiRequest(`${API_ENDPOINTS.DEMO_REQUESTS}/count`);
      
      if (data.success) {
        setCounts({
          total: data.count,
          newCount: data.newCount,
          contactedCount: data.contactedCount,
          qualifiedCount: data.qualifiedCount
        });
      }
      return data;
    } catch (error) {
      console.error('Error fetching counts:', error);
      // Don't set global error here to allow main data to load even if stats fail
    }
  };

  // Fetch Demo Requests using apiRequest
  const fetchDemoRequests = async () => {
    try {
      setLoading(true);
      console.log('Fetching demo requests...');
      
      // Use apiRequest which handles base URL and auth
      const result = await apiRequest(API_ENDPOINTS.DEMO_REQUESTS);
      
      console.log('API Response:', result); 
      
      // Handle both array and object responses
      const leadsData = Array.isArray(result) 
        ? result 
        : (result?.data || []);
      
      console.log('Processed leads data:', leadsData);
      setLeads(leadsData);
      return leadsData;
    } catch (err) {
      console.error('Error in fetchDemoRequests:', err);
      setError(err.message || 'Failed to load demo requests. Please try again later.');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchDemoRequests(), 
        fetchCounts()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete selected leads using apiRequest
  const handleDeleteLeads = async (leadIds) => {
    if (!leadIds || leadIds.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${leadIds.length} selected item(s)?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      
      // Use apiRequest for DELETE operation
      await apiRequest(API_ENDPOINTS.DEMO_REQUESTS, {
        method: 'DELETE',
        body: JSON.stringify({ ids: leadIds })
      });

      // Update local state to remove deleted leads
      setLeads(prev => prev.filter(lead => !leadIds.includes(lead._id)));
      setSelectedLeads(prev => prev.filter(lead => !leadIds.includes(lead._id)));
      
      // Refresh counts after delete
      fetchCounts();
      
    } catch (error) {
      console.error("Error deleting leads:", error);
      setError('Failed to delete selected items. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Select / deselect a lead
  const toggleLeadSelection = (lead) => {
    setSelectedLeads((prev) => {
      const isSelected = prev.some((l) => l._id === lead._id);
      if (isSelected) {
        return prev.filter((l) => l._id !== lead._id);
      } else {
        return [...prev, lead];
      }
    });
  };

  // Search filter with null check and safe property access
  const filteredLeads = (Array.isArray(leads) ? leads : []).filter((lead) => {
    if (!lead) return false;
    
    const term = searchTerm.toLowerCase();
    const name = lead.name || '';
    const email = lead.email || '';
    const company = lead.company || '';
    const phone = lead.phone ? lead.phone.toString() : '';
    const role = lead.role || '';
    
    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      company.toLowerCase().includes(term) ||
      phone.toLowerCase().includes(term) ||
      role.toLowerCase().includes(term)
    );
  });

  // Normalize backend data to UI shape
  const businessLeads = filteredLeads.map((lead) => {
    const safeLead = {
      _id: lead._id || lead.id || Math.random().toString(36).substr(2, 9),
      name: lead.name || "Unknown",
      email: lead.email || "No email",
      phone: lead.phone || "No phone",
      company: lead.company || "N/A",
      role: lead.role || "N/A",
      interests: Array.isArray(lead.interests)
        ? lead.interests
        : [lead.interests || "General Inquiry"].filter(Boolean),
      message: lead.message || "No message provided",
      source: lead.source || "Website Form",
      status: lead.status || "new",
      createdAt: lead.createdAt || lead.submittedAt || new Date().toISOString(),
      metadata: {
        ...(lead.metadata || {}),
        priority:
          (lead.metadata && lead.metadata.priority) || lead.priority || "medium",
        value: (lead.metadata && lead.metadata.value) || lead.value || "$0",
        location:
          (lead.metadata && lead.metadata.location) || lead.location || "N/A",
      },
    };

    return {
      id: safeLead._id,
      companyName: safeLead.company,
      contactName: safeLead.name,
      email: safeLead.email,
      phone: safeLead.phone,
      location: safeLead.metadata.location,
      industry: Array.isArray(safeLead.interests)
        ? safeLead.interests[0]
        : safeLead.interests || "Other",
      leadDate: safeLead.createdAt
        ? new Date(safeLead.createdAt).toLocaleDateString()
        : "N/A",
      status: safeLead.status,
      source: safeLead.source,
      priority: safeLead.metadata.priority,
      value: safeLead.metadata.value,
      rawData: safeLead,
      description: safeLead.message,
      role: safeLead.role,
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "qualified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "proposal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getIndustryIcon = (industry) => {
    switch (industry) {
      case "Technology":
        return <Globe className="w-4 h-4" />;
      case "Finance":
        return <DollarSign className="w-4 h-4" />;
      case "Healthcare":
        return <Target className="w-4 h-4" />;
      case "Retail":
        return <Building className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  // Stats configuration
  const stats = [
    { name: 'Total Leads', value: counts.total, icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { name: 'New', value: counts.newCount, icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Contacted', value: counts.contactedCount, icon: Phone, color: 'bg-purple-100 text-purple-600' },
    { name: 'Qualified', value: counts.qualifiedCount, icon: Target, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout title="Business Leads" description="Manage your business leads and inquiries">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:p-6 dark:bg-gray-800"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-md ${stat.color.split(' ')[0]} bg-opacity-20`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.split(' ')[1]}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {loading ? (
                          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                        ) : (
                          stat.value
                        )}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between gap-4 mt-8 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Leads</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and track your business leads and inquiries
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                disabled={selectedLeads.length === 0 || isDeleting}
                onClick={() => handleDeleteLeads(selectedLeads.map(lead => lead._id))}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={handleRefresh}
                disabled={loading || isDeleting}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Filters & actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 mt-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by company, contact, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="border rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    Demo Requests
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl p-6 mb-6">
              <div className="flex items-center text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Error loading demo requests:</span>{" "}
                {error}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={selectedLeads.length === leads.length && leads.length > 0}
                        onChange={toggleSelectAll} 
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Interests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {loading && !leads.length ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-pulse flex flex-col items-center">
                            <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                            <p className="text-gray-500">Loading demo requests...</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : businessLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center">
                          <FileText className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-lg font-medium">No demo requests found</p>
                          <p className="text-sm mt-1">Demo requests will appear here once submitted</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    businessLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedLeads.some((l) => l._id === lead.id)}
                            onChange={() => toggleLeadSelection({ _id: lead.id, ...lead.rawData })}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {lead.companyName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {lead.rawData?.source || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {lead.contactName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {lead.email}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {lead.rawData.interests.map((interest, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(lead.status)
                            }`}
                          >
                            {lead.status
                              ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1)
                              : 'New'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              getPriorityColor(lead.priority)
                            }`}
                          >
                            {lead.priority
                              ? lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)
                              : 'Medium'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.location.href = `mailto:${lead.email}`}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.location.href = `tel:${lead.phone}`}
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
