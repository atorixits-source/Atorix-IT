"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Search, Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { format } from 'date-fns';
import { getAuthHeader } from '@/lib/auth';

// User role constants with display names
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MODE: 'hr_mode',
  BUSINESS_MODE: 'business_mode'
};

const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.HR_MODE]: 'HR',
  [USER_ROLES.BUSINESS_MODE]: 'Business User'
};

// Default validation errors object
const DEFAULT_VALIDATION_ERRORS = {};

// User data structure
// {
//   _id: string,
//   name: string,
//   email: string,
//   role: string,
//   location?: string,
//   color?: string,
//   isActive: boolean,
//   createdAt: string,
//   updatedAt: string
// }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://atorix-backend-server.onrender.com";
const ADMIN_API_URL = `${API_BASE_URL}/api`;

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.SUPER_ADMIN,
    location: "",
    color: "#3B82F6",
  });

  const [errors, setErrors] = useState(DEFAULT_VALIDATION_ERRORS);

  // Fetch users from admin API on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setApiError(null);
        
        const API_URL = 'https://atorix-backend-server.onrender.com/api';
        console.log('Fetching admin users from:', `${API_URL}/users`);
        const authHeaders = getAuthHeader();
        const res = await fetch(`${API_URL}/users`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...authHeaders
          },
          credentials: 'include'
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        
        const usersData = await res.json();
        console.log('Admin Users API Response:', usersData);

        if (!Array.isArray(usersData)) {
          throw new Error('Invalid users data format received from server');
        }

        setUsers(usersData);
        toast.success('Users loaded successfully');
      } catch (err) {
        console.error("Error loading users:", err);
        const errorMessage = err.message || 'Failed to load users';
        setApiError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.location || "").toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  });

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      location: user.location || '',
      color: user.color || "#3B82F6",
    });
    setShowAddUserModal(true);
  };

  const handleCreateUser = async () => {
    setApiError(null);
    setErrors({});
    const validationErrors = {};

    if (!userForm.name.trim()) validationErrors.name = "Name is required";
    if (!userForm.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      validationErrors.email = "Email is invalid";
    }
    
    // Only validate password if creating a new user or changing password
    if (!editingUser) {
      if (!userForm.password) {
        validationErrors.password = "Password is required";
      } else if (userForm.password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }
      if (userForm.password !== userForm.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }
    } else if (userForm.password && userForm.password.length > 0) {
      // If editing and password is provided, validate it
      if (userForm.password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }
      if (userForm.password !== userForm.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (!userForm.role) {
      validationErrors.role = "Role is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setCreatingUser(true);

      console.log('Sending user creation request:', {
        url: editingUser ? `${ADMIN_API_URL}/users/${editingUser._id}` : `${ADMIN_API_URL}/users`,
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          name: userForm.name,
          email: userForm.email,
          password: userForm.password ? '***' : '',
          role: userForm.role,
          location: userForm.location,
          color: userForm.color,
        },
      });

      const isEditing = !!editingUser;
      const url = isEditing 
        ? `${ADMIN_API_URL}/users/${editingUser._id}`
        : `${ADMIN_API_URL}/users`;
        
      const userData = {
        name: userForm.name.trim(),
        email: userForm.email.trim().toLowerCase(),
        role: userForm.role,
        location: userForm.location?.trim() || '',
        color: userForm.color,
      };
      
      // Only include password if it's being changed (for edit) or required (for create)
      if (userForm.password) {
        userData.password = userForm.password;
      }

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log('User creation response:', { status: res.status, data });

      if (!res.ok) {
        // Handle validation errors
        if (res.status === 400 && data.errors) {
          const fieldErrors = {};
          Object.entries(data.errors).forEach(([field, message]) => {
            fieldErrors[field] = message;
          });
          setErrors(fieldErrors);
          setApiError('Please correct the errors below');
        } else if (res.status === 400 && data.missingFields) {
          const fieldErrors = {};
          data.missingFields.forEach(field => {
            fieldErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          });
          setErrors(fieldErrors);
          setApiError(data.message || 'Please fill in all required fields');
        } else {
          setApiError(data.message || `Failed to create user (${res.status})`);
        }
        return;
      }

      const userResponse = data.data || data; // Handle both formats
      
      // Refresh the users list after successful operation
      const refreshUsers = async () => {
        try {
          const res = await fetch(`${ADMIN_API_URL}/users`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            credentials: 'include'
          });
          
          if (res.ok) {
            const usersData = await res.json();
            setUsers(usersData);
            toast.success(`User ${isEditing ? 'updated' : 'created'} successfully`);
          }
        } catch (err) {
          console.error('Error refreshing users:', err);
          toast.error('Failed to refresh user list');
        }
      };
      
      await refreshUsers();

      setShowAddUserModal(false);
      setEditingUser(null);
      setUserForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: USER_ROLES.SUPER_ADMIN,
        location: "",
        color: "#3B82F6",
      });
      setErrors({});
    } catch (err) {
      console.error("Create user error:", err);
      setApiError("Network error while creating user");
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout
        title="User Management"
        description="Manage system users and their permissions."
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <Button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>

            {loadingUsers ? (
              <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                Loading users...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="flex-shrink-0 h-8 w-8 rounded-full"
                              style={{ backgroundColor: user.color }}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === USER_ROLES.SUPER_ADMIN
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                : user.role === USER_ROLES.HR_MODE
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            }`}
                          >
                            {ROLE_LABELS[user.role] || user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {user.location || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                          >
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddUserModal(false);
                      setEditingUser(null);
                      setUserForm({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        role: USER_ROLES.SUPER_ADMIN,
                        location: "",
                        color: "#3B82F6",
                      });
                      setErrors({});
                    }}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {apiError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
                    {apiError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, name: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {editingUser ? 'New Password' : 'Password'} {!editingUser && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({ ...userForm, password: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                      placeholder={editingUser ? 'Leave blank to keep current' : '••••••••'}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {editingUser ? 'Confirm New Password' : 'Confirm Password'} {!editingUser && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="password"
                      value={userForm.confirmPassword}
                      onChange={(e) =>
                        setUserForm({ ...userForm, confirmPassword: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={userForm.role}
                      onChange={(e) =>
                        setUserForm({ ...userForm, role: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    >
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.role}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={userForm.location}
                      onChange={(e) =>
                        setUserForm({ ...userForm, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g. New York, USA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={userForm.color}
                        onChange={(e) =>
                          setUserForm({ ...userForm, color: e.target.value })
                        }
                        className="h-10 w-10 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {userForm.color.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setEditingUser(null);
                      setUserForm({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        role: USER_ROLES.SUPER_ADMIN,
                        location: "",
                        color: "#3B82F6",
                      });
                      setErrors({});
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateUser}
                    disabled={creatingUser}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingUser ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        {editingUser ? 'Updating...' : 'Creating...'}
                      </>
                    ) : editingUser ? (
                      'Update User'
                    ) : (
                      'Create User'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Delete User
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to delete {userToDelete.name}? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setIsDeleting(true);
                        const res = await fetch(`${ADMIN_API_URL}/users/${userToDelete._id}`, {
                          method: 'DELETE',
                          headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                          },
                          credentials: 'include'
                        });

                        if (!res.ok) {
                          const errorData = await res.json().catch(() => ({}));
                          throw new Error(errorData.message || `Failed to delete user (${res.status})`);
                        }

                        // Refresh users list
                        const usersRes = await fetch(`${ADMIN_API_URL}/users`, {
                          method: 'GET',
                          headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                          },
                          credentials: 'include'
                        });

                        if (usersRes.ok) {
                          const usersData = await usersRes.json();
                          setUsers(usersData);
                          toast.success('User deleted successfully');
                        }
                      } catch (err) {
                        console.error('Error deleting user:', err);
                        toast.error(err.message || 'Failed to delete user');
                      } finally {
                        setIsDeleting(false);
                        setShowDeleteModal(false);
                        setUserToDelete(null);
                      }
                    }}
                    disabled={isDeleting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

// Role badge component
function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        role === USER_ROLES.SUPER_ADMIN
          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
          : role === USER_ROLES.HR_MODE
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      }`}
    >
      {role === USER_ROLES.HR_MODE
        ? "HR Mode"
        : role === USER_ROLES.BUSINESS_MODE
        ? "Business Mode"
        : "Super Admin"}
    </span>
  );
}