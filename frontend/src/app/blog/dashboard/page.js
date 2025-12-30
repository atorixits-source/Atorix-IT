"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, MoreVertical, X, ArrowLeft, Home, User, Rss, LogOut, ExternalLink } from 'lucide-react';
import CreateBlogForm from './components/CreateBlogForm';
import { getAuthToken, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';
const getApiOrigin = () => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').trim();
  try {
    const url = new URL(raw);
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw.replace(/\/+$/, '');
    }
    return `http://${raw}`.replace(/\/+$/, '');
  }
};

const apiOrigin = getApiOrigin();

const resolveImageUrl = (imageCandidate) => {
  if (!imageCandidate) return null;

  const normalize = (value) => {
    if (!value) return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('/')) return `${apiOrigin}${value}`;
    return `${apiOrigin}/${value}`;
  };

  if (typeof imageCandidate === 'string') {
    return normalize(imageCandidate);
  }

  if (typeof imageCandidate === 'object') {
    return normalize(imageCandidate.url || imageCandidate.src || imageCandidate.path);
  }

  return null;
};
import DOMPurify from 'isomorphic-dompurify';


// Blog Viewer Component
const BlogViewer = ({ blog, onClose }) => {
  const sanitizedContent = useMemo(() => {
    const rawContent = blog?.content || blog?.body || blog?.description || '';
    return rawContent ? DOMPurify.sanitize(rawContent) : '';
  }, [blog]);

  // Compute the public/live URL for this blog post
  const livePath = useMemo(() => {
    if (!blog) return null;
    const slug = blog.slug || blog._id || blog.id;
    return slug ? `/blog/${slug}` : null;
  }, [blog]);

  const liveUrl = useMemo(() => {
    if (!livePath) return null;
    if (typeof window === 'undefined') return livePath;
    return `${window.location.origin}${livePath}`;
  }, [livePath]);

  const handleCopyLiveLink = () => {
    if (!liveUrl) return;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(liveUrl)
        .then(() => {
          alert('Live blog link copied to clipboard.');
        })
        .catch(() => {
          alert('Could not copy the link automatically. Please copy it manually.');
        });
    } else {
      // Fallback: prompt the user with the URL
      window.prompt('Copy this URL:', liveUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {blog.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              blog.status === 'Published' ? 'bg-green-100 text-green-700' :
              blog.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {blog.status}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <span>By {blog.author}</span>
            <span>•</span>
            <span>Created: {blog.created}</span>
            <span>•</span>
            <span>Updated: {blog.updated}</span>
          </div>
          {livePath && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <div className="text-gray-600">
                <span className="font-semibold mr-1">Live URL:</span>
                <a
                  href={livePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {liveUrl || livePath}
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopyLiveLink}
                className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                Copy live link
              </button>
            </div>
          )}
        </div>

        {/* Featured/Banner Image */}
        {(blog.bannerImage || blog.featuredImage || blog.image) && (
          <div className="mb-8">
            <img 
              src={
                resolveImageUrl(blog.bannerImage) ||
                resolveImageUrl(blog.featuredImage) ||
                resolveImageUrl(blog.image) ||
                (blog.bannerImage?.data ? `data:${blog.bannerImage.contentType || 'image/jpeg'};base64,${blog.bannerImage.data}` :
                blog.featuredImage?.data ? `data:${blog.featuredImage.contentType || 'image/jpeg'};base64,${blog.featuredImage.data}` :
                blog.image?.data ? `data:${blog.image.contentType || 'image/jpeg'};base64,${blog.image.data}` :
                'https://via.placeholder.com/800x400')
              } 
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                console.log('Blog viewer image failed to load, trying fallback:', e.target.src);
                // Try to find any available image in any format
                const fallbackSrc = 
                  blog.bannerImage || 
                  blog.featuredImage || 
                  blog.image ||
                  'https://via.placeholder.com/800x400';
                
                // Only update if we have a different fallback
                if (e.target.src !== fallbackSrc) {
                  e.target.src = fallbackSrc;
                } else {
                  // If we've already tried the fallback, use the placeholder
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400';
                }
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {blog.excerpt && (
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            {blog.excerpt}
          </p>
          )}
          {sanitizedContent ? (
            <>
              <style jsx>{`
                .prose a,
                .prose a:visited,
                .prose a:link {
                  color: #1d4ed8 !important;
                  text-decoration: underline !important;
                  text-decoration-color: #1d4ed8 !important;
                }
                .prose a:hover {
                  color: #1d4ed8 !important;
                  text-decoration-color: #1d4ed8 !important;
                }
              `}</style>
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </>
          ) : (
            <p className="text-gray-500">No content available for this post.</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BlogAdminPanel() {
  const router = useRouter();
  
  // State for UI
  const [activeFilter, setActiveFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingBlog, setViewingBlog] = useState(null);
  
  // State for blog posts and pagination
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // User data state
  const [userData, setUserData] = useState({ name: 'User', role: 'user' });
  
  // Connection status state
  const [isConnected, setIsConnected] = useState(false);

  // Function to fetch blog posts
  const fetchBlogPosts = async (page = 1, searchQuery = '') => {
    console.log('fetchBlogPosts called');
    setIsLoading(true);
    setError(null);
    
    const token = getAuthToken();
    if (!token) {
      console.log('No auth token found');
      setIsLoading(false);
      return;
    }

    console.log('Auth token:', token ? 'Token exists' : 'No token');
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let url = new URL('/api/blog/posts', baseUrl);
      
      // Add pagination and search query parameters
      url.searchParams.append('page', page);
      if (searchQuery) {
        url.searchParams.append('search', searchQuery);
      }
      
      console.log('Fetching from URL:', url.toString());
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.success) {
        console.log('Blog posts data:', data.data); // Debug log
        console.log(`Found ${data.data?.length || 0} blog posts`);
        setBlogPosts(data.data || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
        setTotalPosts(data.totalPosts || (data.data ? data.data.length : 0));
      } else {
        setBlogPosts([]);
        setTotalPages(1);
        setCurrentPage(1);
        setTotalPosts(0);
      }
    } catch (error) {
      console.error('Error in fetchBlogPosts:', error);
      setError(error.message);
      setBlogPosts([]);
      setTotalPages(1);
      setCurrentPage(1);
      setTotalPosts(0);
    }
  };

  useEffect(() => {
    // Get user data from localStorage
    const fetchUserData = () => {
      try {
        const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('Fetched user data from localStorage:', storedData);
        
        const userRole = storedData.role && (storedData.role === 'admin' || storedData.role === 'user') 
          ? storedData.role 
          : 'user';
        
        setUserData({
          name: storedData.name || 'User',
          role: userRole,
          email: storedData.email || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserData({
          name: 'User',
          role: 'user',
          email: ''
        });
      }
    };

    // Check connection status
    const checkConnection = () => {
      const connected = isAuthenticated();
      setIsConnected(connected);
    };

    fetchUserData();
    checkConnection();
    
    const handleStorageChange = () => {
      fetchUserData();
      checkConnection();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check connection status periodically
    const connectionInterval = setInterval(checkConnection, 5000);
    
    // Fetch blog posts on component mount and when filters change
    fetchBlogPosts(currentPage, searchTerm);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(connectionInterval);
    };
  }, [currentPage, searchTerm]);

  const publishStatuses = new Set(['published', 'publish', 'live']);
  const draftStatuses = new Set(['draft', 'in progress', 'pending']);
  const archivedStatuses = new Set(['archived', 'archive', 'inactive']);

  const stats = [
    { label: 'Total', count: totalPosts, color: 'bg-blue-500' },
    { label: 'Published', count: blogPosts.filter(post => publishStatuses.has((post.status || '').toLowerCase())).length, color: 'bg-green-500' },
    { label: 'Draft', count: blogPosts.filter(post => draftStatuses.has((post.status || '').toLowerCase())).length, color: 'bg-yellow-500' },
    { label: 'Archived', count: blogPosts.filter(post => archivedStatuses.has((post.status || '').toLowerCase())).length, color: 'bg-gray-500' }
  ];

  // Handle navigation to user management
  const handleNavigateToUserManagement = () => {
    if (userData.role === 'admin') {
      window.location.href = '/blog/dashboard/user-management';
    } else {
      alert('You do not have permission to access user management.');
    }
  };

  // Handle blog creation - This will be called from your CreateBlogForm
  const handleBlogCreated = () => {
    // Refresh the blog posts list to include the newly created post
    fetchBlogPosts(currentPage, searchTerm);
    setShowCreateForm(false);
    setSelectedPost(null);
  };

  const handleBlogUpdated = () => {
    fetchBlogPosts(currentPage, searchTerm);
    setShowCreateForm(false);
    setSelectedPost(null);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setSelectedPost(null);
  };

  const handleCreateButtonClick = () => {
    setSelectedPost(null);
    setShowCreateForm(true);
  };

  // Handle blog deletion
  const handleDelete = async (postOrId) => {
    try {
      // Extract the ID whether we got an ID string or a post object
      const postId = typeof postOrId === "string" ? postOrId : postOrId?._id;
      
      console.log('Deleting post with ID:', postId);
      console.log('Original postOrId:', postOrId);
      
      if (!postId) {
        const errorMsg = 'No post ID provided for deletion';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Check if post exists in the current state
      const postExists = blogPosts.some(post => post._id === postId || post.id === postId);
      if (!postExists) {
        const errorMsg = 'The post you are trying to delete does not exist or has already been deleted.';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
        return;
      }

      // Get authentication token
      let token = getAuthToken();
      
      // If token not found in auth utility, try other locations
      if (!token) {
        console.log('Token not found in auth utility, checking other locations...');
        const possibleTokenKeys = [
          'adminToken',
          'blogToken',
          'atorix_auth_token',
          'token',
          'authToken'
        ];

        // Check localStorage
        for (const key of possibleTokenKeys) {
          const value = localStorage.getItem(key);
          if (value) {
            token = value;
            console.log(`Found token in localStorage.${key}`);
            break;
          }
        }

        // If still not found, check sessionStorage
        if (!token) {
          for (const key of possibleTokenKeys) {
            const value = sessionStorage.getItem(key);
            if (value) {
              token = value;
              console.log(`Found token in sessionStorage.${key}`);
              break;
            }
          }
        }

        // Last resort: check userData
        if (!token) {
          try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            token = userData.token || userData.accessToken;
            if (token) {
              console.log('Found token in userData');
            }
          } catch (e) {
            console.error('Error parsing userData:', e);
          }
        }
      }

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Get the base URL from environment variables
      let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/blog';
      
      // Clean up the base URL
      baseUrl = baseUrl.trim();
      // Remove any trailing slashes
      baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      
      // Construct the API URL - ensure we don't have duplicate /posts in the URL
      let apiUrl = baseUrl;
      if (!apiUrl.endsWith('/posts')) {
        apiUrl = `${baseUrl}/posts`;
      }
      apiUrl = `${apiUrl}/${postId}`;
      
      console.log('Base URL:', baseUrl);
      console.log('Final API URL:', apiUrl);
      console.log('Deleting blog post at URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
      });

      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to delete blog post';
        try {
          // Read the response body as text first
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
            console.error('Error response JSON:', errorData);
          } catch (jsonError) {
            // If it's not JSON, use the raw text as the error message
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          console.error('Error reading error response:', e);
        }
        
        // If unauthorized, clear auth and redirect to login
        if (response.status === 401) {
          // Clear all possible auth tokens
          ['adminToken', 'blogToken', 'atorix_auth_token', 'token', 'authToken'].forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
          });
          localStorage.removeItem('userData');
          
          throw new Error('Your session has expired. Please log in again.');
        }
        
        throw new Error(errorMessage);
      }

      // Only update the UI after successful deletion from the server
      setBlogPosts(prevPosts => prevPosts.filter(post => post._id !== postId && post.id !== postId));
      // Show success message
      alert('Blog post deleted successfully!');
      // Fetch the latest blog list and update stats/counts
      fetchBlogPosts(currentPage, searchTerm);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      
      if (error.message.includes('session') || error.message.includes('log in') || error.message.includes('auth') || error.message.includes('401')) {
        // Redirect to login page if session expired
        alert('Your session has expired. Please log in again.');
        window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
      } else {
        alert(`Error: ${error.message || 'Failed to delete blog post. Please try again.'}`);
      }
      
      // Refresh the blog posts to ensure UI is in sync with the server
      fetchBlogPosts();
    }
  };

  // Handle blog edit
  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowCreateForm(true);
  };

  // Handle form submission for both create and update
  const handleFormSubmit = async (formData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let response;

      if (selectedPost) {
        // Update existing post
        const apiUrl = new URL(`/api/blog/posts/${selectedPost._id}`, baseUrl).toString();
        response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData),
          credentials: 'include',
          mode: 'cors'
        });
      } else {
        // Create new post
        const apiUrl = new URL('/api/blog/posts', baseUrl).toString();
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData),
          credentials: 'include',
          mode: 'cors'
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save blog post');
      }

      // Refresh the blog posts
      await fetchBlogPosts();
      setShowCreateForm(false);
      setSelectedPost(null);
      alert(`Blog post ${selectedPost ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle view live - navigate to the public blog route so the slug appears in the URL
  const handleViewLive = (post) => {
    if (!post) return;
    
    const slug = post.slug || post._id || post.id;
    if (!slug) {
      alert('Unable to open blog: missing slug or ID.');
      return;
    }

    // Navigate to the public blog route: /blog/{slug}
    const path = `/blog/${slug}`;
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  // Filter blogs based on search, category, and status
  const filteredBlogs = blogPosts.filter(post => {
    const normalizedTitle = (post.title || '').toLowerCase();
    const normalizedExcerpt = (post.excerpt || '').toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase();

    const matchesSearch = normalizedTitle.includes(normalizedSearch) || normalizedExcerpt.includes(normalizedSearch);

    const normalizedCategory = (post.category || '').trim().toLowerCase();
    const matchesCategory = activeFilter === 'All Categories' ||
      normalizedCategory === activeFilter.trim().toLowerCase();

    const normalizedStatus = (post.status || '').trim().toLowerCase();
    const matchesStatus = statusFilter === 'All Statuses' ||
      normalizedStatus === statusFilter.trim().toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const logout = () => {
    // Remove known auth tokens
    ['adminToken', 'blogToken', 'atorix_auth_token', 'token', 'authToken'].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    localStorage.removeItem('userData');
    sessionStorage.clear();
    window.location.href = '/admin/login';
  };

  // If viewing a blog, show the blog viewer
  if (viewingBlog) {
    return <BlogViewer blog={viewingBlog} onClose={() => setViewingBlog(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4 pt-20">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Blog Admin</h2>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium">{userData.name}</div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Role:</span>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-900/50 text-blue-200 rounded-full">
                  {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            <div className="w-5 h-5 flex items-center justify-center">📝</div>
            <span>Dashboard</span>
          </a>
          {userData.role === 'admin' && (
            <a 
              href="/blog/dashboard/user-management" 
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/blog/dashboard/user-management';
              }}
            >
              <div className="w-5 h-5 flex items-center justify-center">👥</div>
              <span>User Management</span>
            </a>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            {/* Left Side - Breadcrumb and Title */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Home size={16} />
                <span>Blog admin</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Admin Panel</h1>
              <p className="text-gray-600">Manage blog content and users</p>
            </div>
            
            {/* Right Side - Status, User Info, View Blog, Logout */}
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-700 font-medium">
                  {isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              
              {/* User Info Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <User size={18} className="text-gray-600" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                  <div className="text-xs text-gray-600">{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</div>
                </div>
              </button>
              
              {/* View Blog Button */}
              <button
                onClick={() => router.push('/blog')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Rss size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">View Blog</span>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section - NOW DYNAMIC */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-6 text-white">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-1">{stat.count}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleCreateButtonClick}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Plus size={18} />
            Create New Blog
          </button>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search blog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Categories">All Categories</option>
            <option value="SAP">SAP</option>
            <option value="Technology">Technology</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Business">Business</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Results count - Only show when there are blogs */}
        {blogPosts.length > 0 && (
          <div className="mb-4 text-gray-600">
            Showing {filteredBlogs.length} of {blogPosts.length} posts
          </div>
        )}

        {/* Blog Posts List */}
        <div className="space-y-4">
          {blogPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Blog Posts Yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first blog post</p>
              <button 
                onClick={handleCreateButtonClick}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 font-medium transition-colors"
              >
                <Plus size={20} />
                Create Your First Blog
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No blog posts found matching your criteria.
            </div>
          ) : (
            filteredBlogs.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <img
                      src={
                        resolveImageUrl(post.bannerImage) ||
                        resolveImageUrl(post.featuredImage) ||
                        resolveImageUrl(post.image) ||
                        (post.bannerImage?.data ? `data:${post.bannerImage.contentType};base64,${post.bannerImage.data}` :
                        post.featuredImage?.data ? `data:${post.featuredImage.contentType};base64,${post.featuredImage.data}` :
                        post.image?.data ? `data:${post.image.contentType};base64,${post.image.data}` :
                        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA4MCI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNDAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiMwMDAiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==')
                      }
                      alt={post.title}
                      className="w-full h-full rounded-lg object-cover bg-blue-100"
                      onError={(e) => {
                        // Prevent multiple error handlers
                        e.target.onerror = null;
                        
                        // Use the inline SVG directly as fallback
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA4MCI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNDAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiMwMDAiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm flex-wrap">
                      {/* Category and Subcategory */}
                      {post.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                          {post.category}
                        </span>
                      )}
                      {post.subcategory && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                          {post.subcategory}
                        </span>
                      )}
                      
                      {/* Status */}
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        post.status === 'published' || post.status === 'Published' ? 'bg-green-100 text-green-700' :
                        post.status === 'draft' || post.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1).toLowerCase()}
                      </span>
                      
                      {/* Author */}
                      <span className="text-gray-600 text-sm">
                        By {post.authorName || post.author || 'Unknown'}
                      </span>
                      
                      {/* Keywords/Tags */}
                      {post.keywords && post.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.keywords.slice(0, 3).map((keyword, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {keyword}
                            </span>
                          ))}
                          {post.keywords.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                              +{post.keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Dates */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
                      <span>Created: {new Date(post.created || post.createdAt || new Date()).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                      {post.updated && post.updated !== post.created && (
                        <span>• Updated: {new Date(post.updated).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-2 leading-relaxed">{post.excerpt}</p>

                    {/* Public live link for this blog */}
                    <div className="mb-3 text-xs text-gray-500 break-all">
                      <span className="font-semibold mr-1">Live URL:</span>
                      {typeof window !== 'undefined' ? (
                        <a
                          href={`/blog/${post.slug || post._id || post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {`/blog/${post.slug || post._id || post.id}`}
                        </a>
                      ) : (
                        <span>{`/blog/${post.slug || post._id || post.id}`}</span>
                      )}
                      {typeof window !== 'undefined' && navigator.clipboard && (
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/blog/${post.slug || post._id || post.id}`;
                            navigator.clipboard.writeText(url).then(
                              () => alert('Live blog URL copied to clipboard.'),
                              () => alert('Could not copy URL. Please copy it manually.')
                            );
                          }}
                          className="ml-2 px-2 py-0.5 border border-gray-300 rounded text-[11px] text-gray-700 hover:bg-gray-100"
                        >
                          Copy
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(post)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                      <button 
                        onClick={() => handleViewLive(post)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View Live
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Create Blog Form Modal - Using your existing CreateBlogForm component */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-2 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Your CreateBlogForm component will go here */}
            {/* Pass handleBlogCreated as a prop to receive the new blog data */}
            <CreateBlogForm 
              onClose={handleCloseForm}
              onBlogCreated={handleBlogCreated}
              onBlogUpdated={handleBlogUpdated}
              initialData={selectedPost}
            />
          </div>
        </div>
      )}
    </div>
  );
}