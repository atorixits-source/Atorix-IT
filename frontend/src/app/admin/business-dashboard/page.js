"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
import RecentLeads from "@/components/admin/RecentLeads";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { DollarSign, ArrowUpRight, ArrowDownRight, Briefcase, TrendingUp, Users, MessageSquare, RefreshCw, Plus, Mail, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: {
      label: "New",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    contacted: {
      label: "Contacted",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    qualified: {
      label: "Qualified",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, trend, percentage, color }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendIcon = trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {percentage && (
              <span className={`ml-2 text-sm font-medium flex items-center ${trendColor}`}>
                {trendIcon} {percentage}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default function BusinessDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    qualifiedLeads: 0,
  });

  // Mock data for metrics
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231",
      icon: DollarSign,
      trend: 'up',
      percentage: '12.5',
      color: 'text-green-500'
    },
    {
      title: "Active Projects",
      value: "12",
      icon: Briefcase,
      trend: 'up',
      percentage: '5.2',
      color: 'text-blue-500'
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      icon: TrendingUp,
      trend: 'down',
      percentage: '1.1',
      color: 'text-purple-500'
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: Users,
      trend: 'up',
      percentage: '8.7',
      color: 'text-yellow-500'
    }
  ];

  // Mock activities
  const activities = [
    {
      icon: Users,
      title: "New lead added",
      description: "John Doe from Acme Inc. requested a demo",
      time: "5 min ago"
    },
    {
      icon: Briefcase,
      title: "Project completed",
      description: "E-commerce website for RetailPro",
      time: "2 hours ago"
    },
    {
      icon: MessageSquare,
      title: "New message",
      description: "You have 3 unread messages",
      time: "1 day ago"
    }
  ];

  // Fetch leads from the API
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("https://atorix-blogs-server1.onrender.com/api/demo-requests", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch business leads");
      }

      const data = await response.json();
      const leadsArray = data?.data || [];

      // Process leads to match the expected format
      const processedLeads = leadsArray.map(lead => ({
        ...lead,
        id: lead._id,
        company: lead.company || "N/A",
        contact: lead.name,
        email: lead.email,
        phone: lead.phone,
        interests: lead.interests || ["Not specified"],
        status: lead.status || "new",
        priority: "medium",
        source: lead.source || "demo_request"
      }));

      setLeads(processedLeads);

      // Calculate stats
      const totalLeads = processedLeads.length;
      const newLeads = processedLeads.filter(lead => lead.status === "new" || !lead.status).length;
      const contactedLeads = processedLeads.filter(lead => lead.status === "contacted").length;
      const qualifiedLeads = processedLeads.filter(lead => lead.status === "qualified").length;

      setStats({
        totalLeads,
        newLeads,
        contactedLeads,
        qualifiedLeads,
      });

    } catch (error) {
      console.error("Error fetching business leads:", error);
      toast.error(error.message || "Error fetching business leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchLeads();
  };

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
    // Set up polling every 5 minutes
    const interval = setInterval(fetchLeads, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  return (
    <RoleBasedRoute>
      <AdminLayout
        title="Business Dashboard"
        description="Overview of your business performance"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Business Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
              percentage={metric.percentage}
              color={metric.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Leads */}
          <div className="col-span-2">
            <RecentLeads />
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add New Lead
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Email Campaign
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Performance Overview
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  This Month
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  This Year
                </Button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Performance chart will be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RoleBasedRoute>
  );
}