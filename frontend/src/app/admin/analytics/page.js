"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, TrendingUp, Download, Filter, Calendar as CalendarIcon } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { API_ENDPOINTS, apiRequest } from "@/lib/api";

const statusColors = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  qualified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const statusIcons = {
  new: <Users className="w-5 h-5" />,
  contacted: <Clock className="w-5 h-5" />,
  qualified: <CheckCircle className="w-5 h-5" />,
  closed: <CheckCircle className="w-5 h-5" />,
  lost: <Users className="w-5 h-5" />
};

export default function Analytics() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [error, setError] = useState(null);

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(API_ENDPOINTS.BUSINESS_LEADS);
        // Handle both array and object responses
        const leadsData = Array.isArray(response) ? response : (response?.data || []);
        console.log('Fetched leads:', leadsData);
        setLeads(leadsData);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to load lead data');
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    // Ensure leads is an array and handle potential undefined/null cases
    const leadArray = Array.isArray(leads) ? leads : [];
    const totalLeads = leadArray.length;
    const newLeads = leadArray.filter(lead => lead?.status === 'new').length;
    const contactedLeads = leadArray.filter(lead => lead?.status === 'contacted').length;
    const qualifiedLeads = leadArray.filter(lead => lead?.status === 'qualified').length;
    
    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      conversionRate: totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0,
    };
  }, [leads]);

  // Group leads by status for the chart
  const statusData = useMemo(() => {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / leads.length) * 100) || 0,
      color: statusColors[status] || 'bg-gray-100 text-gray-800',
      icon: statusIcons[status] || <Users className="w-5 h-5" />
    }));
  }, [leads]);

  // Get recent activities
  const recentActivities = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5);
  }, [leads]);

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Analytics" description="Loading...">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Analytics" description="Error loading data">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout 
        title="Analytics" 
        description="View detailed analytics and insights about your leads."
      >
        {/* Date Range Picker */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Last {dateRange === 'week' ? '7 days' : dateRange === 'month' ? '30 days' : '90 days'}</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Leads" 
            value={metrics.totalLeads} 
            change="+12%" 
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard 
            title="New Leads" 
            value={metrics.newLeads} 
            change="+5%" 
            icon={<Users className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard 
            title="Contacted" 
            value={metrics.contactedLeads} 
            change="+8%" 
            icon={<Clock className="w-6 h-6" />}
            color="green"
          />
          <MetricCard 
            title="Qualified" 
            value={metrics.qualifiedLeads} 
            change={`${metrics.conversionRate}%`} 
            icon={<CheckCircle className="w-6 h-6" />}
            color="indigo"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Lead Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Status Distribution</h2>
              <Button variant="ghost" size="sm" className="text-sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <DonutChart data={statusData} />
                </div>
              </div>
              <div className="space-y-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${item.color.split(' ')[0]}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.count} ({item.percentage}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Source */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Source</h2>
              <Button variant="ghost" size="sm" className="text-sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {leads.slice(0, 5).map((lead, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{lead.source || 'Unknown'}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(Math.random() * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
              <Button variant="ghost" size="sm" className="text-sm">
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Lead
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentActivities.map((lead, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-300 font-medium">
                              {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {lead.name || 'Unnamed Lead'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {lead.company || 'No company'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[lead.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {lead.source || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lead.updatedAt || lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

// Metric Card Component
function MetricCard({ title, value, change, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          <div className="flex items-center mt-1">
            <TrendingUp className={`w-4 h-4 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ml-1 ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {change} from last period
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Simple Donut Chart Component
function DonutChart({ data }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;
  const colors = [
    'stroke-blue-500',
    'stroke-purple-500',
    'stroke-green-500',
    'stroke-yellow-500',
    'stroke-red-500',
  ];

  return (
    <svg className="w-full h-full" viewBox="0 0 100 100">
      {data.map((item, index) => {
        const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
        const strokeDashoffset = circumference - (currentOffset / 100) * circumference;
        currentOffset += item.percentage;
        
        return (
          <circle
            key={index}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeWidth="10"
            strokeLinecap="round"
            className={colors[index % colors.length]}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
        );
      })}
      <circle cx="50" cy="50" r="30" className="fill-white dark:fill-gray-800" />
      <text 
        x="50" 
        y="50" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        className="text-sm font-bold text-gray-900 dark:text-white"
      >
        {data.reduce((sum, item) => sum + item.count, 0)}
      </text>
      <text 
        x="50" 
        y="65" 
        textAnchor="middle" 
        className="text-xs text-gray-500 dark:text-gray-400"
      >
        Total
      </text>
    </svg>
  );
}
