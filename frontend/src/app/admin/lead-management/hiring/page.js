// frontend/src/app/admin/lead-management/hiring/page.js
'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  Download, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Award,
  File,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  Menu,
  X,
  ChevronDown,
  Plus,
  Frown,
  RefreshCw,
  ExternalLink,
  Eye,
  FileText as FileTextIcon
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { format } from 'date-fns';

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
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </td>
  </tr>
);

// Empty State Component
const EmptyState = ({ onRefresh }) => (
  <div className="text-center py-12">
    <div className="mx-auto h-24 w-24 text-gray-400">
      <Frown className="h-full w-full opacity-50" />
    </div>
    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No applications found</h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Get started by uploading a new resume or checking back later.
    </p>
    <div className="mt-6">
      <button
        onClick={onRefresh}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
        Refresh
      </button>
    </div>
  </div>
);

// Form validation function
const validateForm = () => {
  // Add your form validation logic here
  return true; // Return true if form is valid, false otherwise
};

// Web3Forms submission fallback
const submitWeb3FormData = async (formData) => {
  // Implementation of Web3Forms submission
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit the form via Web3Forms');
  }
};

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    applied: { bg: 'bg-blue-100 text-blue-800', text: 'Applied' },
    review: { bg: 'bg-yellow-100 text-yellow-800', text: 'In Review' },
    interview: { bg: 'bg-purple-100 text-purple-800', text: 'Interview' },
    hired: { bg: 'bg-green-100 text-green-800', text: 'Hired' },
    rejected: { bg: 'bg-red-100 text-red-800', text: 'Rejected' },
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100 text-gray-800', text: 'Unknown' };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text === 'Hired' ? 'animate-pulse' : ''}`}>
      {config.text}
    </span>
  );
};

export default function HiringManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1
  });
  const [error, setError] = useState(null);

  // Fetch job applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `http://localhost:5001/api/job-applications?page=${pagination.page}&limit=${pagination.pageSize}&search=${searchTerm}`;
      console.log('Fetching from URL:', url);
      
      let response;
      try {
        response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
      } catch (fetchError) {
        console.error('Network error:', fetchError);
        throw new Error('Unable to connect to the server. Please check your connection and try again.');
      }

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If we can't parse JSON, use the status text
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && Array.isArray(data.data)) {
        setApplications(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
          totalPages: Math.ceil((data.total || 0) / pagination.pageSize)
        }));
      } else {
        // Handle case where data is not in expected format
        console.warn('Unexpected API response format:', data);
        setApplications([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalPages: 1
        }));
      }
    } catch (error) {
      console.error('Error in fetchApplications:', {
        message: error.message,
        name: error.name,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
      
      // Set user-friendly error message
      const errorMessage = error.message.includes('Failed to fetch') || 
                         error.message.includes('NetworkError') ||
                         error.message.includes('AbortError')
        ? 'Unable to connect to the server. Please check your internet connection and try again.'
        : error.message || 'An unexpected error occurred while loading applications.';
      
      setError(errorMessage);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [pagination.page, searchTerm]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {/* Header */}
          <div className="bg-white shadow">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Hiring Management</h1>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Add New
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Filter className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" />
                  Filter
                </button>
                <button
                  type="button"
                  onClick={fetchApplications}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw className={`-ml-0.5 mr-2 h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Candidate
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Position
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Applied
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                          // Show skeleton loaders while loading
                          Array(5).fill().map((_, index) => <SkeletonRow key={index} />)
                        ) : applications.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center">
                              <EmptyState onRefresh={fetchApplications} />
                            </td>
                          </tr>
                        ) : (
                          applications.map((application) => (
                            <tr key={application._id} className="hover:bg-gray-50">
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900">{application.fullName}</div>
                                    <div className="text-gray-500">{application.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <div className="text-gray-900 font-medium">{application.position}</div>
                                <div className="text-gray-500">{application.experience} experience</div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <StatusBadge status={application.status || 'applied'} />
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {application.createdAt ? format(new Date(application.createdAt), 'MMM d, yyyy') : 'N/A'}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setIsViewModalOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  <Eye className="h-5 w-5" />
                                  <span className="sr-only">View</span>
                                </button>
                                {application.resumePath && (
                                  <a
                                    href={`http://localhost:5001${application.resumePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <FileTextIcon className="h-5 w-5" />
                                    <span className="sr-only">Download Resume</span>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                          pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              pagination.page === pageNum
                                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                          pagination.page >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* View Application Modal */}
      {isViewModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsViewModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                        Application Details
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setIsViewModalOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <div className="bg-white overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {selectedApplication.fullName}
                              </h3>
                              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Applied for {selectedApplication.position} on {format(new Date(selectedApplication.createdAt), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <StatusBadge status={selectedApplication.status || 'applied'} />
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                          <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Email</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <a href={`mailto:${selectedApplication.email}`} className="text-blue-600 hover:text-blue-500">
                                  {selectedApplication.email}
                                </a>
                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Phone</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <a href={`tel:${selectedApplication.phone}`} className="text-blue-600 hover:text-blue-500">
                                  {selectedApplication.phone}
                                </a>
                              </dd>
                            </div>
                            {selectedApplication.currentCompany && (
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Current Company</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                  {selectedApplication.currentCompany}
                                </dd>
                              </div>
                            )}
                            {selectedApplication.experience && (
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Experience</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                  {selectedApplication.experience}
                                </dd>
                              </div>
                            )}
                            {selectedApplication.expectedSalary && (
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Expected Salary</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                  ₹{selectedApplication.expectedSalary.toLocaleString()}
                                </dd>
                              </div>
                            )}
                            {selectedApplication.noticePeriod && (
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Notice Period</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                  {selectedApplication.noticePeriod}
                                </dd>
                              </div>
                            )}
                            {selectedApplication.coverLetter && (
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Cover Letter</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-line">
                                  {selectedApplication.coverLetter}
                                </dd>
                              </div>
                            )}
                            {selectedApplication.resumePath && (
                              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Resume</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                  <a
                                    href={`http://localhost:5001${selectedApplication.resumePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-500"
                                  >
                                    <FileTextIcon className="h-5 w-5 mr-2" />
                                    View Resume
                                  </a>
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Add your action here (e.g., schedule interview)
                    console.log('Action taken on application:', selectedApplication._id);
                    setIsViewModalOpen(false);
                  }}
                >
                  Schedule Interview
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}