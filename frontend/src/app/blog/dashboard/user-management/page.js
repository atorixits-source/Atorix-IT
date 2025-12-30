"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, RefreshCw, UserCircle2 } from 'lucide-react';
import { getAuthToken, clearAuthToken } from '@/lib/auth';
import { usePathname } from 'next/navigation';

export default function UserManagement() {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({ name: 'User', role: 'user' });
  
  // Redirect if not admin
  useEffect(() => {
    const checkAuthAndRole = () => {
      try {
        const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
        const token = getAuthToken();
        
        if (!token) {
          // No token, redirect to login
          window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
          return;
        }
        
        const userRole = storedData.role === 'admin' ? 'admin' : 'user';
        
        setUserData({
          name: storedData.name || 'User',
          role: userRole,
          email: storedData.email || ''
        });
        
        // If not admin, redirect to dashboard
        if (userRole !== 'admin') {
          window.location.href = '/blog/dashboard';
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = '/admin/login';
      }
    };
    
    checkAuthAndRole();
    
    // Listen for storage changes (like logout from another tab)
    const handleStorageChange = () => {
      checkAuthAndRole();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch users from the backend with retry logic
  const fetchUsers = async (retry = true) => {
    try {
      setLoading(true);
      setError('');
      
      // Get token from auth.js
      const token = getAuthToken();
      console.log('Auth token retrieved:', token ? `${token.substring(0, 20)}...` : 'No token found');
      
      if (!token) {
        console.error('No authentication token found');
        // Redirect to login if no token
        window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
        return;
      }
      
      // Make the API request
      const response = await fetch('https://atorix-blogs-server1.onrender.com/api/blog/users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      console.log('Response status:', response.status, response.statusText);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.error('Unauthorized - clearing token and redirecting to login');
        clearAuthToken();
        window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
        return;
      }
      
      // Handle 403 Forbidden (not admin)
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'You do not have permission to view users');
      }
      
      // Handle other error statuses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // Process successful response
      const data = await response.json();
      console.log('Users data received:', data);
      
      if (data && data.data) {
        // Map MongoDB _id to id for frontend consistency
        const formattedUsers = data.data.map(user => ({
          ...user,
          id: user._id || user.id, // Use _id if available, fallback to id
          created: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : 'N/A',
          name: user.name || user.username || 'Unnamed User',
          status: user.status || 'Active'
        }));
        
        console.log('Formatted users:', formattedUsers);
        setUsers(formattedUsers);
      } else {
        console.warn('Unexpected response format:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError(err.message || 'Error fetching users. Please try again.');
      setUsers([]); // Clear users on error to avoid showing stale data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', password: '', role: 'user' });

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle edit button click
  const handleEditClick = (user) => {
    console.log('Edit button clicked for user:', user);
    // Use _id as it's the MongoDB field name
    const userId = user._id || user.id;
    if (!user || !userId) {
      console.error('Invalid user object or missing id:', user);
      alert('Error: Invalid user data');
      return;
    }
    setEditingUser({
      id: userId,
      _id: userId, // Include _id for API calls
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'user',
      status: user.status || 'Active'
    });
    setShowEditModal(true);
  };

  // Handle update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser || !editingUser.id) {
      console.error('No user selected for update or missing ID');
      return;
    }

    try {
      setIsUpdating(true);
      const token = getAuthToken();
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      console.log('Updating user with data:', editingUser);
      const response = await fetch(`https://atorix-blogs-server1.onrender.com/api/blog/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingUser.name,
          username: editingUser.username,
          email: editingUser.email,
          role: editingUser.role,
          status: editingUser.status
        }),
        credentials: 'include'
      });

      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        console.error('Update failed:', responseData);
        throw new Error(responseData.message || `Failed to update user: ${response.statusText}`);
      }

      console.log('Update successful:', responseData);
      
      // Refresh the users list
      await fetchUsers();
      setShowEditModal(false);
      setEditingUser(null);
      alert('User updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('No user ID provided for deletion');
      alert('Error: No user ID provided');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setDeleteError('');
      
      const token = getAuthToken();
      if (!token) {
        console.error('No authentication token found');
        window.location.href = '/admin/login';
        return;
      }
      
      console.log(`Attempting to delete user with ID: ${id}`);
      const response = await fetch(`https://atorix-blogs-server1.onrender.com/api/blog/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      console.log('Delete response status:', response.status);
      
      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        clearAuthToken();
        window.location.href = '/admin/login';
        return;
      }
      
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'You do not have permission to delete users');
      }
      
      if (response.status === 404) {
        throw new Error('User not found');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete error response:', errorData);
        throw new Error(errorData.message || `Failed to delete user: ${response.statusText}`);
      }
      
      // If we get here, deletion was successful
      console.log('User deleted successfully');
      
      // Show success message
      alert('User deleted successfully!');
      
      // Refresh the users list
      await fetchUsers();
      
    } catch (err) {
      console.error('Error in handleDelete:', err);
      setDeleteError(err.message || 'Failed to delete user');
      alert(`Error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
      alert('Please fill in all fields');
      return;
    }
    
    // Basic username validation
    if (!/^[a-zA-Z0-9_]+$/.test(newUser.username)) {
      alert('Username can only contain letters, numbers, and underscores');
      return;
    }

    try {
      const response = await fetch('https://atorix-blogs-server1.onrender.com/api/blog/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('atorix_auth_token')}`
        },
        body: JSON.stringify({
          name: newUser.name,
          username: newUser.username.toLowerCase(),
          email: newUser.email,
          password: newUser.password,
          role: newUser.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      // Refresh the users list
      await fetchUsers();
      
      // Reset form and close modal
      setNewUser({ name: '', username: '', email: '', password: '', role: 'user' });
      setShowAddModal(false);
      setUsers([...users, {
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        created: new Date().toLocaleDateString('en-US')
      }]);

      setNewUser({ name: '', username: '', email: '', password: '', role: 'user' });
      setShowAddModal(false);
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.message || 'Failed to create user');
    }
  };

  const filteredUsers = users.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const search = searchTerm.toLowerCase();
    
    return (
      name.toString().toLowerCase().includes(search) ||
      email.toString().toLowerCase().includes(search) ||
      (user.username || '').toString().toLowerCase().includes(search) ||
      (user.role || '').toLowerCase().includes(search)
    );
  });

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
          {/* Sidebar */}
          <div className="mb-8">
            <h2 className="text-xl font-bold">Blog Admin</h2>
            <p className="text-sm text-gray-400">Manage blog posts and more</p>
          </div>

          <nav className="space-y-2">
            <a 
              href="/blog/dashboard" 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                currentPath === '/blog/dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">📝</div>
              <span>Dashboard</span>
            </a>
            <a 
              href="/blog/dashboard/user-management" 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                currentPath === '/blog/dashboard/user-management' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">👥</div>
              <span>User Management</span>
            </a>
          </nav>
        </div>

        <div className="ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
          {/* Sidebar */}
          <div className="mb-8">
            <h2 className="text-xl font-bold">Blog Admin</h2>
            <p className="text-sm text-gray-400">Manage blog posts and more</p>
          </div>

          <nav className="space-y-2">
            <a 
              href="/blog/dashboard" 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                currentPath === '/blog/dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">📝</div>
              <span>Dashboard</span>
            </a>
            <a 
              href="/blog/dashboard/user-management" 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                currentPath === '/blog/dashboard/user-management' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">👥</div>
              <span>User Management</span>
            </a>
          </nav>
        </div>

        <div className="ml-64 p-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error loading users</p>
            <p>{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="inline mr-2" size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4 pt-20">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">User Management</h2>
          <div className="flex items-center gap-2 mb-4">
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
            href="/blog/dashboard" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              currentPath === '/blog/dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">📝</div>
            <span>Dashboard</span>
          </a>
          {userData.role === 'admin' && (
            <a 
              href="/blog/dashboard/user-management" 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                currentPath === '/blog/dashboard/user-management' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage blog admin users and their roles via Express backend</p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <span className="text-sm text-gray-600">{filteredUsers.length} user(s) found</span>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCircle2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.created}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            console.log('Delete button clicked for user:', user);
                            if (!user || !user._id) {
                              console.error('Invalid user object or missing _id:', user);
                              alert('Error: Invalid user data');
                              return;
                            }
                            handleDelete(user._id);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Add New User</h2>
            
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">@</span>
                      </div>
                      <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        className="pl-8 w-full px-4 py-2 bg-gray-100 text-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="username"
                        pattern="[a-zA-Z0-9_]+"
                        title="Only letters, numbers, and underscores allowed"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Enter email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Enter password"
                  minLength="6"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {isUpdating ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}